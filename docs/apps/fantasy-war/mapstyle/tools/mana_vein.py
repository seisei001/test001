# 魔力の地脈(ユーザー指示 11-21 17:27・19:01): ガウス揺らぎの場の「薄い所」が強くなり、周りの薄い所を通ってつながる線=地脈。
# 見せ方は後で決める(ここは地脈のデータを作る所だけ。確認用の絵は仮)。
# 使い方: python3 -I mana_vein.py <世界dir(world-data.png)> <出力の前置き> [種] [--min-dist 30] [--z -0.6]
# 出力: <前置き>_veins.json(結び目・つながり・線の点列。座標は世界データの画素) / _field.png(魔力の強さ。白=強い) / _overlay.png(仮の細い線・透明) / _check.jpg(地図+線)
import sys, os, json, numpy as np, cv2
from PIL import Image
from scipy.spatial import Delaunay
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import minimum_spanning_tree
from skimage.graph import route_through_array
from skimage.feature import peak_local_max

def gauss_field(h, w, seed, sig):
    rng = np.random.default_rng(seed); f = np.zeros((h, w), np.float32)
    for k, a in ((1.0, 1.0), (0.5, 0.45)):             # 大きな波+小さな波(ガウス揺らぎ)
        n = rng.standard_normal((h, w)).astype(np.float32)
        f += a * cv2.GaussianBlur(n, (0, 0), sig * k) / (cv2.GaussianBlur(n, (0, 0), sig * k).std() + 1e-9)
    return f

def build(wd, seed=1, min_dist=30, zthr=-0.6, loop_ratio=1.0):
    H0, W0 = wd.shape[:2]; bio = wd[..., 1]; R = wd[..., 0]; land0 = (bio > 0) & (R >= 20)
    s = 2; h, w = H0 // s, W0 // s                      # 作業は縦横半分の大きさ
    land = cv2.resize(land0.astype(np.uint8), (w, h), interpolation=cv2.INTER_NEAREST).astype(bool)
    F = gauss_field(h, w, seed, sig=0.035 * w)
    m, sd = F[land].mean(), F[land].std(); Z = (F - m) / sd   # 陸の上で標準化
    Zl = np.where(land, Z, 9.0)
    pk = peak_local_max(-Zl, min_distance=min_dist, threshold_abs=-zthr, exclude_border=False)  # 薄い所の中心=結び目
    pk = [(int(y), int(x)) for y, x in pk if land[y, x]]
    if len(pk) < 2: return dict(nodes=[], edges=[]), Z, land, (H0, W0)
    cost = np.where(land, np.exp(1.1 * np.clip(Z, -3, 3)), 1e6).astype(np.float64)   # 薄い所ほど通りやすい
    P = np.array([[x, y] for y, x in pk]); tri = Delaunay(P)
    pairs = set()
    for sm in tri.simplices:
        for i in range(3):
            a, b = int(sm[i]), int(sm[(i + 1) % 3]); pairs.add((min(a, b), max(a, b)))
    E = []
    for a, b in sorted(pairs):
        if np.hypot(*(P[a] - P[b])) > 0.30 * w: continue
        path, c = route_through_array(cost, pk[a], pk[b], fully_connected=True, geometric=True)
        if c >= 1e5: continue                               # 海をまたぐ線は作らない
        E.append((a, b, float(c), path))
    if not E: return dict(nodes=[], edges=[]), Z, land, (H0, W0)
    n = len(pk); mat = coo_matrix(([e[2] + 1e-6 for e in E], ([e[0] for e in E], [e[1] for e in E])), shape=(n, n))
    T = minimum_spanning_tree(mat).tocoo(); keep = {(min(int(i), int(j)), max(int(i), int(j))) for i, j in zip(T.row, T.col)}
    med = float(np.median([e[2] for e in E if (e[0], e[1]) in keep]))
    for e in E:                                                 # 木のほかに、安い道は輪(ループ)としても残す
        if (e[0], e[1]) not in keep and e[2] <= loop_ratio * med: keep.add((e[0], e[1]))
    nodes = [dict(x=int(x * s), y=int(y * s), z=round(float(Z[y, x]), 3), strength=round(float(np.clip(-Z[y, x] / 3, 0, 1)), 3)) for y, x in pk]
    edges = []
    for a, b, c, path in E:
        if (a, b) not in keep: continue
        pts = np.array([[x * s, y * s] for y, x in path], np.int32)
        ap = cv2.approxPolyDP(pts.reshape(-1, 1, 2), 2.0, False).reshape(-1, 2)
        st = float(np.mean([np.clip(-Z[y, x] / 3, 0, 1) for y, x in path]))
        edges.append(dict(a=a, b=b, cost=round(c, 2), strength=round(st, 3), pts=ap.tolist()))
    return dict(nodes=nodes, edges=edges), Z, land, (H0, W0)

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    opt = {a.split('=')[0]: a.split('=')[1] for a in sys.argv[1:] if a.startswith('--') and '=' in a}
    wdir, out = args[0].rstrip('/'), args[1]; seed = int(args[2]) if len(args) > 2 else 1
    wd = np.array(Image.open(wdir + '/world-data.png'))
    res, Z, land, (H0, W0) = build(wd, seed, int(opt.get('--min-dist', 30)), float(opt.get('--z', -0.6)))
    res.update(seed=seed, size=[W0, H0], note='座標は世界データ(world-data.png)の画素。strength=0〜1(魔力の強さ)。')
    json.dump(res, open(out + '_veins.json', 'w'), ensure_ascii=False)
    S = np.clip(-Z / 3, 0, 1) * land; S = cv2.resize(S, (W0, H0), interpolation=cv2.INTER_LINEAR)
    Image.fromarray((S * 255).astype(np.uint8)).save(out + '_field.png')
    ov = np.zeros((H0, W0, 4), np.uint8)
    for e in res['edges']:
        a = int(70 + 150 * e['strength']); cv2.polylines(ov, [np.array(e['pts'], np.int32).reshape(-1, 1, 2)], False, (200, 245, 255, 255), 2, cv2.LINE_AA)
    for nd in res['nodes']: cv2.circle(ov, (nd['x'], nd['y']), 5, (255, 255, 255, 255), -1, cv2.LINE_AA)
    Image.fromarray(ov, 'RGBA').save(out + '_overlay.png')
    hh = (wd[..., 0].astype(np.float32) / 255); base = np.zeros((H0, W0, 3), np.uint8); base[:] = (60, 90, 130); lm = (wd[..., 1] > 0) & (wd[..., 0] >= 20); base[lm] = (np.stack([120 + 110 * hh, 150 + 80 * hh, 90 + 100 * hh], -1)[lm]).astype(np.uint8); mp = Image.fromarray(base).convert('RGBA'); mp.alpha_composite(Image.fromarray(ov, 'RGBA')); mp.convert('RGB').save(out + '_check.jpg', quality=88)
    print('結び目', len(res['nodes']), 'つながり', len(res['edges']))
