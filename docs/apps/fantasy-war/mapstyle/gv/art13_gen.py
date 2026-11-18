import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as ndi
FNT=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',13)
C_LIGHT=np.array([0xdf,0xc8,0x9d],float); C_MID=np.array([0x9a,0x8d,0x6b],float); C_DARK=np.array([0x6d,0x61,0x44],float); C_DEEP=np.array([0x3a,0x33,0x18],float)
HAZE=np.array([186,198,214],float); SNOW=np.array([248,248,252],float); INK=(58,44,30)
N=360
def smooth(x): x=np.clip(x,0,1); return x*x*(3-2*x)
def bump(n,x0,a,wl,wr,s,p):
    xs=np.arange(n); d=xs-x0; w=np.where(d<0,wl,wr); u=np.clip(np.abs(d)/w,0,1)
    rnd=np.cos(np.pi*u/2)**2; shp=(1-u)**p
    return a*((1-s)*rnd+s*shp)
def noise1(n,rs,oct=5):
    v=np.zeros(n)
    for o in range(oct):
        k=2**(o+2); v+=np.interp(np.arange(n),np.linspace(0,n-1,k),rs.randn(k))/ (1.6**o)
    return v
def ridge(style,h,rs,n=N):
    """高さ h(0〜1)だけから稜線をつくる。styleは絵の描き方の違い。"""
    s=smooth((h-0.25)/0.6)          # 高いほど尖る
    if style=='D':                  # 一方がなだらかな丸い丘 → 反対側へ尖った高峰
        pk=rs.choice([2,3,3]) if h>0.4 else rs.choice([1,2])
        x0=n*(0.62+0.18*rs.rand()); xs=np.sort(rs.rand(pk-1)*(x0-0.1*n)+0.05*n)
        if rs.rand()<0.5: xs=x0+(x0-xs)*-1 if False else xs
        pos=list(xs)+[x0]; hts=[h*(0.25+0.6*(i+1)/pk)*(0.85+0.3*rs.rand()) for i in range(pk-1)]+[h]
        sh=[s*(0.1+0.9*(i+1)/pk) for i in range(pk)]
    elif style=='B':                # 黄金比の位置に主峰、奇数、高さは0.618倍ずつ
        pk=rs.choice([3,5]) if h>0.5 else 3
        x0=n*(0.382 if rs.rand()<0.5 else 0.618); pos=[x0]; hts=[h]
        for i in range(1,pk):
            side=(-1)**i; step=n*(0.12+0.07*rs.rand())*((i+1)//2)
            pos.append(np.clip(x0+side*step*1.5,12,n-12)); hts.append(h*(0.618**((i+1)//2))*(0.9+0.2*rs.rand()))
        sh=[s*(1 if i==0 else 0.75) for i in range(pk)]
    elif style=='C':                # 段々に上がり、同じように下がる
        pk=rs.choice([4,5,6]) if h>0.4 else 3
        top=rs.randint(1,pk-1); pos=list(np.sort(rs.rand(pk)*n*0.8+n*0.1)); pos=np.linspace(n*0.12,n*0.88,pk)+rs.randn(pk)*6
        hts=[h*(0.4+0.6*min(i,2*top-i if 2*top-i>=0 else 0)/max(top,1)) if True else 0 for i in range(pk)]
        hts=[h*(0.35+0.65*(1-abs(i-top)/max(top,pk-1-top))) for i in range(pk)]
        sh=[s]*pk
    else:                           # A: 基本(位置も高さも乱数)
        pk=rs.choice([2,3,4]) if h>0.4 else rs.choice([1,2,3])
        pos=list(rs.rand(pk)*n*0.76+n*0.12); hts=[h*(0.55+0.45*rs.rand()) for _ in range(pk)]; hts[rs.randint(pk)]=h
        sh=[s]*pk
    y=np.zeros(n)
    for x0,a,ss in zip(pos,hts,sh):
        wl=n*(0.16+0.20*rs.rand())*(0.7+0.6*a); wr=n*(0.16+0.20*rs.rand())*(0.7+0.6*a)
        if rs.rand()<0.5: wl,wr=wr*0.7,wl*1.25   # 左右非対称
        y=np.maximum(y,bump(n,x0,a,wl,wr,ss,1.5+0.9*ss))
    jag=noise1(n,rs)*0.018*s*np.clip(y/max(h,1e-6),0,1)**1.5
    y=np.clip(y+jag,0,None)
    return y
def compose(style,h,seed,W=N,Hh=230,layers=4):
    rs=np.random.RandomState(seed)
    canvas=np.ones((Hh,W,3))*np.array([236,240,246])
    paint=np.zeros((Hh,W),bool); GH=Hh*0.40
    for k in range(layers):
        u=k/(layers-1)                       # 0=奥 1=手前
        hk=h*(1.0-0.22*u)*(0.9+0.2*rs.rand())
        r=ridge(style,min(hk,1.0),rs,W)
        base=Hh*(0.55+0.20*u)+4
        top=base-r*GH*(0.8+0.2*(1-u))
        # 影を奥の層へ
        m=np.zeros((Hh,W),bool)
        for x in range(W):
            t=int(max(top[x],0)); m[t:int(base)+int(Hh*0.5),x]=True
        shd=ndi.gaussian_filter(np.roll(np.roll(m.astype(float),6,1),-5,0),3.5)
        canvas[paint]=canvas[paint]*(1-0.5*shd[paint])[:,None]
        topS=ndi.gaussian_filter1d(top,1.5)
        for x in range(1,W-1):
            if r[x]<0.01 and top[x]>base-1: pass
            t=int(max(top[x],0)); b=int(Hh)
            d=(topS[x+1]-topS[x-1])/2; lit=float(np.clip(0.5-np.clip(d,-5,5)*0.1,0,1))
            col=C_DEEP*(1-lit)**1.5*0.0+ (C_DARK*(1-lit)+C_LIGHT*lit)
            col=col*(0.55+0.45*u)+HAZE*(1-u)*0.45
            if r[x]>0.72 and lit>0.45:
                depth=(base-top[x]); cap=np.arange(t,b)-t<depth*0.14
                cs=np.where(cap[:,None],col*0.4+SNOW*0.6,col); canvas[t:b,x]=cs
            else: canvas[t:b,x]=col
            fade=np.linspace(1,0.62,b-t)[:,None]; canvas[t:b,x]=canvas[t:b,x]*fade+HAZE*(1-fade)*0.0
        # 暗い面に細い線(尾根と谷の筋)
        img=Image.fromarray(np.clip(canvas,0,255).astype(np.uint8)); dr=ImageDraw.Draw(img)
        for x in range(4,W-4,5):
            if r[x]<0.2 or rs.rand()<0.4: continue
            d=(top[x+1]-top[x-1])/2
            if d>0.4:   # 右下がり=暗い面
                L=(base-top[x])*rs.uniform(0.25,0.55); pts=[(x,top[x]+2)]; xx=x; yy=top[x]+2
                for q in range(4): xx+=rs.uniform(0.5,2.5); yy+=L/4; pts.append((xx,yy))
                dr.line(pts,fill=INK,width=1)
        # 稜線の墨(手前ほど濃く)
        ink=tuple(int(c*(0.6+0.4*(1-u))+190*(1-u)*0.3) for c in INK)
        dr.line([(x,top[x]) for x in range(W)],fill=ink,width=2 if u>0.4 else 1)
        canvas=np.array(img).astype(float)
        mm=np.zeros((Hh,W),bool)
        for x in range(W): mm[int(max(top[x],0)):,x]=True
        paint|=mm
    return Image.fromarray(np.clip(canvas,0,255).astype(np.uint8))
if __name__=='__main__':
    styles=[('A','A 位置・高さが乱数'),('B','B 黄金比+奇数+0.618倍'),('C','C 段々に上がり下がる'),('D','D 丸い丘→尖った高峰')]
    heights=[(0.35,'低い(0.35)'),(0.65,'中くらい(0.65)'),(0.95,'高い(0.95)')]
    cw,ch=N,230
    sheet=Image.new('RGB',(cw*4+8*5,ch*3+8*4+26),(244,246,250)); dr=ImageDraw.Draw(sheet)
    for j,(sid,sn) in enumerate(styles): dr.text((8+j*(cw+8),4),sn,fill=(30,40,60),font=FNT)
    for i,(h,hn_) in enumerate(heights):
        for j,(sid,sn) in enumerate(styles):
            im=compose(sid,h,10+i*7+j); sheet.paste(im,(8+j*(cw+8),26+8+i*(ch+8)))
    sheet.save('art_sheet.png'); print(sheet.size)
    s2=Image.new('RGB',(cw*4+8*5,ch*3+8*4+26),(244,246,250)); d2=ImageDraw.Draw(s2)
    for j in range(4): d2.text((8+j*(cw+8),4),f'D 丸い丘→尖った高峰(別の乱数{j+1})',fill=(30,40,60),font=FNT)
    for i,(h,hn_) in enumerate(heights):
        for j in range(4): s2.paste(compose('D',h,100+i*11+j),(8+j*(cw+8),34+i*(ch+8)))
    s2.save('art_sheet2.png')
