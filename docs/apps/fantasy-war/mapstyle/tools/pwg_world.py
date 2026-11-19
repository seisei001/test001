# PWGを直接動かして出したデータ(pwg_dump_world.ts)を、世界データ(1400×900 world-data.png)にする。
# 使い方: python3 pwg_world.py <入力の接頭辞(…/w7)> <出力dir> <回転(0か1)> [氷の厚さpx=30]
# 回転=1: 世界を90度回す(左右の端に陸があるとき、それを上下に持っていく)。上下の端は白い氷にする。
import numpy as np, os, sys, json
from PIL import Image
from scipy import ndimage as ndi
from pwg_convert import MAP
W,Hh=1400,900
def build(pre,outdir,rot=0,ice=30):
    n=json.load(open(pre+'.json'))['n']; seed=json.load(open(pre+'.json'))['seed']
    el=np.fromfile(pre+'_elev.bin',np.float32).reshape(n,n); wc=np.fromfile(pre+'_water.bin',np.uint8).reshape(n,n); ids=np.fromfile(pre+'_biome.bin',np.uint8).reshape(n,n)
    if rot: el,wc,ids=[np.rot90(a) for a in (el,wc,ids)]
    el=np.where(wc==1,np.minimum(el,-50),el)               # 海は必ず海面より下
    el9=np.array(Image.fromarray(np.ascontiguousarray(el)).resize((900,900),Image.BILINEAR)); id9=np.array(Image.fromarray(np.ascontiguousarray(ids)).resize((900,900),Image.NEAREST))
    E=np.full((Hh,W),-4000.0,np.float32); I=np.zeros((Hh,W),np.uint8); x0=(W-900)//2
    E[:,x0:x0+900]=el9; I[:,x0:x0+900]=id9
    lake=ndi.gaussian_filter(((I==0)&(E>0)).astype(float),1.3)>0.55
    sea_el=ndi.gaussian_filter(E,0.8); land=(sea_el>0)&~lake
    z=(I==0)&land
    if z.any():
        idx=ndi.distance_transform_edt(I==0,return_distances=False,return_indices=True); I=np.where(z,I[idx[0],idx[1]],I)
    el=sea_el; lm=el[land]; q=np.quantile(lm,0.94); mx=lm.max()
    H=np.where(land,np.where(el<=q,20.3+45.7*np.clip(el,0,None)/q,66+34*np.clip((el-q)/max(mx-q,1),0,1)),np.where(el>0,19.0,np.clip(19.5+el/250,2,19.5)))
    BI=np.zeros((Hh,W),int)
    for k,v in MAP.items(): BI[I==k]=v
    BI[~land]=0
    # 上下の氷: 全幅に、ゆらぎのある厚さで白い氷(群系11・低い平らな陸)
    rs=np.random.RandomState(seed)
    t=ndi.gaussian_filter(rs.rand(2,W),12); t=(t-t.min())/(t.max()-t.min())
    top=(ice*(0.6+0.8*t[0])).astype(int); bot=(ice*(0.6+0.8*t[1])).astype(int)
    yy=np.arange(Hh)[:,None]
    icem=(yy<top[None,:])|(yy>=Hh-bot[None,:])
    H=np.where(icem,np.maximum(21.0,np.where(land,H,21.0)),H); BI=np.where(icem,11,BI); land=land|icem
    ys,xs=np.nonzero(land); idx=rs.choice(len(ys),12,replace=False)
    seeds=np.stack([ys[idx],xs[idx]],1); ST=np.zeros((Hh,W),int)
    d2=((ys[:,None]-seeds[None,:,0])**2+(xs[:,None]-seeds[None,:,1])**2); ST[ys,xs]=d2.argmin(1)+1
    os.makedirs(outdir,exist_ok=True)
    dat=np.zeros((Hh,W,3),np.uint8); dat[...,0]=np.clip(H*2.55,0,255).astype(np.uint8); dat[...,1]=BI; dat[...,2]=ST
    Image.fromarray(dat).save(outdir+'/world-data.png')
    Image.fromarray(np.zeros((Hh,W,3),np.uint8)+np.array([120,160,190],np.uint8)).save(outdir+'/world-map.jpg')
    e=8; L=land.copy(); sq=L[:,x0:x0+900]; sq_noice=(land&~icem)[:,x0:x0+900]
    return {'land_img':round(float(L.mean()),3),'land_noice':round(float((land&~icem).mean()),3),'left':round(float(sq_noice[:,:e].mean()),3),'right':round(float(sq_noice[:,-e:].mean()),3),'mount':round(float(((H>=66)&land).sum()/land.sum()),3)}
if __name__=='__main__':
    print(json.dumps(build(sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]) if len(sys.argv)>4 else 30)))
