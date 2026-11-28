# 波形による日々の雨の生成(地球の地形で試す)。ユーザー指示 11-29 02:45「やってみて」
# 式: 平方根雨量 S(場所,日) = 平年(場所,日) + σ(場所) × 波形(場所,日)。波形=空間になめらかな乱数を、緯度ごとの「地球の周期ごとの力」で時間方向に色付けしたもの。
#   σ(場所) = 海との距離・緯度・標高の項の和(daily_fit.jsonの係数)。雨量=max(S,0)の2乗。
# 今回は平年は地球の実測を使い、日々の波形の部分だけを試す。東への波の進みは未実装。
# 使い方: python3 -I wave_sim.py <earth05.npz>
import sys, json, numpy as np
from scipy import ndimage as ndi
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
d = np.load(sys.argv[1]); z = d['z']; P2 = d['P'].astype(np.float32)          # 2,365,360,720
lat = 90 - 0.5 * (np.arange(360) + 0.5); LAT = lat[:, None] * np.ones((1, 720))
land = z > 0; valid = ~np.isnan(P2[0, 0]) & land & (np.abs(LAT) < 70)
dist = ndi.distance_transform_edt(land, sampling=(55.6, 55.6 * np.cos(np.deg2rad(40))))
iy, ix = np.nonzero(valid); N = len(iy)
Sv = np.sqrt(np.clip(np.nan_to_num(P2[:, :, iy, ix]), 0, None)); Pearth = P2[:, :, iy, ix]; del P2
clim = ndi.uniform_filter1d(Sv.mean(0), 31, axis=0, mode='wrap')                # 365,N 平年
An = Sv - clim[None]                                                            # 2,365,N 日々のずれ
la = np.abs(LAT[iy, ix]); dd = dist[iy, ix]; zz = z[iy, ix]
# 緯度ごとの周期の力(地球): 5つの緯度帯の平均スペクトル → 緯度で補間
f = np.fft.rfftfreq(365, 1.0); cents = np.array([7.5, 22.5, 37.5, 52.5, 65.0]); edges = [0, 15, 30, 45, 60, 70]
pw = (np.abs(np.fft.rfft(An, axis=1)) ** 2).mean(0)                              # 183,N
spec = np.array([pw[:, (la >= edges[i]) & (la < edges[i + 1])].mean(1) for i in range(5)])   # 5,183
spec = spec / spec[:, 1:].sum(1, keepdims=True)
amp = np.sqrt(np.stack([np.interp(la, cents, spec[:, k]) for k in range(len(f))], 0))     # 183,N 緯度ごとの振幅の形
amp[0] = 0
# σ(場所): 前の当てはめ(daily_fit.json)の項の和
c = [0.680, 0.1653, 0.7256, 0.2148, -0.0649, -0.274]
sig = c[0] + c[1] * np.exp(-dd / 500) + c[2] * G(la, 0, 10) + c[3] * G(la, 47, 12) + c[4] * zz / 1000 + c[5] * G(la, 80, 12)
# 乱数: 空間になめらか(約1.5マス)→時間方向に色付け
rs = np.random.RandomState(1)
W = np.zeros((365, 360, 720), np.float32); W[:] = rs.randn(365, 360, 720)
W = ndi.gaussian_filter(W, (0, 1.5, 1.5), mode=('nearest', 'nearest', 'wrap'))
Wv = W[:, iy, ix]; del W
Fw = np.fft.rfft(Wv, axis=0) * amp; Wt = np.fft.irfft(Fw, n=365, axis=0)
Wt = Wt / Wt.std(0, keepdims=True)
# 潜在ガウス波形 U(平均0・分散1)を、正規分布の値→雨量に変える(コピュラ): 雨が降る確率p=その場所・季節の雨の日割合、降るときの量は指数分布(平均=平年の日平均÷p)
Pe = np.nan_to_num(Pearth)                                                    # 2,365,N mm/日
pm = ndi.uniform_filter1d(Pe.mean(0), 31, axis=0, mode='wrap')               # 平年の日平均雨量
pp = ndi.uniform_filter1d((Pe >= 1).mean(0), 31, axis=0, mode='wrap').clip(0.01, 0.95)   # 平年の雨の日割合
from scipy.special import ndtr
u = ndtr(Wt)                                                                  # 0〜1に一様
wet = u > (1 - pp)
Psim = np.where(wet, pm / pp * (-np.log(np.clip((1 - u) / pp, 1e-9, 1))), 0.0)
# 比較(陸の面積加重・緯度帯別): 年降水 / 雨の日(1mm以上)% / 濡れ日平均 / 上位10日の割合%
wgt = np.cos(np.deg2rad(LAT[iy, ix]))
def stats(Pd):
    ann = Pd.sum(0); wet = (Pd >= 1).mean(0); wdm = np.where(Pd >= 1, Pd, np.nan); cnt = np.isfinite(wdm).sum(0); wdm = np.where(cnt > 0, np.nansum(wdm, 0) / np.maximum(cnt, 1), 0)
    top10 = np.sort(Pd, axis=0)[::-1][:10].sum(0) / np.maximum(ann, 1e-6)
    return ann, wet, np.nan_to_num(wdm), top10
E = stats(Pe[0]); Sm = stats(Psim)
print('緯度帯 | 年降水mm(地球/式) | 雨の日%(地球/式) | 濡れ日平均mm(地球/式) | 上位10日の割合%(地球/式)')
res = {}
for lo, hi in ((0, 15), (15, 30), (30, 45), (45, 60), (60, 70)):
    m = (la >= lo) & (la < hi); w = wgt[m]; wm = lambda x: float((x[m] * wgt[m]).sum() / w.sum())
    row = [(wm(E[i]) * (1 if i != 1 and i != 3 else 100), wm(Sm[i]) * (1 if i != 1 and i != 3 else 100)) for i in range(4)]
    res[f'{lo}-{hi}'] = [[round(a, 1), round(b, 1)] for a, b in row]
    print(f'{lo}-{hi}度 | ' + ' | '.join(f'{a:.0f}/{b:.0f}' if i == 0 else f'{a:.1f}/{b:.1f}' for i, (a, b) in enumerate(row)))
json.dump(res, open('wave_sim_result.json', 'w'), ensure_ascii=False, indent=1)

# 時間の組み立て: 前日との相関(平方根雨量)と、雨の日が続く長さ
def lag1(Pd):
    x = np.sqrt(Pd); x = x - x.mean(0); return float(((x[1:] * x[:-1]).sum() / (x * x).sum()))
def spell(Pd):                                                            # 雨の日の連続の平均の長さ
    w = (Pd >= 1); runs = []; 
    return float((w.sum() / np.maximum(((w[1:] == 1) & (w[:-1] == 0)).sum() + w[0].sum(), 1)))
print('前日との相関(平方根雨量, 全体)  地球 %.3f / 式 %.3f' % (lag1(Pe[0]), lag1(Psim)))
print('雨の日の連続の平均の長さ(日)      地球 %.2f / 式 %.2f' % (spell(Pe[0]), spell(Psim)))
