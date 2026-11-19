# 山の配置(段階17): 「山塊(主峰+脇の峰)→稜線でつなぐ→手前に丘→奥にかすみ」で並べる。乱数の格子置きはやめる。
# 研究: 主稜線に沿って峰を並べる(mapstyle4)・高い所ほど大きく尖る・0.618倍ずつ低くなる脇の峰(mapstyle10)・
#       Geminiの山=3〜8個の群れで前後に重なり足もとはなじむ(STATE 11-19)。形の選び方は点数表のコサイン類似度(段階16と同じ)。
import math
import numpy as np, cv2
from scipy import ndimage as ndi
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pipeline', 'gv'))
import mtn16
MAIN = {'非対称・肩の峰': 1.0, '鋭い尖峰': 1.0, '双峰・大きな群れ': 1.0, '低く広い雪山': 0.8, '氷河の山': 0.8, '尖った小峰の群れ': 0.7, '火山': 0.5, '台地・メサ': 0.4, '岩場・岩塊': 0.2}
SAT = {'尖った小峰の群れ': 1.0, '小峰の連なり': 1.0, '非対称・肩の峰': 0.7, '鋭い尖峰': 0.5, '丘陵の連なり': 0.6, '双峰・大きな群れ': 0.4}
RIDGE = {'長い山脈': 1.0, '小峰の連なり': 0.8, '丘陵の連なり': 0.5}
FOOT = {'丘陵の連なり': 1.0, '草の丘': 0.8, '小峰の連なり': 0.6, '砂丘': 0.5}

