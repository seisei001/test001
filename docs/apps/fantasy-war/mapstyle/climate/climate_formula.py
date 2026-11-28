# 気候の式版(基本値の段階)。設計案①: 世界データ(高さ・陸海・緯度)だけから、月ごとの気温・風・比湿・降水を式で作る。
# 係数は地球(NCEPの湿度・CPCの降水)に1回当てはめる。地球でも世界地図でも、入力は同じ(陸海・標高・緯度)で、風と気温も式で作る(NCEPの風・気温は使わない)。
# 地球換算: 世界地図の半分解像度(700×350)の1マス≒地球の0.5度(約55.6km)として扱う(判断 11-29 03:08。世界の周長は地球の約1/5だが、気候帯を地球と同じ角度で置くため)。
# 使い方: python3 -I climate_formula.py fit <earth05.npz> <rhum.nc> <coef.json>      # 地球で当てはめ
#         python3 -I climate_formula.py apply <coef.json> <world-data.png> <出力ディレクトリ>   # 世界地図へ適用
import sys, os, json, numpy as np
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import climate_base as cb
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
KM = 55.6
def features(land, elev):
    """land: 陸(h×w) / elev: 標高km(h×w)。戻り値=月ごとの特徴の辞書のリストと共通情報"""
    h, w = land.shape; lat = cb.lat_rows(h); LAT = lat[:, None] * np.ones((1, w))
    dist = ndi.distance_transform_edt(land, sampling=(KM, KM * np.cos(np.deg2rad(40))))
    cosl = np.cos(np.deg2rad(lat)).clip(0.1, None); iy0, ix0 = np.nonzero(land & (np.abs(LAT) < 70)); n = len(iy0)
    Tm = cb.sea_level_mean_T(LAT); cont = np.where(land, 1 - np.exp(-dist / 600.0), 0.0); out = []
    for m in range(12):
        s = np.sin(2 * np.pi * (m - 3) / 12.0)                                      # 0始まりの月m: 7月(m=6)で最大
        phi0 = 6.0 + 6.0 * s; amp = np.abs(LAT) * (0.10 + 0.17 * cont)
        T = Tm + np.sign(LAT) * amp * s - cb.LAPSE * elev * land
        u1, v1 = cb.wind_field(lat, phi0); U = u1[:, None] * np.ones((1, w)); V = v1[:, None] * np.ones((1, w))
        py = iy0.astype(float); px = ix0.astype(float); alive = np.ones(n, bool); fetch = np.zeros(n); up = np.zeros(n); zc = elev[iy0, ix0].copy()
        for k in range(200):
            yi = np.clip(np.round(py).astype(int), 0, h - 1); xi = np.round(px).astype(int) % w
            uu = U[yi, xi]; vv = V[yi, xi]; sp = np.maximum(np.hypot(uu, vv), 0.3)
            ny = np.clip(py + vv / sp, 0, h - 1); nx = (px - uu / sp / cosl[yi]) % w
            nyi = np.round(ny).astype(int); nxi = np.round(nx).astype(int) % w
            sea = ~land[nyi, nxi]; zn = elev[nyi, nxi]; step = alive & ~sea
            fetch[step] += KM; up[step] += np.maximum(zc[step] - zn[step], 0)
            zc = np.where(step, zn, zc); py = np.where(step, ny, py); px = np.where(step, nx, px); alive = alive & ~sea
            if not alive.any(): break
        la = LAT[iy0, ix0]; sh = np.sign(la) * s
        out.append({'la': la, 's': s, 'sh': sh, 'phi0': phi0, 'T': T[iy0, ix0], 'fetch': fetch, 'up': up, 'dist': dist[iy0, ix0], 'wind': np.hypot(U, V)[iy0, ix0] * 5.0, 'elev': elev[iy0, ix0]})
    return out, (iy0, ix0, h, w, LAT)
def rh_design(f):
    la = f['la']; cols = []
    for a in range(-60, 70, 10): b = ((la >= a) & (la < a + 10)).astype(float); cols += [b, b * f['sh']]
    for sc in (200, 500, 1500): cols.append(np.exp(-f['dist'] / sc))
    for sc in (200, 500, 1500): cols.append(np.exp(-f['fetch'] / sc))
    cols.append(f['up'] / 1000.0); return np.stack(cols, 1)
def qs_of(T): es = 6.112 * np.exp(17.67 * T / (T + 243.5)); return 622.0 * es / (1000.0 - es)
def rain_design(f, q):
    la = f['la']; itcz = G(la, f['phi0'], 9); mid = G(np.abs(la), 47, 12); sub = G(np.abs(la), 25, 7)
    return np.stack([np.ones_like(q), q, q * q, f['T'], mid, f['wind'], f['up'] / 1000.0, q * f['up'] / 1000.0, itcz * q, sub * q, f['elev']], 1)
