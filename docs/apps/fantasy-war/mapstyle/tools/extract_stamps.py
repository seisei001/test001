# Geminiの木の見本シート(透明背景)から、広葉樹のシルエット(影絵)を1本ずつ切り出す。
# 使い方: python3 extract_stamps.py シート.png 出力フォルダ
import sys, os
import numpy as np, cv2
from PIL import Image
sheet, outd = sys.argv[1], sys.argv[2]
os.makedirs(outd, exist_ok=True)
a = np.array(Image.open(sheet))
m = (a[..., 3] > 128).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
n, lab, st, cen = cv2.connectedComponentsWithStats(m, connectivity=8)
# 広葉樹の塊(シート上の位置から選んだ): 面積と位置で指定
PICK = {  # id: 種類メモ
    3: '緑の広葉樹(3本)', 2: '緑の広葉樹(密な塊)', 26: '灰緑の広葉樹(4本)', 24: '紅葉(橙・赤)',
    31: '桜(ピンク)', 13: '緑の広葉樹(1本)', 21: '緑の広葉樹(1本・小)'}
k = 0
meta = []
for cid, name in PICK.items():
    x, y, w, h, ar = st[cid]
    comp = (lab[y:y + h, x:x + w] == cid).astype(np.uint8)
    # 幹などの細い部分を消す(開く)
    op = cv2.morphologyEx(comp, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    if op.sum() < 0.5 * comp.sum(): op = comp
    # 1本ずつに分ける(距離変換+流域分割)
    pad = cv2.copyMakeBorder(op, 6, 6, 6, 6, cv2.BORDER_CONSTANT, value=0)
    dist = cv2.distanceTransform(pad, cv2.DIST_L2, 5)
    r = dist.max()
    if w > 90 or h > 90:
        # 山(中心)を探す: 近くの山は同じ木とみなす
        dil = cv2.dilate(dist, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(r * 1.1) | 1, int(r * 1.1) | 1)))
        peaks = ((dist == dil) & (dist > 0.55 * r)).astype(np.uint8)
        nm, mk = cv2.connectedComponents(peaks)
        mk[pad == 0] = 0
        col = cv2.cvtColor(pad * 255, cv2.COLOR_GRAY2BGR)
        ws = cv2.watershed(col, mk.astype(np.int32))
        parts = [((ws == i) & (pad > 0)).astype(np.uint8) for i in range(1, nm)]
    else:
        parts = [pad]
    for p in parts:
        if p.sum() < 400: continue
        ys, xs = np.nonzero(p)
        crop = p[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        if crop.shape[0] < 18 or crop.shape[1] < 18: continue
        asp = crop.shape[1] / crop.shape[0]
        if asp < .75 or asp > 1.4 or max(crop.shape) > 85: continue
        cnt,_=cv2.findContours(crop.astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        c0=max(cnt,key=cv2.contourArea); sol=cv2.contourArea(c0)/max(1,cv2.contourArea(cv2.convexHull(c0)))
        if sol<0.93: continue
        # なめらかに
        crop = cv2.GaussianBlur(crop.astype(np.float32), (0, 0), 1.2)
        al = (np.clip((crop - .35) / .3, 0, 1) * 255).astype(np.uint8)
        rgba = np.zeros(al.shape + (4,), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = al
        Image.fromarray(rgba).save(os.path.join(outd, 'broad_%02d.png' % k))
        meta.append((k, name, crop.shape[1], crop.shape[0])); k += 1
for m_ in meta: print(m_)
print('total', k)
