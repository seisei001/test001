# 気候の式版2: 緯度のガウスの土台 × 地形・湿度の倍率。ユーザー指示 11-29 03:14「軽い計算でそれらしければ使わない手はない」
# 月降水 = 土台(緯度と季節のガウスの重ね合わせ。地球の緯度帯の月平均に当てはめる) × 倍率(海との距離・風上の距離・風上で登った高さ・標高・湿度。地球の月降水に当てはめる)。
# 使い方: python3 -I climate_formula2.py fit <earth05.npz> <rhum.nc> <coef2.json>  /  python3 -I climate_formula2.py apply <coef2.json> <world-data.png> <出力ディレクトリ>
import sys, os, json, numpy as np
from scipy import ndimage as ndi
from scipy.optimize import curve_fit
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import climate_base as cb
from climate_formula import features, rh_design, qs_of, G
def base(X, b0, A1, c0, c1, w1, A2, mu2, w2, k2, A3):
    la, s = X; sh = np.sign(la) * s
    return b0 + A1 * G(la, c0 + c1 * s, w1) + A2 * G(np.abs(la), mu2, w2) * (1 - k2 * sh) + A3 * G(np.abs(la), 25.0, 7.0)
P0 = [30, 120, 6, 6, 9, 40, 47, 11, 0.2, -20]
def mult_design(f, rh):
    return np.stack([np.ones_like(rh), np.exp(-f['dist'] / 300.0), np.exp(-f['dist'] / 1500.0), np.exp(-f['fetch'] / 300.0), np.exp(-f['fetch'] / 1500.0), f['up'] / 1000.0, f['elev'], rh, np.log1p(f['wind'])], 1)
MN = ['定数', '海距離(300km)', '海距離(1500km)', '風上距離(300km)', '風上距離(1500km)', '風上で登った高さkm', '標高km', '相対湿度', 'log(1+風速)']
if sys.argv[1] == 'fit':
    import xarray as xr
    d = np.load(sys.argv[2]); z = d['z']; P2 = d['P'].astype(np.float32)
    land = z > 0; elev = np.clip(z / 1000.0, 0, None)
    feats, (iy0, ix0, h, w, LAT) = features(land, elev)
    mo = np.array([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365])
    Pm = np.stack([np.nansum(np.nanmean(P2, axis=0)[mo[m]:mo[m + 1]], axis=0) for m in range(12)]); have = ~np.isnan(P2[0, 0]); del P2
    ok = have[iy0, ix0]; lat = cb.lat_rows(h)
    v = xr.open_dataset(sys.argv[3], decode_times=False)['rhum'].values.astype(np.float32)
    ly = np.interp(lat, np.linspace(90, -90, 73)[::-1], np.arange(73)[::-1]); lx = (((np.arange(w) * 0.5 + 0.25) + 180.0) % 360.0) / 2.5
    yy, xx = np.meshgrid(ly, lx, indexing='ij'); RH = np.stack([ndi.map_coordinates(v[m], [yy, xx], order=1, mode='grid-wrap') for m in range(12)])
    # (1) 土台: 緯度5度×月の陸の月降水の面積加重平均へ当てはめ
    la_all = np.concatenate([f['la'][ok] for f in feats]); s_all = np.concatenate([np.full(ok.sum(), f['s']) for f in feats])
    p_all = np.concatenate([Pm[m][iy0, ix0][ok] for m in range(12)]); good = np.isfinite(p_all)
    la_all, s_all, p_all = la_all[good], s_all[good], p_all[good]
    xs, ys = [], []
    for sm in np.unique(s_all):
        for a in range(-70, 70, 5):
            mm = (s_all == sm) & (la_all >= a) & (la_all < a + 5)
            if mm.sum() > 30: xs.append((a + 2.5, sm)); ys.append(p_all[mm].mean())
    xs = np.array(xs); ys = np.array(ys)
    pb, _ = curve_fit(base, (xs[:, 0], xs[:, 1]), ys, p0=P0, maxfev=20000)
    r2b = 1 - ((ys - base((xs[:, 0], xs[:, 1]), *pb)) ** 2).sum() / ((ys - ys.mean()) ** 2).sum()
    # (2) 倍率: log((月降水+1)/(土台+1)) を項で回帰
    cr = np.linalg.lstsq(np.concatenate([rh_design(f)[ok] for f in feats]), np.concatenate([RH[m][iy0, ix0][ok] for m in range(12)]) / 100.0, rcond=None)[0]
    Xm, ym = [], []
    for m, f in enumerate(feats):
        rh = np.clip(rh_design(f) @ cr, 0.05, 0.99); B = base((f['la'], np.full(len(f['la']), f['s'])), *pb)
        Xm.append(mult_design(f, rh)[ok]); ym.append(np.log1p(Pm[m][iy0, ix0][ok]) - np.log1p(B.clip(0)[ok]))
    Xm = np.concatenate(Xm); ym = np.concatenate(ym); g2 = np.isfinite(ym)
    cm = np.linalg.lstsq(Xm[g2], ym[g2], rcond=None)[0]; r2m = 1 - ((ym[g2] - Xm[g2] @ cm) ** 2).sum() / ((ym[g2] - ym[g2].mean()) ** 2).sum()
    smear = float(np.mean(np.exp(Xm[g2] @ cm)))                                   # 倍率の全体平均(これで割って、倍率は「相対的な形」だけにする=土台の水準を壊さない)
    Bs = np.concatenate([base((f['la'], np.full(len(f['la']), f['s'])), *pb).clip(0)[ok] for f in feats]); Pp = ((Bs + 1) * np.exp(Xm @ cm) / smear - 1).clip(0); Pt = np.concatenate([Pm[m][iy0, ix0][ok] for m in range(12)])
    gg = np.isfinite(Pt); corr = float(np.corrcoef(Pp[gg], Pt[gg])[0, 1]); corr_base = float(np.corrcoef(Bs[gg], Pt[gg])[0, 1])
    print('土台の当てはまりR2(緯度5度×月の平均)', round(r2b, 3), '土台だけの月降水の相関', round(corr_base, 3), '/ 倍率をかけた相関', round(corr, 3), '倍率の説明率(log)', round(r2m, 3), 'smear', round(smear, 3))
    print('土台の係数', dict(zip(['b0', 'A1', 'c0', 'c1', 'w1', 'A2', 'mu2', 'w2', 'k2', 'A3'], np.round(pb, 2))))
    print('倍率の係数', dict(zip(MN, np.round(cm, 3))))
    la2 = np.concatenate([f['la'][ok] for f in feats]); print('緯度帯別の年降水(陸) 実測/土台だけ/土台×倍率:')
    for a in range(-60, 70, 15):
        mm = gg & (la2 >= a) & (la2 < a + 15)
        if mm.sum() > 100: print(f'  {a:>4}~{a + 15:>3}: {12 * Pt[mm].mean():6.0f} / {12 * Bs[mm].mean():6.0f} / {12 * Pp[mm].mean():6.0f}')
    json.dump({'base_params': pb.tolist(), 'rh_coef': cr.tolist(), 'smear': smear, 'mult_coef': cm.tolist(), 'mult_names': MN, 'R2_土台': float(r2b), 'R2_倍率': float(r2m), '月降水の相関': corr}, open(sys.argv[4], 'w'), ensure_ascii=False, indent=1)
