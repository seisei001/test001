# 湿度は風が海から運ぶ。内陸へ進むほど低下する。風の向きを海までさかのぼり、湿度を「風上の海から進んだ距離・登った高さ」で書けるかを地球で確かめる。
# ユーザー指示 11-29 02:56。時間を進める計算(差分)はしない。各地点で風上へ海までたどる(1回の積分)だけ。
# 使い方: python3 -I humid_trace.py <earth05.npz> <rhum.nc>
import sys, numpy as np, xarray as xr
from scipy import ndimage as ndi
d = np.load(sys.argv[1]); z = d['z']
lat = 90 - 0.5 * (np.arange(360) + 0.5); LAT = lat[:, None] * np.ones((1, 720)); land = z > 0
def regrid(f, name):
    v = xr.open_dataset(f, decode_times=False)[name].values.astype(np.float32)
    ly = np.interp(lat, np.linspace(90, -90, 73)[::-1], np.arange(73)[::-1]); lx = (((np.arange(720) * 0.5 + 0.25) + 180.0) % 360.0) / 2.5     # earth05は経度-180〜180、NCEPは0〜360
    yy, xx = np.meshgrid(ly, lx, indexing='ij'); return np.stack([ndi.map_coordinates(v[m], [yy, xx], order=1, mode='grid-wrap') for m in range(12)])
RH = regrid(sys.argv[2], 'rhum').mean(0)
wind = np.where(np.abs(lat) < 28, -1, np.where(np.abs(lat) < 62, 1, -1))     # 東向き=+1(貿易風は西向き・偏西風は東向き・極は西向き)
H, W = 360, 720; fetch = np.zeros((H, W)); uplift = np.zeros((H, W)); cell_km = 55.6 * np.cos(np.deg2rad(lat))
up_cols = {}
for y in range(H):
    s = wind[y]
    # 風上へたどる: 各列で、風上の隣を順に見て海に出るまでの歩数と、登った高さの合計
    zrow = z[y]; lrow = land[y]
    for x in range(W):
        if not lrow[x]: continue
        n = 0; up = 0.0; px = x
        while n < 240:
            qx = (px - s) % W                                                  # 風上の隣
            if not lrow[qx]: break
            up += max(zrow[px] - zrow[qx], 0.0)                                # 風上→風下へ登った分
            px = qx; n += 1
        fetch[y, x] = n * cell_km[y]; uplift[y, x] = up
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
dist = ndi.distance_transform_edt(land, sampling=(55.6, 55.6 * np.cos(np.deg2rad(40))))
m = land & (np.abs(LAT) < 70); y = RH[m] / 100.0
def r2(cols):
    X = np.stack([c[m] for c in cols], 1); co = np.linalg.lstsq(X, y, rcond=None)[0]; r = y - X @ co; return 1 - (r ** 2).sum() / ((y - y.mean()) ** 2).sum(), co
one = np.ones((H, W)); eq = G(LAT, 0, 10); mid = G(np.abs(LAT), 47, 12)
LATB = [((LAT >= a) & (LAT < a + 10)).astype(np.float64) for a in range(-60, 70, 10)]   # 緯度10度帯のダミー(緯度の影響を柔軟に引く)
print('陸の年平均の湿度(NCEP地表)を説明する率(R2)。基準=緯度10度帯ごとの平均(緯度の影響を十分に引いた後)')
base = LATB
for nm, cols in (('緯度帯だけ', base),
                 ('+ 最寄りの海までの距離(指数500km)', base + [np.exp(-dist / 500.0)]),
                 ('+ 風上の海から進んだ距離(指数500km)', base + [np.exp(-fetch / 500.0)]),
                 ('+ 風上の距離(500km)+風上で登った高さ', base + [np.exp(-fetch / 500.0), uplift / 1000.0]),
                 ('+ 風上の距離3つ(200/500/1500km)+登った高さ', base + [np.exp(-fetch / 200.0), np.exp(-fetch / 500.0), np.exp(-fetch / 1500.0), uplift / 1000.0]),
                 ('+ 最寄りの距離3つ(200/500/1500km)', base + [np.exp(-dist / 200.0), np.exp(-dist / 500.0), np.exp(-dist / 1500.0)]),
                 ('+ 最寄り3つ+風上3つ+登った高さ', base + [np.exp(-dist / 200.0), np.exp(-dist / 500.0), np.exp(-dist / 1500.0), np.exp(-fetch / 200.0), np.exp(-fetch / 500.0), np.exp(-fetch / 1500.0), uplift / 1000.0])):
    r, co = r2(cols); print(f'  {nm}: {r:.3f}')
