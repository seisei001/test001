# 怪物シート(白背景)を1体ずつ切り出す。外とつながる白だけを背景にして、縁はなめらかに透明へ
import cv2, numpy as np, os, sys
from scipy import ndimage as ndi
SRC=sys.argv[1]; OUT='/home/claude/test001/docs/apps/sekai-hex/assets/animals/'
B={'squid':(0,0,630,515),'serpent':(595,10,1085,520),'mermaid':(1070,100,1536,520),'fairy':(0,455,445,1024),'anchor':(372,500,705,1000),'dragon':(660,520,1536,1024)}
im=cv2.imread(SRC); H,W=im.shape[:2]
mx=im.max(axis=2).astype(int); mn=im.min(axis=2).astype(int)
white=(mn>=236)&((mx-mn)<=16)
lab,n=ndi.label(white); edge=set(lab[0])|set(lab[-1])|set(lab[:,0])|set(lab[:,-1]); edge.discard(0)
bg=np.isin(lab,list(edge))
fg=(~bg).astype(np.uint8)
fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
B['mermaid']=(1070,40,1536,520)
strict=((mn>=246)&((mx-mn)<=8)).astype(np.uint8)   # 閉じた隙間の白(触手の間など)も、広いものは透明にする
ls,ns=ndi.label(strict); big=[k+1 for k,v in enumerate(ndi.sum(strict,ls,range(1,ns+1))) if v>=150]
bg2=bg|np.isin(ls,big)
fg=(~bg2).astype(np.uint8); fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
L,N=ndi.label(fg); objs=ndi.find_objects(L); owner=np.zeros(N+1,int)-1; names=list(B)
for k,sl in enumerate(objs,1):
    area=(L[sl]==k).sum()
    if area<500: continue
    cy=(sl[0].start+sl[0].stop)/2; cx=(sl[1].start+sl[1].stop)/2
    for j,nm in enumerate(names):
        x0,y0,x1,y1=B[nm]
        if x0<=cx<x1 and y0<=cy<y1: owner[k]=j; break
for j,nm in enumerate(names):
    x0,y0,x1,y1=B[nm]; m=np.isin(L,np.where(owner==j)[0]).astype(np.uint8)
    ys,xs=np.where(m>0)
    if len(ys)==0: print(nm,'空'); continue
    m=cv2.morphologyEx(m*255,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    a=cv2.GaussianBlur(m,(0,0),0.9)
    rgba=np.dstack([im,a]); ys,xs=np.where(a>20); rgba=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]
    s=min(1.0,420/max(rgba.shape[:2]))
    if s<1: rgba=cv2.resize(rgba,None,fx=s,fy=s,interpolation=cv2.INTER_AREA)
    cv2.imwrite(OUT+nm+'.png',rgba)
print('done')
