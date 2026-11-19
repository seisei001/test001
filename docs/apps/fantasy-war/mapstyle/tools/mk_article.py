# 記事の考え方を自前で再現した世界生成(概念のみ参考。コードは写していない)。
# 参考にした考え方:
#  - mewo2「Generating fantasy maps」: 点を置いて1回だけ整える→円錐・丘・傾きを足して高さ→分位点で海面→窪地を埋めて水を流し、
#    傾き×流量の平方根で侵食→海岸の細かい島をならす→流量が多い所に都市→移動コスト(上り坂・海岸)で領域を広げて国境
#  - Red Blob「polygon map generation」: 水域からの距離で湿度→気温と降水量から生物群系(Whittaker)
#  - pvigier「Vagabond」: 気温は北が寒い縦の傾きにノイズでゆがみ、降水は穏やかなノイズ、生物群系は気温と降水の表で
# 使い方: python3 mk_article.py <seed> <出力dir> [陸の割合 0.35]  → world-data.png と world-map.jpg(既存の処理にそのまま渡せる形)
import sys, os, json, time, heapq
import numpy as np
from scipy.spatial import Delaunay, cKDTree
from scipy.interpolate import LinearNDInterpolator
from PIL import Image

OUT_W, OUT_H = 1400, 900

def smooth_noise(rs, W, H, scale, n=1):
    g = rs.rand(int(H / scale) + 3, int(W / scale) + 3).astype(np.float32)
    import cv2
    a = cv2.resize(g, (W, H), interpolation=cv2.INTER_CUBIC)
    a = (a - a.min()) / (a.max() - a.min() + 1e-9)
    return a

