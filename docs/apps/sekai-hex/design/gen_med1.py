# 中世の木骨造り(ハーフティンバー)を、柱・梁・筋かい・張り出し2階・厚い屋根・窓枠・鎧戸まで実際に立体で組む
import json,os,math
from PIL import Image,ImageDraw
HERE=os.path.dirname(os.path.abspath(__file__));OUT=os.path.join(HERE,'..','assets','ai3d','med1')
SRC=Image.open(os.path.join(HERE,'..','assets','ai3d','set1','atlas_clean.png')).convert('RGB')
REG={'plaster':(0,0,512,256),'roof':(512,0,512,512),'stone':(0,256,512,256),'brick':(0,512,256,256),'wood':(256,512,256,256),'door':(512,512,256,256),'glass':(768,512,256,256)}
def make_atlas():
    at=Image.new('RGB',(1024,1024),(120,100,80))
    def put(name,box):
        x,y,w,h=REG[name];at.paste(SRC.crop((box[0],box[1],box[0]+box[2],box[1]+box[3])).resize((w,h),Image.LANCZOS),(x,y))
    put('plaster',(530,20,470,300));put('roof',(700,380,310,290));put('stone',(520,695,290,300));put('brick',(8,693,196,305))
    put('wood',(352,745,38,230));put('door',(868,800,100,130))
    x,y,w,h=REG['glass'];g=Image.new('RGB',(w,h),(90,120,140));d=ImageDraw.Draw(g)
    for i in range(0,h,64):d.line([0,i,w,i],fill=(40,40,44),width=5)
    for i in range(0,w,64):d.line([i,0,i,h],fill=(40,40,44),width=5)
    d.polygon([(0,200),(60,0),(110,0),(30,256)],fill=(150,178,195));at.paste(g,(x,y))
    at.save(os.path.join(OUT,'atlas.png'))
def U(reg,fu,fv):
    x,y,w,h=REG[reg];return (x+2+fu*(w-4),y+2+fv*(h-4))
def sub(a,b):return [a[i]-b[i] for i in range(3)]
def cross(a,b):return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
def norm(a):
    l=math.sqrt(sum(x*x for x in a)) or 1;return [x/l for x in a]
class M:
    def __init__(s):s.p=[];s.uv=[];s.i=[];s.parts=[];s.cur=None
    def part(s,n):
        if s.parts and s.parts[-1][0]==n:s.cur=s.parts[-1];return
        s.cur=[n,len(s.i),0];s.parts.append(s.cur)
    def tri(s,pts,uvs,out):
        a,b,c=pts;n=cross(sub(b,a),sub(c,a))
        if sum(n[k]*out[k] for k in range(3))<0:pts=[a,c,b];uvs=[uvs[0],uvs[2],uvs[1]]
        base=len(s.p)//3
        for p,q in zip(pts,uvs):s.p+=[round(x,4) for x in p];s.uv+=[round(q[0],2),round(q[1],2)]
        s.i+=[base,base+1,base+2];s.cur[2]+=3
    def face(s,p,reg,out,rot=False):
        uv=[(0,0),(1,0),(1,1),(0,1)]
        if rot:uv=[(0,0),(0,1),(1,1),(1,0)]
        uv=[U(reg,*q) for q in uv]
        s.tri([p[0],p[1],p[2]],[uv[0],uv[1],uv[2]],out);s.tri([p[0],p[2],p[3]],[uv[0],uv[2],uv[3]],out)
    def solid(s,v,regs,skip=()):
        c=[sum(x[k] for x in v)/8 for k in range(3)]
        F=[(0,1,2,3),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
        for fi,f in enumerate(F):
            if fi in skip:continue
            q=[v[i] for i in f];fc=[sum(x[k] for x in q)/4 for k in range(3)]
            s.face(q,regs[fi] if isinstance(regs,(list,tuple)) else regs,sub(fc,c),False)
def abox(m,x0,x1,y0,y1,z0,z1,reg,grain='y'):
    v=[(x0,y0,z0),(x1,y0,z0),(x1,y0,z1),(x0,y0,z1),(x0,y1,z0),(x1,y1,z0),(x1,y1,z1),(x0,y1,z1)]
    c=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2]
    def f(p,out,rot):m.face(p,reg,out,rot)
    # 木目: grain方向に v を合わせる
    f([v[3],v[2],v[6],v[7]],(0,0,1),grain=='x');f([v[1],v[0],v[4],v[5]],(0,0,-1),grain=='x')
    f([v[2],v[1],v[5],v[6]],(1,0,0),grain=='z');f([v[0],v[3],v[7],v[4]],(-1,0,0),grain=='z')
    f([v[4],v[5],v[6],v[7]],(0,1,0),grain=='z'); f([v[0],v[1],v[2],v[3]],(0,-1,0),False)
    # 正しい向きは tri が out で自動補正する
