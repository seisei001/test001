# 詳細な木骨造りモデル(med1)を正面・側面・屋根面から撮影して絵に焼き付け、少ない面の簡単な形(lo1)に貼る
# 使い方: python3 bake_med1.py views  →  node bake_med1.js  →  python3 bake_med1.py pack
import json,os,sys,math
from PIL import Image
import numpy as np
HERE=os.path.dirname(os.path.abspath(__file__))
EAST=len(sys.argv)>2 and sys.argv[2]=='east'
MED=os.path.join(HERE,'..','assets','ai3d','med2' if EAST else 'med1');LO=os.path.join(HERE,'..','assets','ai3d','lo2' if EAST else 'lo1')
TMP='/tmp/claude-0/hf/bake'+('_e' if EAST else '')+'';os.makedirs(TMP,exist_ok=True);os.makedirs(LO,exist_ok=True)
sys.path.insert(0,HERE);import gen_med1 as G
G.setstyle(EAST)
SPECS=G.EAST_SPECS if EAST else G.WEST_SPECS
_OLD=[('w_med_a',7.0,5.0,1,0,3,2,1,(1.8,-1.0),0),('w_med_b',8.0,5.5,2,.5,4,2,1,(-2.5,-1.2),1),('w_med_c',6.0,5.0,2,.45,3,2,1,(1.4,-1.0),0),
       ('w_med_d',11.0,5.5,2,.5,5,2,2,(3.5,-1.2),1),('w_med_e',9.0,6.0,2,.55,4,3,2,(-3.0,-1.4),0)]
def dims_of(n):return json.load(open(os.path.join(MED,n+'.json')))['dims']
def views(dm):
    xo=dm['xo'];zE=dm['zE'];yR=dm['yR'];top=dm['ymax']+.2;rise=yR-dm['yE'];sl=math.hypot(zE,rise)
    V={}
    V['F']=dict(center=[0,top/2,0],forward=[0,0,-1],up=[0,1,0],w=2*xo,h=top)
    V['B']=dict(center=[0,top/2,0],forward=[0,0,1],up=[0,1,0],w=2*xo,h=top)
    V['R']=dict(center=[0,top/2,0],forward=[-1,0,0],up=[0,1,0],w=2*zE,h=top)
    V['L']=dict(center=[0,top/2,0],forward=[1,0,0],up=[0,1,0],w=2*zE,h=top)
    nF=[0,zE,rise];nB=[0,zE,-rise];upF=[0,rise,-zE];upB=[0,rise,zE]
    cF=[0,(yR+dm['yE'])/2,zE/2];cB=[0,(yR+dm['yE'])/2,-zE/2]
    V['RF']=dict(center=cF,forward=[-x for x in nF],up=upF,w=2*xo,h=sl)
    V['RB']=dict(center=cB,forward=[-x for x in nB],up=upB,w=2*xo,h=sl)
    V['CF']=dict(center=[dm['cx'],dm['cy']+.55,dm['cz']],forward=[0,0,-1],up=[0,1,0],w=1.2,h=2.9)
    V['CR']=dict(center=[dm['cx'],dm['cy']+.55,dm['cz']],forward=[-1,0,0],up=[0,1,0],w=1.2,h=2.9)
    return V,sl
def pack(sizes,N=2048,pad=4):
    order=sorted(range(len(sizes)),key=lambda i:-sizes[i][1]);x=y=sh=0;pos={}
    for i in order:
        w,h=sizes[i][0]+2*pad,sizes[i][1]+2*pad
        if x+w>N:x=0;y+=sh;sh=0
        if y+h>N:return None
        pos[i]=(x+pad,y+pad);x+=w;sh=max(sh,h)
    return pos
GROUPS=[SPECS[:3],SPECS[3:]]
def allsizes(pxm,specs):
    L=[];keys=[]
    for sp in specs:
        V,_=views(dims_of(sp[0]))
        for k,v in V.items():
            if k[0]=='C' and dims_of(sp[0]).get('nochim'):continue
            L.append((round(v['w']*pxm),round(v['h']*pxm)));keys.append((sp[0],k))
    return L,keys
if sys.argv[1]=='views':
    for sp in SPECS:json.dump(G.house(*sp),open(os.path.join(MED,sp[0]+'.json'),'w'))
    out=[];PX={}
    for gi,g in enumerate(GROUPS):
        pxm=90
        while pxm>20:
            L,keys=allsizes(pxm,g)
            if pack(L):break
            pxm-=1
        PX[gi]=pxm;print('group',gi,'px/m',pxm)
        for sp in g:
            V,_=views(dims_of(sp[0]))
            for k,v in V.items():out.append(dict(house=sp[0],key=k,view=v,pxm=pxm,only=['chimney','chimney_cap'] if k[0]=='C' else None))
            if dims_of(sp[0]).get('nochim'):out=[o for o in out if not (o['house']==sp[0] and o['key'][0]=='C')]
    json.dump(dict(px=PX,med='med2' if EAST else 'med1',jobs=out),open(TMP+'/jobs.json','w'))
