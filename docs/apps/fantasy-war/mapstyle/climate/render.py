# 気候シミュレーター簡易版の結果を画像にする(確認用)。使い方: python3 -I render.py <出力ディレクトリ(_P.npy等がある所)> <world-data.png>
import sys, numpy as np
import matplotlib; matplotlib.use('Agg'); matplotlib.rcParams['font.family']='Noto Sans CJK TC'
import matplotlib.pyplot as plt
from PIL import Image
d = sys.argv[1]
P = np.load(d + '/_P.npy'); T = np.load(d + '/_T.npy'); U = np.load(d + '/_U.npy'); V = np.load(d + '/_V.npy')
a = np.array(Image.open(sys.argv[2])).astype(np.float32)
land = ((a[..., 1] > 0) & (a[..., 0] >= 20))
h2, w2 = a.shape[0] // 2, a.shape[1] // 2
land = land[:h2 * 2, :w2 * 2].reshape(h2, 2, w2, 2).mean(axis=(1, 3)) > 0.5
Pa = P.sum(0)
fig, ax = plt.subplots(2, 2, figsize=(14, 7.6), dpi=110)
def show(axx, data, title, cmap, vmin, vmax, label):
    im = axx.imshow(data, cmap=cmap, vmin=vmin, vmax=vmax); axx.contour(land, [0.5], colors='k', linewidths=0.4); axx.set_title(title, fontsize=10); axx.axis('off')
    plt.colorbar(im, ax=axx, fraction=0.03, pad=0.01, label=label)
show(ax[0, 0], Pa, '年降水(mm・仮の倍率)', 'YlGnBu', 0, 3000, 'mm/年')
show(ax[0, 1], T.mean(0), '年平均気温', 'RdYlBu_r', -25, 30, '度')
show(ax[1, 0], P[0], '1月の降水(mm/月)', 'YlGnBu', 0, 400, 'mm/月')
show(ax[1, 1], P[6], '7月の降水(mm/月)', 'YlGnBu', 0, 400, 'mm/月')
plt.tight_layout(); plt.savefig(d + '/overview.png')
# 緯度ごとの帯平均(陸・海)
lat = 90 - 180 * (np.arange(Pa.shape[0]) + 0.5) / Pa.shape[0]
print('緯度帯 降水(mm/年) 陸 / 海, 気温(陸)')
for l0 in range(-90, 90, 15):
    m = (lat >= l0) & (lat < l0 + 15)
    pl = Pa[m][land[m]]; po = Pa[m][~land[m]]; tl = T.mean(0)[m][land[m]]
    print(f'{l0:4d}〜{l0+15:4d}: 陸{pl.mean() if pl.size else float("nan"):7.0f} 海{po.mean() if po.size else float("nan"):7.0f} 陸気温{tl.mean() if tl.size else float("nan"):6.1f}')
