# Geminiで色付けされた修正シート(10列×14行)を、fix_order.json の順に部品へ切り出す
import sys,os,json,cv2,numpy as np
from scipy import ndimage as ndi
src,outd=sys.argv[1:3]; os.makedirs(outd,exist_ok=True)
HERE=os.path.dirname(os.path.abspath(__file__))
if len(sys.argv)>3:   # 4分割シート: cut_fixed.py src outd <シート番号>
    sh=int(sys.argv[3]);order=[o for o in json.load(open(os.path.join(HERE,'..','parts','fix4_order.json'))) if o['sheet']==sh];NC,NR=7,5
else:
    order=json.load(open(os.path.join(HERE,'..','parts','fix_order.json')));NC,NR=10,14
im=cv2.imread(src).astype(np.float32);H,W=im.shape[:2];bg=np.median(im.reshape(-1,3),axis=0)
cw,ch=W/NC,H/NR;k=0
for o in order:
    r,c=o['row']-1,o['col']-1
    y0,y1,x0,x1=int(r*ch),int((r+1)*ch),int(c*cw),int((c+1)*cw)
    sub=im[y0:y1,x0:x1];m=np.linalg.norm(sub-bg,axis=2)>48
    m=cv2.morphologyEx(m.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((3,3),np.uint8));m=ndi.binary_fill_holes(m>0)
    lab,n=ndi.label(m)
    if n==0: continue
    sz=ndi.sum(m,lab,range(1,n+1));m=np.isin(lab,[i+1 for i in range(n) if sz[i]>=max(6,0.03*sz.max())])
    m=cv2.erode(m.astype(np.uint8),np.ones((3,3),np.uint8),iterations=2)>0
    ys,xs=np.nonzero(m)
    if len(ys)<20: continue
    a=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgb=sub[a[0]:a[1],a[2]:a[3]];al=m[a[0]:a[1],a[2]:a[3]].astype(np.float32)
    # 赤のにじみ: 縁の画素を内側の色で置き換える
    dd=np.linalg.norm(rgb-bg,axis=2);inner=(cv2.erode(al,np.ones((3,3),np.uint8))>0.5)&(dd>100)
    if inner.any():
        idx=ndi.distance_transform_edt(~inner,return_indices=True)[1];rgb=rgb[idx[0],idx[1]]
    B,G,R=rgb[...,0],rgb[...,1],rgb[...,2]
    R=np.minimum(R,G+np.maximum(0,G-B)*0.8+12)       # 赤のにじみを抑える
    rgb=np.dstack([B,G,R])
    s=3;rgb=cv2.resize(rgb,None,fx=s,fy=s,interpolation=cv2.INTER_CUBIC);al=cv2.GaussianBlur(cv2.resize(al,None,fx=s,fy=s,interpolation=cv2.INTER_LINEAR),(0,0),1.5)
    cv2.imwrite(os.path.join(outd,o['id']+'.png'),np.dstack([np.clip(rgb,0,255),al*255]).astype(np.uint8));k+=1
print(k,'parts')
