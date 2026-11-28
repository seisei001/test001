# 点の周りとの雨量の連動係数の推計(地球の日降水)。ユーザー指示 11-29 02:54。
# 連動係数 κ(場所) = その場所の日々の雨のずれ(平方根雨量−平年)と、周りのリング(1〜2マス/3〜5マス/6〜10マス)の平均との同じ日の相関。
# κを、気候(湿度・気温)・海との距離・緯度・標高・「海に向かう斜面か」の項で説明し、どの項が効くか(説明率の増え方)を見る。差分(隣との時間発展の数値計算)はしない=係数は項の式で与える。
# 使い方: python3 -I coupling_est.py <earth05.npz> <rhum.nc> <air.nc> <出力json>
import sys, json, numpy as np, xarray as xr
from scipy import ndimage as ndi
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
d = np.load(sys.argv[1]); z = d['z']; zsd = d['zsd']; P = d['P'].astype(np.float32)[0]        # 2015: 365,360,720
lat = 90 - 0.5 * (np.arange(360) + 0.5); LAT = lat[:, None] * np.ones((1, 720))
land = z > 0; valid = ~np.isnan(P[0]) & land & (np.abs(LAT) < 70)
S = np.sqrt(np.clip(np.nan_to_num(P), 0, None)); S[:, ~valid] = 0
clim = ndi.uniform_filter1d(S, 31, axis=0, mode='wrap'); A = (S - clim) * valid[None]           # 平年からのずれ(陸以外0)
# リング平均(陸の有効セルだけで平均)
def ring(r0, r1):
    k = np.zeros((2 * r1 + 1, 2 * r1 + 1)); yy, xx = np.mgrid[-r1:r1 + 1, -r1:r1 + 1]; rr = np.hypot(yy, xx); k[(rr >= r0) & (rr <= r1)] = 1; k /= k.sum()
    cnt = ndi.convolve(valid.astype(np.float32), k, mode='wrap'); out = np.empty_like(A)
    for t in range(A.shape[0]): out[t] = ndi.convolve(A[t], k, mode='wrap')
    return out / np.maximum(cnt, 1e-6)[None], cnt
def corr_map(R, cnt):
    num = (A * R).sum(0); den = np.sqrt((A * A).sum(0) * (R * R).sum(0)) + 1e-9; k = num / den; k[(cnt < 0.5) | ~valid] = np.nan; return k
rings = {'近く(1〜2マス)': (1, 2), '中(3〜5マス)': (3, 5), '遠く(6〜10マス)': (6, 10)}
KAP = {}
for nm, (a, b) in rings.items():
    R, cnt = ring(a, b); KAP[nm] = corr_map(R, cnt); del R
# ---- 説明に使う項 ----
def regrid(f, name):                                                                              # NCEP 2.5度月別平年 → 0.5度(双一次)
    v = xr.open_dataset(f, decode_times=False)[name].values.astype(np.float32)                    # 12,73,144
    out = np.empty((12, 360, 720), np.float32)
    ly = np.interp(lat, np.linspace(90, -90, 73)[::-1], np.arange(73)[::-1])                      # 行(緯度)
    lx = (np.arange(720) * 0.5 + 0.25) / 2.5
    yy, xx = np.meshgrid(ly, lx, indexing='ij')
    for m in range(12): out[m] = ndi.map_coordinates(v[m], [yy, xx], order=1, mode='grid-wrap')
    return out
RH = regrid(sys.argv[2], 'rhum'); T = regrid(sys.argv[3], 'air')
land_sea = z > 0
dist, (iy_, ix_) = ndi.distance_transform_edt(land_sea, sampling=(55.6, 55.6 * np.cos(np.deg2rad(40))), return_indices=True)
Y, X = np.mgrid[0:360, 0:720]
sy = (iy_ - Y) * 55.6; sx = ((ix_ - X + 360) % 720 - 360) * 55.6 * np.cos(np.deg2rad(LAT))            # 最寄りの海への向き(km)
sn = np.hypot(sy, sx) + 1e-6; sy /= sn; sx /= sn                                                  # 北が上=yは下向きが正なので注意: 行が増えると南
zs = ndi.gaussian_filter(z, 1.5)
gy = np.gradient(zs, axis=0) / 55.6 * (-1)                                                          # 北向きに増える高さ(m/km)
gx = np.gradient(zs, axis=1) / (55.6 * np.cos(np.deg2rad(LAT)).clip(0.1, None))                     # 東向きに増える高さ(m/km)
# 海への向き(北向き成分=-sy、東向き成分=sx)。海に向かう斜面(風上側)=標高が海から内陸へ増える = gを「海から遠ざかる向き」へ射影した値>0
face_sea = -( gy * (-sy) + gx * sx )                                                                # 海の側へ向かって下る斜面(=海に向かう面)は正
feat = {
 '定数': np.ones((360, 720)),
 '年平均の湿度%': RH.mean(0), '湿度の季節差': RH.max(0) - RH.min(0),
 '年平均気温℃': T.mean(0), '気温の季節差': T.max(0) - T.min(0),
 '海近く(指数500km)': np.exp(-dist / 500.0),
 '海近く(指数150km)': np.exp(-dist / 150.0),
 '赤道': G(LAT, 0, 10), '中緯度': G(np.abs(LAT), 47, 12),
 '標高km': z / 1000.0, '地形の荒さkm': zsd / 1000.0,
 '海に向かう斜面': np.clip(face_sea, -50, 50) / 20.0,
 '海に向かう斜面×海近く': np.clip(face_sea, -50, 50) / 20.0 * np.exp(-dist / 500.0),
 '湿度×標高': RH.mean(0) / 100.0 * z / 1000.0,
}
names = list(feat)
out = {'連動係数の平均(地球・陸)': {k: float(np.nanmean(v)) for k, v in KAP.items()}, '項ごとの結果': {}}
for kn, kap in KAP.items():
    m = valid & np.isfinite(kap)
    y = kap[m]; Xall = {n: feat[n][m].astype(np.float64) for n in names}
    # 項を1つずつ足して、説明率が最も増える項を選ぶ(前向き選択)
    chosen = ['定数']; hist = []
    def r2_of(cols):
        Xm = np.stack([Xall[c] for c in cols], 1); co = np.linalg.lstsq(Xm, y, rcond=None)[0]; r = y - Xm @ co; return 1 - (r ** 2).sum() / ((y - y.mean()) ** 2).sum(), co
    base = 0.0
    for _ in range(8):
        best = None
        for n in names:
            if n in chosen: continue
            r, _co = r2_of(chosen + [n])
            if best is None or r > best[0]: best = (r, n)
        if best[0] - base < 0.003: break
        chosen.append(best[1]); hist.append((best[1], round(float(best[0]), 4))); base = best[0]
    r, co = r2_of(chosen)
    out['項ごとの結果'][kn] = {'選ばれた順(項, 累積の説明率)': hist, '最終の説明率': round(float(r), 4), '係数': {c: round(float(v), 4) for c, v in zip(chosen, co)}, '連動係数の平均': round(float(y.mean()), 3), 'セル数': int(m.sum())}
json.dump(out, open(sys.argv[4], 'w'), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False, indent=1))
