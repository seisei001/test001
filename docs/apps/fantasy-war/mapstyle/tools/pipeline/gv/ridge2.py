import numpy as np, cv2
from scipy import ndimage as ndi
from skimage.morphology import skeletonize, remove_small_objects
def _prune(sk,n):
    k=np.ones((3,3),np.float32); k[1,1]=0
    s=sk.copy()
    for _ in range(n):
        nb=cv2.filter2D(s.astype(np.float32),-1,k,borderType=cv2.BORDER_CONSTANT)
        s=s&~((nb<=1)&s)
    return s
def ridge_layer2(Hh,land,seed=1,hi_pct=55,sig=2.0,thr_pct=78,step=2,length=8,end_cut=4,keep=0.8,par=1,lw=1):
    """mountain-style: thin crest line, ends erased, fixed shading strokes on the shadow side only"""
    H0,W0=Hh.shape; rs=np.random.RandomState(seed)
    Hs=ndi.gaussian_filter(Hh,1.2)
    a=ndi.gaussian_filter(Hh,sig,order=(0,2)); c=ndi.gaussian_filter(Hh,sig,order=(2,0)); b=ndi.gaussian_filter(Hh,sig,order=(1,1))
    l1=(a+c)/2-np.sqrt(((a-c)/2)**2+b**2); rid=np.maximum(-l1,0)
    ok=(Hs>np.percentile(Hs[land],hi_pct))&land
    m=(rid>np.percentile(rid[ok],thr_pct))&ok
    m=remove_small_objects(m,max_size=20)
    sk=skeletonize(m); sk=remove_small_objects(sk,max_size=14,connectivity=2)
    sk=_prune(sk,end_cut)                       # ridge ends erased
    sk=remove_small_objects(sk,max_size=6,connectivity=2)
    crest=cv2.GaussianBlur(sk.astype(np.float32),(0,0),0.55)*1.5
    gy,gx=np.gradient(ndi.gaussian_filter(Hh,2.0)); gm=np.hypot(gx,gy)+1e-6
    dx=-gx/gm; dy=-gy/gm
    img=np.zeros((H0,W0),np.uint8)
    ys,xs=np.where(sk); idx=np.arange(len(ys))
    for i in idx[::step]:
        y,x=ys[i],xs[i]
        if rs.rand()>keep: continue
        # shadow side = down-right slope only; constant shading
        for side in [1,-1]+([2,-2] if par>1 else []):
            px,py=x-side*dy[y,x]*1.5,y+side*dx[y,x]*1.5
            ix,iy=int(round(px)),int(round(py))
            if not(0<=ix<W0 and 0<=iy<H0): continue
            if (dx[iy,ix]*0.7+dy[iy,ix]*0.7)<0.1: continue
            ex,ey=px+dx[iy,ix]*length,py+dy[iy,ix]*length
            cv2.line(img,(int(px*4),int(py*4)),(int(ex*4),int(ey*4)),255,lw,cv2.LINE_AA,shift=2)
    ink=np.clip(np.maximum(crest,img.astype(np.float32)/255*0.8),0,1)*land
    return ink,sk
