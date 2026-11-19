# 元の世界(Azgaar・PWG・簡易生成)の地形データを、記事再現の世界の「分布」に近づけて強調する。
#  1) 高さ: 陸の高さの順位はそのまま、値の分布を基準の世界(記事再現)に合わせる(低地が多く高い山は少数・山は連なる)
#  2) 植生: 高さ・海からの距離・緯度から、記事再現と同じ考え方(縦の気温傾き+標高で冷える+水からの距離の湿度)で作り直す
#  3) 国は元のまま。首都は make_extra と同じ方法で追加
# 使い方: python3 -I restyle_world.py <元の世界dir> <出力dir> <基準の世界dir ...>
import sys, os, json, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
src, out = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/'); refs = sys.argv[3:]
os.makedirs(out, exist_ok=True)
wd = np.array(Image.open(src + '/world-data.png')); H0, W0 = wd.shape[:2]
R = wd[..., 0].astype(np.float32); st = wd[..., 2]
land = (wd[..., 1] > 0) & (R >= 20)
# --- 1) 高さの分布合わせ
rv = []
for r in refs:
    a = np.array(Image.open(r.rstrip('/') + '/world-data.png')); m = (a[..., 1] > 0) & (a[..., 0] >= 20); rv.append(a[..., 0][m].astype(np.float32))
rv = np.sort(np.concatenate(rv)); 
vals = R[land]; rank = np.argsort(np.argsort(vals)) / max(len(vals) - 1, 1)
newv = np.interp(rank, np.linspace(0, 1, len(rv)), rv)
R2 = R.copy(); R2[land] = np.maximum(newv, 21)
# 元の高さの細かい凹凸を残す(順位が同じ点は連続につながる)ので、軽くなじませる
R2 = np.where(land, ndi.gaussian_filter(R2, 1.0), R2)
# --- 2) 植生の作り直し
rs = np.random.RandomState(5)
def smooth_noise(scale):
    g = rs.rand(int(H0 / scale) + 3, int(W0 / scale) + 3).astype(np.float32)
    a = cv2.resize(g, (W0, H0), interpolation=cv2.INTER_CUBIC); return (a - a.min()) / (a.max() - a.min() + 1e-9)
yy = np.arange(H0)[:, None] / H0 * np.ones((1, W0))
wy = np.clip(yy + 0.12 * (smooth_noise(150) - 0.5), 0, 1)
hn = np.clip((R2 / 2.55 - 20) / 80, 0, 1)
temp = 0.30 + 0.80 * wy - 0.35 * hn
# 川(高さから流れの多い所)と海からの距離で湿度
water = ~land
Hs = ndi.gaussian_filter(R2, 2.0)
order = np.argsort(-Hs.ravel()); acc = np.ones(H0 * W0, np.float32); Hf = Hs.ravel().copy(); Hf[(~land).ravel()] = -1
yq, xq = np.divmod(np.arange(H0 * W0), W0); best = np.full(H0 * W0, -1, np.int64); bd = np.zeros(H0 * W0, np.float32)
for dy, dx in [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]:
    ni = np.clip(yq + dy, 0, H0 - 1) * W0 + np.clip(xq + dx, 0, W0 - 1); dz = (Hf - Hf[ni]) / np.hypot(dy, dx); m = dz > bd; bd = np.where(m, dz, bd); best = np.where(m, ni, best)
for i in order:
    if Hf[i] < 0: break
    j = best[i]
    if j >= 0: acc[j] += acc[i]
acc = acc.reshape(H0, W0); river = (acc > 420) & land
dist = ndi.distance_transform_edt(~(water | river))
hum = np.exp(-dist / 120.0)
rain = 0.45 * smooth_noise(70) + 0.55 * hum; rain = (rain - rain[land].min()) / (rain[land].max() - rain[land].min())
t, r = temp, rain
b = np.where(t < 0.14, 11, np.where(t < 0.28, np.where(r < 0.25, 2, 10),
    np.where(t < 0.45, np.where(r < 0.22, 2, 9),
    np.where(t < 0.68, np.where(r < 0.16, 2, np.where(r < 0.42, 4, np.where(r < 0.72, 6, 8))),
             np.where(r < 0.2, 1, np.where(r < 0.42, 3, np.where(r < 0.66, 5, 7)))))))
wet = river & (hn < 0.05) & (r > 0.5); b = np.where(wet, 12, b)
bio = np.where(land, b, 0).astype(np.uint8)
dat = np.dstack([np.clip(R2, 0, 255), bio, st]).astype(np.uint8)
Image.fromarray(dat).save(out + '/world-data.png')
if os.path.exists(src + '/world-map.jpg'): Image.open(src + '/world-map.jpg').save(out + '/world-map.jpg')
# --- 3) 首都
H = R2 / 2.55; cs = []
for s in np.unique(st[land]):
    if s == 0: continue
    m = (st == s) & land
    if m.sum() < 1500: continue
    dt = ndi.distance_transform_edt(m); sc = dt * (1.2 - np.clip(H, 20, 100) / 100.0); sc[~m] = -1
    y, x = np.unravel_index(sc.argmax(), sc.shape); cs.append(dict(x=int(x), y=int(y), state=int(s), flux=float(dt[y, x])))
json.dump(dict(cities=cs), open(out + '/world-extra.json', 'w'), ensure_ascii=False)
print(out, 'land %.1f%%' % (land.mean() * 100), 'capitals', len(cs), 'biomes', {int(k): round(float(v) / land.sum(), 3) for k, v in zip(*np.unique(bio[land], return_counts=True))})