def plan(Hh, land, bio, seed=1, hi=50.0, min_region=500, scale=1.0, volc_rate=0.04, plat_rate=0.08):
    rs = np.random.RandomState(seed * 7 + 3)
    P = mtn16._load()
    G = np.stack([p['g'] for p in P]); cats = np.array([p['cat'] for p in P])
    H0, W0 = Hh.shape
    Hs = ndi.gaussian_filter(Hh, 1.5)
    core = ndi.binary_opening(ndi.binary_closing((Hs >= hi) & land, iterations=3), iterations=1)
    lab, nl = ndi.label(core); keep = [i + 1 for i in range(nl) if (lab == i + 1).sum() >= min_region]
    region = np.isin(lab, keep)
    if not region.any(): return [], region
    hmax = max(np.percentile(Hh[land], 99.5), hi + 1); hn = np.clip((ndi.gaussian_filter(Hh, 3) - hi) / (hmax - hi), 0, 1)
    gy, gx = np.gradient(ndi.gaussian_filter(Hh, 2.0)); sl = ndi.gaussian_filter(np.hypot(gx, gy), 3)
    steep = np.clip(sl / (np.percentile(sl[region], 95) + 1e-6), 0, 1)
    cold = ndi.gaussian_filter(np.isin(bio, [2, 9, 10, 11]).astype(np.float32) * np.where(bio == 11, 1.0, 0.7), 8)
    dry = ndi.gaussian_filter(np.isin(bio, [1, 2, 3]).astype(np.float32), 8)
    wet = ndi.gaussian_filter(np.isin(bio, [4, 5, 6, 7, 8, 12]).astype(np.float32), 8)
    def fld(sig):
        f = ndi.gaussian_filter(rs.rand(H0, W0).astype(np.float32), sig); r = f[region]; q = np.argsort(np.argsort(r)) / max(len(r) - 1, 1)
        o = np.zeros_like(f); o[region] = q; return o
    volc = np.clip(ndi.gaussian_filter((fld(22) >= 1 - volc_rate).astype(np.float32), 6) * 3, 0, 1)
    plat = np.clip(ndi.gaussian_filter((fld(26) >= 1 - plat_rate * (0.6 + 1.6 * dry)).astype(np.float32), 6) * 3, 0, 1)
    ys_all = {rid: np.nonzero(lab == rid)[0] for rid in keep}
    zone_y = {rid: (v.min(), v.max()) for rid, v in ys_all.items()}
    used = {}
    def vec(y, x):
        y = min(max(int(y), 0), H0 - 1); x = min(max(int(x), 0), W0 - 1)
        return np.array([hn[y, x] * 0.8 + 0.2, steep[y, x], cold[y, x], dry[y, x], wet[y, x], volc[y, x], plat[y, x], 1 - steep[y, x]], np.float32), hn[y, x]
    def pick(v, cw, big=False):
        cs = mtn16._cos(v, G); idx = np.nonzero(np.isin(cats, list(cw)))[0]
        if len(idx) == 0: return None
        top = idx[np.argsort(-cs[idx])[:6]]; w = np.exp((cs[top] - cs[top].max()) / 0.05)
        for j, t in enumerate(top):
            c = cats[t]; w[j] *= cw[c]
            if c == '台地・メサ': w[j] *= 0.4 + 2.5 * v[6]
            if c == '火山': w[j] *= 0.3 + 2.5 * v[5]
            if c == '砂丘': w[j] *= 0.3 + 1.5 * v[3]
            w[j] /= (1 + used.get(P[t]['id'], 0) * 0.25)
        w /= w.sum(); t = top[rs.choice(len(top), p=w)]; used[P[t]['id']] = used.get(P[t]['id'], 0) + 1; return P[t]['id']
    # ---- 山塊の中心: 高い所から順に、主峰の幅の約半分ずつ離して選ぶ
    Hs6 = ndi.gaussian_filter(Hh, 5); cand = (Hs6 == ndi.maximum_filter(Hs6, size=21)) & region
    cy, cx = np.nonzero(cand); order = np.argsort(-Hs6[cy, cx]); peaks = []
    for i in order:
        y, x = cy[i], cx[i]; h = hn[y, x]; w = (62 + 130 * h ** 1.1) * scale
        if all((x - px) ** 2 + (y - py) ** 2 > (0.20 * (w + pw)) ** 2 for (py, px, pw, ph, _) in peaks):
            peaks.append((y, x, w, h, int(lab[y, x])))
    items = []
    def add(y, x, pid, w, h, rid, kind='mtn', haze=0.0, foot=0.22, shadow=0.22, hmax=230):
        if pid is None: return
        y0, y1 = zone_y.get(rid, (y, y)); t = min(1.0, max(0.0, (y - y0) / max(1, y1 - y0)))                 # 地帯の中の奥行き(0=奥,1=手前)
        hz = haze + 0.14 * (1 - t) ** 1.3 * (1 - h * 0.6)
        items.append(dict(y=y, x=x, pid=pid, w=float(w), kind=kind, haze=float(hz), foot=foot, shadow=shadow, hmax=hmax))
    for (y, x, w, h, rid) in peaks:
        v, hv = vec(y, x)
        main = pick(v, MAIN)
        if main is None: continue
        add(y + 0.14 * w, x, main, w, h, rid, haze=0.0, foot=0.09, shadow=0.14, hmax=220)
        # 脇の峰: 左右に0.618倍ずつ小さく(重ねる)
        for side in (-1, 1):
            ww = w; off = 0.0
            for k in range(rs.randint(2, 4)):
                ww *= 0.72 * rs.uniform(0.9, 1.15); off += (0.5 * (ww / 0.618) + 0.3 * ww) * rs.uniform(0.7, 1.0)
                sx_ = x + side * off; sy_ = y + rs.uniform(-0.06, 0.10) * w
                v2, h2 = vec(sy_, sx_)
                add(sy_ + 0.12 * ww, sx_, pick(v2, SAT), ww, h2, rid, haze=0.03 * (k + 1), foot=0.13, shadow=0.12)
        # 奥のかすみの峰(1個)と、手前のふもとの丘(1〜2個)
        bx = x + rs.uniform(-0.3, 0.3) * w; by = y - 0.22 * w
        v2, h2 = vec(by, bx)
        if rs.rand() < 0.8: add(by + 0.1 * w, bx, pick(v2, SAT), w * 0.7, h2, rid, haze=0.12, foot=0.2, shadow=0.06)
        for k in range(rs.randint(1, 3)):
            fx = x + rs.uniform(-0.6, 0.6) * w; fy = y + (0.28 + 0.12 * k) * w
            v2, h2 = vec(fy, fx)
            add(fy, fx, pick(v2, FOOT), w * rs.uniform(0.4, 0.62), h2 * 0.5, rid, kind='hill', foot=0.3, shadow=0.0, hmax=70)
    # ---- 稜線: 近い山塊どうしを、小さな峰の連なりでつなぐ(最も近い2つまで)
    for i, (y, x, w, h, rid) in enumerate(peaks):
        ds = sorted([(math.hypot(x - px, y - py), j) for j, (py, px, pw, ph, r2) in enumerate(peaks) if j != i and r2 == rid])[:1]
        for d, j in ds:
            if j < i and any(True for _ in ()): continue
            py, px, pw, ph, _ = peaks[j]
            if d < 0.45 * (w + pw) or d > 2.4 * (w + pw): continue
            n = max(1, int(d / (0.5 * (w + pw) * 0.55)))
            for k in range(1, n + 1):
                f = k / (n + 1); rx = x + (px - x) * f; ry = y + (py - y) * f + 4
                if not region[min(int(ry), H0 - 1), min(int(rx), W0 - 1)]: continue
                v2, h2 = vec(ry, rx); ww = (w * (1 - f) + pw * f) * 0.5
                add(ry + 0.1 * ww, rx, pick(v2, RIDGE), ww, h2, rid, haze=0.06, foot=0.2, shadow=0.08, hmax=120)
    # ---- すき間(山塊から遠い山地)に小さな峰をまばらに
    occ = np.zeros((H0, W0), np.uint8)
    for (y, x, w, h, rid) in peaks: cv2.circle(occ, (int(x), int(y)), int(0.55 * w), 1, -1)
    free = region & (occ == 0); free = ndi.binary_erosion(free, iterations=3)
    fy, fx = np.nonzero(free)
    if len(fy):
        for i in rs.choice(len(fy), min(len(fy) // 450, 600), replace=False):
            y, x = fy[i], fx[i]; v, hv = vec(y, x); ww = (36 + 70 * hv) * scale * rs.uniform(0.8, 1.2)
            add(y, x, pick(v, SAT), ww, hv, int(lab[y, x]), haze=0.05, foot=0.22, shadow=0.08, hmax=110)
    return items, region
