# 世界データ(world-data.png)に国のデータがあるとき、各国の首都の位置を決めて world-extra.json を作る。
# (記事再現の世界は mk_article.py が自分で作る。これは元のAzgaar・PWG・簡易生成の世界に同じ絵の要素を足すための道具)
# 首都 = 国の内側のうち、海岸や国境から遠く、低めの所。使い方: python3 -I make_extra.py <世界dir>
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
d = sys.argv[1].rstrip('/')
wd = np.array(Image.open(d + '/world-data.png')); H = wd[..., 0].astype(float) / 2.55; st = wd[..., 2].astype(int)
land = (wd[..., 1] > 0) & (wd[..., 0] >= 20)
out = []
for s in np.unique(st[land]):
    if s == 0: continue
    m = (st == s) & land
    if m.sum() < 1500: continue
    dt = ndi.distance_transform_edt(m)
    score = dt * (1.2 - np.clip(H, 20, 100) / 100.0); score[~m] = -1
    y, x = np.unravel_index(score.argmax(), score.shape)
    out.append(dict(x=int(x), y=int(y), state=int(s), flux=float(dt[y, x])))
json.dump(dict(cities=out), open(d + '/world-extra.json', 'w'), ensure_ascii=False)
print(d, len(out), 'capitals')
