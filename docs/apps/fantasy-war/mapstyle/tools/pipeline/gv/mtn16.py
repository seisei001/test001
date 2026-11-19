# 山の絵(段階16): 「部品→群れ→山脈」方式の試作(ユーザー案の5工程のうち ①②③ と④の一部)。
# ①部品=Geminiの絵から切り出した画像(parts_scores.json)。各部品の「群れの点数」(8軸)を私の推論で付けた表を使う。
# ②その場所の地形の点数(8軸)を測り、向きの近さ(コサイン類似度)の高い部品を選んで置く。
# ③地形から色を決め、部品の明暗(線画)に色を載せる。④下の地面になじませる(足もとのぼかし・影)。
# 未実装: ⑤手前の地形を群れとして前に置く処理、合わない所の形の変更、火山性・浸食台地の地球の分布の率(今は仮の割合)。
import os, json, math
import numpy as np, cv2
from scipy import ndimage as ndi

_HERE = os.path.dirname(os.path.abspath(__file__))
_FW = os.path.abspath(os.path.join(_HERE, '..', '..', '..', '..'))      # apps/fantasy-war
_SC = os.path.abspath(os.path.join(_HERE, '..', '..', 'parts_scores.json'))
BAD = {'h15', 'h28', 'k28', 'k32', 'm26', 'm27', 'h19', 'h21', 'h35', 'k38', 'p25', 'k36', 'm08', 'm09', 'm10', 'm11', 'm12', 'n05', 'n10', 'p16', 'p17', 'h22', 'h16', 'h29', 'h14', 'h32', 'p21', 'p10', 'p19', 'p20', 'k29', 'k33'}   # 不自然に目立った部品(遺跡風の塔・樽形の台地・細い尖塔など)は選ばない
CATW = {'岩塔・柱': 0.4, '岩場・岩塊': 0.35, '台地・メサ': 0.3, '崖・地層': 0.6, '砂丘': 0.5, '火山': 0.6, '火口': 0.3, '草の丘': 0.6}
SKIP = {'砂漠の飾り', '混合の連なり', '峡谷'}
PAPER, INKC = 222.0, 33.0

def _load():
    J = json.load(open(_SC))
    P = []
    for r in J['parts']:
        if r['cat'] in SKIP or r['id'] in BAD: continue
        fp = os.path.join(_FW, r['img'])
        if not os.path.exists(fp): continue
        im = cv2.imread(fp, cv2.IMREAD_UNCHANGED)
        if im is None or im.shape[2] < 4: continue
        rgb = im[..., :3][..., ::-1].astype(np.float32); a = im[..., 3].astype(np.float32) / 255
        t = np.clip((rgb.mean(2) - INKC) / (PAPER - INKC), 0, 1)
        ys, xs = np.nonzero(a > 0.3)
        if len(ys) < 50: continue
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        P.append(dict(id=r['id'], cat=r['cat'], g=np.array(r['group'], np.float32), t=rgb[y0:y1, x0:x1], a=a[y0:y1, x0:x1]))
    return P

def _cos(u, V):
    nu = np.linalg.norm(u) + 1e-6; nv = np.linalg.norm(V, axis=1) + 1e-6
    return (V @ u) / (nu * nv)