def fix(a,b):return (min(a,b),max(a,b))
class Wall:
    """壁を局所座標(s=壁に沿う, t=高さ, d=外向き)で扱う。o=(x,z)原点,u=(ux,uz)壁方向,n=(nx,nz)外向き"""
    def __init__(w,m,o,u,n,y0):w.m=m;w.o=o;w.u=u;w.n=n;w.y0=y0
    def pt(w,s,t,d):return (w.o[0]+w.u[0]*s+w.n[0]*d,w.y0+t,w.o[1]+w.u[1]*s+w.n[1]*d)
    def lbox(w,s0,s1,t0,t1,d0,d1,reg,grain='v'):
        a=w.pt(s0,t0,d0);b=w.pt(s1,t1,d1)
        g={'v':'y','u':'x' if abs(w.u[0])>0 else 'z','n':'z' if abs(w.u[0])>0 else 'x'}[grain]
        abox(w.m,*fix(a[0],b[0]),*fix(a[1],b[1]),*fix(a[2],b[2]),reg,g)
    def beam(w,s0,t0,s1,t1,wd,dd,d,reg='wood'):
        p0=w.pt(s0,t0,d);p1=w.pt(s1,t1,d);n=[w.n[0],0,w.n[1]]
        dr=norm(sub(p1,p0));sd=norm(cross(dr,n))
        def c(p,a,b):return [p[k]+sd[k]*a*wd/2+n[k]*b*dd/2 for k in range(3)]
        m=w.m
        for (a0,b0,a1,b1) in [(1,1,-1,1)]:
            m.face([c(p0,1,1),c(p1,1,1),c(p1,-1,1),c(p0,-1,1)],reg,n,True)
        m.face([c(p0,1,-1),c(p1,1,-1),c(p1,1,1),c(p0,1,1)],reg,sd,True)
        sdn=[-x for x in sd];m.face([c(p0,-1,1),c(p1,-1,1),c(p1,-1,-1),c(p0,-1,-1)],reg,sdn,True)
def build_wall(m,W,L,h,nb,opens,door_bay,y0,gable_h=0,is_front=False):
    """1階分の壁。opens: 'win'|'none' per bay。gable_h>0 なら上に三角妻面を載せる"""
    bay=L/nb;fr=.2
    W.part=m.part
    m.part('infill');W.lbox(0,L,0,h,-.20,0,'plaster','u')
    m.part('timber_frame')
    for k in range(nb+1):W.lbox(k*bay-fr/2 if 0<k<nb else (k*bay-fr/2 if k==0 else k*bay-fr/2),k*bay+fr/2,0,h,-.12,.10,'wood','v')
    W.lbox(0,L,0,.22,-.12,.10,'wood','u');W.lbox(0,L,h-.24,h,-.12,.10,'wood','u')
    W.lbox(0,L,h*.55,h*.55+.14,-.10,.07,'wood','u')   # 中桁
    for k in range(nb):
        o=opens[k];s0=k*bay;s1=s0+bay
        if o=='win':
            cx=(s0+s1)/2;ww=bay*.42;t0=h*.18+.15;t1=h*.55-.12
            if h<2.4:t0=h*.30;t1=h*.78
            m.part('window_glass');W.lbox(cx-ww/2,cx+ww/2,t0,t1,0,.03,'glass','v')
            m.part('window_frames')
            e=.07
            W.lbox(cx-ww/2-e,cx+ww/2+e,t1,t1+e+.03,-.02,.14,'wood','u');W.lbox(cx-ww/2-e,cx+ww/2+e,t0-e-.03,t0,-.02,.16,'wood','u')
            W.lbox(cx-ww/2-e,cx-ww/2,t0,t1,-.02,.14,'wood','v');W.lbox(cx+ww/2,cx+ww/2+e,t0,t1,-.02,.14,'wood','v');W.lbox(cx-.02,cx+.02,t0,t1,0,.08,'wood','v')
            m.part('shutters')
            sw=ww*.5
            W.lbox(cx-ww/2-e-sw,cx-ww/2-e,t0,t1,0,.07,'wood','v');W.lbox(cx+ww/2+e,cx+ww/2+e+sw,t0,t1,0,.07,'wood','v')
        elif o=='door':
            cx=(s0+s1)/2;dw=.55;dh=min(h*.82,2.0)
            m.part('door');W.lbox(cx-dw/2,cx+dw/2,0,dh,0,.08,'door','v')
            m.part('window_frames')
            W.lbox(cx-dw/2-.1,cx-dw/2,0,dh+.12,-.02,.16,'wood','v');W.lbox(cx+dw/2,cx+dw/2+.1,0,dh+.12,-.02,.16,'wood','v');W.lbox(cx-dw/2-.1,cx+dw/2+.1,dh,dh+.12,-.02,.16,'wood','u')
            m.part('porch_hood')
            W.lbox(cx-dw/2-.25,cx+dw/2+.25,dh+.16,dh+.22,.0,.55,'roof','u')
    # 筋かい(窓のない区画に斜め材)
    m.part('timber_frame')
    for k in range(nb):
        if opens[k]=='none':
            s0=k*bay;s1=s0+bay
            if k%2==0:W.beam(s0+fr/2,.22,s0+bay*.42,h*.55,.14,.12,.10)
            else:W.beam(s1-fr/2,.22,s1-bay*.42,h*.55,.14,.12,.10)
            if k%2==0:W.beam(s1-fr/2,h-.24,s1-bay*.40,h*.55+.14,.14,.12,.10)
            else:W.beam(s0+fr/2,h-.24,s0+bay*.40,h*.55+.14,.14,.12,.10)
