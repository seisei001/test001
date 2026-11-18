# 簡易生成: 画素に直接描く世界(約70行)。世界の型10種(SPEC)。川・国の自然境界・資源は無い(見た目の検証用)。
# 使い方: python3 export_simple.py <型0〜9> <出力ディレクトリ>   → world-data.png と world-map.jpg
import numpy as np, cv2, os, json, sys
from PIL import Image
from scipy import ndimage as ndi
W,Hh=1400,900
def fbm(shape,scale,oct=5,seed=0):
    r=np.random.RandomState(seed); acc=np.zeros(shape); amp=1; tot=0
    for o in range(oct):
        s=max(2,int(scale/(2**o))); small=r.rand(shape[0]//s+2,shape[1]//s+2)
        acc+=amp*cv2.resize(small,(shape[1],shape[0]),interpolation=cv2.INTER_CUBIC); tot+=amp; amp*=.5
    return acc/tot
# 世界の型: 名前, 大陸の塊(位置x,y,半径), 陸の割合, 気温の補正, 湿り気の補正, 山の強さ
SPEC=[
 ('一つの大陸',[(0.5,0.5,330)],0.34,0.0,0.0,1.0),
 ('二つの大陸',[(0.27,0.5,240),(0.72,0.48,260)],0.33,0.0,0.0,1.0),
 ('群島',[(0.2,0.3,110),(0.4,0.65,130),(0.62,0.35,120),(0.8,0.68,110),(0.5,0.2,90),(0.12,0.7,90)],0.26,0.05,0.1,0.7),
 ('三日月の大陸',[(0.35,0.35,170),(0.5,0.55,170),(0.65,0.72,170),(0.3,0.58,130)],0.30,0.0,0.0,1.1),
 ('巨大な一つの大陸',[(0.5,0.5,430)],0.46,0.0,-0.05,1.0),
 ('寒冷な世界',[(0.4,0.5,280),(0.78,0.4,180)],0.34,-0.28,0.0,1.1),
 ('乾燥した世界',[(0.45,0.5,320),(0.85,0.6,150)],0.36,0.2,-0.28,0.9),
 ('湿潤な熱帯の世界',[(0.3,0.45,230),(0.68,0.55,250)],0.35,0.22,0.3,0.8),
 ('山脈の多い世界',[(0.38,0.5,260),(0.72,0.5,240)],0.34,0.0,0.0,1.7),
 ('内海のある大陸',[(0.38,0.5,170),(0.62,0.5,170),(0.5,0.3,150),(0.5,0.72,150)],0.36,0.0,0.05,1.1),
]
def make(i,outdir):
    name,blobs,lf,dt,dm,ms=SPEC[i]; sd=100+i*17
    yy,xx=np.mgrid[0:Hh,0:W]
    f=np.zeros((Hh,W))
    for (bx,by,r) in blobs: f+=np.exp(-(((xx-bx*W)**2+(yy-by*Hh)**2)/(2*(r*0.62)**2)))
    n=fbm((Hh,W),230,6,sd)
    f=f/ max(f.max(),1)+0.55*(n-0.5)
    edge=np.clip(np.minimum(np.minimum(xx,W-1-xx)/60,np.minimum(yy,Hh-1-yy)/50),0,1); f=f*edge-(1-edge)*0.5
    th=np.quantile(f,1-lf); land=f>=th
    land=ndi.binary_opening(land,iterations=2); lab,nl=ndi.label(land)
    if nl>1:
        sz=ndi.sum(land,lab,range(1,nl+1)); keep=[k+1 for k,s in enumerate(sz) if s>=350]; land=np.isin(lab,keep)
    dist=ndi.distance_transform_edt(land); dsea=ndi.distance_transform_edt(~land)
    # 山岳: 帯状に連なる山(低周波の帯 × 尾根ノイズ)
    ridge=1-np.abs(2*fbm((Hh,W),150,5,sd+1)-1); band=fbm((Hh,W),340,3,sd+2)
    mraw=(band**1.0)*(0.45+0.55*np.clip(ridge,0,1))*np.clip(dist/22,0,1)
    tf=min(0.09*ms,0.22); q=np.quantile(mraw[land],1-tf*2.2)
    mm=np.clip((mraw-q)/max(mraw[land].max()-q,1e-6),0,1)**(0.85 if ms<=1 else 0.55)
    base=20+np.clip(dist/45,0,1)*12+9*(fbm((Hh,W),90,4,sd+3)-0.5)+ 68*mm
    Hc=np.where(land,np.clip(base,20.5,100),np.clip(20-dsea/6,2,19.5))
    # 気温・湿り気 → 生物群系(Azgaar番号)
    lat=yy/Hh; T=dt+0.95*(1-np.abs(lat-0.5)*2)+0.08*(fbm((Hh,W),200,3,sd+4)-0.5)-0.4*np.clip((Hc-20)/80,0,1)
    M=dm+0.55*fbm((Hh,W),180,4,sd+5)+0.45*np.exp(-dsea*0)*np.clip(1-dist/260,0,1)*0.6+0.25
    BI=np.zeros((Hh,W),int)
    hot=T>0.62; warm=(T>0.38)&~hot; cool=(T>0.15)&~warm&~hot
    BI[hot&(M<0.45)]=1; BI[hot&(M>=0.45)&(M<0.65)]=3; BI[hot&(M>=0.65)&(M<0.8)]=5; BI[hot&(M>=0.8)]=7
    BI[warm&(M<0.4)]=4; BI[warm&(M>=0.4)&(M<0.62)]=6; BI[warm&(M>=0.62)&(M<0.8)]=6; BI[warm&(M>=0.8)]=8
    BI[cool&(M<0.4)]=2; BI[cool&(M>=0.4)]=9
    BI[(T<=0.15)]=10; BI[(T<=0.0)]=11
    BI[land&(Hc<24)&(M>0.7)&(BI>0)&(T>0.1)]=12
    BI[~land]=0; BI[land&(BI==0)]=4
    # 国(ボロノイ)
    rs=np.random.RandomState(sd); ys,xs=np.nonzero(land); idx=rs.choice(len(ys),11,replace=False)
    seeds=np.stack([ys[idx],xs[idx]],1); ST=np.zeros((Hh,W),int)
    d2=((ys[:,None]-seeds[None,:,0])**2+(xs[:,None]-seeds[None,:,1])**2); ST[ys,xs]=d2.argmin(1)+1
    os.makedirs(outdir,exist_ok=True)
    dat=np.zeros((Hh,W,3),np.uint8); dat[...,0]=np.clip(Hc*2.55,0,255).astype(np.uint8); dat[...,1]=BI; dat[...,2]=ST
    Image.fromarray(dat).save(outdir+'/world-data.png')
    pal={0:(80,140,190),1:(214,190,120),2:(190,180,150),3:(190,180,90),4:(150,180,90),5:(70,140,70),6:(90,150,70),7:(40,120,60),8:(60,120,90),9:(70,110,90),10:(180,190,180),11:(240,245,250),12:(100,150,130)}
    img=np.zeros((Hh,W,3),np.uint8)
    for b,c in pal.items(): img[BI==b]=c
    Image.fromarray(img).save(outdir+'/world-map.jpg',quality=85)
    return {'name':name,'land':float(land.mean()),'mount':float(((Hc>=66)&land).sum()/land.sum()),'biomes':{int(k):round(float(((BI==k)&land).sum()/land.sum()),3) for k in np.unique(BI[land])}}
if __name__=='__main__':
    import time; t=time.time(); r=make(int(sys.argv[1]),sys.argv[2]); r['gen_sec']=round(time.time()-t,2); print(json.dumps(r,ensure_ascii=False))