else:
    cf = json.load(open(sys.argv[2])); pb = np.array(cf['base_params']); cr = np.array(cf['rh_coef']); cm = np.array(cf['mult_coef'])
    land, Hh = cb.load(sys.argv[3]); elev = np.where(land, np.clip((Hh - 20.3) / (100 - 20.3), 0, 1) * cb.ELEV_TOP_KM, 0.0)
    feats, (iy0, ix0, h, w, LAT) = features(land, elev); P = np.zeros((12, h, w), np.float32); T = np.zeros((12, h, w), np.float32)
    for m, f in enumerate(feats):
        rh = np.clip(rh_design(f) @ cr, 0.05, 0.99); B = base((f['la'], np.full(len(f['la']), f['s'])), *pb).clip(0)
        P[m][iy0, ix0] = ((B + 1) * np.exp(mult_design(f, rh) @ cm) / cf['smear'] - 1).clip(0); T[m][iy0, ix0] = f['T']
    os.makedirs(sys.argv[4], exist_ok=True); np.savez_compressed(sys.argv[4] + '/climate_formula2.npz', P=P, T=T, land=land)
    lat = cb.lat_rows(h); area = np.cos(np.deg2rad(lat))[:, None] * np.ones((1, w)); Pa = P.sum(0); sel = land & (np.abs(LAT) < 70)
    print('陸の年降水 面積加重平均 mm:', round(float((Pa * area)[sel].sum() / area[sel].sum())))
    for a in range(-60, 70, 15):
        m = land & (LAT >= a) & (LAT < a + 15)
        if m.sum() > 20: print(f'{a:>4}~{a + 15:>3}: 年降水 {float((Pa * area)[m].sum() / area[m].sum()):6.0f}mm')
