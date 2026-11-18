import numpy as np, cv2, json
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from sklearn.cluster import KMeans
SP='/tmp/claude-0/-home-claude/1cd05bc6-9ed2-5956-b484-3fece23bc169/scratchpad/'
names={1:'砂漠(熱)',2:'砂漠(寒)',3:'サバンナ',4:'草原',5:'季節林',6:'落葉林',7:'熱帯雨林',8:'温帯雨林',9:'タイガ',10:'ツンドラ',11:'氷河',12:'湿地'}
CS=12; K=7
pal=np.array([[220,60,60],[60,160,60],[60,90,220],[230,200,50],[160,60,200],[60,200,200],[240,140,40],[130,130,130]],np.uint8)
out={}
sheet=[]
for my in (5,6,7):
    G=cv2.cvtColor(cv2.imread(f'aligned{my}.jpg'),cv2.COLOR_BGR2RGB)
    wd=np.array(Image.open(SP+f'worlds/pp{my:02d}/world-data.png')); Hh=wd[...,0].astype(np.float32); bio=wd[...,1]
    land=(bio>0)&(Hh>=20); inner=ndi.binary_erosion(land,iterations=8)
    Hs=ndi.gaussian_filter(Hh,1.0); HI=float(np.percentile(Hs[land],99.7)); hn=np.clip((Hs-56)/(HI-56),0,1)*land; mtn=ndi.gaussian_filter(hn,2.5)>0.30
    lab=cv2.cvtColor(G,cv2.COLOR_RGB2LAB).astype(np.float32); gr=cv2.cvtColor(G,cv2.COLOR_RGB2GRAY).astype(np.float32)
    hf=np.abs(gr-cv2.GaussianBlur(gr,(0,0),2))
    H,W=gr.shape; gh,gw=H//CS,W//CS
    cells=[];pos=[]
    for j in range(gh):
        for i in range(gw):
            sl=(slice(j*CS,(j+1)*CS),slice(i*CS,(i+1)*CS))
            if inner[sl].mean()<0.95: continue
            L=lab[sl].reshape(-1,3)
            cells.append([*L.mean(0),L[:,0].std(),hf[sl].mean(),(L[:,1]-128).mean()*0+0]); pos.append((j,i))
    X=np.array(cells)[:,:5]; Xn=(X-X.mean(0))/X.std(0)
    km=KMeans(K,n_init=5,random_state=0).fit(Xn); lb=km.labels_
    cmap=np.full((gh,gw),-1)
    for (j,i),l in zip(pos,lb): cmap[j,i]=l
    # cross-tab with my data
    ct=np.zeros((K,14)); 
    for (j,i),l in zip(pos,lb):
        sl=(slice(j*CS,(j+1)*CS),slice(i*CS,(i+1)*CS))
        b=np.bincount(bio[sl].ravel(),minlength=13).argmax(); ct[l,b]+=1
        if mtn[sl].mean()>0.5: ct[l,13]+=1
    # cluster descriptions (mean RGB, hf) 
    desc=[]
    for k in range(K):
        idx=[n for n,l in enumerate(lb) if l==k]
        rgb=np.mean([G[pos[n][0]*CS:(pos[n][0]+1)*CS,pos[n][1]*CS:(pos[n][1]+1)*CS].reshape(-1,3).mean(0) for n in idx],0)
        desc.append(dict(k=k,n=len(idx),rgb=rgb.round(0).tolist(),hf=float(X[idx,4].mean()),
          bio={names[b]:int(ct[k,b]) for b in range(1,13) if ct[k,b]>0.08*len(idx)},mtn=int(ct[k,13])))
    out[my]=desc
    # visualization: cluster map upscaled
    vis=np.zeros((H,W,3),np.uint8)+30
    for j in range(gh):
        for i in range(gw):
            if cmap[j,i]>=0: vis[j*CS:(j+1)*CS,i*CS:(i+1)*CS]=pal[cmap[j,i]]
    # my biome map
    bm=np.zeros((H,W,3),np.uint8)+30
    bpal={1:(230,200,120),2:(180,170,130),3:(200,170,60),4:(140,200,80),5:(90,150,60),6:(40,120,50),7:(10,90,30),8:(30,140,110),9:(60,100,90),10:(170,190,170),11:(250,250,250),12:(90,120,160)}
    for b,c in bpal.items(): bm[(bio==b)&inner]=c
    bm[mtn&inner]=(120,60,30)
    row=np.concatenate([G,vis,bm],1); row=cv2.resize(row,(row.shape[1]//2,row.shape[0]//2))
    sheet.append(row)
    print('world',my)
    for d in desc: print(' ',d)
json.dump(out,open('infer.json','w'),ensure_ascii=False)
cv2.imwrite('infer_sheet.jpg',cv2.cvtColor(np.concatenate(sheet,0),cv2.COLOR_RGB2BGR))