RAIN_NAMES = ['定数', '比湿', '比湿^2', '気温', '中緯度', '風速', '風上で登った高さkm', '比湿×登った高さ', '収束帯×比湿', '亜熱帯高圧×比湿', '標高km']
if __name__ == '__main__' and sys.argv[1] == 'fit':
    import xarray as xr
    d = np.load(sys.argv[2]); z = d['z']; P2 = d['P'].astype(np.float32)
    land = z > 0; elev = np.clip(z / 1000.0, 0, None)
    feats, (iy0, ix0, h, w, LAT) = features(land, elev)
    mo = np.array([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365])
    Pm = np.stack([np.nansum(np.nanmean(P2, axis=0)[mo[m]:mo[m + 1]], axis=0) for m in range(12)]); have = ~np.isnan(P2[0, 0]); del P2
    lat = cb.lat_rows(h)
    v = xr.open_dataset(sys.argv[3], decode_times=False)['rhum'].values.astype(np.float32)
    ly = np.interp(lat, np.linspace(90, -90, 73)[::-1], np.arange(73)[::-1]); lx = (((np.arange(w) * 0.5 + 0.25) + 180.0) % 360.0) / 2.5
    yy, xx = np.meshgrid(ly, lx, indexing='ij'); RH = np.stack([ndi.map_coordinates(v[m], [yy, xx], order=1, mode='grid-wrap') for m in range(12)])
    ok = have[iy0, ix0]
    # 湿度の式: 相対湿度 = lat帯・季節×lat帯・海距離3スケール・風上3スケール・登った高さ(線形)
    X = np.concatenate([rh_design(f)[ok] for f in feats]); y = np.concatenate([RH[m][iy0, ix0][ok] for m in range(12)]) / 100.0
    cr = np.linalg.lstsq(X, y, rcond=None)[0]; r2rh = 1 - ((y - X @ cr) ** 2).sum() / ((y - y.mean()) ** 2).sum()
    # 降水の式: log(1+月降水) = 項の和
    Xr, yr = [], []
    for m, f in enumerate(feats):
        rh = np.clip(rh_design(f) @ cr, 0.05, 0.99); q = rh * qs_of(f['T'])
        Xr.append(rain_design(f, q)[ok]); yr.append(np.log1p(Pm[m][iy0, ix0][ok]))
    Xr = np.concatenate(Xr); yr = np.concatenate(yr); good = np.isfinite(yr)
    cp = np.linalg.lstsq(Xr[good], yr[good], rcond=None)[0]; r2p = 1 - ((yr[good] - Xr[good] @ cp) ** 2).sum() / ((yr[good] - yr[good].mean()) ** 2).sum()
    smear = float(np.mean(np.exp(yr[good] - Xr[good] @ cp)))                                  # 対数で当てはめた式を元の量に戻すときの偏りの補正(Duanの平滑化推定。標準的な統計の補正)
    pred = (np.exp(Xr[good] @ cp) * smear - 1).clip(0); corr = float(np.corrcoef(pred, np.expm1(yr[good]))[0, 1])
    json.dump({'rh_coef': cr.tolist(), 'rain_coef': cp.tolist(), 'rain_names': RAIN_NAMES, 'smear': smear, 'R2_湿度(相対湿度)': float(r2rh), 'R2_降水(log)': float(r2p), '月降水mmの相関': corr}, open(sys.argv[4], 'w'), ensure_ascii=False, indent=1)
    # 緯度帯別の年降水: 地球の実測(CPC) と 式(地球の地形で)
    la_all = np.concatenate([f['la'][ok] for f in feats]); tru = np.expm1(yr); prd = (np.exp(Xr @ cp) * smear - 1).clip(0); gd = np.isfinite(tru)
    print('緯度帯別の年降水(陸) 実測/式:')
    for a in range(-60, 70, 15):
        mm = gd & (la_all >= a) & (la_all < a + 15)
        if mm.sum() > 100: print(f'  {a:>4}~{a + 15:>3}: {12 * np.nanmean(tru[mm]):6.0f} / {12 * np.nanmean(prd[mm]):6.0f}')
    print('湿度R2', round(r2rh, 3), '降水R2(log)', round(r2p, 3), '月降水の相関', round(corr, 3)); print(dict(zip(RAIN_NAMES, np.round(cp, 4))))
elif __name__ == '__main__':
    cf = json.load(open(sys.argv[2])); cr = np.array(cf['rh_coef']); cp = np.array(cf['rain_coef'])
    land, H = cb.load(sys.argv[3]); elev = np.where(land, np.clip((H - 20.3) / (100 - 20.3), 0, 1) * cb.ELEV_TOP_KM, 0.0)
    feats, (iy0, ix0, h, w, LAT) = features(land, elev); P = np.zeros((12, h, w), np.float32); T = np.zeros((12, h, w), np.float32); RHm = np.zeros((12, h, w), np.float32)
    for m, f in enumerate(feats):
        rh = np.clip(rh_design(f) @ cr, 0.05, 0.99); q = rh * qs_of(f['T']); p = (np.exp(rain_design(f, q) @ cp) * cf['smear'] - 1).clip(0)
        P[m][iy0, ix0] = p; T[m][iy0, ix0] = f['T']; RHm[m][iy0, ix0] = rh
    os.makedirs(sys.argv[4], exist_ok=True); np.savez_compressed(sys.argv[4] + '/climate_formula.npz', P=P, T=T, RH=RHm, land=land)
    lat = cb.lat_rows(h); area = np.cos(np.deg2rad(lat))[:, None] * np.ones((1, w)); Pa = P.sum(0)
    print('陸の年降水 面積加重平均 mm:', round(float((Pa * area)[land & (np.abs(LAT) < 70)].sum() / area[land & (np.abs(LAT) < 70)].sum())))
    for a in range(-60, 70, 15):
        m = land & (LAT >= a) & (LAT < a + 15)
        if m.sum() > 20: print(f'{a:>4}~{a + 15:>3}: 年降水 {float((Pa * area)[m].sum() / area[m].sum()):6.0f}mm  陸のセル{int(m.sum())}')
