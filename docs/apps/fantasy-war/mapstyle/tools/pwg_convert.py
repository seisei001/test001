import numpy as np, re, os, sys, json
from PIL import Image
from scipy import ndimage as ndi
S=''
W,Hh=1400,900
def cat(i):
    hh=((i*0.61803398875+0.13)%1+1)%1
    k=[min(1,max(0,abs(((hh*6+o)%6+6)%6-3)-1)) for o in (0,4,2)]
    return tuple(int(round(((0.5+(x-0.5)*0.55)*0.85+0.08)*255)) for x in k)
INV={cat(i):i for i in range(28)}
# PWGの生物群系(28) → Azgaar番号(12): 地図の描き方(段階5)が使う区分へ寄せる
MAP={0:0,1:11,2:2,3:10,4:9,5:9,6:6,7:8,8:4,9:4,10:1,11:2,12:3,13:3,14:5,15:7,16:7,17:10,18:11,19:12,20:12,21:12,22:12,23:4,24:1,25:2,26:12,27:12}
def convert(seed,outdir,prefix='',indir='.'):
    S=indir.rstrip('/')+'/'
    hp=Image.open(S+f'h_{prefix}{seed}.png'); desc=hp.info['Description']
    mn,rg=map(float,re.search(r'= (-?[\d.]+) \+ v / 65535 \* ([\d.]+)',desc).groups())
    el=np.array(hp).astype(float)/65535*rg+mn
    b=np.array(Image.open(S+f'b_{prefix}{seed}.png').convert('RGB'))
    ids=np.zeros(b.shape[:2],np.uint8)
    flat=b.reshape(-1,3)
    keys=(flat[:,0].astype(int)<<16)|(flat[:,1].astype(int)<<8)|flat[:,2].astype(int)
    lut={(c[0]<<16)|(c[1]<<8)|c[2]:i for c,i in INV.items()}
    ids=np.array([lut.get(int(k),0) for k in np.unique(keys)])
    u,inv=np.unique(keys,return_inverse=True); ids=np.array([lut.get(int(k),0) for k in u])[inv].reshape(b.shape[:2])
    # 世界全体を正方形のまま900×900に縮め、左右は海で埋める(大陸を切らない)
    el9=np.array(Image.fromarray(el.astype(np.float32)).resize((900,900),Image.BILINEAR)); id9=np.array(Image.fromarray(ids.astype(np.uint8)).resize((900,900),Image.NEAREST))
    el=np.full((Hh,W),-4000.0,np.float32); ids=np.zeros((Hh,W),np.uint8); x0=(W-900)//2
    el[:,x0:x0+900]=el9; ids[:,x0:x0+900]=id9
    lake=ndi.gaussian_filter(((ids==0)&(el>0)).astype(float),1.3)>0.55
    sea_el=ndi.gaussian_filter(el,0.8)
    land=(sea_el>0)&~lake
    # 内陸で群系が0の画素は、最も近い群系で埋める
    z=(ids==0)&land
    if z.any():
        idx=ndi.distance_transform_edt(ids==0,return_distances=False,return_indices=True); ids=np.where(z,ids[idx[0],idx[1]],ids)
    el=sea_el
    lm=el[land]; q=np.quantile(lm,0.94); mx=lm.max()
    H=np.where(land,np.where(el<=q,20.3+45.7*np.clip(el,0,None)/q,66+34*np.clip((el-q)/max(mx-q,1),0,1)),np.where(el>0,19.0,np.clip(19.5+el/250,2,19.5)))
    BI=np.zeros((Hh,W),int)
    for k,v in MAP.items(): BI[ids==k]=v
    BI[~land]=0
    rs=np.random.RandomState(seed); ys,xs=np.nonzero(land); idx=rs.choice(len(ys),12,replace=False)
    seeds=np.stack([ys[idx],xs[idx]],1); ST=np.zeros((Hh,W),int)
    d2=((ys[:,None]-seeds[None,:,0])**2+(xs[:,None]-seeds[None,:,1])**2); ST[ys,xs]=d2.argmin(1)+1
    os.makedirs(outdir,exist_ok=True)
    dat=np.zeros((Hh,W,3),np.uint8); dat[...,0]=np.clip(H*2.55,0,255).astype(np.uint8); dat[...,1]=BI; dat[...,2]=ST
    Image.fromarray(dat).save(outdir+'/world-data.png')
    Image.fromarray(np.zeros((Hh,W,3),np.uint8)+np.array([120,160,190],np.uint8)).save(outdir+'/world-map.jpg')
    return {'seed':seed,'land':float(land.mean()),'mount':float(((H>=66)&land).sum()/land.sum()),'maxM':float(mx),'pwg_biomes':{int(k):round(float(((ids==k)&land).sum()/land.sum()),3) for k in np.unique(ids[land])}}
if __name__=='__main__':
    # 使い方: python3 pwg_convert.py <seed> <出力ディレクトリ> <h_/b_画像のあるディレクトリ>
    print(convert(int(sys.argv[1]),sys.argv[2],'',sys.argv[3]))
