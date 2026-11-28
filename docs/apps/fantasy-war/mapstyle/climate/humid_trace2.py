# 湿度を、季節ごとの実測の風(NCEP地表の月別平年)で風上の海まで2次元にたどって説明する。ユーザー指示 11-29 02:58「それを使おう」
# 各地点から、その月の風の向きの逆(風上)へ1マスずつ進み、海に出るまでの距離と、その間に登った高さを出す。時間は進めない(各地点の1回の積分)。
# 使い方: python3 -I humid_trace2.py <earth05.npz> <rhum.nc> <uwnd.nc> <vwnd.nc> [air.nc]   air.ncを付けると、運ばれる量=比湿(空気1kgの水蒸気g)で試す
import sys, numpy as np, xarray as xr
from scipy import ndimage as ndi
d = np.load(sys.argv[1]); z = d['z']
lat = 90 - 0.5 * (np.arange(360) + 0.5); LAT = lat[:, None] * np.ones((1, 720)); land = z > 0
H, W = 360, 720
def regrid(f, name):
    v = xr.open_dataset(f, decode_times=False)[name].values.astype(np.float32)
    ly = np.interp(lat, np.linspace(90, -90, 73)[::-1], np.arange(73)[::-1]); lx = (((np.arange(720) * 0.5 + 0.25) + 180.0) % 360.0) / 2.5
    yy, xx = np.meshgrid(ly, lx, indexing='ij'); return np.stack([ndi.map_coordinates(v[m], [yy, xx], order=1, mode='grid-wrap') for m in range(12)])
RH = regrid(sys.argv[2], 'rhum'); U = regrid(sys.argv[3], 'uwnd'); V = regrid(sys.argv[4], 'vwnd')
AIR = regrid(sys.argv[5], 'air') if len(sys.argv) > 5 else None
if AIR is not None:                                                  # 相対湿度→比湿(g/kg)。気温で変わる相対湿度でなく、運ばれる水蒸気の量そのもの
    es = 6.112 * np.exp(17.67 * AIR / (AIR + 243.5)); qs = 622.0 * es / (1000.0 - es); RH = RH / 100.0 * qs; YS = 1.0
else: YS = 100.0
dist = ndi.distance_transform_edt(land, sampling=(55.6, 55.6 * np.cos(np.deg2rad(40))))
cosl = np.cos(np.deg2rad(lat)).clip(0.1, None)
iy0, ix0 = np.nonzero(land & (np.abs(LAT) < 70)); n = len(iy0)
def trace(u, v, maxstep=200):
    py = iy0.astype(np.float64); px = ix0.astype(np.float64); alive = np.ones(n, bool)
    fetch = np.zeros(n); up = np.zeros(n); zc = z[iy0, ix0].copy()
    for _ in range(maxstep):
        yi = np.clip(np.round(py).astype(int), 0, H - 1); xi = np.round(px).astype(int) % W
        uu = u[yi, xi]; vv = v[yi, xi]; sp = np.maximum(np.hypot(uu, vv), 0.5)
        ny = np.clip(py + vv / sp, 0, H - 1); nx = (px - uu / sp / cosl[yi]) % W          # 風上へ1歩(緯度が高いほど経度方向に多く動く)
        nyi = np.round(ny).astype(int); nxi = np.round(nx).astype(int) % W
        sea = ~land[nyi, nxi]; zn = z[nyi, nxi]
        step = alive & ~sea
        fetch[step] += 55.6; up[step] += np.maximum(zc[step] - zn[step], 0)
        zc = np.where(step, zn, zc); py = np.where(step, ny, py); px = np.where(step, nx, px); alive = alive & ~sea
        if not alive.any(): break
    return fetch, up
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
res = {k: [] for k in ('緯度帯だけ', '+最寄りの海距離3スケール', '+風上の距離(その月の風)3スケール+登った高さ', '+最寄り3つ+風上3つ+登った高さ', '+固定の風帯の風上(前の版)')}
for mth in range(12):
    f, up = trace(U[mth], V[mth])
    ym = RH[mth][iy0, ix0] / YS; dd = dist[iy0, ix0]; la = LAT[iy0, ix0]
    LB = [((la >= a) & (la < a + 10)).astype(np.float64) for a in range(-60, 70, 10)]
    def r2(cols):
        X = np.stack(cols, 1); co = np.linalg.lstsq(X, ym, rcond=None)[0]; r = ym - X @ co; return 1 - (r ** 2).sum() / ((ym - ym.mean()) ** 2).sum()
    nr = [np.exp(-dd / s) for s in (200, 500, 1500)]; fe = [np.exp(-f / s) for s in (200, 500, 1500)]
    res['緯度帯だけ'].append(r2(LB)); res['+最寄りの海距離3スケール'].append(r2(LB + nr))
    res['+風上の距離(その月の風)3スケール+登った高さ'].append(r2(LB + fe + [up / 1000.0]))
    res['+最寄り3つ+風上3つ+登った高さ'].append(r2(LB + nr + fe + [up / 1000.0]))
    print('月', mth + 1, ' '.join(f'{k[:8]}={v[-1]:.3f}' for k, v in res.items() if v))
print('--12か月の平均 R2')
for k, v in res.items():
    if v: print(f'  {k}: {np.mean(v):.3f}')