def paint(img, Hh, land, bio, seed=1, scale=1.0, dens=0.55, hi=50.0, min_region=500, volc_rate=0.04, plat_rate=0.08):
    rs = np.random.RandomState(seed * 11 + 5)
    P = _load()
    if not P: return img, 0
    G = np.stack([p['g'] for p in P])
    H0, W0 = Hh.shape
    Hs = ndi.gaussian_filter(Hh, 1.5)
    core = (Hs >= hi) & land
    core = ndi.binary_opening(ndi.binary_closing(core, iterations=3), iterations=1)
    lab, nl = ndi.label(core)
    keep = [i + 1 for i in range(nl) if (lab == i + 1).sum() >= min_region]
    region = np.isin(lab, keep)
    if not region.any(): return img, 0
    hmax = max(np.percentile(Hh[land], 99.5), hi + 1)
    hn = np.clip((Hs - hi) / (hmax - hi), 0, 1)
    # ---- 地形の8軸(地図から測れるもの)
    gy, gx = np.gradient(ndi.gaussian_filter(Hh, 2.0))
    sl = np.hypot(gx, gy); sl = ndi.gaussian_filter(sl, 3)
    steep = np.clip(sl / (np.percentile(sl[region], 95) + 1e-6), 0, 1)
    cold = ndi.gaussian_filter(np.isin(bio, [2, 9, 10, 11]).astype(np.float32) * np.where(bio == 11, 1.0, 0.7), 8)
    dry = ndi.gaussian_filter(np.isin(bio, [1, 2, 3]).astype(np.float32), 8)
    wet = ndi.gaussian_filter(np.isin(bio, [4, 5, 6, 7, 8, 12]).astype(np.float32), 8)
    def field(sig):                                   # 滑らかな乱数の場(順位で0〜1にそろえる)
        f = ndi.gaussian_filter(rs.rand(H0, W0).astype(np.float32), sig)
        r = f[region]; q = np.argsort(np.argsort(r)) / max(len(r) - 1, 1)
        o = np.zeros_like(f); o[region] = q; return o
    fv = field(22); fp = field(26)
    volc = (fv >= 1 - volc_rate).astype(np.float32); volc = ndi.gaussian_filter(volc, 6); volc = np.clip(volc * 3, 0, 1)
    plat = ((fp >= 1 - plat_rate * (0.6 + 1.6 * dry))).astype(np.float32); plat = ndi.gaussian_filter(plat, 6); plat = np.clip(plat * 3, 0, 1)
    ground = cv2.GaussianBlur(img, (0, 0), 10)
    gbase = cv2.GaussianBlur(img, (0, 0), 2.5)
    clump = ndi.gaussian_filter(rs.rand(H0, W0).astype(np.float32), 18); clump = (clump - clump.min()) / (clump.max() - clump.min() + 1e-6)
    dist = ndi.distance_transform_edt(region)
    items = []
    for rid in keep:
        m = lab == rid; ys, xs = np.nonzero(m)
        y = ys.min() + 6
        while y <= ys.max() + 14:
            row = np.nonzero(m[min(int(y), H0 - 1)])[0]
            if len(row):
                x = row.min() + rs.uniform(0, 20)
                while x <= row.max() + 4:
                    xi, yi = int(min(x, W0 - 1)), int(min(y, H0 - 1))
                    if m[yi, xi] and clump[yi, xi] > 0.25 + 0.25 * rs.rand():
                        c = min(dist[yi, xi] / 24.0, 1.0)
                        wd = (34 + 150 * hn[yi, xi] ** 1.2 + 18 * c) * (0.6 + 0.8 * clump[yi, xi]) * rs.uniform(0.75, 1.3) * scale
                        v = np.array([hn[yi, xi] * 0.8 + 0.2 * c, steep[yi, xi], cold[yi, xi], dry[yi, xi], wet[yi, xi], volc[yi, xi], plat[yi, xi], 1 - steep[yi, xi]], np.float32)
                        items.append((y, x, wd, v, hn[yi, xi]))
                        x += wd * rs.uniform(0.45, 0.8)
                    else:
                        x += 6
            y += 16 * rs.uniform(0.8, 1.2) / math.sqrt(dens)
    items.sort(key=lambda a: a[0])
    out = img.copy().astype(np.float32); n = 0; used = {}
    for (by, bx, wd, v, hnv) in items:
        cs = _cos(v, G)
        # 火山性・浸食台地の場の上では、その種類を強める(場=地球の分布の率で当てはめる前提の仮の値)
        top = np.argsort(-cs)[:10]
        w = np.exp((cs[top] - cs[top].max()) / 0.05)
        for j, ti in enumerate(top):
            cw = CATW.get(P[ti]['cat'], 1.0)
            if P[ti]['cat'] == '台地・メサ': cw *= 0.4 + 2.5 * v[6]
            if P[ti]['cat'] == '火山': cw *= 0.3 + 2.5 * v[5]
            if P[ti]['cat'] in ('砂丘',): cw *= 0.3 + 1.5 * v[3]
            w[j] *= cw / (1 + used.get(P[ti]['id'], 0) * 0.15)
        w /= w.sum(); p = P[top[rs.choice(len(top), p=w)]]
        used[p['id']] = used.get(p['id'], 0) + 1
        t, a = p['t'], p['a']
        hh, ww = t.shape[:2]
        sc = wd / ww
        sc = min(sc, 210.0 / hh) if hh > 0 else sc
        nw, nh = max(8, int(ww * sc)), max(6, int(hh * sc))
        if nw < 10 or nh < 6: continue
        ts = cv2.resize(t, (nw, nh), interpolation=cv2.INTER_AREA); as_ = cv2.resize(a, (nw, nh), interpolation=cv2.INTER_AREA)
        # ---- ③色: 色は元の地図(下の地面の色)による。部品からは線と明暗(絵)だけを使う
        x0, y0 = int(bx - nw / 2), int(by - nh)
        ya, yb, xa, xb = max(y0, 0), min(y0 + nh, H0), max(x0, 0), min(x0 + nw, W0)
        if ya >= yb or xa >= xb: continue
        sy, sx = ya - y0, xa - x0; ey, ex = sy + (yb - ya), sx + (xb - xa)
        lum = ts.mean(2)
        tt = np.clip((lum - INKC) / (PAPER - INKC), 0, 1)
        shade = (0.30 + 0.95 * np.clip((tt - 0.20) / 0.80, 0, 1) ** 0.8)[..., None]
        shade = np.where(tt[..., None] < 0.20, 0.22 + 0.4 * tt[..., None], shade)
        gb = ground[ya:yb, xa:xb]
        col = np.zeros((nh, nw, 3), np.float32)
        col[sy:ey, sx:ex] = np.clip(gb * shade[sy:ey, sx:ex] * 1.22 + 10, 0, 255)
        # ④足もとのぼかし(地面になじませる)
        fade = np.ones(nh, np.float32); k = max(3, int(nh * 0.30)); fade[-k:] = np.linspace(1, 0.0, k) ** 1.2
        al = (as_ * fade[:, None])[..., None]
        # 影(右下)
        sh = np.zeros((nh, nw), np.float32); cv2.ellipse(sh, (nw // 2 + int(nw * 0.08), nh - 2), (int(nw * 0.5), max(2, int(nh * 0.06))), 0, 0, 360, 1.0, -1)
        sh = cv2.GaussianBlur(sh, (0, 0), 2.0)
        reg = out[ya:yb, xa:xb]
        reg *= (1 - 0.22 * sh[sy:ey, sx:ex, None])
        aa = al[sy:ey, sx:ex]
        out[ya:yb, xa:xb] = reg * (1 - aa) + col[sy:ey, sx:ex] * aa
        n += 1
    return out, n
