# 雨量の式を求める。ユーザー指示 11-29 03:00「それらの係数(湿度・風上たどり・海との距離・気温)を与えて雨量のベクトル計算の式を求めてみて」
# 地球の月別の雨(CPC日降水を月に集計)を、項(湿度・気温・風上の海からの距離と登った高さ・海との距離・緯度のガウス・地形)で説明する式を、前向き選択+最小二乗で求める。
# 目的変数: log(1+月降水mm)。掛け算の形(各項が雨を何倍にするか)。差分(時間を進める計算)はしない。
# 使い方: python3 -I rain_formula.py <earth05.npz> <rhum.nc> <air.nc> <uwnd.nc> <vwnd.nc> <出力json>
import sys, json, numpy as np, xarray as xr
from scipy import ndimage as ndi
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
d = np.load(sys.argv[1]); z = d['z']; zsd = d['zsd']; P2 = d['P'].astype(np.float32)             # 2,365,360,720
lat = 90 - 0.5 * (np.arange(360) + 0.5); LAT = lat[:, None] * np.ones((1, 720)); H, W = 360, 720
land = z > 0
mo = np.array([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365])
Pm = np.stack([np.nansum(np.nanmean(P2, axis=0)[mo[m]:mo[m + 1]], axis=0) for m in range(12)])   # 12,360,720 月降水mm
have = ~np.isnan(P2[0, 0]) & land & (np.abs(LAT) < 70); del P2
def regrid(f, name):
    v = xr.open_dataset(f, decode_times=False)[name].values.astype(np.float32)
    ly = np.interp(lat, np.linspace(90, -90, 73)[::-1], np.arange(73)[::-1]); lx = (((np.arange(720) * 0.5 + 0.25) + 180.0) % 360.0) / 2.5
    yy, xx = np.meshgrid(ly, lx, indexing='ij'); return np.stack([ndi.map_coordinates(v[m], [yy, xx], order=1, mode='grid-wrap') for m in range(12)])
RH, T, U, V = regrid(sys.argv[2], 'rhum'), regrid(sys.argv[3], 'air'), regrid(sys.argv[4], 'uwnd'), regrid(sys.argv[5], 'vwnd')
es = 6.112 * np.exp(17.67 * T / (T + 243.5)); Q = RH / 100.0 * 622.0 * es / (1000.0 - es)       # 比湿 g/kg
dist = ndi.distance_transform_edt(land, sampling=(55.6, 55.6 * np.cos(np.deg2rad(40))))
cosl = np.cos(np.deg2rad(lat)).clip(0.1, None); iy0, ix0 = np.nonzero(have); n = len(iy0)
def trace(u, v, maxstep=200):                                                                       # 風上の海まで: 距離・登った高さ・最初の1歩の登り下り
    py = iy0.astype(np.float64); px = ix0.astype(np.float64); alive = np.ones(n, bool)
    fetch = np.zeros(n); up = np.zeros(n); zc = z[iy0, ix0].copy(); asc = np.zeros(n); dsc = np.zeros(n)
    for k in range(maxstep):
        yi = np.clip(np.round(py).astype(int), 0, H - 1); xi = np.round(px).astype(int) % W
        uu = u[yi, xi]; vv = v[yi, xi]; sp = np.maximum(np.hypot(uu, vv), 0.5)
        ny = np.clip(py + vv / sp, 0, H - 1); nx = (px - uu / sp / cosl[yi]) % W
        nyi = np.round(ny).astype(int); nxi = np.round(nx).astype(int) % W
        sea = ~land[nyi, nxi]; zn = z[nyi, nxi]; step = alive & ~sea
        if k == 0: asc = np.where(step, np.maximum(zc - zn, 0), 0.0); dsc = np.where(step, np.maximum(zn - zc, 0), 0.0)
        fetch[step] += 55.6; up[step] += np.maximum(zc[step] - zn[step], 0)
        zc = np.where(step, zn, zc); py = np.where(step, ny, py); px = np.where(step, nx, px); alive = alive & ~sea
        if not alive.any(): break
    return fetch, up, asc, dsc
