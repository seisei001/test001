# 赤背景の部品シートを切り出して RGBA の部品にする。usage: cut_sheet.py <sheet.jpg> <outdir> <prefix> [text]
import sys,os,cv2,numpy as np
from scipy import ndimage as ndi
src,out,pre=sys.argv[1:4]; text=len(sys.argv)>4
os.makedirs(out,exist_ok=True)
im=cv2.imread(src).astype(np.float32); H,W=im.shape[:2]
bg=np.median(im.reshape(-1,3),axis=0)
dist=np.linalg.norm(im-bg,axis=2)
mask=dist>55
mask=cv2.morphologyEx(mask.astype(np.uint8),cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
dil=cv2.dilate(mask,np.ones((9,9),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(dil)
paper=np.array([204,226,236],np.float32)  # BGR
inkc=np.array([28,36,50],np.float32)
k=0; rows=[]
for i in range(1,n):
    x,y,w,h,a=st[i]
    if a<300 or w<14 or h<10: continue
    if text and h<34 and w>1.6*h: continue          # 日本語の題字
    if text and h<34 and w<40: continue
    comp=(lab==i)&(mask>0)
    sil=cv2.morphologyEx(comp.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
    sil=ndi.binary_fill_holes(sil>0)
    p=3; y0,y1,x0,x1=max(y-p,0),min(y+h+p,H),max(x-p,0),min(x+w+p,W)
    s=sil[y0:y1,x0:x1]; sub=im[y0:y1,x0:x1]
    R=sub[...,2]; ink=np.clip((1-R/bg[2]-0.12)/0.5,0,1)              # 暗い線
    dk=np.clip(1-np.linalg.norm(sub-paper,axis=2)/150,0,1)*0       # (未使用)
    rgb=paper*(1-ink[...,None])+inkc*ink[...,None]
    # 明るいクリーム地はそのまま活かす(赤より明るい所)
    cream=np.clip((R-bg[2]+5)/30,0,1)*(sub[...,1]>110)
    rgb=rgb*(1-cream[...,None])+sub*cream[...,None]
    al=cv2.GaussianBlur(s.astype(np.float32),(0,0),0.8)
    o=np.dstack([np.clip(rgb,0,255),al*255]).astype(np.uint8)
    # 外周の赤のにじみを紙色に
    fn=f'{pre}{k+1:02d}.png'; cv2.imwrite(os.path.join(out,fn),o); rows.append((fn,int(w),int(h))); k+=1
print(k,'parts')