def do_pack(gi,g,pxm):
    L,keys=allsizes(pxm,g);pos=pack(L);N=2048
    at=np.zeros((N,N,3),np.uint8)+np.array([217,210,192],np.uint8);R={}
    for i,(h,k) in enumerate(keys):
        im=np.asarray(Image.open(f'{TMP}/{h}_{k}.png').convert('RGB'));ih,iw=im.shape[:2];x,y=pos[i]
        pad=4;pim=np.pad(im,((pad,pad),(pad,pad),(0,0)),mode='edge');at[y-pad:y+ih+pad,x-pad:x+iw+pad]=pim
        R[(h,k)]=(x,y,iw,ih)
    Image.fromarray(at).save(LO+f'/atlas_{gi}.jpg',quality=88)
    for sp in g:
        n=sp[0];dm=dims_of(n);V,sl=views(dm);xo,zE,hx,uz,hz,yR,yE=dm['xo'],dm['zE'],dm['hx'],dm['uz'],dm['hz'],dm['yR'],dm['yE']
        y1=dm['fh']+dm['h1'];yP=dm['yP'];two=dm['floors']==2
        def uvF(k,p):
            x,y,iw,ih=R[(n,k)];v=V[k];X,Y,Z=p
            if k=='F':fu=(X+v['w']/2)/v['w']
            elif k=='B':fu=(v['w']/2-X)/v['w']
            elif k=='R':fu=(v['w']/2-Z)/v['w']
            elif k=='L':fu=(Z+v['w']/2)/v['w']
            elif k in('RF','RB'):
                fu=(X+v['w']/2)/v['w'] if k=='RF' else (v['w']/2-X)/v['w'];s=math.hypot(Z,yR-Y);return (x+fu*iw,y+min(1,s/sl)*ih)
            fv=1-Y/v['h'];return (x+fu*iw,y+fv*ih)
        P=[];U=[];I=[];parts=[]
        def part(name):parts.append([name,len(I),0])
        def quad(pts,k,out):
            a,b,c=pts[0],pts[1],pts[2];ux=[b[i]-a[i] for i in range(3)];vx=[c[i]-a[i] for i in range(3)]
            nn=[ux[1]*vx[2]-ux[2]*vx[1],ux[2]*vx[0]-ux[0]*vx[2],ux[0]*vx[1]-ux[1]*vx[0]]
            seq=[0,1,2,0,2,3] if sum(nn[i]*out[i] for i in range(3))>=0 else [0,2,1,0,3,2]
            base=len(P)//3
            for p in pts:P.extend([round(q,4) for q in p]);U.extend([round(t,2) for t in uvF(k,p)])
            I.extend(base+i for i in seq);parts[-1][2]+=len(seq)
        def tri(pts,k,out):
            a,b,c=pts;ux=[b[i]-a[i] for i in range(3)];vx=[c[i]-a[i] for i in range(3)]
            nn=[ux[1]*vx[2]-ux[2]*vx[1],ux[2]*vx[0]-ux[0]*vx[2],ux[0]*vx[1]-ux[1]*vx[0]]
            seq=[0,1,2] if sum(nn[i]*out[i] for i in range(3))>=0 else [0,2,1];base=len(P)//3
            for p in pts:P.extend([round(q,4) for q in p]);U.extend([round(t,2) for t in uvF(k,p)])
            I.extend(base+i for i in seq);parts[-1][2]+=3
        def box(x0,x1,ya,yb,z0,z1,kf,kb,kr,kl,top=None):
            quad([(x0,ya,z1),(x1,ya,z1),(x1,yb,z1),(x0,yb,z1)],kf,(0,0,1));quad([(x0,ya,z0),(x1,ya,z0),(x1,yb,z0),(x0,yb,z0)],kb,(0,0,-1))
            quad([(x1,ya,z0),(x1,ya,z1),(x1,yb,z1),(x1,yb,z0)],kr,(1,0,0));quad([(x0,ya,z0),(x0,ya,z1),(x0,yb,z1),(x0,yb,z0)],kl,(-1,0,0))
        part('walls_lower');box(-hx,hx,0,y1,-hz,hz,'F','B','R','L')
        if two:
            part('walls_upper');box(-hx,hx,y1,yP,-uz,uz,'F','B','R','L')
            part('jetty_under')
            for sg,k in((1,'F'),(-1,'B')):quad([(-hx,y1,sg*hz),(hx,y1,sg*hz),(hx,y1,sg*uz),(-hx,y1,sg*uz)],k,(0,-1,0))
        part('gables')
        for sg,k in((1,'R'),(-1,'L')):tri([(sg*hx,yP,-uz),(sg*hx,yP,uz),(sg*hx,yR-.2,0)],k,(sg,0,0))
        part('roof_front');quad([(-xo,yE,zE),(xo,yE,zE),(xo,yR,0),(-xo,yR,0)],'RF',(0,1,1))
        part('roof_back');quad([(xo,yE,-zE),(-xo,yE,-zE),(-xo,yR,0),(xo,yR,0)],'RB',(0,1,-1))
        for dmr in dm.get('dorm',[]):
            part('dormer')
            dx,wd,zd,yb,yt,ydr,ze,zh=dmr['dx'],dmr['wd'],dmr['zd'],dmr['yb'],dmr['yt'],dmr['ydr'],dmr['ze'],dmr['zh']
            quad([(dx-wd/2,yb,zd),(dx+wd/2,yb,zd),(dx+wd/2,yt,zd),(dx-wd/2,yt,zd)],'F',(0,0,1))
            tri([(dx-wd/2,yt,zd),(dx+wd/2,yt,zd),(dx,ydr-.1,zd)],'F',(0,0,1))
            for sg,k in((1,'R'),(-1,'L')):tri([(dx+sg*wd/2,yb,zd),(dx+sg*wd/2,yt,zd),(dx+sg*wd/2,yt,ze)],k,(sg,0,0))
            xw=wd/2+.2
            rx,ry,riw,rih=R[(n,'RF')]
            def ruv(fu,fv):return (rx+fu*riw,ry+fv*rih)
            for sg in(-1,1):
                pts=[(dx,ydr,zd+.2),(dx,ydr,zh),(dx+sg*xw,yt,ze),(dx+sg*xw,yt,zd+.2)]
                base=len(P)//3
                for p,(fu,fv) in zip(pts,[(.3,.30),(.3,.55),(.5,.55),(.5,.30)]):P.extend([round(q,4) for q in p]);U.extend([round(t,2) for t in ruv(fu,fv)])
                a_,b_,c_=pts[0],pts[1],pts[2];ux=[b_[i]-a_[i] for i in range(3)];vx=[c_[i]-a_[i] for i in range(3)]
                nn=[ux[1]*vx[2]-ux[2]*vx[1],ux[2]*vx[0]-ux[0]*vx[2],ux[0]*vx[1]-ux[1]*vx[0]];seq=[0,1,2,0,2,3] if sum(nn[i]*o for i,o in enumerate((sg,1,.3)))>=0 else [0,2,1,0,3,2]
                I.extend(base+i for i in seq);parts[-1][2]+=len(seq)
        cx,cz,cy=dm['cx'],dm['cz'],dm['cy']
        if not dm.get('nochim'):part('chimney')
        # 煙突は専用に撮った絵(CF=正面,CR=側面)を貼る。頂部は笠を含めて全高を撮影
        def cuv(k,p):
            x,y,iw,ih=R[(n,k)];v=V[k];X,Y,Z=p
            fu=(X-cx+v['w']/2)/v['w'] if k=='CF' else (v['w']/2-(Z-cz))/v['w']
            fv=1-(Y-(cy+.55-v['h']/2))/v['h'];return (x+fu*iw,y+fv*ih)
        def cq(pts,k,out):
            a,b,c=pts[0],pts[1],pts[2];ux=[b[i]-a[i] for i in range(3)];vx=[c[i]-a[i] for i in range(3)]
            nn=[ux[1]*vx[2]-ux[2]*vx[1],ux[2]*vx[0]-ux[0]*vx[2],ux[0]*vx[1]-ux[1]*vx[0]]
            seq=[0,1,2,0,2,3] if sum(nn[i]*out[i] for i in range(3))>=0 else [0,2,1,0,3,2];base=len(P)//3
            for p in pts:P.extend([round(q,4) for q in p]);U.extend([round(t,2) for t in cuv(k,p)])
            I.extend(base+i for i in seq);parts[-1][2]+=len(seq)
        if not dm.get('nochim'):
            cw=.5;ya=cy-.8;yb=cy+1.9
            cq([(cx-cw,ya,cz+cw),(cx+cw,ya,cz+cw),(cx+cw,yb,cz+cw),(cx-cw,yb,cz+cw)],'CF',(0,0,1));cq([(cx-cw,ya,cz-cw),(cx+cw,ya,cz-cw),(cx+cw,yb,cz-cw),(cx-cw,yb,cz-cw)],'CF',(0,0,-1))
            cq([(cx+cw,ya,cz-cw),(cx+cw,ya,cz+cw),(cx+cw,yb,cz+cw),(cx+cw,yb,cz-cw)],'CR',(1,0,0));cq([(cx-cw,ya,cz-cw),(cx-cw,ya,cz+cw),(cx-cw,yb,cz+cw),(cx-cw,yb,cz-cw)],'CR',(-1,0,0))
        xs=P[0::3];ys=P[1::3];zs=P[2::3]
        j=dict(name=n.replace('med','lo').replace('east','eastlo'),unit='m',atlas=f'atlas_{gi}.jpg',atlasSize=2048,bbox=dict(w=round(max(xs)-min(xs),3),d=round(max(zs)-min(zs),3),h=round(max(ys)-min(ys),3)),positions=P,uvs=U,indices=I,parts=[dict(name=a,start=b,count=c) for a,b,c in parts if c])
        json.dump(j,open(os.path.join(LO,j['name']+'.json'),'w'))
        print(j['name'],'tri',len(I)//3,'maxidx',max(I),'<',len(P)//3,'uv',min(U),max(U))

if sys.argv[1]=='pack':
    J=json.load(open(TMP+'/jobs.json'))
    for gi,g in enumerate(GROUPS):do_pack(gi,g,J['px'][str(gi)])
