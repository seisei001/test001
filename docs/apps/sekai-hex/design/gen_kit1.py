# 見本のAI絵(atlas_clean.png)の部品を、歪まないよう実比率で組む(形はコード生成)
import json,os
out=os.path.join(os.path.dirname(__file__),'..','assets','ai3d','kit1')
# 絵の中の矩形 (x,y,w,h) px
RA=(0,0,510,335);RB=(515,0,505,335);RC=(5,345,330,330);RD=(345,345,335,330);RE=(700,380,310,290)
RCH=(235,700,76,160);RG=(345,690,165,315);RH=(515,690,300,315)
def P(r,fx,fy):return (r[0]+fx*r[2],r[1]+fy*r[3])
class M:
    def __init__(s):s.p=[];s.uv=[];s.i=[];s.parts=[];s.cur=None
    def part(s,n):s.cur=[n,len(s.i),0];s.parts.append(s.cur)
    def tri(s,pts,uvs,out):
        a,b,c=pts;u=[b[k]-a[k] for k in range(3)];v=[c[k]-a[k] for k in range(3)]
        n=(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])
        if sum(n[k]*out[k] for k in range(3))<0:pts=[a,c,b];uvs=[uvs[0],uvs[2],uvs[1]]
        base=len(s.p)//3
        for p,q in zip(pts,uvs):s.p+=[round(x,4) for x in p];s.uv+=[round(q[0],2),round(q[1],2)]
        s.i+=[base,base+1,base+2];s.cur[2]+=3
    def quad(s,p,u,o):s.tri([p[0],p[1],p[2]],[u[0],u[1],u[2]],o);s.tri([p[0],p[2],p[3]],[u[0],u[2],u[3]],o)
def box(m,x0,x1,y0,y1,z0,z1,r,top=None):
    uv=[P(r,0,0),P(r,1,0),P(r,1,1),P(r,0,1)]
    for pts,o in [([(x0,y0,z1),(x1,y0,z1),(x1,y1,z1),(x0,y1,z1)],(0,0,1)),([(x0,y0,z0),(x1,y0,z0),(x1,y1,z0),(x0,y1,z0)],(0,0,-1)),
      ([(x1,y0,z0),(x1,y0,z1),(x1,y1,z1),(x1,y1,z0)],(1,0,0)),([(x0,y0,z0),(x0,y0,z1),(x0,y1,z1),(x0,y1,z0)],(-1,0,0)),
      ([(x0,y1,z0),(x1,y1,z0),(x1,y1,z1),(x0,y1,z1)],(0,1,0))]:m.quad(pts,uv,o)
def house(name,s,wst,chim_x):
    # 前面 A は 510:335 の比率を保つ。高さHを基準に幅Wが決まる(歪まない)
    H=4.0*s;W=H*510/335*wst; hx=W/2
    # 妻面 C/D: 壁部分 295x160px が奥行Dp x H に対応 → 比率を保つ
    Dp=H*295/160;hz=Dp/2;zo=hz*330/295   # 絵の屋根の張り出し分
    ridge=H*(675-350)/(675-515)
    m=M();fh=.35*s
    m.part('walls_front');m.quad([(-hx,0,hz),(hx,0,hz),(hx,H,hz),(-hx,H,hz)],[P(RA,0,1),P(RA,1,1),P(RA,1,0),P(RA,0,0)],(0,0,1))
    m.part('walls_back');m.quad([(hx,0,-hz),(-hx,0,-hz),(-hx,H,-hz),(hx,H,-hz)],[P(RB,0,1),P(RB,1,1),P(RB,1,0),P(RB,0,0)],(0,0,-1))
    for side,R,sg in(('left',RC,-1),('right',RD,1)):
        x=sg*hx
        # 絵: 壁は x=25..320 (330中)、屋根縁を含む三角は 5..335
        fl,fr=(25-5)/330,(320-5)/330
        uz=lambda z,sg=sg:((z+zo)/(2*zo)) if sg==-1 else ((zo-z)/(2*zo))
        ua=lambda z:P(R,uz(z),0)[0]
        def pt(z,yfrac):return (ua(z),R[1]+yfrac*R[3])
        yE=(515-345)/330   # 軒の位置(絵の縦割合)
        m.part('walls_'+side);m.quad([(x,0,-hz),(x,0,hz),(x,H,hz),(x,H,-hz)],[pt(-hz,1),pt(hz,1),pt(hz,yE),pt(-hz,yE)],(sg,0,0))
        m.part('gable_'+side);m.tri([(x,H,-zo),(x,H,zo),(x,ridge,0)],[pt(-zo,yE),pt(zo,yE),pt(0,0)],(sg,0,0))
    xo=hx+.1*s
    m.part('roof_front');m.quad([(-xo,H,zo),(xo,H,zo),(xo,ridge,0),(-xo,ridge,0)],[P(RE,0,1),P(RE,1,1),P(RE,1,0),P(RE,0,0)],(0,1,1))
    m.part('roof_back');m.quad([(xo,H,-zo),(-xo,H,-zo),(-xo,ridge,0),(xo,ridge,0)],[P(RE,0,1),P(RE,1,1),P(RE,1,0),P(RE,0,0)],(0,1,-1))
    m.part('stone_foundation');box(m,-hx-.06,hx+.06,0,fh,-hz-.06,hz+.06,RH)
    cz=-zo*.45;ry=H+(ridge-H)*(1-abs(cz)/zo)
    cw=.5*s;ch=2.1*s;m.part('chimney');box(m,chim_x-cw,chim_x+cw,ry-.6*s,ry-.6*s+ch,cz-cw,cz+cw,RCH)
    Pz=m.p;xs=Pz[0::3];ys=Pz[1::3];zs=Pz[2::3]
    return dict(name=name,unit='m',atlas='atlas.png',atlasSize=1024,bbox=dict(w=round(max(xs)-min(xs),3),d=round(max(zs)-min(zs),3),h=round(max(ys)-min(ys),3)),
      positions=Pz,uvs=m.uv,indices=m.i,parts=[dict(name=a,start=b,count=c) for a,b,c in m.parts])
for n,s,w,c in [('w_kit_a',.8,1.0,1.4),('w_kit_b',.95,1.0,-1.6),('w_kit_c',.7,1.25,1.8),('w_kit_d',1.1,.9,-1.2),('w_kit_e',.85,1.35,2.2)]:
    j=house(n,s,w,c);json.dump(j,open(os.path.join(out,n+'.json'),'w'))
    print(n,'tri',len(j['indices'])//3,'maxidx',max(j['indices']),'<',len(j['positions'])//3,'bbox',j['bbox'])
