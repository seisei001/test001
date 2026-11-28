# 日ごとの雨の式を、地球の日降水(earth05.npz)に当てはめる。ユーザー指示 11-29 02:39「式に足すべきものをどんどん足す」。
# 式(平方根雨量の「平年からのずれ」A):  A_今日 = ρ·A_前日 + β·A_前日(風上の隣) + σ·ε
#   ρ(前日との相関)・β(風上の隣からの運び)・σ(日々の揺れ)を、それぞれ「項」の線形和で書く。項=1/海との距離の指数/赤道のガウス/中緯度のガウス/標高/高緯度。
# 使い方: python3 -I daily_fit.py <earth05.npz> <出力json>
import sys, json, numpy as np
from scipy import ndimage as ndi
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
d = np.load(sys.argv[1]); z = d['z']; P = d['P'].astype(np.float32)
lat = 90 - 0.5 * (np.arange(360) + 0.5); LAT = lat[:, None] * np.ones((1, 720))
land = z > 0; valid = ~np.isnan(P[0, 0]) & land & (np.abs(LAT) < 70)
dist = ndi.distance_transform_edt(land, sampling=(55.6, 55.6 * np.cos(np.deg2rad(40))))
# メモリ節約: 有効な陸のセルだけの時系列にする(セル×日)
iy, ix = np.nonzero(valid); N = len(iy)
idx = -np.ones((360, 720), np.int64); idx[iy, ix] = np.arange(N)
Sv = np.sqrt(np.clip(np.nan_to_num(P[:, :, iy, ix]), 0, None))           # 2,365,N
del P
clim = ndi.uniform_filter1d(Sv.mean(axis=0), 31, axis=0, mode='wrap')    # 平年 365,N
A = (Sv - clim[None]).reshape(730, N).astype(np.float32); del Sv
wind = np.where(np.abs(lat) < 28, -1, np.where(np.abs(lat) < 62, 1, -1))  # 東向き=+1
SHIFT = 4                                                                 # 風上の隣=4マス(0.5度×4≒220km。1日で雨が動く距離の目安)
nbx = (ix - SHIFT * wind[iy]) % 720                                               # 風上の隣の経度(東向きの風なら西隣)
up = idx[iy, nbx]                                                          # 風上の隣のセル番号(陸でなければ-1)
Aw = np.where((up >= 0)[None], A[:, np.maximum(up, 0)], np.nan).astype(np.float32)
# 項(特徴量)
feats = {'定数': np.ones(N), '海近く': np.exp(-dist[iy, ix] / 500.0), '赤道': G(LAT[iy, ix], 0, 10), '中緯度': G(np.abs(LAT[iy, ix]), 47, 12), '標高km': z[iy, ix] / 1000.0, '高緯度': G(np.abs(LAT[iy, ix]), 80, 12)}
names = list(feats); X = np.stack([feats[k] for k in names], 1)          # セル×項
# 項の係数を、全セル・全日をまとめた最小二乗で直接求める(セルごとに分けると隣と似すぎて不安定になるため)
a1 = A[1:]; a0 = A[:-1]; aw = Aw[:-1]
K = len(names); XtX = np.zeros((2 * K, 2 * K)); Xty = np.zeros(2 * K); n_tot = 0
for t in range(0, a1.shape[0], 30):                                        # 30日ずつ
    y = a1[t:t + 30]; p0 = a0[t:t + 30]; pw = aw[t:t + 30]
    okm = ~np.isnan(y) & ~np.isnan(p0) & ~np.isnan(pw)
    y = np.where(okm, y, 0); p0 = np.where(okm, p0, 0); pw = np.where(okm, pw, 0)
    Z = np.concatenate([X[None] * p0[..., None], X[None] * pw[..., None]], axis=2).reshape(-1, 2 * K)   # (日×セル)×(2K)
    yy = y.reshape(-1); XtX += Z.T @ Z; Xty += Z.T @ yy; n_tot += okm.sum()
cf = np.linalg.solve(XtX + 1e-6 * np.eye(2 * K), Xty)
cr, cb = cf[:K], cf[K:]
rho_c = X @ cr; beta_c = X @ cb
res = a1 - rho_c[None] * a0 - beta_c[None] * np.where(np.isnan(aw), 0, aw)
res = np.where(np.isnan(a1), np.nan, res)
sig_c = np.sqrt(np.nanmean(res ** 2, axis=0))
coef = {'rho': cr, 'beta': cb, 'sigma': np.linalg.lstsq(X, sig_c, rcond=None)[0]}
pred_s = X @ coef['sigma']
r2 = {'sigma': float(1 - ((sig_c - pred_s) ** 2).sum() / ((sig_c - sig_c.mean()) ** 2).sum())}
tot = np.nansum(a1 ** 2); r2['全体(前日の揺れの説明率)'] = float(1 - np.nansum(res ** 2) / tot)
eps = res / np.maximum(sig_c, 1e-6)
ne = idx[iy, (ix + 1) % 720]; ok2 = ne >= 0
nb = float(np.nanmean((eps[:, ok2] * eps[:, ne[ok2]]).mean(0)))
out = {'項': names, '係数': {k: [round(float(c), 4) for c in v] for k, v in coef.items()}, '説明率': r2,
       'セル平均': {'rho': float(rho_c.mean()), 'beta': float(beta_c.mean()), 'sigma': float(sig_c.mean())},
       '東隣のマスとの揺れの相関': nb}
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1); print(json.dumps(out, ensure_ascii=False, indent=1))