def house(name,Wd,Dp,floors,jet,nbx,nbz,door_bay,chim,seed=0,roofov=.45):
    m=M();hx=Wd/2;hz=Dp/2;fh=.45;h1=2.55;h2=2.25
    m.part('stone_foundation');abox(m,-hx-.08,hx+.08,0,fh,-hz-.08,hz+.08,'stone')
    rng=lambda k:((seed*7+k*13)%5)
    # 1階
    ys=fh
    def opens_for(nb,front,hasdoor=None):
        o=['win' if (i+seed)%2==0 else 'none' for i in range(nb)]
        if hasdoor is not None:o[hasdoor]='door'
        return o
    # 前(+z) 後(-z) 右(+x) 左(-x)
    walls1=[((-hx,hz),(1,0),(0,1),Wd,nbx,door_bay),((hx,-hz),(-1,0),(0,-1),Wd,nbx,None),((hx,hz),(0,-1),(1,0),Dp,nbz,None),((-hx,-hz),(0,1),(-1,0),Dp,nbz,None)]
    for o,u,n,L,nb,db in walls1:
        build_wall(m,Wall(m,o,u,n,ys),L,h1,nb,opens_for(nb,True,db),db,ys)
    y=ys+h1;top_hz=hz;yPlate=y
    if floors==2:
        j=jet;uz=hz+j
        # 張り出しの梁(根太の先端)と受け桁
        m.part('timber_frame')
        for k in range(nbx+1):
            x=-hx+k*Wd/nbx
            abox(m,x-.09,x+.09,y-.26,y,hz-.1,hz+j+.02,'wood','z');abox(m,x-.09,x+.09,y-.26,y,-hz-j-.02,-hz+.1,'wood','z')
        abox(m,-hx,hx,y-.26,y,hz+j-.02,hz+j+.12,'wood','x');abox(m,-hx,hx,y-.26,y,-hz-j-.12,-hz-j+.02,'wood','x')
        walls2=[((-hx,uz),(1,0),(0,1),Wd,nbx),((hx,-uz),(-1,0),(0,-1),Wd,nbx),((hx,uz),(0,-1),(1,0),2*uz,nbz+1),((-hx,-uz),(0,1),(-1,0),2*uz,nbz+1)]
        for o,u,n,L,nb in walls2:
            build_wall(m,Wall(m,o,u,n,y),L,h2,nb,opens_for(nb,False),None,y)
        top_hz=uz;yPlate=y+h2
    # 屋根
    th=.16;ov=roofov;zE=top_hz+ov;xo=hx+ov*.7;yE=yPlate+.12;rise=zE*1.05;yR=yE+rise
    m.part('roof_front');nrm=norm(cross([2*xo,0,0],[0,rise,-zE]))
    R0=(-xo,yR,0);R1=(xo,yR,0);E1=(xo,yE,zE);E0=(-xo,yE,zE);tn=norm(cross(sub(R1,R0),sub(E0,R0)))
    def off(p,k):return (p[0]+tn[0]*k,p[1]+tn[1]*k,p[2]+tn[2]*k)
    # 前の斜面(外向き=上)
    top=[R0,R1,E1,E0];bot=[off(p,th) for p in top]
    m.solid(list(bot)+list(top),['wood','roof','wood','wood','wood','wood'])
    m.part('roof_back')
    R0b=(xo,yR,0);R1b=(-xo,yR,0);E1b=(-xo,yE,-zE);E0b=(xo,yE,-zE);tn2=norm(cross(sub(R1b,R0b),sub(E0b,R0b)))
    def off2(p,k):return (p[0]+tn2[0]*k,p[1]+tn2[1]*k,p[2]+tn2[2]*k)
    top=[R0b,R1b,E1b,E0b];bot=[off2(p,th) for p in top]
    m.solid(list(bot)+list(top),['wood','roof','wood','wood','wood','wood'])
    m.part('ridge');abox(m,-xo-.05,xo+.05,yR-.08,yR+.1,-.12,.12,'wood','x')
    # 妻面(左右): 漆喰の三角+木の枠
    m.part('gable')
    for sg in(-1,1):
        x=sg*hx;ap=yR-th-.05
        W=Wall(m,(x,top_hz),(0,-1),(sg,0),yE-.12) if sg==1 else Wall(m,(x,-top_hz),(0,1),(-1,0),yE-.12)
        gh=ap-(yE-.12)
        tri=[(x-sg*.2,yE-.12,-top_hz),(x-sg*.2,yE-.12,top_hz),(x-sg*.2,ap,0)]
        m.tri([tri[0],tri[1],tri[2]],[U('plaster',0,0),U('plaster',1,0),U('plaster',.5,1)],(sg,0,0))
        # 外面
        tri2=[(x,yE-.12,-top_hz),(x,yE-.12,top_hz),(x,ap,0)]
        m.tri(tri2,[U('plaster',0,0),U('plaster',1,0),U('plaster',.5,1)],(sg,0,0))
        m.part('timber_frame')
        W2=Wall(m,(x,-top_hz) if sg==1 else (x,top_hz),(0,1) if sg==1 else (0,-1),(sg,0),yE-.12)
        L=2*top_hz
        W2.beam(0,0,L/2,gh,.16,.16,.06);W2.beam(L,0,L/2,gh,.16,.16,.06)
        W2.lbox(L*.2,L*.8,gh*.38,gh*.38+.13,-.02,.08,'wood','u');W2.lbox(L/2-.07,L/2+.07,0,gh*.38,-.02,.08,'wood','v')
        m.part('gable')
    # 煙突
    cx,cz=chim;cy=yR-(abs(cz)/zE)*rise if abs(cz)<zE else yE
    m.part('chimney');abox(m,cx-.42,cx+.42,cy-.8,cy+1.7,cz-.42,cz+.42,'brick','y')
    m.part('chimney_cap');abox(m,cx-.55,cx+.55,cy+1.7,cy+1.9,cz-.55,cz+.55,'stone','y')
    P=m.p;xs=P[0::3];ys=P[1::3];zs=P[2::3]
    dims=dict(hx=hx,hz=hz,uz=top_hz,h1=h1,h2=h2,fh=fh,yE=yE,yR=yR,zE=zE,xo=xo,yP=yPlate,cx=cx,cz=cz,cy=cy,floors=floors,ymax=max(ys),th=th)
    return dict(dims=dims,name=name,unit='m',atlas='atlas.png',atlasSize=1024,bbox=dict(w=round(max(xs)-min(xs),3),d=round(max(zs)-min(zs),3),h=round(max(ys)-min(ys),3)),
      positions=P,uvs=m.uv,indices=m.i,parts=[dict(name=a,start=b,count=c) for a,b,c in m.parts if c])
if __name__=='__main__':
    make_atlas()
    specs=[('w_med_a',7.0,5.0,1,0,3,2,1,(1.8,-1.0),0),
           ('w_med_b',8.0,5.5,2,.5,4,2,1,(-2.5,-1.2),1),
           ('w_med_c',6.0,5.0,2,.45,3,2,1,(1.4,-1.0),0),
           ('w_med_d',11.0,5.5,2,.5,5,2,2,(3.5,-1.2),1),
           ('w_med_e',9.0,6.0,2,.55,4,3,2,(-3.0,-1.4),0)]
    for n,W,D,fl,j,nbx,nbz,db,ch,sd in specs:
        j=house(n,W,D,fl,j,nbx,nbz,db,ch,sd);json.dump(j,open(os.path.join(OUT,n+'.json'),'w'))
        v=len(j['positions'])//3
        print(n,'tri',len(j['indices'])//3,'maxidx',max(j['indices']),'<',v,'uv',min(j['uvs']),max(j['uvs']),j['bbox'])