rows = []; Y = []; MON = []
for m in range(12):
    f, up, asc, dsc = trace(U[m], V[m])
    la = LAT[iy0, ix0]; s_ = np.sin(2 * np.pi * (m - 3) / 12.0); c_itcz = 6.0 + 6.0 * s_
    feat = {
     '定数': np.ones(n),
     '比湿': Q[m][iy0, ix0], '比湿^2': Q[m][iy0, ix0] ** 2, '気温℃': T[m][iy0, ix0],
     '最寄りの海距離(200km)': np.exp(-dist[iy0, ix0] / 200.0), '最寄りの海距離(1000km)': np.exp(-dist[iy0, ix0] / 1000.0),
     '風上の距離(200km)': np.exp(-f / 200.0), '風上の距離(1000km)': np.exp(-f / 1000.0),
     '風上で登った高さkm': up / 1000.0, 'その場の登り(風上→)km': np.clip(asc, 0, 1500) / 1000.0, 'その場の下り(風下側)km': np.clip(dsc, 0, 1500) / 1000.0,
     '赤道の雨帯(季節で動く)': G(la, c_itcz, 9), '中緯度': G(np.abs(la), 47, 12), '亜熱帯高圧': G(np.abs(la), 25, 7),
     '比湿×その場の登り': Q[m][iy0, ix0] * np.clip(asc, 0, 1500) / 1000.0, '比湿×その場の下り': Q[m][iy0, ix0] * np.clip(dsc, 0, 1500) / 1000.0,
     '比湿×風上で登った高さ': Q[m][iy0, ix0] * up / 1000.0, '比湿×赤道の雨帯': Q[m][iy0, ix0] * G(la, c_itcz, 9), '比湿×中緯度': Q[m][iy0, ix0] * G(np.abs(la), 47, 12),
     '比湿×風上の距離(1000km)': Q[m][iy0, ix0] * np.exp(-f / 1000.0),
     '標高km': z[iy0, ix0] / 1000.0, '地形の荒さkm': zsd[iy0, ix0] / 1000.0, '風速m/s': np.hypot(U[m], V[m])[iy0, ix0],
    }
    rows.append(feat); Y.append(np.log1p(Pm[m][iy0, ix0])); MON.append(np.full(n, m))
names = list(rows[0]); Xall = {k: np.concatenate([r[k] for r in rows]) for k in names}; y = np.concatenate(Y)
ok = np.isfinite(y); y = y[ok]; Xall = {k: v[ok] for k, v in Xall.items()}
def fit(cols):
    X = np.stack([Xall[c] for c in cols], 1); co = np.linalg.lstsq(X, y, rcond=None)[0]; r = y - X @ co
    return 1 - (r ** 2).sum() / ((y - y.mean()) ** 2).sum(), co
chosen = ['定数']; hist = []; base = 0.0
for _ in range(12):
    best = None
    for k in names:
        if k in chosen: continue
        r2, _ = fit(chosen + [k])
        if best is None or r2 > best[0]: best = (r2, k)
    if best[0] - base < 0.004: break
    chosen.append(best[1]); hist.append((best[1], round(float(best[0]), 4))); base = best[0]
r2, co = fit(chosen)
# 月降水そのもの(mm)での当てはまり: 予測=exp(式)-1 と実測の相関・緯度帯別の年降水
pred = np.expm1(np.stack([Xall[c] for c in chosen], 1) @ co).clip(0)
true = np.expm1(y); corr = float(np.corrcoef(pred, true)[0, 1])
out = {'選ばれた順(項, 累積の説明率)': hist, '最終の説明率(log(1+雨))': round(float(r2), 4), '係数': {c: round(float(v), 4) for c, v in zip(chosen, co)}, '月降水mmの相関(予測と実測)': round(corr, 3), 'セル×月': int(len(y))}
json.dump(out, open(sys.argv[6], 'w'), ensure_ascii=False, indent=1); print(json.dumps(out, ensure_ascii=False, indent=1))
