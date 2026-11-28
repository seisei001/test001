# 洪水の危うさ(簡易・ガウス版)。ユーザー指示 11-29 02:04/02:07。絵は作らず、数と地球の分布との照合だけ。
# 洪水の危うさ = 雨の強さ(多雨月+前の月の湿り+融雪) × 土地の当てはまり度(低い平地・窪み・海岸の低地・急斜面)。各項はガウスの山。係数は【仮】。
# 使い方: python3 -I climate_flood.py <_P.npy等のあるディレクトリ> <world-data.png> <出力json>
import sys, json, numpy as np
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
import climate_base as cb
from scipy import ndimage as ndi
G = lambda x, mu, sd: np.exp(-0.5 * ((x - mu) / sd) ** 2)
d, wd, out = sys.argv[1], sys.argv[2], sys.argv[3]
P = np.load(d + '/_P.npy'); T = np.load(d + '/_T.npy')
land, H = cb.load(wd); h, w = land.shape
lat = cb.lat_rows(h)[:, None] * np.ones((1, w))
elev = np.where(land, np.clip((H - 20.3) / (100 - 20.3), 0, 1) * cb.ELEV_TOP_KM, 0.0)
cell = cb.CIRC_KM / w
slope = np.hypot(*np.gradient(ndi.gaussian_filter(elev, 1.0))) / (cell * np.cos(np.deg2rad(lat)).clip(0.05, None)) * 1000  # m/km 相当(粗い)
dist = ndi.distance_transform_edt(land) * cell
# 土地の当てはまり度
low = G(elev, 0.0, 0.4)                                    # 低地(標高0〜0.4km)
flat = G(slope, 0.0, 40.0)                                 # 平ら
plain = low * flat                                         # 氾濫原・低い平野
dent = np.clip(-(elev - ndi.gaussian_filter(elev, 6)) / 0.3, 0, 1)   # 周りより低い窪み・谷底
coast = G(dist, 0.0, 150.0) * G(elev, 0.0, 0.15)           # 海岸低地(出口を塞がれやすい)
flash = np.clip((slope - 40) / 120, 0, 1)                  # 急斜面=鉄砲水
fit = np.clip(np.maximum.reduce([plain, 0.8 * dent * G(elev, 0.5, 1.5), 0.8 * coast, 0.5 * flash]), 0, 1)
# 雨の強さ
Pm = P.max(0)                                              # 最多雨月(mm)
prev = np.roll(P, 1, axis=0)
wet = np.take_along_axis(prev, P.argmax(0)[None], 0)[0]    # その前の月の雨=土の湿り
melt = np.zeros_like(Pm)
for m in range(12):
    melt = np.maximum(melt, np.clip((T[m] + 2) / 8, 0, 1) * np.clip(-T[m - 1] / 8 + 0.2, 0, 1))  # 凍→融けの月(融雪)
rain = 1 - np.exp(-Pm / 200.0)                             # 多雨月が大きいほど1に近づく
soil = 1 - np.exp(-wet / 120.0)
power = np.clip(rain * (0.6 + 0.4 * soil) + 0.35 * melt * (1 - np.exp(-P.sum(0) / 300)), 0, 1)
score = np.where(land, power * fit, 0.0)
area = np.cos(np.deg2rad(lat)).clip(0.05, None)
L = land & (np.abs(lat) < 60) | land  # 全陸(南極相当は下で除外)
Lm = land & (lat > -60)                                    # 南極を除く
res = {'share_land_excl_antarctica': {}}
for th in (0.1, 0.2, 0.3, 0.4, 0.5, 0.6):
    res['share_land_excl_antarctica'][str(th)] = float(((score > th) * area)[Lm].sum() / area[Lm].sum())
res['mean_score_by_lat'] = {}
for a in range(-60, 90, 15):
    m = land & (lat >= a) & (lat < a + 15)
    if m.sum(): res['mean_score_by_lat'][f'{a}~{a+15}'] = round(float(((score > 0.2) * area)[m].sum() / area[m].sum()), 3)
# 気候帯別(年降水)の洪水域率
Pa = P.sum(0)
for nm, m in (('乾燥(<250mm)', Pa < 250), ('半乾燥(250-600)', (Pa >= 250) & (Pa < 600)), ('湿潤(600-1500)', (Pa >= 600) & (Pa < 1500)), ('多雨(>1500)', Pa >= 1500)):
    mm = land & m & (lat > -60)
    res.setdefault('share_by_rain', {})[nm] = round(float(((score > 0.2) * area)[mm].sum() / max(area[mm].sum(), 1e-9)), 3)
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1); print(json.dumps(res, ensure_ascii=False, indent=1))
