# 日々の雨を「波形」として見る(周期ごとの力・波の進み)。ユーザー指示 11-29 02:44「その地点の雨量は、とある波形になるはず」
# 地点ごとの365日の雨(平方根)をフーリエ変換し、周期帯ごとの力の割合を、海からの距離別・緯度帯別に出す。さらに5〜10日の波が東へ進むかを、東2マス先との位相差で見る。
# 使い方: python3 -I daily_wave.py <earth05.npz>
import sys, numpy as np
from scipy import ndimage as ndi
d = np.load(sys.argv[1]); z = d['z']; P = d['P'].astype(np.float32)
lat = 90 - 0.5 * (np.arange(360) + 0.5); LAT = lat[:, None] * np.ones((1, 720))
land = z > 0; valid = ~np.isnan(P[0, 0]) & land & (np.abs(LAT) < 70)
dist = ndi.distance_transform_edt(land, sampling=(55.6, 55.6 * np.cos(np.deg2rad(40))))
iy, ix = np.nonzero(valid); S = np.sqrt(np.clip(np.nan_to_num(P[:, :, iy, ix]), 0, None))
f = np.fft.rfftfreq(365, 1.0); per = np.where(f > 0, 1 / np.maximum(f, 1e-9), 1e9)
F = np.fft.rfft(S - S.mean(1, keepdims=True), axis=1); pw = (np.abs(F) ** 2).mean(0) / 365
bands = [('年周期(180日以上)', 180, 1e9), ('季節内(30〜180日)', 30, 180), ('10〜30日', 10, 30), ('5〜10日(天気の波)', 5, 10), ('2〜5日', 2, 5)]
dd = dist[iy, ix]; la = np.abs(LAT[iy, ix])
def share(m): t = pw[1:, m].sum(); return ' '.join(f'{n}:{100 * pw[(per >= a) & (per < b)][:, m].sum() / t:4.1f}%' for n, a, b in bands)
for lo, hi in ((0, 150), (150, 500), (500, 1000), (1000, 3000)): print(f'{lo}-{hi}km', share((dd >= lo) & (dd < hi)))
for lo, hi in ((0, 15), (15, 30), (30, 45), (45, 60), (60, 70)): print(f'{lo}-{hi}度', share((la >= lo) & (la < hi)))
sel = (per >= 5) & (per < 10); idx = -np.ones((360, 720), np.int64); idx[iy, ix] = np.arange(len(iy))
for lo, hi in ((0, 15), (30, 45), (45, 60)):
    m = np.nonzero((la >= lo) & (la < hi))[0]; e = idx[iy[m], (ix[m] + 2) % 720]; ok = e >= 0
    cs = (F[:, sel][:, :, m[ok]] * np.conj(F[:, sel][:, :, e[ok]])).mean()
    print(f'緯度{lo}-{hi}度 5〜10日の波 東1度先との位相差 {np.angle(cs, deg=True):.1f}度')
