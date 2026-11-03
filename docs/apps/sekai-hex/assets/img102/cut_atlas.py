# 部品表W01(5列×4行×6枚)を1個ずつ切り出し、背景を透明にして assets/world/<枚><行><列>.png に保存
import os
from PIL import Image
import numpy as np
from scipy import ndimage as ndi
APP='/home/claude/test001/docs/apps/sekai-hex/assets/'; SRC=APP+'img102/W01_atlas_a.png'; OUT=APP+'world/'
os.makedirs(OUT,exist_ok=True)
im=Image.open(SRC).convert('RGB'); A=np.asarray(im).astype(int)
XS=[(3.5,170),(173.5,340),(344,510)]; YS=[(4.5,138),(143,277)]
def clean(cell):
    h,w,_=cell.shape
    # 背景=明るい無彩色(白〜薄灰)。縁とつながる部分だけ消す
    mx=cell.max(axis=2); mn=cell.min(axis=2); bg=(mn>205)&((mx-mn)<28)
    lab,n=ndi.label(bg); edge=set(lab[0])|set(lab[-1])|set(lab[:,0])|set(lab[:,-1]); edge.discard(0)
    m=np.isin(lab,list(edge))
    a=(~m).astype('uint8')*255
    a=ndi.binary_opening(a>0,iterations=1).astype('uint8')*255
    lab2,n2=ndi.label(a>0)
    if n2>1:
        sizes=ndi.sum(a>0,lab2,range(1,n2+1)); keep=[i+1 for i,s in enumerate(sizes) if s>=max(12,0.08*sizes.max())]
        a=np.where(np.isin(lab2,keep),255,0).astype('uint8')
    return a
names='ABCDEF'; res={}
for pi in range(6):
    px=XS[pi%3]; py=YS[pi//3]; cw=(px[1]-px[0])/5; ch=(py[1]-py[0])/4
    for r in range(4):
        for c in range(5):
            x0=int(round(px[0]+c*cw))+1; x1=int(round(px[0]+(c+1)*cw))-1; y0=int(round(py[0]+r*ch))+1; y1=int(round(py[0]+(r+1)*ch))-1
            cell=A[y0:y1,x0:x1]; a=clean(cell)
            o=Image.fromarray(np.dstack([cell.astype('uint8'),a]),'RGBA'); bb=o.getbbox()
            if not bb: continue
            o=o.crop(bb); o=o.resize((o.width*4,o.height*4),Image.LANCZOS)
            nm=f'{names[pi]}{r+1}{c+1}'; o.save(OUT+nm+'.png'); res[nm]=o.size
print(len(res),'個')
