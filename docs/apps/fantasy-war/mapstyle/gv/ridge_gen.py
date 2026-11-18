import numpy as np, cv2
from scipy import ndimage as ndi
from skimage.morphology import skeletonize, remove_small_objects
def ridge_layer(Hh,land,seed=1,hi_pct=62,sig=2.2,thr_pct=86,dens=1.0):
    """return ink alpha (0..1) of ridge lines + slope hatching, in map coords"""
    H0,W0=Hh.shape; rs=np.random.RandomState(seed)
    Hs=ndi.gaussian_filter(Hh,1.2)
    a=ndi.gaussian_filter(Hh,sig,order=(0,2)); c=ndi.gaussian_filter(Hh,sig,order=(2,0)); b=ndi.gaussian_filter(Hh,sig,order=(1,1))
    l1=(a+c)/2-np.sqrt(((a-c)/2)**2+b**2)
    rid=np.maximum(-l1,0)
    hv=Hs[land]; hi=Hs>np.percentile(hv,hi_pct)
    ok=hi&land
    thr=np.percentile(rid[ok],thr_pct)
    m=(rid>thr)&ok
    m=remove_small_objects(m,20)
    sk=skeletonize(m); sk=remove_small_objects(sk,12,connectivity=2)
    ink=np.zeros((H0,W0),np.float32)
    # crest line
    ink=np.maximum(ink,cv2.GaussianBlur(sk.astype(np.float32),(0,0),0.6)*1.6)
    # hatching: strokes from ridge pixels downhill, denser/longer on shadow side (light from upper-left)
    gy,gx=np.gradient(ndi.gaussian_filter(Hh,2.0))
    gm=np.hypot(gx,gy)+1e-6; dx=-gx/gm; dy=-gy/gm      # downhill unit vector
    shade=(dx*0.7+dy*0.7)                               # >0 : faces away from light (down-right)
    img=np.zeros((H0,W0),np.uint8)
    ys,xs=np.where(sk)
    sel=rs.rand(len(ys))<0.30*dens
    for y,x in zip(ys[sel],xs[sel]):
        s=shade[y,x]
        if s<-0.2 and rs.rand()<0.7: continue
        L=(5+10*min(1,gm[y,x]/6.0))*(1.0 if s>0 else 0.55)*rs.uniform(0.7,1.3)
        n=2
        for k in (-1,1):                       # strokes down both flanks of the crest
            # flank direction: perpendicular to crest approximated by downhill dir sign handled by gradient at offset
            px,py=x+k*1.5*dy[y,x]*-1,y+k*1.5*dx[y,x]
            ix,iy=int(round(px)),int(round(py))
            if not(0<=ix<W0 and 0<=iy<H0): continue
            ddx,ddy=dx[iy,ix],dy[iy,ix]
            ex,ey=px+ddx*L,py+ddy*L
            cv2.line(img,(int(px*4),int(py*4)),(int(ex*4),int(ey*4)),255,1,cv2.LINE_AA,shift=2)
    hat=img.astype(np.float32)/255*0.8
    ink=np.clip(np.maximum(ink,hat),0,1)
    return ink*(land.astype(np.float32)), sk
