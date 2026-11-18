import numpy as np, cv2, sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as ndi
SP='/tmp/claude-0/-home-claude/1cd05bc6-9ed2-5956-b484-3fece23bc169/scratchpad/'
def noise(h,w,scales,seed):
    rs=np.random.RandomState(seed); o=np.zeros((h,w),np.float32); tot=0
    for s,a in scales:
        n=rs.rand(max(2,h//s+2),max(2,w//s+2)).astype(np.float32)
        o+=a*cv2.resize(n,(w,h),interpolation=cv2.INTER_CUBIC); tot+=a
    return o/tot
IMPROVE=True
def render(my,out,seed=1,title='三極の大陸',sub='THE THREE CONTINENTS'):
    wd=np.array(Image.open(SP+f'worlds/pp{my:02d}/world-data.png'))
    base=np.array(Image.open(SP+f'worlds/poutp{my:02d}/s13a.jpg').convert('RGB')).astype(np.float32)
    if IMPROVE:
        g5=np.array(Image.open(SP+f'worlds/poutp{my:02d}/s5a.jpg').convert('RGB')).astype(np.float32)
        _wd=np.array(Image.open(SP+f'worlds/pp{my:02d}/world-data.png')); _bio=_wd[...,1]
        # 1) mountain pixels = where stage12 differs from plain map
        diff=np.abs(base-g5).sum(2)
        mm=(diff>40).astype(np.float32); mm=cv2.morphologyEx(mm,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
        mm=cv2.GaussianBlur(mm,(0,0),1.2)
        # local ground colour (wide blur of plain map, excluding nothing)
        ground=cv2.GaussianBlur(g5,(0,0),14)
        gl=ground.mean(2,keepdims=True)+1e-3
        tint=ground/gl                                         # colour direction of the ground
        ml=base.mean(2,keepdims=True)
        ml=(ml-ml[mm>0.5].mean())*1.15+gl*1.10; ml=np.maximum(ml,gl*0.62)                 # keep mountain light/dark structure, level = ground
        mnt=np.clip(ml*(0.55+0.45*tint),0,255)
        # cold ground -> snow caps: lighten on bright faces
        cold=np.isin(_bio,[10,11]).astype(np.float32); cold=cv2.GaussianBlur(cold,(0,0),10)
        snow=np.clip((ml-gl*1.15)/(gl*0.5),0,1)*cold[...,None]
        mnt=mnt*(1-snow)+np.array([240,232,214],np.float32)*snow
        # feather the foot of the mountain into the ground
        a=np.clip(cv2.GaussianBlur(mm,(0,0),3.5)*1.15,0,1)[...,None]
        base=g5*(1-a)+mnt*a
        # 2) smooth the speckled biomes (ice / wetland / tundra / cold desert)
        sp=np.isin(_bio,[2,11,12]).astype(np.float32); sp=cv2.GaussianBlur(sp,(0,0),2)[...,None]
        sm=cv2.GaussianBlur(base,(0,0),3.2)
        base=base*(1-sp)+sm*sp
    H0,W0=wd.shape[:2]
    Hh=wd[...,0].astype(np.float32); bio=wd[...,1]
    land=ndi.gaussian_filter(((bio>0)&(Hh>=20)).astype(np.float32),1.2)>0.5
    # --- sea
    dist=ndi.distance_transform_edt(~land).astype(np.float32)
    nz=noise(H0,W0,[(120,1),(40,.6)],seed)
    t=np.clip(dist/110.0,0,1); t=t**0.7
    PAL={5:((92,128,132),(52,84,100),(36,56,76)),6:((170,205,220),(110,155,185),(70,110,145)),7:((104,112,152),(60,66,122),(36,40,88))}
    shallow,mid,deep=[np.array(c,np.float32) for c in PAL.get(my,((88,142,150),(36,78,104),(18,34,62)))]
    sea=np.where(t[...,None]<0.45, shallow+(mid-shallow)*(t[...,None]/0.45), mid+(deep-mid)*((t[...,None]-0.45)/0.55))
    sea*= (0.93+0.14*nz)[...,None]
    # ripples (coast-parallel lines)
    wob=ndi.gaussian_filter(np.random.RandomState(seed+3).randn(H0,W0).astype(np.float32),12)*6
    for d0,al in ((11,.30),(24,.22),(40,.16),(60,.10)):
        dd=np.abs(dist+wob-d0); line=np.clip(1-dd/1.1,0,1)*al
        sea=sea*(1-line[...,None])+np.array([190,215,215],np.float32)*line[...,None]
    # --- land grading from base (stage12) : warm, soft contrast
    lum=base.mean(2,keepdims=True)
    gr=lum+(base-lum)*0.85
    gr=gr*np.array([1.10,1.03,0.90],np.float32)*1.04           # warm, brighter
    # local contrast (unsharp) for texture
    bl=cv2.GaussianBlur(gr,(0,0),6); gr=np.clip(gr+(gr-bl)*0.9,0,255)
    gr=np.clip((gr-110)*1.12+118,0,255)*1.12
    img=np.where(land[...,None],gr,sea)
    # coast: soft shadow into the sea (down-right) and inner ink line
    sh=ndi.shift(land.astype(np.float32),(5,5),order=1); sh=ndi.gaussian_filter(sh,4)*(~land)
    img=img*(1-0.35*sh[...,None])
    edge=ndi.morphological_gradient(land.astype(np.uint8),size=3)>0
    edge=cv2.GaussianBlur(edge.astype(np.float32),(0,0),0.9)
    img=img*(1-0.8*edge[...,None])+np.array([46,32,22],np.float32)*0.8*edge[...,None]
    # --- rivers (flow accumulation on height)
    Hs=ndi.gaussian_filter(Hh,2.0)+np.random.RandomState(seed).rand(H0,W0).astype(np.float32)*0.02
    Hs[~land]=-1
    order=np.argsort(-Hs.ravel()); acc=np.ones(H0*W0,np.float32); Hf=Hs.ravel()
    nbr=[(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    yy,xx=np.divmod(np.arange(H0*W0),W0)
    best=np.full(H0*W0,-1,np.int64); bd=np.zeros(H0*W0,np.float32)
    for dy,dx in nbr:
        ny=np.clip(yy+dy,0,H0-1); nx=np.clip(xx+dx,0,W0-1); ni=ny*W0+nx
        dz=(Hf-Hf[ni])/math.hypot(dy,dx)
        m=dz>bd; bd=np.where(m,dz,bd); best=np.where(m,ni,best)
    for i in order:
        if Hf[i]<0: break
        j=best[i]
        if j>=0: acc[j]+=acc[i]
    acc=acc.reshape(H0,W0)
    riv=(acc>420)&land
    rimg=np.zeros((H0,W0),np.float32)
    ys,xs=np.where(riv)
    for y,x in zip(ys,xs):
        r=0.6+0.5*math.log(acc[y,x]/420)
        cv2.circle(rimg,(int(x),int(y)),int(round(min(r,2.2))),1.0,-1)
    rimg=cv2.GaussianBlur(rimg,(0,0),0.7)
    rc=np.array([70,120,150],np.float32)
    img=img*(1-0.85*rimg[...,None])+rc*0.85*rimg[...,None]
    # --- compose on parchment with frame
    OW,OH=1500,1000; ox,oy=(OW-W0)//2,(OH-H0)//2
    pn=noise(OH,OW,[(300,1),(60,.5),(12,.25)],seed+7)
    par=np.array([222,198,152],np.float32)*(0.86+0.28*pn)[...,None]
    yy2,xx2=np.mgrid[:OH,:OW]
    vig=1-0.55*np.clip(((xx2-OW/2)/(OW/2))**4+((yy2-OH/2)/(OH/2))**4,0,1)
    par*=vig[...,None]
    canvas=par.copy(); canvas[oy:oy+H0,ox:ox+W0]=img
    # blend map border into parchment (feather)
    mask=np.zeros((OH,OW),np.float32); mask[oy:oy+H0,ox:ox+W0]=1
    f=np.clip(ndi.distance_transform_edt(mask>0)/26,0,1)
    f=f*f*(3-2*f)
    canvas=par*(1-f[...,None])+canvas*f[...,None]
    pil=Image.fromarray(np.clip(canvas,0,255).astype(np.uint8)).convert('RGB')
    d=ImageDraw.Draw(pil)
    # frame
    for k,(c,wd_) in enumerate([((58,38,24),26),((120,84,48),6),((196,160,90),2)]):
        off=sum(w for _,w in [((0,0),26),((0,0),6),((0,0),2)][:k])
        d.rectangle([off,off,OW-1-off,OH-1-off],outline=c,width=wd_)
    for cx,cy,sx,sy in ((0,0,1,1),(OW,0,-1,1),(0,OH,1,-1),(OW,OH,-1,-1)):
        d.polygon([(cx+sx*8,cy+sy*8),(cx+sx*78,cy+sy*8),(cx+sx*8,cy+sy*78)],fill=(86,58,34))
        d.polygon([(cx+sx*8,cy+sy*8),(cx+sx*50,cy+sy*8),(cx+sx*8,cy+sy*50)],fill=(150,112,60))
    # compass rose (top-left)
    cx,cy,R=140,140,70
    d.ellipse([cx-R,cy-R,cx+R,cy+R],outline=(70,48,30),width=3)
    d.ellipse([cx-R*0.62,cy-R*0.62,cx+R*0.62,cy+R*0.62],outline=(110,80,50),width=2)
    for a in range(0,360,45):
        L=R*1.25 if a%90==0 else R*0.85; w=R*0.13 if a%90==0 else R*0.09
        a0=math.radians(a-90); p=(cx+L*math.cos(a0),cy+L*math.sin(a0))
        l=(cx+w*math.cos(a0-1.57),cy+w*math.sin(a0-1.57)); r_=(cx+w*math.cos(a0+1.57),cy+w*math.sin(a0+1.57))
        d.polygon([p,l,(cx,cy)],fill=(60,40,26)); d.polygon([p,r_,(cx,cy)],fill=(190,150,90))
    ft=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc',30,index=0) if False else None
    return pil,land,bio,Hh,rimg
