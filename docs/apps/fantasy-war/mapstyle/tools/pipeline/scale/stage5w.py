import sys, pickle, numpy as np, cv2, random
from PIL import Image
from scipy import ndimage as ndi
OUTD=sys.argv[1]; sys.argv=[sys.argv[0],OUTD]
src=open('../style/mapstyle_w.py').read().split('# ---------------- 段階')[0]
exec(src)            # base,H,BI,land,fbm,paper,coast_lines,ink_lines,draw_glyphs,water_lines,tiltshift...
lib=pickle.load(__import__('gzip').open('../lib/simlib5_z8.pkl.gz','rb')); pal=lib['pal'].astype(np.uint8); lib_cg=lib['lib_cg']; lib_c=lib['lib_c']
rg=np.random.RandomState(3)
SQ=16
# 土地の種類(ESA番号の並び): 0森 1低木 2草地 3畑 4市街 5裸地 6雪氷 7水 8湿地 10こけ
# 生物群系 → (種類の割合, 気候の群)
BIO={1:([(2,1.0)],8), 2:([(2,1.0)],9), 3:([(1,.85),(0,.15)],7), 4:([(1,1.0)],10), 5:([(0,.8),(1,.2)],0),
     6:([(0,.6),(1,.4)],0), 7:([(0,1.0)],3), 8:([(0,1.0)],6), 9:([(0,.85),(4,.15)],6), 10:([(1,.8),(2,.2)],10),
     11:([(3,1.0)],8), 12:([(4,.7),(1,.3)],11)}
def smooth(seed,s): 
    r=np.random.RandomState(seed); f=ndi.gaussian_filter(r.randn(900,1400),s); return np.argsort(np.argsort(f.ravel())).reshape(900,1400)/(900*1400)
U=smooth(11,5); U2=smooth(12,2)
CL=np.full((900,1400),-1,int); GR=np.zeros((900,1400),int)
for b,(mix,g) in BIO.items():
    m=land&(BI==b); cum=0; 
    for c,p in mix:
        mm=m&(U>=cum)&(U<cum+p+1e-9); CL[mm]=c; cum+=p
    GR[m]=g
CL[land&(H>=82)]=3        # 高い所は雪
mt=land&(H>=66)&(CL!=3); CL[mt&(U2<0.7)]=2; GR[mt]=9      # 高い所は裸地(岩)
CL[land&(CL<0)]=0
# 型を貼る: 16×16の区画ごとに、(種類,群)ごとに見本を1つ選ぶ
out=np.zeros((900,1400,3),np.uint8); out[:]=0
MU={}
def mu(key,L):
    if key not in MU: MU[key]=np.mean([pal[x].astype(float).mean(0) for x in L[:200]],0)
    return MU[key]
def getlib(c,g):
    return lib_cg.get((c,g)) or lib_c.get(c) or lib_c.get(1)
by=(900+SQ-1)//SQ; bx=(1400+SQ-1)//SQ
rank=np.argsort(np.argsort(ndi.gaussian_filter(rg.randn(900,1400),1.0).ravel()))
for j in range(by):
    for i in range(bx):
        ys=slice(j*SQ,min(900,(j+1)*SQ)); xs=slice(i*SQ,min(1400,(i+1)*SQ))
        cb=CL[ys,xs]; gb=GR[ys,xs]; lm=land[ys,xs]
        if not lm.any(): continue
        for key in set(zip(cb[lm].tolist(),gb[lm].tolist())):
            m=lm&(cb==key[0])&(gb==key[1]); L=getlib(*key); s=L[rg.randint(len(L))]
            # 区画内の並び: 乱数場の順位をもとに型の色を割り当て
            r=rank.reshape(900,1400)[ys,xs][m]; r=np.argsort(np.argsort(r))
            pix=pal[s[(r*len(s)//max(1,m.sum()))]].astype(float)
            pix=pix+(mu(key,L)-pal[s].astype(float).mean(0))*0.9      # 区画ごとの明るさの差(つなぎ目)を消す。区画内の混ざり方は残す
            out[ys,xs][m]=np.clip(pix,0,255).astype(np.uint8)
# 起伏(白黒) × 色の層
Hs=cv2.GaussianBlur(H.astype(np.float32),(0,0),1.3); gy,gx=np.gradient(Hs)
shade=np.clip(0.5+2.6*(gx+gy)/1.414,0,1)
land3=land[...,None]
col=out.astype(float)/255
col=np.clip(col,0,1)**0.58                       # ファンタジー用に明るく持ち上げる(地球の森は暗すぎる)
hsv=cv2.cvtColor((col*255).astype(np.uint8),cv2.COLOR_RGB2HSV).astype(float); hsv[...,1]=np.clip(hsv[...,1]*1.15,0,255)
col=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2RGB)/255.
relief=(0.80+0.55*(shade-0.5))[...,None]
land_img=np.clip(col*relief*1.0,0,1)
# 海: 岸から離れるほど濃く
dist=ndi.distance_transform_edt(~land); t=np.clip(dist/110,0,1)[...,None]
sea_img=(np.array([0.58,0.74,0.80])*(1-t)+np.array([0.30,0.48,0.62])*t)
img=np.where(land3,land_img,sea_img)
img=(np.clip(img,0,1)*255).astype(np.uint8)
# 紙の質感
img=paper(img,tint=(1.0,0.95,0.84))
# 128色に減らして、ディザで段差をぼかす
q=Image.fromarray(img).quantize(colors=128,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.FLOYDSTEINBERG).convert('RGB')
img=np.array(q)
Image.fromarray(img).save(OUTD+'s5a.jpg',quality=90)
# 4b: 海岸の墨線+波線+山の絵(森は絵にしない=飾りなので最後・省略)
s=ink_lines(img,coast_lines(land,3.0,0.0),width=1.8)
s=water_lines(s,n=3,step=10,alpha=.5)
s=draw_glyphs(s,scale=1.0,mind_m=26,mind_h=18,mind_t=100000)
Image.fromarray(s).save(OUTD+'s5b.jpg',quality=90)
print('done')
