"""色彩加算 (iro-kasan): independent last-stage colour balance.
Decide a colour-family share table FIRST (from reference pictures / a preset), then add accent colours
to a finished picture until its shares approach the table. Terrain-independent (low-frequency noise masks).
Remove it by simply not calling apply(); every parameter lives in the preset dict."""
import numpy as np, cv2, json
FAM=['白・クリーム','灰','暗い','赤茶','金・黄土','オリーブ','緑','青緑','青','紫']
def classify(rgb):
    hsv=cv2.cvtColor(np.clip(rgb,0,255).astype(np.uint8),cv2.COLOR_RGB2HSV).astype(np.float32)
    h=hsv[...,0]*2; s=hsv[...,1]/255; v=hsv[...,2]/255
    f=np.full(h.shape,3,np.int8)
    f[(h>=20)&(h<50)]=4; f[(h>=50)&(h<90)]=5; f[(h>=90)&(h<160)]=6
    f[(h>=160)&(h<200)]=7; f[(h>=200)&(h<250)]=8; f[(h>=250)&(h<340)]=9
    f[s<0.16]=1
    f[(v>0.80)&(s<0.28)]=0
    f[v<0.30]=2
    return f,hsv
def measure(rgb,region):
    f,hsv=classify(rgb); y0,y1,x0,x1=region
    ff=f[y0:y1,x0:x1]; hh=hsv[y0:y1,x0:x1]
    sh=np.array([(ff==i).mean() for i in range(len(FAM))])
    rep=[]
    for i in range(len(FAM)):
        m=ff==i
        rep.append([float(np.median(hh[...,0][m])),float(np.median(hh[...,1][m])),float(np.median(hh[...,2][m]))] if m.sum()>50 else None)
    return {'shares':sh.tolist(),'rep':rep,'meanV':float(hh[...,2].mean())}
def apply(rgb,preset,region,strength=0.5,seed=1,sigma=70,gain=1.0,lift=True,max_hue=22,sat_up=0.25):
    """rgb float HxWx3 0..255 -> same.  preset=measure()-style dict. region=(y0,y1,x0,x1) of the map body."""
    H,W=rgb.shape[:2]; y0,y1,x0,x1=region
    f,hsv=classify(rgb)
    cur=np.array([(f[y0:y1,x0:x1]==i).mean() for i in range(len(FAM))]); tgt=np.array(preset['shares'])
    out=hsv.copy(); rs=np.random.RandomState(seed)
    surplus=np.maximum(cur-tgt,0); body=np.zeros((H,W),bool); body[y0:y1,x0:x1]=True
    cand=np.isin(f,[i for i in range(len(FAM)) if surplus[i]>0.005])&body
    area=body.sum()
    for i in np.argsort(-(tgt-cur)):
        d=tgt[i]-cur[i]
        if d<0.006 or i in (0,1,2) or preset['rep'][i] is None: continue
        nz=cv2.resize(rs.rand(H//sigma+3,W//sigma+3).astype(np.float32),(W,H),interpolation=cv2.INTER_CUBIC)
        nz=cv2.GaussianBlur(nz,(0,0),sigma/6)
        c=cand&(out[...,1]>=0)
        if c.sum()<100: continue
        frac=min(1.0,d*gain*area/c.sum()); q=np.quantile(nz[c],1-frac)
        rng=float(nz[c].max()-nz[c].min())+1e-6
        m=np.clip((nz-q)/(0.25*rng)+0.5,0,1)*c
        m=cv2.GaussianBlur(m.astype(np.float32),(0,0),10.0)*strength
        h0,s0,v0=preset['rep'][i]
        # hue to the family's hue, saturation lifted toward the family's, brightness kept (never darker)
        hh=out[...,0]; dh=np.clip(((h0/2-hh+90)%180)-90,-max_hue/2,max_hue/2)
        out[...,0]=(hh+dh*m)%180
        out[...,1]=np.clip(out[...,1]*(1+sat_up*m),0,255)
        out[...,2]=np.clip(out[...,2]*(1-0.0*m),0,255)
        cand&=~(m>0.5*strength)
    img=cv2.cvtColor(out.astype(np.uint8),cv2.COLOR_HSV2RGB).astype(np.float32)
    if lift:   # keep it from turning dark: lift towards the reference brightness (never darken, max +12%)
        v=hsv[y0:y1,x0:x1,2].mean()/255; vt=preset['meanV']
        if vt>v: img=np.clip(img*min(1.12,vt/v),0,255)
    return img
