import numpy as np, cv2, json
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
SP='/tmp/claude-0/-home-claude/1cd05bc6-9ed2-5956-b484-3fece23bc169/scratchpad/'
A='/mnt/user-data/attachments/1cd05bc6-9ed2-5956-b484-3fece23bc169/'
pairs={5:'7f6f1459',6:'fe578357',7:'328b6a57'}
ecc=json.load(open('ecc.json'))
names={0:'海',1:'砂漠(熱)',2:'砂漠(寒)',3:'サバンナ',4:'草原',5:'季節林(熱帯)',6:'落葉広葉樹林',7:'熱帯雨林',8:'温帯雨林',9:'タイガ',10:'ツンドラ',11:'氷河',12:'湿地'}
tab={}; crops=[]
for my,gid in pairs.items():
    G=cv2.cvtColor(np.array(Image.open(A+gid+'-image.jpg').convert('RGB')),cv2.COLOR_RGB2BGR)
    gh,gw=G.shape[:2]
    W=np.array(ecc[str(my)]['W'],np.float32); sc=0.5
    # W maps Gemini(half-res) coords -> program canvas(half-res). Build Gemini(full)->canvas(1500x1000)
    # canvas_half = W @ [xg_half,yg_half,1] ; xg_half = xg*sc ; canvas_full = canvas_half/sc
    # want image in my world coords (1400x900): world = canvas_full - 50.   Warp Gemini into that frame:
    # for dest pixel (X,Y) in world: canvas_full=(X+50,Y+50); canvas_half=sc*that; need Gemini_half s.t. W@[gx,gy,1]=canvas_half
    M3=np.vstack([W,[0,0,1]]); Minv=np.linalg.inv(M3)
    # gemini_half = Minv @ canvas_half ; gemini_full = gemini_half/sc
    T=np.array([[1,0,50],[0,1,50],[0,0,1]],np.float32); S1=np.diag([sc,sc,1]).astype(np.float32); S2=np.diag([1/sc,1/sc,1]).astype(np.float32)
    # world->gemini_full: S2 @ Minv @ S1 @ T
    Wf=(S2@Minv@S1@T)[:2]
    Gal=cv2.warpAffine(G,Wf,(1400,900),flags=cv2.INTER_AREA+cv2.WARP_INVERSE_MAP if False else cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
    # warpAffine maps src->dst using M; we have dst->src, so use WARP_INVERSE_MAP
    Gal=cv2.warpAffine(G,Wf,(1400,900),flags=cv2.INTER_LINEAR+cv2.WARP_INVERSE_MAP,borderMode=cv2.BORDER_REPLICATE)
    mine=cv2.cvtColor(cv2.imread(SP+f'worlds/poutp{my:02d}/s12a.jpg'),cv2.COLOR_BGR2RGB)
    Gal=cv2.cvtColor(Gal,cv2.COLOR_BGR2RGB)
    cv2.imwrite(f'aligned{my}.jpg',cv2.cvtColor(Gal,cv2.COLOR_RGB2BGR))
    wd=np.array(Image.open(SP+f'worlds/pp{my:02d}/world-data.png'))
    Hh=wd[...,0].astype(np.float32); bio=wd[...,1]
    land=(bio>0)&(Hh>=20)
    inner=ndi.binary_erosion(land,iterations=10)
    Hs=ndi.gaussian_filter(Hh,1.0); LO=56.0; HI=float(np.percentile(Hs[land],99.7)); hn=np.clip((Hs-LO)/(HI-LO),0,1)*land
    mtn=ndi.gaussian_filter(hn,2.5)>0.30
    gG=cv2.cvtColor(Gal,cv2.COLOR_RGB2GRAY).astype(np.float32); gM=cv2.cvtColor(mine,cv2.COLOR_RGB2GRAY).astype(np.float32)
    hfG=np.abs(gG-cv2.GaussianBlur(gG,(0,0),2)); hfM=np.abs(gM-cv2.GaussianBlur(gM,(0,0),2))
    for b in range(1,13):
        m=inner&(bio==b)&~mtn
        if m.sum()<2500: continue
        tab.setdefault(b,[]).append(dict(w=my,n=int(m.sum()),gem=Gal[m].mean(0).round(0).tolist(),mine=mine[m].mean(0).round(0).tolist(),gstd=float(Gal[m].std(0).mean()),mstd=float(mine[m].std(0).mean()),ghf=float(hfG[m].mean()),mhf=float(hfM[m].mean())))
    m=inner&mtn
    tab.setdefault('山岳',[]).append(dict(w=my,n=int(m.sum()),gem=Gal[m].mean(0).round(0).tolist(),mine=mine[m].mean(0).round(0).tolist(),gstd=float(Gal[m].std(0).mean()),mstd=float(mine[m].std(0).mean()),ghf=float(hfG[m].mean()),mhf=float(hfM[m].mean())))
    # crops: biggest mountain comp, biggest biome comp (desert/forest/grass...)
    def bigcomp(mask):
        l,n=ndi.label(mask); 
        if n==0: return None
        s=ndi.sum(mask,l,range(1,n+1)); i=1+int(np.argmax(s)); ys,xs=np.where(l==i); return xs.min(),xs.max(),ys.min(),ys.max()
    cats=[('山岳',mtn&land)]
    for b in (1,2,6,4,9,10,11):
        mm=ndi.binary_opening((bio==b)&inner&~mtn,iterations=4)
        if mm.sum()>15000: cats.append((names[b],mm))
    for nm,mm in cats[:3]:
        bb=bigcomp(mm)
        if bb is None: continue
        x0,x1,y0,y1=bb; cx,cy=(x0+x1)//2,(y0+y1)//2; w=min(max(x1-x0,160),300); h=min(max(y1-y0,120),240)
        X0=int(np.clip(cx-w//2,0,1400-w)); Y0=int(np.clip(cy-h//2,0,900-h))
        a=mine[Y0:Y0+h,X0:X0+w]; g=Gal[Y0:Y0+h,X0:X0+w]
        pair=np.concatenate([a,g],1); pair=cv2.resize(pair,None,fx=2,fy=2,interpolation=cv2.INTER_CUBIC)
        crops.append((my,nm,pair))
json.dump(tab,open('deform.json','w'),ensure_ascii=False)
# crop sheet
rows=[]
for my,nm,p in crops:
    im=Image.fromarray(p); d=ImageDraw.Draw(im); d.rectangle([0,0,260,22],fill=(0,0,0)); d.text((4,4),f'world{my} {nm} (left=mine / right=Gemini)',fill=(255,255,255))
    rows.append(im)
print(len(rows))
for i,r in enumerate(rows): r.save(f'crop{i}.jpg',quality=90)
for b,v in tab.items():
    print(b if isinstance(b,str) else names[b], [(x['w'],x['gem'],x['mine'],round(x['ghf'],1),round(x['mhf'],1)) for x in v])
