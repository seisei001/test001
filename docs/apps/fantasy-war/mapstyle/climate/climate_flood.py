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
# 地形で地球の洪水の場所を真似る: 水の流れ(D8)で川=集水の大きい筋、川からの高さ(HAND)=氾濫原
import heapq
def fill_and_flow(E, land):
    """低い所へ流す。海に出るまで。窪みは周りの最も低い縁まで埋めて流す(優先度つき埋め立て)。戻り値=集水(上流のマス数)"""
    h, w = E.shape; Z = E.copy(); done = np.zeros((h, w), bool); order = []
    heap = []
    for y in range(h):
        for x in range(w):
            if not land[y, x]:
                continue
            pass
    # 海に接する陸から外へ広げる
    sea = ~land
    for y, x in zip(*np.nonzero(land & ndi.binary_dilation(sea, np.ones((3, 3), bool), border_value=0))):
        heapq.heappush(heap, (Z[y, x], y, x)); done[y, x] = True
    down = np.full((h, w, 2), -1, np.int32)
    while heap:
        z, y, x = heapq.heappop(heap); order.append((y, x))
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy == 0 and dx == 0: continue
                yy, xx = y + dy, (x + dx) % w
                if yy < 0 or yy >= h or done[yy, xx] or not land[yy, xx]: continue
                done[yy, xx] = True; Z[yy, xx] = max(Z[yy, xx], z + 1e-4)
                down[yy, xx] = (y, x); heapq.heappush(heap, (Z[yy, xx], yy, xx))
    acc = np.ones((h, w), np.float64) * land
    for y, x in reversed(order):
        dy, dx = down[y, x]
        if dy >= 0: acc[dy, dx] += acc[y, x]
    return acc
acc = fill_and_flow(elev + 1e-3 * ndi.gaussian_filter(np.random.RandomState(0).randn(h, w), 1), land)
river = land & (acc > 300)                                   # 川=上流が300マス(約1万km2)超
hand_d, (iy, ix) = ndi.distance_transform_edt(~river, return_indices=True)
HAND = np.where(land, elev - elev[iy, ix], 0.0)              # 一番近い川からの高さ(km)
fp = G(np.clip(HAND, 0, None), 0.0, 0.15) * np.clip(np.log10(acc[iy, ix]) / 3.5, 0, 1)   # 川の近くで低い所ほど氾濫原。大河ほど大きい
fp = np.where(land, fp, 0.0)
# 土地の当てはまり度
low = G(elev, 0.0, 0.4)                                    # 低地(標高0〜0.4km)
flat = G(slope, 0.0, 40.0)                                 # 平ら
plain = low * flat                                         # 氾濫原・低い平野
dent = np.clip(-(elev - ndi.gaussian_filter(elev, 6)) / 0.3, 0, 1)   # 周りより低い窪み・谷底
coast = G(dist, 0.0, 150.0) * G(elev, 0.0, 0.15)           # 海岸低地(出口を塞がれやすい)
flash = np.clip((slope - 40) / 120, 0, 1)                  # 急斜面=鉄砲水
fit = np.clip(np.maximum.reduce([fp, 0.6 * plain, 0.8 * dent * G(elev, 0.5, 1.5), 0.8 * coast, 0.5 * flash]), 0, 1)
# 雨の強さ(月ごと)。月ごとに作り直し、年の危うさ=12か月の最大
Pa = P.sum(0); MELT_W = 0.7                                # 融雪の重み【仮】(0.35から強めた)
score_m = []
for m in range(12):
    rain = 1 - np.exp(-P[m] / 200.0)                       # その月の雨
    soil = 1 - np.exp(-P[m - 1] / 120.0)                   # 前の月の雨=土の湿り
    melt = np.clip((T[m] + 2) / 8, 0, 1) * np.clip(-T[m - 1] / 8 + 0.2, 0, 1) * (1 - np.exp(-Pa / 300))   # 凍→融けの月
    score_m.append(np.where(land, np.clip(rain * (0.6 + 0.4 * soil) + MELT_W * melt, 0, 1) * fit, 0.0))
score_m = np.array(score_m); score = score_m.max(0)
area = np.cos(np.deg2rad(lat)).clip(0.05, None)
L = land & (np.abs(lat) < 60) | land  # 全陸(南極相当は下で除外)
Lm = land & (lat > -60)                                    # 南極を除く
TH = 0.4                                                   # 洪水と呼ぶ線【固定・仮】。世界平均には合わせない(地形の形で地球を真似る)
res = {'threshold_fixed': TH, 'share_land_excl_antarctica': {}}
for th in (TH,):
    res['share_land_excl_antarctica'][str(th)] = float(((score > th) * area)[Lm].sum() / area[Lm].sum())
res['mean_score_by_lat'] = {}
for a in range(-60, 90, 15):
    m = land & (lat >= a) & (lat < a + 15)
    if m.sum(): res['mean_score_by_lat'][f'{a}~{a+15}'] = round(float(((score > TH) * area)[m].sum() / area[m].sum()), 3)
# 気候帯別(年降水)の洪水域率
for nm, m in (('乾燥(<250mm)', Pa < 250), ('半乾燥(250-600)', (Pa >= 250) & (Pa < 600)), ('湿潤(600-1500)', (Pa >= 600) & (Pa < 1500)), ('多雨(>1500)', Pa >= 1500)):
    mm = land & m & (lat > -60)
    res.setdefault('share_by_rain', {})[nm] = round(float(((score > TH) * area)[mm].sum() / max(area[mm].sum(), 1e-9)), 3)
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1); print(json.dumps(res, ensure_ascii=False, indent=1))
