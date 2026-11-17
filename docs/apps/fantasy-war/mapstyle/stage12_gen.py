import sys, numpy as np, json
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.signal import find_peaks
import art
OUTD=sys.argv[1]; sys.argv=[sys.argv[0],OUTD]
src=open('../style/mapstyle.py').read().split('# ---------------- 段階')[0]; exec(src)
Hs=ndi.gaussian_filter(H,1.0); LO=56.0; HI=float(np.percentile(Hs[land],99.7)); hn=np.clip((Hs-LO)/(HI-LO),0,1)*land
# --- 山岳地帯: 高い所がまとまった地域だけ
core=ndi.gaussian_filter(hn,2.5)>0.30
core=ndi.binary_closing(core,iterations=4); core=ndi.binary_opening(core,iterations=2)
lab,nl=ndi.label(core); areas=ndi.sum(core,lab,range(1,nl+1))
keep=[i+1 for i,a in enumerate(areas) if a>=1500]
region=np.isin(lab,keep); print('山岳地帯の数',len(keep),'面積',[int(areas[i-1]) for i in keep],'陸に占める割合',round(float(region.sum()/land.sum()),3))
base=np.array(Image.open('../scale/st5/s5a.jpg').convert('RGB'))
S=2; canvas=np.array(Image.fromarray(base).resize((W*S,Hh*S),Image.LANCZOS)).astype(float); TEX=canvas.copy()
BAND=22; GH=50.0*S; rs=np.random.RandomState(21)
HAZE=art.HAZE; CL=art.C_LIGHT; CD=art.C_DARK; SNOW=art.SNOW; INK=art.INK
paint=np.zeros(canvas.shape[:2],bool)
npk=0
def ridge_from(prof,env,rs):
    n=len(prof); pr=ndi.gaussian_filter1d(prof,4.0)
    pk,_=find_peaks(pr,prominence=0.04,distance=max(int(n*0.16),10),height=0.12)
    if len(pk)==0: return np.zeros(n),0
    pk=sorted(pk,key=lambda p:-pr[p])[:4]
    y=np.zeros(n)
    for p in pk:
        a=float(min(pr[p]*1.05,1.0)); s=art.smooth((a-0.25)/0.6)
        wl=n*(0.16+0.20*rs.rand())*(0.7+0.6*a); wr=n*(0.16+0.20*rs.rand())*(0.7+0.6*a)
        if rs.rand()<0.5: wl,wr=wr*0.7,wl*1.25
        y=np.maximum(y,art.bump(n,p,a,wl,wr,s,1.5+0.9*s))
    y=y+art.noise1(n,rs)*0.015*np.clip(y,0,1)**1.5
    return np.clip(y,0,None)*env,len(pk)
for rid in keep:
    m=(lab==rid); ys,xs=np.nonzero(m); cx=(xs.min()+xs.max())/2; hw=max((xs.max()-xs.min())/2+25,85); y0,y1,x0,x1=ys.min(),ys.max(),int(max(cx-hw,0)),int(min(cx+hw,W))
    nb=7; BAND=max(int((y1-y0)/nb),12); bands=[y0+BAND*(k+1) for k in range(nb)]; GH=float(np.clip(0.36*(x1-x0),60,115))*S
    for bi,yb in enumerate(bands):
        yb=min(yb,Hh-1); ya=max(yb-BAND,0)
        sl=slice(x0,x1)
        prof=hn[ya:yb,sl].max(0)*m[ya:yb,sl].max(0)
        env=np.clip(ndi.gaussian_filter1d(m[ya:yb,sl].max(0).astype(float),9.0)*1.4,0,1)
        hk=float(np.clip(prof.max()/max(hn[m].max(),1e-6),0.35,1.0))*(1.0-0.15*(1-bi/max(nb-1,1)))
        env=np.clip(ndi.gaussian_filter1d(m[ya:yb,sl].max(0).astype(float),14.0)*1.6,0,1)
        r=art.ridge('D',hk,rs,len(prof))*env; np_=4; npk+=np_
        if (r>0.03).sum()<4: continue
        n=len(r); u=bi/max(nb-1,1)
        top=yb*S-r*GH; bot=(yb+3)*S
        # 影(奥の層へ)
        mk=np.zeros(canvas.shape[:2],bool)
        for i in range(n):
            if r[i]<0.02: continue
            mk[int(max(top[i],0)):int(bot),(x0+i)*S:(x0+i+1)*S]=True
        sub=(slice(max(int(top[r>0.02].min())-30,0),min(int(bot)+30,Hh*S)),slice(max(x0*S-30,0),min(x1*S+30,W*S)))
        shd=ndi.gaussian_filter(np.roll(np.roll(mk[sub].astype(float),7,1),-5,0),3.5)
        pm=paint[sub]; reg=canvas[sub]; reg[pm]=reg[pm]*(1-0.5*shd[pm])[:,None]
        topS=ndi.gaussian_filter1d(top,1.5)
        for i in range(1,n-1):
            if r[i]<0.02: continue
            t=int(max(top[i],0)); b=int(bot)
            if b<=t: continue
            d=(topS[i+1]-topS[i-1])/2; lit=float(np.clip(0.5-np.clip(d,-5,5)*0.1,0,1))
            ry=np.arange(t,b); frac=(b-ry)/max(1,(b-t)); span=BAND*2.0+r[i]*30
            sy=np.clip(((yb-frac*span)*S).astype(int),0,Hh*S-1)
            tex=TEX[sy,(x0+i)*S:(x0+i+1)*S].mean(1)
            pal=CD*(1-lit)+CL*lit
            col=(tex*0.45+pal*0.55)*(0.62+0.38*lit+0.1)*(0.70+0.30*u)+HAZE*(1-u)*0.22*0.9
            col=np.clip(col,0,255)
            if r[i]>0.72 and lit>0.45:
                cap=frac>0.82; col[cap]=col[cap]*0.4+SNOW*0.6
            canvas[t:b,(x0+i)*S:(x0+i+1)*S]=col[:,None,:]
        img=Image.fromarray(np.clip(canvas,0,255).astype(np.uint8)); dr=ImageDraw.Draw(img)
        for i in range(3,n-3,4):
            if r[i]<0.2 or rs.rand()<0.4: continue
            d=(topS[i+1]-topS[i-1])/2
            if d>0.4:
                L=(bot-top[i])*rs.uniform(0.25,0.5); xx=(x0+i)*S; yy=top[i]+2; pts=[(xx,yy)]
                for q in range(4): xx+=rs.uniform(0.5,2.5); yy+=L/4; pts.append((xx,yy))
                dr.line(pts,fill=INK,width=1)
        ink=tuple(int(c*(0.6+0.4*(1-u))+190*(1-u)*0.3) for c in INK)
        dr.line([((x0+i)*S,top[i]) for i in range(n) if r[i]>=0.02],fill=ink,width=2)
        canvas=np.array(img).astype(float); paint|=mk
out=Image.fromarray(np.clip(canvas,0,255).astype(np.uint8)).resize((W,Hh),Image.LANCZOS)
out.save(OUTD+'s12a.jpg',quality=90)
json.dump({'regions':len(keep),'peaks':int(npk),'ratio':float(region.sum()/land.sum())},open(OUTD+'s12_stats.json','w'))
print('頂点',npk)
