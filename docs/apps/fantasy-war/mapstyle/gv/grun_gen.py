import sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi
sys.path.insert(0,'.')
import gstyle
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
# cities: river-adjacent sample points
ys,xs=np.where((riv>0.5))
rs=np.random.RandomState(my)
for k in rs.choice(len(ys),min(5,len(ys)),replace=False) if len(ys) else []:
    X,Y=xs[k]+ox,ys[k]+oy
    d.rectangle([X-7,Y-7,X+7,Y+4],fill=(70,48,30),outline=(236,222,190)); d.polygon([(X-9,Y-7),(X,Y-17),(X+9,Y-7)],fill=(150,60,44),outline=(236,222,190))
pil.save(f'gs{my:02d}.jpg',quality=93)
print('ok')