def make(seed, outdir, land_frac=0.38, npts=16384):
    t0 = time.time(); rs = np.random.RandomState(seed)
    AW = OUT_W / OUT_H                                   # 横長の領域(縦を1とする)
    # ---- 1. 点を置いて1回だけ整える(Lloyd)
    P = np.column_stack([rs.rand(npts) * AW, rs.rand(npts)])
    S = np.column_stack([rs.rand(500000) * AW, rs.rand(500000)])
    _, idx = cKDTree(P).query(S)
    cnt = np.bincount(idx, minlength=npts).astype(np.float64); ok = cnt > 0; cnt[~ok] = 1
    P2 = np.column_stack([np.bincount(idx, S[:, 0], npts) / cnt, np.bincount(idx, S[:, 1], npts) / cnt])
    P = np.where(ok[:, None], P2, P)
    tri = Delaunay(P); ip, ind = tri.vertex_neighbor_vertices
    nb = [ind[ip[i]:ip[i + 1]] for i in range(npts)]
    # ---- 2. 高さ: 傾き・円錐・丘を足す → 0〜1にそろえる → 角を丸める → 近傍平均
    x, y = P[:, 0], P[:, 1]
    h = np.zeros(npts)
    ang = rs.uniform(0, 6.283); h += rs.uniform(0.1, 0.4) * ((x - AW / 2) * np.cos(ang) + (y - .5) * np.sin(ang))
    for _ in range(rs.randint(9, 14)):                   # 円錐(島や山)
        cx, cy = rs.uniform(0.2, AW - 0.2), rs.uniform(0.15, .85); r = rs.uniform(0.09, 0.24)
        h += rs.uniform(0.35, 0.9) * np.clip(1 - np.hypot(x - cx, y - cy) / r, 0, None)
    for _ in range(rs.randint(2, 4)):                    # 反転した円錐(湾・内海)
        cx, cy = rs.uniform(0.2, AW - 0.2), rs.uniform(0.2, .8); r = rs.uniform(0.08, 0.2)
        h -= rs.uniform(0.3, 0.7) * np.clip(1 - np.hypot(x - cx, y - cy) / r, 0, None)
    for _ in range(90):                                  # 丘(ばらまいて凹凸を作る)
        cx, cy = rs.uniform(0, AW), rs.uniform(0, 1); r = rs.uniform(0.03, 0.09)
        h += rs.uniform(-0.12, 0.2) * np.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * r * r))
    nzh = smooth_noise(rs, 140, 90, 9) * 0.6 + smooth_noise(rs, 140, 90, 4) * 0.4          # 海岸と地面をぎざぎざにする細かい凹凸
    gi = (np.clip(y * 90, 0, 89).astype(int), np.clip(x / AW * 140, 0, 139).astype(int))
    h += 0.55 * (nzh[gi] - 0.5)
    h = (h - h.min()) / (h.max() - h.min()); h = np.sqrt(h)
    edge = np.maximum(np.abs(2 * x / AW - 1), np.abs(2 * y - 1)) ** 6   # 端は必ず海にする
    h = h - 1.1 * edge
    def avg(h, k=1):
        for _ in range(k): h = 0.5 * h + 0.5 * np.array([h[n].mean() for n in nb])
        return h
    h = avg(h, 2)
    sea = np.quantile(h, 1 - land_frac); h = h - sea
    # ---- 3. 侵食: 窪地を埋める→流量→傾き×流量の平方根で削る
    def fill_flux(h):
        hf = h.copy(); done = np.zeros(npts, bool); q = []
        for i in range(npts):
            if h[i] <= 0: hf[i] = h[i]; done[i] = True; heapq.heappush(q, (hf[i], i))
        while q:
            v, i = heapq.heappop(q)
            for j in nb[i]:
                if not done[j]:
                    done[j] = True; hf[j] = max(h[j], v + 1e-5); heapq.heappush(q, (hf[j], j))
        order = np.argsort(-hf); rec = np.full(npts, -1); flux = np.where(h > 0, 1.0, 0.0)
        for i in order:
            if h[i] <= 0: continue
            nn = nb[i]; j = nn[np.argmin(hf[nn])]
            rec[i] = j; flux[j] += flux[i] if h[j] > 0 or True else 0
        return hf, rec, flux
    for it in range(3):
        hf, rec, flux = fill_flux(h)
        sl = np.zeros(npts)
        for i in range(npts):
            if rec[i] >= 0: sl[i] = max(hf[i] - hf[rec[i]], 0) / (np.hypot(*(P[i] - P[rec[i]])) + 1e-9)
        er = sl * np.sqrt(flux); er = np.minimum(er, np.quantile(er[h > 0], 0.98)); er = er / (er.max() + 1e-9) * 0.05
        h = np.where(h > 0, h - er, h)
        h = np.where(h > 0, np.maximum(h, 1e-4) , h)
        h = avg(h, 1) if it < 2 else h
        sea2 = np.quantile(h, 1 - land_frac * 0.97); h = h - sea2
    # ---- 海岸の整形: 周りの多数派と逆の点を反転(小さな島をなくす)
    for _ in range(3):
        isl = h > 0; flip = np.array([(isl[n].mean() > 0.7) != isl[i] and abs(isl[n].mean() - 0.5) > 0.3 for i, n in enumerate(nb)])
        h = np.where(flip, np.where(isl, -1e-3, 1e-3), h)
    hf, rec, flux = fill_flux(h)
    # ---- 4. 気候(Vagabond: 縦の傾き+ノイズ / Red Blob: 水域からの距離で湿度)
    W2, H2 = 140, 90
    nz = smooth_noise(rs, W2, H2, 12); nz2 = smooth_noise(rs, W2, H2, 7)
    def samp(a, pts): return a[np.clip((pts[:, 1] * H2).astype(int), 0, H2 - 1), np.clip((pts[:, 0] / AW * W2).astype(int), 0, W2 - 1)]
    wy = np.clip(y + 0.12 * (samp(nz, P) - 0.5), 0, 1)
    temp = 0.30 + 0.80 * wy - 0.35 * np.clip(h, 0, None) / max(h.max(), 1e-6)
    water = (h <= 0) | (flux > np.quantile(flux[h > 0], 0.93))
    dist = np.full(npts, 999.0); fr = list(np.nonzero(water)[0]); dist[fr] = 0
    while fr:
        nf = []
        for i in fr:
            for j in nb[i]:
                if dist[j] > dist[i] + 1: dist[j] = dist[i] + 1; nf.append(j)
        fr = nf
    hum = np.exp(-dist / 14.0)
    rain = 0.45 * samp(nz2, P) + 0.55 * hum
    rain = (rain - rain.min()) / (rain.max() - rain.min())
    # ---- 5. 生物群系 (Azgaar番号: 1暑い砂漠 2寒い砂漠 3サバンナ 4草原 5熱帯季節林 6温帯落葉樹林 7熱帯雨林 8温帯雨林 9タイガ 10ツンドラ 11氷河 12湿地)
    bio = np.zeros(npts, np.int32)
    L = h > 0
    t, r = temp, rain
    b = np.where(t < 0.14, 11, np.where(t < 0.28, np.where(r < 0.25, 2, 10),
        np.where(t < 0.45, np.where(r < 0.22, 2, 9),
        np.where(t < 0.68, np.where(r < 0.16, 2, np.where(r < 0.42, 4, np.where(r < 0.72, 6, 8))),
                 np.where(r < 0.2, 1, np.where(r < 0.42, 3, np.where(r < 0.66, 5, 7)))))))
    wet = (hf - h < 1e-3) & (flux > np.quantile(flux[L], 0.9)) & (h < 0.05) & (r > 0.5)
    b = np.where(wet, 12, b); bio[L] = b[L]
    # ---- 6. 都市(流量が多い所・既存の都市から離す・端から離す)→ 移動コストで領域を広げて国
    ncity = 13; cities = []
    base = np.log1p(flux) / np.log1p(flux[L].max()); base = np.where(L, base, -9)
    pen = np.zeros(npts)
    for _ in range(ncity):
        sc = base - pen - 0.5 * edge * 4
        i = int(np.argmax(sc)); cities.append(i)
        pen += 0.9 * np.exp(-np.hypot(x - x[i], y - y[i]) ** 2 / (2 * 0.07 ** 2))
    owner = np.full(npts, -1); cost = np.full(npts, 1e9); q = []
    for k, c in enumerate(cities): cost[c] = 0; owner[c] = k + 1; heapq.heappush(q, (0.0, c))
    while q:
        v, i = heapq.heappop(q)
        if v > cost[i]: continue
        for j in nb[i]:
            if h[j] <= 0: continue
            d = np.hypot(x[i] - x[j], y[i] - y[j]); up = h[j] - h[i]
            cj = v + d * (1 + (6 * up if up > 0 else -1.5 * up)) + (0.2 if flux[j] > np.quantile(flux[L], 0.95) else 0)
            if cj < cost[j]: cost[j] = cj; owner[j] = owner[i]; heapq.heappush(q, (cj, j))
    owner = np.where(L & (owner > 0), owner, 0)
    # ---- 7. 画素にする(高さは補間、群系・国は最も近い点)
    gx = (np.arange(OUT_W) + .5) / OUT_W * AW; gy = (np.arange(OUT_H) + .5) / OUT_H
    GX, GY = np.meshgrid(gx, gy)
    hh = np.where(h > 0, 20 + 80 * (np.clip(h, 0, None) / h.max()) ** 0.9, 20 * (1 - np.minimum(h, 0) / h.min()))
    hr = LinearNDInterpolator(tri, hh)(GX, GY); hr = np.nan_to_num(hr, nan=0.0)
    _, ni = cKDTree(P).query(np.column_stack([GX.ravel(), GY.ravel()]))
    bi = bio[ni].reshape(OUT_H, OUT_W); ow = owner[ni].reshape(OUT_H, OUT_W)
    land = (hr >= 20.5)
    bi = np.where(land, np.where(bi == 0, 4, bi), 0); ow = np.where(land, ow, 0)
    dat = np.dstack([np.clip(hr * 2.55, 0, 255), bi, ow]).astype(np.uint8)
    os.makedirs(outdir, exist_ok=True)
    Image.fromarray(dat).save(outdir + '/world-data.png')
    pal = np.array([[30, 70, 120], [236, 210, 150], [200, 190, 160], [190, 180, 90], [140, 190, 90], [60, 140, 70], [80, 150, 60], [30, 110, 60], [40, 120, 90], [60, 100, 70], [150, 160, 130], [240, 244, 248], [90, 140, 120]], np.uint8)
    img = pal[bi]; sh = np.clip((hr - 20) / 80, 0, 1)[..., None]; img = np.where(land[..., None], (img * (0.7 + 0.5 * sh)).clip(0, 255), pal[0]).astype(np.uint8)
    Image.fromarray(img).save(outdir + '/world-map.jpg', quality=85)
    # ---- 8. 世界の追加データ: 川(流量の多い所を線で)と都市の位置(絵の処理がこれを使う)
    import cv2
    rv = np.zeros((OUT_H, OUT_W), np.uint8); thr = np.quantile(flux[L], 0.94)
    toxy = lambda i: (int(P[i][0] / AW * OUT_W), int(P[i][1] * OUT_H))
    for i in np.nonzero(L & (flux > thr) & (rec >= 0) & (h > 0.03) & (h[np.maximum(rec, 0)] > 0.012))[0]:
        w = 1 + int(round(np.log(flux[i] / thr) * 0.9)); cv2.line(rv, toxy(i), toxy(rec[i]), 255, min(w, 4), cv2.LINE_AA)
    Image.fromarray(rv).save(outdir + '/rivers.png')
    cj = [dict(x=toxy(c)[0], y=toxy(c)[1], state=k + 1, flux=float(flux[c])) for k, c in enumerate(cities)]
    json.dump(dict(cities=cj), open(outdir + '/world-extra.json', 'w'), ensure_ascii=False)
    return dict(seed=seed, gen_sec=round(time.time() - t0, 2), land_pct=round(float(land.mean()) * 100, 1),
                biomes={int(k): round(float(v), 3) for k, v in zip(*np.unique(bi[land], return_counts=True)) for v in [v / land.sum()]},
                states=int(len(np.unique(ow)) - 1))

if __name__ == '__main__':
    print(json.dumps(make(int(sys.argv[1]), sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else 0.38), ensure_ascii=False))
