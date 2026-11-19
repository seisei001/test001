import sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi
sys.path.insert(0,'.')
import gstyle10 as gstyle
my=int(sys.argv[1]); title=sys.argv[2]; sub=sys.argv[3]
pil,land,bio,Hh,riv=gstyle.render(my,None,seed=my)
OW,OH=pil.size; ox,oy=(OW-land.shape[1])//2,(OH-land.shape[0])//2
d=ImageDraw.Draw(pil)
FP='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
def F(sz): return ImageFont.truetype(FP,sz,index=2)
def txt(xy,s,sz,fill=(54,36,22),halo=(236,222,190),anchor='mm'):
    d.text(xy,s,font=F(sz),fill=fill,anchor=anchor,stroke_width=3,stroke_fill=halo)
# title ribbon
tw=d.textlength(title,font=F(40)); bw=tw+120
x0=OW/2-bw/2
d.polygon([(x0-34,40),(x0,40),(x0,92),(x0-34,92),(x0-16,66)],fill=(110,70,40))
d.polygon([(x0+bw+34,40),(x0+bw,40),(x0+bw,92),(x0+bw+34,92),(x0+bw+16,66)],fill=(110,70,40))
d.rectangle([x0,34,x0+bw,86],fill=(196,160,104),outline=(70,44,26),width=3)
d.text((OW/2,58),title,font=F(38),fill=(46,28,16),anchor='mm')
d.text((OW/2,100),sub,font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',15),fill=(236,222,190),anchor='mm',stroke_width=2,stroke_fill=(60,40,26))
# scale bar
sx,sy=OW-300,OH-70
d.rectangle([sx,sy,sx+200,sy+8],outline=(54,36,22),width=2)
for i in range(4): d.rectangle([sx+i*50,sy,sx+i*50+50,sy+8],fill=(54,36,22) if i%2==0 else (236,222,190))
d.text((sx,sy+22),'0',font=F(16),fill=(54,36,22),anchor='lm'); d.text((sx+200,sy+22),'200 km',font=F(16),fill=(54,36,22),anchor='rm')
# labels by biome components
names={6:'古の森',4:'緑の草原',9:'北風の針葉林',10:'凍土の辺境',1:'灼熱の荒野',2:'冷たい砂漠',3:'黄金の平原',7:'深き密林',8:'霧の森',11:'氷河',12:'湿地帯',5:'陽光の森'}
used=[]; done=set()
lab,n=ndi.label(land)
cand=[]
for b,nm in names.items():
    m=(bio==b)&land
    m=ndi.binary_opening(m,iterations=3)
    l2,k=ndi.label(m)
    for i in range(1,k+1):
        a=(l2==i); s=a.sum()
        if s>3000:
            cy,cx=ndi.center_of_mass(a); 
            dt=ndi.distance_transform_edt(a); py,px=np.unravel_index(dt.argmax(),dt.shape)
            cand.append((s,nm,px,py))
cand.sort(reverse=True)
for s,nm,px,py in cand[:9]:
    X,Y=px+ox,py+oy
    if any(abs(X-u)<150 and abs(Y-v)<60 for u,v in used) or nm in done: continue
    used.append((X,Y)); done.add(nm); txt((X,Y),nm,max(22,min(34,int(s**0.5/6))))
# ---- 世界データの国境と都市(world-extra.json があるときだけ。無い世界は従来どおり)
import os as _o2, json as _j
_FW=_o2.environ['FM_WORLD'].rstrip('/')+'/'
if _o2.path.exists(_FW+'world-extra.json'):
    _wd=np.array(Image.open(_FW+'world-data.png')); _st=_wd[...,2].astype(np.int32)
    # 国境: 隣り合う画素で国が違う所(両方とも陸)に、細い赤茶の線
    bd=np.zeros(_st.shape,bool)
    bd[:,1:]|=(_st[:,1:]!=_st[:,:-1])&(_st[:,1:]>0)&(_st[:,:-1]>0)
    bd[1:,:]|=(_st[1:,:]!=_st[:-1,:])&(_st[1:,:]>0)&(_st[:-1,:]>0)
    bd=ndi.binary_dilation(bd,iterations=2)
    pat=((np.add.outer(np.arange(bd.shape[0]),np.arange(bd.shape[1]))//8)%3!=0)   # 点線にする
    bm=ndi.gaussian_filter((bd&pat).astype(np.float32),0.6)
    arr=np.array(pil).astype(np.float32); reg=arr[oy:oy+bm.shape[0],ox:ox+bm.shape[1]]
    col=np.array([105,36,30],np.float32); reg[:]=reg*(1-0.95*bm[...,None])+col*0.95*bm[...,None]
    pil=Image.fromarray(arr.clip(0,255).astype(np.uint8)); d=ImageDraw.Draw(pil)
    # 都市: 国ごとの首都。名前は音の組み合わせで作る(同じ世界は同じ名前の傾向にそろえる)
    rn=np.random.RandomState(my*7+1)
    syl=['アル','ベル','カン','ド','ラ','ミ','ノル','セ','ヴァ','ロ','エル','ト','ガ','シ','マ','フィ','ク','リ','ハイ','ウ']
    ends=['ス','ン','ア','ト','ド','ル','ム','ル','ナ']
    _used=set()
    for c in _j.load(open(_FW+'world-extra.json'))['cities']:
        X,Y=c['x']+ox,c['y']+oy
        for _t in range(30):
            nm=''.join(rn.choice(syl,rn.randint(2,3)))+rn.choice(ends)
            if nm not in _used: break
        _used.add(nm)
        d.ellipse([X-9,Y-9,X+9,Y+9],fill=(236,222,190),outline=(54,36,22),width=2)
        d.ellipse([X-4,Y-4,X+4,Y+4],fill=(150,50,40))
        txt((X+14,Y-2),nm,18,anchor='lm')
# cities: river-adjacent sample points
ys,xs=np.where((riv>0.5))
rs=np.random.RandomState(my)
import os as _o
for k in rs.choice(len(ys),min(5,len(ys)),replace=False) if (len(ys) and _o.environ.get('FM_MTN')!='parts') else []:
    X,Y=xs[k]+ox,ys[k]+oy
    d.rectangle([X-7,Y-7,X+7,Y+4],fill=(70,48,30),outline=(236,222,190)); d.polygon([(X-9,Y-7),(X,Y-17),(X+9,Y-7)],fill=(150,60,44),outline=(236,222,190))
import os; pil.save(os.environ['FM_OUT'].rstrip('/')+f'/final.jpg',quality=93)
print('ok')
