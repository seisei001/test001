import numpy as np, cv2, json
from PIL import Image
from scipy import ndimage as ndi
SP='/tmp/claude-0/-home-claude/1cd05bc6-9ed2-5956-b484-3fece23bc169/scratchpad/'
A='/mnt/user-data/attachments/1cd05bc6-9ed2-5956-b484-3fece23bc169/'
pairs={5:'7f6f1459',6:'fe578357',7:'328b6a57'}
res={}
for my,gid in pairs.items():
    G=cv2.cvtColor(np.array(Image.open(A+gid+'-image.jpg').convert('RGB')),cv2.COLOR_RGB2BGR)
    gh,gw=G.shape[:2]
    S=cv2.imread(f'gs{my:02d}.jpg')                                   # 1500x1000 program version
    wd=np.array(Image.open(SP+f'worlds/pp{my:02d}/world-data.png'))
    land=((wd[...,1]>0)&(wd[...,0]>=20)).astype(np.uint8)
    # land-likeness images: coast structure. Use blurred gray of program image vs Gemini; also try edge maps
    def prep(im): 
        g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY) if im.ndim==3 else im
        g=cv2.GaussianBlur(g.astype(np.float32),(0,0),3); return g
    sc=0.5
    Sg=prep(cv2.resize(S,(int(1500*sc),int(1000*sc)))); Gg=prep(cv2.resize(G,(int(gw*sc),int(gh*sc))))
    # initial: scale Sg to Gemini size
    sx=Gg.shape[1]/Sg.shape[1]; sy=Gg.shape[0]/Sg.shape[0]
    W=np.array([[1/sx,0,0],[0,1/sy,0]],np.float32)   # maps Gemini coords -> S coords
    best=None
    for mode in (cv2.MOTION_AFFINE,):
        try:
            cc,W2=cv2.findTransformECC(Gg,Sg,W.copy(),mode,(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT,200,1e-6),None,9)
            best=(cc,W2)
        except Exception as e: print('ecc fail',my,e)
    if best is None: continue
    cc,W2=best
    # overlay: warp my land mask (placed in 1500x1000 canvas) into Gemini frame
    canvas=np.zeros((1000,1500),np.uint8); canvas[50:950,50:1450]=land
    M=W2.copy(); 
    warped=cv2.warpAffine(cv2.resize(canvas,(Sg.shape[1],Sg.shape[0]),interpolation=cv2.INTER_NEAREST),M,(Gg.shape[1],Gg.shape[0]),flags=cv2.INTER_NEAREST+cv2.WARP_INVERSE_MAP)
    Gs=cv2.resize(G,(Gg.shape[1],Gg.shape[0]))
    e=cv2.morphologyEx(warped,cv2.MORPH_GRADIENT,np.ones((3,3),np.uint8))>0
    ov=Gs.copy(); ov[e]=(0,0,255)
    cv2.imwrite(f'ecc{my}.jpg',ov)
    res[my]=dict(cc=float(cc),W=W2.tolist(),sc=sc)
    print(my,'ECC corr',round(cc,3),W2.round(3).tolist())
json.dump(res,open('ecc.json','w'))
