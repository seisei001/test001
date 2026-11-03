# 動物シート(1536×1024)を、範囲指定+grabCutで1匹ずつ切り出し、背景を透明にして assets/animals/ へ
import cv2, numpy as np, os, sys
from scipy import ndimage as ndi
SRC=sys.argv[1]; OUT='/home/claude/test001/docs/apps/sekai-hex/assets/animals/'; os.makedirs(OUT,exist_ok=True)
B={'cow':(5,5,335,312),'sheep':(335,60,525,315),'horse':(555,5,820,312),'goat':(815,62,950,315),'dragon_blue':(935,20,1536,395),
'pig':(10,320,230,475),'chicken':(240,320,370,475),'duck':(380,330,495,475),'goose':(520,288,660,478),'dog':(665,285,800,470),'cat':(800,322,945,468),'dragon_red':(930,325,1340,525),
'tuna':(5,480,365,625),'mackerel':(375,478,680,575),'snapper':(510,565,675,662),'flounder':(10,630,240,740),'marlin':(225,585,660,760),'clownfish':(40,745,150,805),'angelfish':(200,722,325,810),
'shark':(400,715,740,850),'octopus':(5,790,340,1020),'squid':(313,815,512,1015),'galleon':(665,480,935,735),'sailboat':(940,530,1100,725),'liner':(765,740,1075,885),
'pegasus':(1085,350,1536,990),'whale':(510,865,1100,1020),'fishingboat':(1090,805,1310,950),'turtle':(975,940,1200,1020)}
im=cv2.imread(SRC); H,W=im.shape[:2]
for nm,(x0,y0,x1,y1) in B.items():
    m=14; X0,Y0,X1,Y1=max(0,x0-m),max(0,y0-m),min(W,x1+m),min(H,y1+m); crop=im[Y0:Y1,X0:X1].copy()
    rect=(x0-X0+2,y0-Y0+2,(x1-x0)-4,(y1-y0)-4); mask=np.zeros(crop.shape[:2],np.uint8); bg=np.zeros((1,65),np.float64); fg=np.zeros((1,65),np.float64)
    try: cv2.grabCut(crop,mask,rect,bg,fg,6,cv2.GC_INIT_WITH_RECT)
    except Exception as e: print(nm,'失敗',e); continue
    a=np.where((mask==1)|(mask==3),255,0).astype(np.uint8)
    lab,n=ndi.label(a>0)
    if n>1:
        sz=ndi.sum(a>0,lab,range(1,n+1)); a=np.where(lab==1+int(np.argmax(sz)),255,0).astype(np.uint8)
    a=ndi.binary_fill_holes(a>0).astype(np.uint8)*255
    a=cv2.GaussianBlur(cv2.erode(a,np.ones((2,2),np.uint8)),(0,0),1.0)
    rgba=np.dstack([crop,a]); ys,xs=np.where(a>20); rgba=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]
    s=min(1.0,380/max(rgba.shape[:2])); 
    if s<1: rgba=cv2.resize(rgba,None,fx=s,fy=s,interpolation=cv2.INTER_AREA)
    cv2.imwrite(OUT+nm+'.png',rgba)
print('done')
