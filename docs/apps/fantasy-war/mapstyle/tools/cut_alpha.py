# 透明PNGの修正シート(7列×5行)を fix4_order.json の順に部品へ切り出す。 usage: cut_alpha.py <sheet.png> <outdir> <シート番号>
import sys,os,json,cv2,numpy as np
from scipy import ndimage as ndi
src,outd,sh=sys.argv[1],sys.argv[2],int(sys.argv[3]); os.makedirs(outd,exist_ok=True)
HERE=os.path.dirname(os.path.abspath(__file__))
order=[o for o in json.load(open(os.path.join(HERE,'..','parts','fix4_order.json'))) if o['sheet']==sh]
im=cv2.imread(src,cv2.IMREAD_UNCHANGED);H,W=im.shape[:2];cw,ch=W/7,H/5;k=0
for o in order:
    r,c=o['row']-1,o['col']-1
    sub=im[int(r*ch):int((r+1)*ch),int(c*cw):int((c+1)*cw)].copy()
    a=sub[...,3].astype(np.float32)/255;m=a>0.08
    lab,n=ndi.label(cv2.dilate(m.astype(np.uint8),np.ones((5,5),np.uint8)))
    if n==0: continue
    sz=ndi.sum(m,lab,range(1,n+1));keep=np.isin(lab,[i+1 for i in range(n) if sz[i]>=max(15,0.04*sz.max())])
    a=a*keep;ys,xs=np.nonzero(a>0.08)
    if len(ys)<30: continue
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgb=sub[y0:y1,x0:x1,:3].astype(np.float32);al=a[y0:y1,x0:x1]
    inner=cv2.erode((al>0.97).astype(np.uint8),np.ones((3,3),np.uint8))>0     # 縁の赤みを内側の色で置き換える
    if inner.any():
        idx=ndi.distance_transform_edt(~inner,return_indices=True)[1];rgb=np.where((al<0.97)[...,None],rgb[idx[0],idx[1]],rgb)
    cv2.imwrite(os.path.join(outd,o['id']+'.png'),np.dstack([rgb,al*255]).astype(np.uint8));k+=1
print(sh,k,'parts')
