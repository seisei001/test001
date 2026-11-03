# 陸の動物シート(市松模様の背景つき)を1匹ずつ切り出す。市松の2色を背景候補にし、grabCutで仕上げる
import cv2, numpy as np, os, sys
from scipy import ndimage as ndi
SRC=sys.argv[1]; OUT='/home/claude/test001/docs/apps/sekai-hex/assets/animals/'; os.makedirs(OUT,exist_ok=True)
B={'deer':(10,5,320,360),'wolf':(340,35,580,360),'fox':(580,25,825,360),'bear':(820,5,1145,360),'polar':(1115,5,1530,360),
'lion':(10,360,420,725),'tiger':(405,380,610,730),'elephant':(590,370,1005,745),'giraffe':(1005,320,1260,740),'camel':(1235,385,1530,725),
'monkey':(5,730,230,1015),'penguin':(245,720,395,1015),'seal':(405,795,865,1015),'dolphin':(710,755,1070,1000),'owl':(1030,750,1230,1000),'eagle':(1230,725,1455,1010),'parrot':(1430,740,1536,1005)}
EXTRA={'polar':[(1150,40,1245,130)],'eagle':[(1265,745,1305,790)],'penguin':[(285,790,340,960)],'owl':[(1045,765,1105,830)]}   # 頭などが背景扱いになる所は前景に固定
im=cv2.imread(SRC); H,W=im.shape[:2]
mx=im.max(axis=2).astype(int); mn=im.min(axis=2).astype(int)
chk=((mx-mn)<=26)&(mn>=196)
for nm,(x0,y0,x1,y1) in B.items():
    m=10; X0,Y0,X1,Y1=max(0,x0-m),max(0,y0-m),min(W,x1+m),min(H,y1+m); crop=im[Y0:Y1,X0:X1].copy(); c=chk[Y0:Y1,X0:X1]
    # 市松のマスは小さな格子なので、少し膨らませて穴をつなぐ
    c=cv2.morphologyEx(c.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))>0
    h,w=c.shape; mask=np.full((h,w),cv2.GC_PR_FGD,np.uint8); mask[c]=cv2.GC_PR_BGD
    rx0,ry0,rx1,ry1=x0-X0,y0-Y0,x1-X0,y1-Y0
    mask[:ry0+1,:]=cv2.GC_BGD; mask[ry1-1:,:]=cv2.GC_BGD; mask[:,:rx0+1]=cv2.GC_BGD; mask[:,rx1-1:]=cv2.GC_BGD
    # 縁から遠い中心付近で、背景色でない所は確実に前景
    core=np.zeros((h,w),np.uint8); core[ry0+(ry1-ry0)//4:ry1-(ry1-ry0)//4, rx0+(rx1-rx0)//4:rx1-(rx1-rx0)//4]=1
    mask[(core==1)&(~c)]=cv2.GC_FGD
    for ex0,ey0,ex1,ey1 in EXTRA.get(nm,[]): mask[ey0-Y0:ey1-Y0,ex0-X0:ex1-X0]=cv2.GC_FGD
    bg=np.zeros((1,65)); fg=np.zeros((1,65))
    try: cv2.grabCut(crop,mask,None,bg,fg,6,cv2.GC_INIT_WITH_MASK)
    except Exception as e: print(nm,'失敗',e); continue
    a=np.where((mask==1)|(mask==3),255,0).astype(np.uint8)
    lab,n=ndi.label(a>0)
    if n>1:
        sz=ndi.sum(a>0,lab,range(1,n+1)); a=np.where(lab==1+int(np.argmax(sz)),255,0).astype(np.uint8)
    a=ndi.binary_fill_holes(a>0).astype(np.uint8)*255
    if nm in ('wolf','elephant','giraffe','camel','monkey','deer','lion','tiger','fox','bear'):
        cc=crop.astype(int); k1=(np.abs(cc-np.array([254,254,254])).max(axis=2)<=5)|(np.abs(cc-np.array([224,211,207])).max(axis=2)<=8)
        k1=cv2.morphologyEx(k1.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
        l2,n2=ndi.label(k1)
        if n2:
            sz2=ndi.sum(k1,l2,range(1,n2+1)); big=[i+1 for i,v in enumerate(sz2) if v>=150]
            a[np.isin(l2,big)]=0
        lab,n=ndi.label(a>0)
        if n>1:
            sz=ndi.sum(a>0,lab,range(1,n+1)); a=np.where(lab==1+int(np.argmax(sz)),255,0).astype(np.uint8)
    a=cv2.GaussianBlur(cv2.erode(a,np.ones((2,2),np.uint8)),(0,0),1.0)
    rgba=np.dstack([crop,a]); ys,xs=np.where(a>20); rgba=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]
    s=min(1.0,380/max(rgba.shape[:2]))
    if s<1: rgba=cv2.resize(rgba,None,fx=s,fy=s,interpolation=cv2.INTER_AREA)
    cv2.imwrite(OUT+nm+'.png',rgba)
print('done')
