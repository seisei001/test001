import json, math, os
from PIL import Image, ImageDraw, ImageFilter
out='/home/user/test001/docs/apps/sekai-hex/assets/ai3d/hf1'
os.makedirs(out,exist_ok=True)
L=lambda n:Image.open(f'/tmp/claude-0/hf/{n}.webp').convert('RGB')
wall,roof,stone,wood=L('wall'),L('roof'),L('stone'),L('wood')
at=Image.new('RGB',(1024,1024),(200,190,170))
def put(img,x,y,w,h): at.paste(img.resize((w,h),Image.LANCZOS),(x,y))
def window(d,cx,cy,w,h):
    d.rectangle([cx-w//2-6,cy-h//2-6,cx+w//2+6,cy+h//2+6],fill=(90,58,36))
    d.rectangle([cx-w//2,cy-h//2,cx+w//2,cy+h//2],fill=(120,160,185))
    d.line([cx,cy-h//2,cx,cy+h//2],fill=(90,58,36),width=5);d.line([cx-w//2,cy,cx+w//2,cy],fill=(90,58,36),width=5)
    d.polygon([(cx-w//2,cy+h//2),(cx-w//2+w//3,cy-h//2),(cx-w//2+w//3+14,cy-h//2),(cx-w//2+14,cy+h//2)],fill=(160,195,215))
# A front 0,0,512,320 ; B back 512,0,512,320
for x in(0,512):
    put(wall,x,0,512,320);d=ImageDraw.Draw(at)
    if x==0: window(d,95,150,70,80);window(d,420,150,70,80)   # door sits between (3D part)
    else: pass
# simpler back: two windows
d=ImageDraw.Draw(at);window(d,512+120,150,70,80);window(d,512+390,150,70,80)
# C left gable 0,320,384,384 ; D right 384,320
for x in(0,384):
    put(wall,x,320,384,384);d=ImageDraw.Draw(at)
    window(d,x+192,320+280,70,80)
    window(d,x+192,320+130,44,44)
put(roof,768,320,256,384)
put(stone,0,704,256,320)
put(wood,256,704,256,320)
put(stone,512,704,256,320)
# I door region 768,704,256,320 : wooden door + glass swatch
put(wood,768,704,256,320);d=ImageDraw.Draw(at)
d.rectangle([768+6,704+6,768+170,704+314],outline=(60,36,20),width=8)
d.ellipse([768+140,704+170,768+158,704+188],fill=(200,170,70))
for k in(1,2):d.line([768+6+ k*55,704+6,768+6+k*55,704+314],fill=(60,36,20),width=3)
d.rectangle([768+176,704+10,768+250,704+310],fill=(120,160,185))
at.save(out+'/atlas.png')

R={'A':(0,0,512,320),'B':(512,0,512,320),'C':(0,320,384,384),'D':(384,320,384,384),'E':(768,320,256,384),
   'F':(0,704,256,320),'G':(256,704,256,320),'H':(512,704,256,320),'I':(768,704,256,320)}
class M:
    def __init__(s):s.p=[];s.uv=[];s.i=[];s.parts=[];s.cur=None
    def part(s,n):s.cur=[n,len(s.i),0]; s.parts.append(s.cur)
    def tri(s,pts,uvs,out):
        a,b,c=pts;ux,uy,uz=[b[k]-a[k] for k in range(3)];vx,vy,vz=[c[k]-a[k] for k in range(3)]
        n=(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx)
        if sum(n[k]*out[k] for k in range(3))<0: pts=[a,c,b];uvs=[uvs[0],uvs[2],uvs[1]]
        base=len(s.p)//3
        for p,u in zip(pts,uvs): s.p+= [round(v,4) for v in p]; s.uv+=[round(u[0],2),round(u[1],2)]
        s.i+=[base,base+1,base+2]; s.cur[2]+=3
    def quad(s,pts,uvs,out): s.tri([pts[0],pts[1],pts[2]],[uvs[0],uvs[1],uvs[2]],out); s.tri([pts[0],pts[2],pts[3]],[uvs[0],uvs[2],uvs[3]],out)
def reg(k,fu,fv):  # fraction -> atlas px
    x,y,w,h=R[k];return (x+fu*w,y+fv*h)
def box(m,x0,x1,y0,y1,z0,z1,k,tile=1):
    cx,cy=(x0+x1)/2,(y0+y1)/2
    uv=[reg(k,0,0),reg(k,1,0),reg(k,1,1),reg(k,0,1)]
    for (pts,o) in [
      ([(x0,y0,z1),(x1,y0,z1),(x1,y1,z1),(x0,y1,z1)],(0,0,1)),([(x0,y0,z0),(x1,y0,z0),(x1,y1,z0),(x0,y1,z0)],(0,0,-1)),
      ([(x1,y0,z0),(x1,y0,z1),(x1,y1,z1),(x1,y1,z0)],(1,0,0)),([(x0,y0,z0),(x0,y0,z1),(x0,y1,z1),(x0,y1,z0)],(-1,0,0)),
      ([(x0,y1,z0),(x1,y1,z0),(x1,y1,z1),(x0,y1,z1)],(0,1,0))]:
        m.quad(pts,uv,o)
def house(name,W,Dp,H,ridge,chim,wins=True,two=False):
    m=M();hx,hz=W/2,Dp/2;fh=0.5
    m.part('walls_front');m.quad([(-hx,0,hz),(hx,0,hz),(hx,H,hz),(-hx,H,hz)],[reg('A',0,1),reg('A',1,1),reg('A',1,0),reg('A',0,0)],(0,0,1))
    m.part('walls_back');m.quad([(hx,0,-hz),(-hx,0,-hz),(-hx,H,-hz),(hx,H,-hz)],[reg('B',0,1),reg('B',1,1),reg('B',1,0),reg('B',0,0)],(0,0,-1))
    for side,k,s in(('left','C',-1),('right','D',1)):
        x=s*hx
        vb=lambda z:(z+hz)/Dp
        hh=lambda h:1-h/ridge
        if s==-1: zs=[(-hz*-1) ,]  # placeholder
        # u runs along z; for +x side, outward view looks from +x toward -x: left=+z... choose u=(hz-z)/Dp for right, (z+hz)/Dp for left
        ux=(lambda z:(z+hz)/Dp) if s==-1 else (lambda z:(hz-z)/Dp)
        m.part('walls_'+side);m.quad([(x,0,-hz),(x,0,hz),(x,H,hz),(x,H,-hz)],[reg(k,ux(-hz),1),reg(k,ux(hz),1),reg(k,ux(hz),hh(H)),reg(k,ux(-hz),hh(H))],(s,0,0))
        m.part('gable_'+side);m.tri([(x,H,-hz),(x,H,hz),(x,ridge,0)],[reg(k,ux(-hz),hh(H)),reg(k,ux(hz),hh(H)),reg(k,.5,0)],(s,0,0))
    ov=0.5;eh=H-0.25;zo=hz+ov;xo=hx+ov
    # roof slopes: uv region E, repeat tiles 2x vertical
    m.part('roof_front');m.quad([(-xo,eh,zo),(xo,eh,zo),(xo,ridge+.1,0),(-xo,ridge+.1,0)],[reg('E',0,1),reg('E',1,1),reg('E',1,0),reg('E',0,0)],(0,1,1))
    m.part('roof_back');m.quad([(xo,eh,-zo),(-xo,eh,-zo),(-xo,ridge+.1,0),(xo,ridge+.1,0)],[reg('E',0,1),reg('E',1,1),reg('E',1,0),reg('E',0,0)],(0,1,-1))
    # gable verge underside caps (roof thickness edges)
    m.part('roof_edges')
    for s in(-1,1):
        x=s*xo; m.tri([(x,eh,-zo),(x,eh,zo),(x,ridge+.1,0)],[reg('E',0,1),reg('E',1,1),reg('E',.5,0)],(s,0,0))
    m.part('stone_foundation');box(m,-hx-.08,hx+.08,0,fh,-hz-.08,hz+.08,'H')
    m.part('timber_posts')
    for sx in(-1,1):
        for sz in(-1,1): box(m,sx*hx-.15-(0 if sx>0 else -.0)+(.15 if sx>0 else 0)-.0 if False else (sx*hx-.18 if sx>0 else sx*hx-.0), sx*hx+.18 if sx>0 else sx*hx+.18-.0+0, fh,H,(sz*hz-.18 if sz>0 else sz*hz),(sz*hz+.18 if sz>0 else sz*hz+.18),'G')
    m.part('timber_beam');box(m,-hx-.1,hx+.1,H-.2,H+.05,hz-.05,hz+.2,'G')
    cx,cz=chim;m.part('chimney');box(m,cx-.45,cx+.45,H-.5,ridge+1.1,cz-.45,cz+.45,'F')
    m.part('chimney_cap');box(m,cx-.58,cx+.58,ridge+1.1,ridge+1.3,cz-.58,cz+.58,'F')
    dx=0.0;m.part('door');m.quad([(dx-.65,fh-.05,hz+.04),(dx+.65,fh-.05,hz+.04),(dx+.65,fh+2.15,hz+.04),(dx-.65,fh+2.15,hz+.04)],
        [(768+4,704+316),(768+176,704+316),(768+176,704+4),(768+4,704+4)],(0,0,1))
    P=m.p;xs=P[0::3];ys=P[1::3];zs=P[2::3]
    return dict(name=name,unit='m',atlas='atlas.png',atlasSize=1024,
      bbox=dict(w=round(max(xs)-min(xs),3),d=round(max(zs)-min(zs),3),h=round(max(ys)-min(ys),3)),
      positions=P,uvs=m.uv,indices=m.i,parts=[dict(name=a,start=b,count=c) for a,b,c in m.parts])
specs=[('w_hf_a',8,6,3,5.2,(2.4,-1.5)),('w_hf_b',10,6.5,3.2,5.6,(-3,-1.8)),('w_hf_c',7,5.5,3.8,6.3,(2,-1.2)),
       ('w_hf_d',12,6,3,5.0,(4,-1.5)),('w_hf_e',8.5,7,3.4,6.0,(-2.5,-2))]
for n,W,D,H,r,c in specs:
    j=house(n,W,D,H,r,c);json.dump(j,open(f'{out}/{n}.json','w'))
    v=len(j['positions'])//3
    print(n,'tri',len(j['indices'])//3,'maxidx',max(j['indices']),'<',v,'uvmax',max(j['uvs']),'min',min(j['uvs']),j['bbox'])
