import numpy as np, cv2, random, math, sys
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

import os; ROOT=os.environ['WROOT']+'/'
OUT=sys.argv[1] if len(sys.argv)>1 else './'
W,Hh=1400,900
base=np.array(Image.open(ROOT+'world-map.jpg').convert('RGB'))
d=np.array(Image.open(ROOT+'world-data.png')).astype(int)
H=d[...,0]/2.55; BI=d[...,1]; ST=d[...,2]
land=H>=20
rng=np.random.RandomState(7); random.seed(7)

def fbm(shape,scale,oct=5,seed=0):
    r=np.random.RandomState(seed); acc=np.zeros(shape); amp=1; tot=0
    for o in range(oct):
        s=max(2,int(scale/(2**o)))
        small=r.rand(shape[0]//s+2,shape[1]//s+2)
        acc+=amp*cv2.resize(small,(shape[1],shape[0]),interpolation=cv2.INTER_CUBIC)
        tot+=amp; amp*=.5
    return acc/tot

# ---- 国の色だけの清書(文字・国境線を消し、国ごとの中央値の色で塗る) ----
wash=base.copy()
for s in np.unique(ST[land]):
    m=(ST==s)&land
    if m.sum()<30: continue
    wash[m]=np.median(base[m],axis=0)
# 海: 元画像の海の色(深さの変化は残す)を、文字のない所から作る
sea=~land
seacol=base.copy()
mask_text=cv2.dilate((sea&(base.sum(axis=2)>600)).astype(np.uint8),np.ones((5,5)))  # 氷の白い欠片
sea_clean=cv2.inpaint(base,mask_text,4,cv2.INPAINT_TELEA)
wash[sea]=sea_clean[sea]
wash=cv2.GaussianBlur(wash,(0,0),1.2)
# 陸と海の境をなじませない: 陸は陸のまま
Image.fromarray(wash).save(OUT+'_wash.png')

def paper(img, strength=1.0, tint=(1.0,0.93,0.80)):
    f=fbm((Hh,W),90,5,1)*.6+fbm((Hh,W),14,3,2)*.4
    fib=fbm((Hh,W),3,2,3)
    tex=(0.88+0.22*f)*(0.97+0.05*fib)
    yy,xx=np.mgrid[0:Hh,0:W]
    vig=1-0.28*(((xx-W/2)/(W/2))**2+((yy-Hh/2)/(Hh/2))**2)**1.2
    out=img.astype(float)/255
    gray=out.mean(axis=2,keepdims=True)
    out=out*0.72+gray*0.28
    lm=cv2.GaussianBlur(land.astype(float),(0,0),3)[...,None]
    out=out*(np.array(tint)*lm+np.array((0.90,0.96,1.0))*(1-lm))
    out=out*(tex*vig)[...,None]*1.04
    return np.clip(out*255,0,255).astype(np.uint8)

def coast_lines(mask, smooth=0.0, jitter=1.2, seed=3):
    from skimage import measure
    m=mask.astype(float)
    if smooth>0: m=cv2.GaussianBlur(m,(0,0),smooth)
    cs=measure.find_contours(m,0.5)
    r=np.random.RandomState(seed); out=[]
    for c in cs:
        if len(c)<45: continue
        n=len(c); w=ndi.gaussian_filter1d(r.randn(n,2),9,mode='wrap')*jitter*5
        out.append(c[:,::-1]+w)
    return out

def ink_lines(img, lines, width=2.2, color=(70,48,30), alpha=0.95):
    S=3
    layer=Image.new('L',(W*S,Hh*S),0); dr=ImageDraw.Draw(layer)
    for l in lines:
        dr.line([(x*S,y*S) for x,y in l],fill=255,width=int(width*S),joint='curve')
    layer=layer.resize((W,Hh),Image.LANCZOS)
    a=np.array(layer)[...,None]/255*alpha
    return (img*(1-a)+np.array(color)*a).astype(np.uint8)

def poisson(cands, mind, limit=100000):
    grid={}; pts=[]
    cs=mind
    idx=list(range(len(cands))); random.shuffle(idx)
    for i in idx:
        x,y=cands[i]
        gx,gy=int(x//cs),int(y//cs); ok=True
        for ax in (gx-1,gx,gx+1):
            for ay in (gy-1,gy,gy+1):
                for (px,py) in grid.get((ax,ay),[]):
                    if (px-x)**2+(py-y)**2<mind*mind: ok=False;break
                if not ok:break
            if not ok:break
        if ok:
            grid.setdefault((gx,gy),[]).append((x,y)); pts.append((x,y))
            if len(pts)>=limit:break
    return pts

INK=(62,42,28)
def draw_glyphs(img, scale=1.0, mind_m=17, mind_h=13, mind_t=11, ink=INK, shade=(150,120,92), light=(236,224,196)):
    S=3
    layer=Image.new('RGBA',(W*S,Hh*S),(0,0,0,0)); dr=ImageDraw.Draw(layer)
    def cand(mask,step=3):
        ys,xs=np.nonzero(mask[::step,::step]); return list(zip(xs*step+rng.rand(len(xs))*step, ys*step+rng.rand(len(xs))*step))
    mt=land&(H>=62); hl=land&(H>=47)&(H<62)
    fo=land&(H<47)&np.isin(BI,[5,6,7,8,9])
    items=[]
    for (x,y) in poisson(cand(mt),mind_m*scale): items.append(('m',x,y,H[int(y),int(x)]))
    mtp=[(x,y) for k,x,y,h in items]
    for (x,y) in poisson(cand(hl),mind_h*scale):
        if all((x-a)**2+(y-b)**2>(mind_m*scale*.8)**2 for a,b in mtp): items.append(('h',x,y,H[int(y),int(x)]))
    for (x,y) in poisson(cand(fo),mind_t*scale):
        if rng.rand()<.55: items.append(('t',x,y,BI[int(y),int(x)]))
    items.sort(key=lambda t:t[2])
    for k,x,y,v in items:
        X,Y=x*S,y*S
        if k=='m':
            s=(15+ (v-62)*0.55 + rng.rand()*5)*scale*S
            hw=s*0.62; ap=(X+rng.randn()*s*.06,Y-s)
            L=(X-hw,Y); R=(X+hw,Y)
            dr.polygon([L,ap,(X+s*.05,Y)],fill=light+(255,))
            dr.polygon([ap,R,(X+s*.05,Y)],fill=shade+(255,))
            for i in range(1,6):
                t=i/6; ax=ap[0]+(X+s*.05-ap[0])*0+ (R[0]-ap[0])*t*.9; ay=ap[1]+(R[1]-ap[1])*t*.9
                bx=X+s*.05+ (R[0]-X-s*.05)*t*.8; by=Y
                dr.line([(ax,ay),(bx,by)],fill=ink+(150,),width=max(1,int(S*.7)))
            dr.line([L,ap,R],fill=ink+(255,),width=int(S*1.4),joint='curve')
            dr.line([(X+s*.05,Y),ap],fill=ink+(210,),width=int(S*1.0))
        elif k=='h':
            s=(8+rng.rand()*3)*scale*S
            pts=[(X-s+s*2*i/10, Y-math.sin(math.pi*i/10)*s*.7) for i in range(11)]
            dr.polygon(pts+[(X+s,Y),(X-s,Y)],fill=light+(235,))
            dr.line(pts,fill=ink+(230,),width=int(S*1.1),joint='curve')
            for i in range(2):
                dr.line([(X+s*.2+i*s*.3,Y-s*.5+i*s*.2),(X+s*.5+i*s*.2,Y-s*.1)],fill=ink+(140,),width=int(S*.7))
        else:
            s=(4.2+rng.rand()*1.6)*scale*S
            if v==9:
                for j in range(3):
                    yy=Y-j*s*.9; w=s*(1-j*.22)
                    dr.polygon([(X-w,yy),(X,yy-s*1.2),(X+w,yy)],fill=(88,112,78,255),outline=ink+(255,))
                dr.line([(X,Y),(X,Y+s*.5)],fill=ink+(255,),width=int(S*1.0))
            else:
                dr.line([(X,Y),(X,Y-s*.8)],fill=ink+(255,),width=int(S*1.0))
                dr.ellipse([X-s,Y-s*2.1,X+s,Y-s*.3],fill=(96,128,78,255),outline=ink+(255,),width=int(S*.9))
    layer=layer.resize((W,Hh),Image.LANCZOS)
    a=np.array(layer).astype(float)/255
    out=img.astype(float)*(1-a[...,3:4])+a[...,:3]*255*a[...,3:4]
    return np.clip(out,0,255).astype(np.uint8)

def water_lines(img, n=3, step=9, alpha=.5, color=(96,118,150)):
    # 海岸に沿って、古い地図の波の線(海岸の外側に平行線)
    outs=[]
    dist=ndi.distance_transform_edt(~land)
    from skimage import measure
    for i in range(1,n+1):
        cs=measure.find_contours(cv2.GaussianBlur(dist,(0,0),2),i*step)
        for c in cs:
            if len(c)<60: continue
            outs.append(c[:,::-1])
    S=3
    layer=Image.new('L',(W*S,Hh*S),0); dr=ImageDraw.Draw(layer)
    for l in outs:
        pts=[(x*S,y*S) for x,y in l]
        # 破線にして手描きらしく
        j=0
        while j<len(pts)-6:
            seg=pts[j:j+random.randint(6,16)]
            dr.line(seg,fill=255,width=int(S*1.1)); j+=len(seg)+random.randint(3,8)
    layer=layer.resize((W,Hh),Image.LANCZOS)
    a=np.array(layer)[...,None]/255*alpha*(sea[...,None])
    return (img*(1-a)+np.array(color)*a).astype(np.uint8)

def tiltshift(img, strength=6):
    blur=cv2.GaussianBlur(img,(0,0),strength)
    yy=np.linspace(-1,1,Hh)[:,None]; m=np.clip((np.abs(yy)-.55)/.45,0,1)[...,None]*np.ones((1,W,1))
    return (img*(1-m)+blur*m).astype(np.uint8)

# ---------------- 段階 ----------------
s0=base.copy()
Image.fromarray(s0).save(OUT+'s0.jpg',quality=88)

# 段階1: 国の色の清書+紙+海岸の墨線
s1=paper(wash)
s1=ink_lines(s1,coast_lines(land,0.0,0.25),width=1.8)
Image.fromarray(s1).save(OUT+'s1.jpg',quality=88)

# 段階2: +山・丘・木の絵+海の波線
s2=water_lines(s1)
s2=draw_glyphs(s2,scale=1.0)
Image.fromarray(s2).save(OUT+'s2.jpg',quality=88)

# 段階3: 強いデフォルメ(海岸をならして大づかみに、絵を大きく、色数を減らす)
q=wash.copy()
q=(q//34*34+17).astype(np.uint8)
q=cv2.bilateralFilter(q,9,40,9)
s3=paper(q,tint=(1.0,0.9,0.74))
s3=ink_lines(s3,coast_lines(land,4.0,0.0),width=3.0)
s3=water_lines(s3,n=4,step=10,alpha=.6)
s3=draw_glyphs(s3,scale=1.7,mind_m=23,mind_h=15,mind_t=12)
s3=tiltshift(s3,5)
Image.fromarray(s3).save(OUT+'s3.jpg',quality=88)
print('done')
