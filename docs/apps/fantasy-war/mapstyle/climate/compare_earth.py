# 気候シミュレーター簡易版の結果を、地球の公開値と比べる(照合用)。使い方: python3 -I compare_earth.py <_P.npy等のあるディレクトリ> <world-data.png> <出力json>
import sys, json, numpy as np
from PIL import Image
d = sys.argv[1]
P = np.load(d + '/_P.npy'); T = np.load(d + '/_T.npy')          # 12×h×w。P=mm/月(仮の倍率済みでなく単位を後で合わせる)
a = np.array(Image.open(sys.argv[2])).astype(np.float32)
land = a[..., 0] >= 51
h2, w2 = a.shape[0] // 2, a.shape[1] // 2
land = land[:h2 * 2, :w2 * 2].reshape(h2, 2, w2, 2).mean(axis=(1, 3)) > 0.5
info = json.load(open('climate_base_info.json')); sc = info['scale_mm_per_unit']
P = P * (sc if P.max() < 5 else 1.0)                              # _P.npy は倍率前なら倍率をかける
lat = 90 - 180 * (np.arange(h2) + .5) / h2
area = np.cos(np.deg2rad(lat))[:, None] * np.ones((1, w2))
Pa = P.sum(0); Ta = T.mean(0)
out = {}
def wmean(x, m): return float((x * area)[m].sum() / area[m].sum()) if m.any() else float('nan')
out['global_P'] = wmean(Pa, np.ones_like(land)); out['land_P'] = wmean(Pa, land); out['ocean_P'] = wmean(Pa, ~land)
# 帯状平均(全球・5度帯)
bands = list(range(-90, 90, 5)); zonal = []
for b in bands:
    m = (lat >= b) & (lat < b + 5); mm = np.broadcast_to(m[:, None], land.shape)
    zonal.append((b + 2.5, wmean(Pa, mm), wmean(Pa, mm & land), wmean(Pa, mm & ~land), wmean(Ta, mm & land), wmean(Ta, mm & ~land)))
Z = np.array(zonal); out['zonal'] = Z.tolist()
g = Z[:, 1]
i = int(np.nanargmax(g)); out['itcz_peak_mm'] = float(g[i]); out['itcz_peak_lat'] = float(Z[i, 0])
for name, lo, hi in (('subN', 10, 40), ('subS', -40, -10)):
    mk = (Z[:, 0] >= lo) & (Z[:, 0] <= hi); j = np.nanargmin(np.where(mk, g, np.inf)); out[name + '_min_mm'] = float(g[j]); out[name + '_min_lat'] = float(Z[j, 0])
for name, lo, hi in (('midN', 35, 65), ('midS', -65, -35)):
    mk = (Z[:, 0] >= lo) & (Z[:, 0] <= hi); j = np.nanargmax(np.where(mk, g, -np.inf)); out[name + '_max_mm'] = float(g[j]); out[name + '_max_lat'] = float(Z[j, 0])
out['polar_mm'] = float(np.nanmean(g[(np.abs(Z[:, 0]) > 70)]))
# 季節の振れ(最暖月−最寒月)。陸と海、緯度帯ごと
rng = T.max(0) - T.min(0)
out['range'] = {}
for lo, hi in ((0, 15), (15, 30), (30, 45), (45, 60), (60, 75)):
    m = ((np.abs(lat) >= lo) & (np.abs(lat) < hi))[:, None] * np.ones((1, w2), bool)
    out['range'][f'{lo}-{hi}'] = {'陸': wmean(rng, m & land), '海': wmean(rng, m & ~land)}
# ケッペン(主要5群)で陸を分ける。【簡略】Beck 2018 の基準(寒い月0度が温帯/冷帯の境、乾燥は年降水<10×Pth)
Tmin = T.min(0); Tmax = T.max(0); Tann = T.mean(0); Pann = Pa
north = (lat > 0)[:, None] * np.ones((1, w2), bool)
sm = np.array([4, 5, 6, 7, 8, 9]) - 1; wm = np.array([10, 11, 12, 1, 2, 3]) - 1
Psum = np.where(north, P[sm].sum(0), P[wm].sum(0)); Pwin = Pann - Psum
Pth = 2 * Tann + np.where(Psum >= 0.7 * Pann, 28, np.where(Pwin >= 0.7 * Pann, 0, 14))
B = Pann < 10 * Pth
E = Tmax < 10
A = (Tmin >= 18) & ~E
D = (Tmax >= 10) & (Tmin <= 0)
C = (Tmax >= 10) & (Tmin > 0) & (Tmin < 18)
grp = np.full(land.shape, '-')
grp[C] = 'C'; grp[D] = 'D'; grp[A] = 'A'; grp[B] = 'B'; grp[E] = 'E'    # 乾燥(B)を先に、極(E)は最優先で上書き
frac = {}
for k in 'ABCDE': frac[k] = wmean((grp == k).astype(float), land)
out['koppen_land'] = frac
frac2 = {}
mk = land & (np.abs(lat)[:, None] < 60)
for k in 'ABCDE': frac2[k] = wmean((grp == k).astype(float), mk)
out['koppen_land_lt60'] = frac2
json.dump(out, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
print({k: (round(v, 1) if isinstance(v, float) else v) for k, v in out.items() if k not in ('zonal',)})
for r in out['zonal'][::2]: print('帯中心%5.1f 全%6.0f 陸%6.0f 海%6.0f 陸気温%6.1f 海気温%6.1f' % tuple(r))

# 帯状平均の図(こちらの結果と、地球の公開値の目印)。地球の目印: GPCPの帯状平均のピーク約5.5mm/日=約2000mm/年(北緯約6度・Adler 2003)/亜熱帯の極小はおおむね緯度20度付近(Springer 2017 の記述)
import matplotlib; matplotlib.use('Agg'); matplotlib.rcParams['font.family'] = 'Noto Sans CJK TC'
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(8, 4.2), dpi=110)
ax.plot(Z[:, 0], Z[:, 1], 'k-', lw=2, label='こちら 全体')
ax.plot(Z[:, 0], Z[:, 2], 'g--', lw=1.4, label='こちら 陸')
ax.plot(Z[:, 0], Z[:, 3], 'b--', lw=1.4, label='こちら 海')
ax.plot([6], [5.5 * 365], 'r*', ms=14, label='地球 ピーク(GPCP 約2000mm・北緯約6度)')
ax.axvspan(-22, -18, color='r', alpha=0.12); ax.axvspan(18, 22, color='r', alpha=0.12, label='地球 亜熱帯の極小(緯度20度付近)')
ax.set_xlabel('緯度'); ax.set_ylabel('年降水(mm)'); ax.set_xlim(-90, 90); ax.grid(alpha=0.3); ax.legend(fontsize=8)
plt.tight_layout(); plt.savefig(sys.argv[3].replace('.json', '.png'))
