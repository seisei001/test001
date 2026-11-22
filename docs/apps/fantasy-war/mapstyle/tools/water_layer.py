# 川と湖を、地図と同じ位置(UV同位置)の透明な層(RGBA)にする(11-22 21:30 改)。
# 川=PWGの川の網(蛇行・合流・三角州つきの線データ)を線で描く。支流が本流へ合流し、下流ほど太くなる(流量の対数で太さ)=ファンタジー地図の川の約束。
# 描き方: 墨色のふち(薄い)+青の川筋。山の稜線の雪の上には描かない(源流は山の中腹から出す)。湖=青灰の面+細い墨の縁。
import numpy as np, cv2
from scipy import ndimage as ndi

def over(rgb, a, col, b):
    oa = b + a * (1 - b)
    out = (np.array(col, np.float32) * b[..., None] + rgb * (a * (1 - b))[..., None]) / np.maximum(oa, 1e-6)[..., None]
    return out, oa

def load_graph(pre):
    g = {k: np.fromfile(f'{pre}_{k}.bin', t) for k, t in [('rlon', np.float32), ('rlat', np.float32), ('rq', np.float32), ('rstr', np.uint8), ('rdown', np.int32)]}
    return g

def river_masks(g, W0, H0, shift, H, min_order=3, S=4, wet=None):
    """川の線を W0xH0 の S倍の細かさで描き、(ふち, 川筋)の2枚の濃さ(0〜1)を返す。"""
    lon, lat, q, st, dn = g['rlon'], g['rlat'], g['rq'], g['rstr'], g['rdown']
    x = (((lon + 180) / 360 * W0 + shift) % W0).astype(np.float32); y = ((90 - lat) / 180 * H0).astype(np.float32)
    n = len(dn); root = np.where(dn >= 0, dn, np.arange(n))
    for _ in range(30): root = root[root]                              # 各節点が最後に行き着く節点(川口)
    reach = np.ones(n, bool)
    if wet is not None:                                                # 海か湖に注ぐ川だけ描く(途中で消える川は描かない=ファンタジー地図の約束)
        near = ndi.binary_dilation(wet, iterations=3)
        reach = near[np.clip(y[root].astype(int), 0, H0 - 1), np.clip(x[root].astype(int), 0, W0 - 1)]
    ok = (dn >= 0) & (st >= min_order) & reach; ok &= (dn != np.arange(n))
    i = np.nonzero(ok)[0]; j = dn[i]
    keep = (np.abs(x[i] - x[j]) < W0 / 2) & (st[j] >= min_order)         # 左右の端をまたぐ線・下流が小さい支流の端は描かない
    i, j = i[keep], j[keep]
    wpx = np.clip(0.55 + 1.0 * np.log10(np.maximum(q, 30) / 30), 0.55, 3.2)   # 下流ほど太く(1400幅で0.55〜3.2画素。縮尺どおりでなく見やすさ優先)
    # 山の雪の上は消す(源流は山の中腹から)。高さ78で薄れ92で消える
    hh = H[np.clip(y[i].astype(int), 0, H0 - 1), np.clip(x[i].astype(int), 0, W0 - 1)]
    vis = 1 - np.clip((hh - 78) / 14, 0, 1)
    ink = np.zeros((H0 * S, W0 * S), np.float32); fill = np.zeros_like(ink)
    order = np.argsort(wpx[i])                                          # 細い線を先に、太い本流を後に描く
    for k in order:
        if vis[k] < 0.3: continue
        a, b = i[k], j[k]; p0 = (int(round(x[a] * S)), int(round(y[a] * S))); p1 = (int(round(x[b] * S)), int(round(y[b] * S)))
        w = float(wpx[b]) * float(vis[k])                               # 太さは下流側の節点で決める=なめらかに太る
        cv2.line(ink, p0, p1, 1.0, max(1, int(round((w + 0.8) * S))), cv2.LINE_AA)
        cv2.line(fill, p0, p1, 1.0, max(1, int(round(w * S))), cv2.LINE_AA)
    ink = cv2.resize(ink, (W0, H0), interpolation=cv2.INTER_AREA); fill = cv2.resize(fill, (W0, H0), interpolation=cv2.INTER_AREA)
    return np.clip(ink * 1.5, 0, 1), np.clip(fill * 1.8, 0, 1)

def make(g, lake, land0, H, out, shift, seed=1, min_order=int(__import__('os').environ.get('RIV_ORD', '4'))):
    H0, W0 = H.shape
    lkz = cv2.GaussianBlur(lake.astype(np.float32), (0, 0), 1.5)
    lki = np.clip(lkz * 1.6 - 0.25, 0, 1); ring = np.clip(1 - np.abs(lkz - 0.5) * 5, 0, 1)
    ink, fill = river_masks(g, W0, H0, shift, H, min_order, wet=(~land0) | lake)
    ink *= (1 - lki); fill *= (1 - lki)
    rgb = np.zeros((H0, W0, 3), np.float32); a = np.zeros((H0, W0), np.float32)
    rgb, a = over(rgb, a, (120, 176, 196), 0.92 * lki)
    rgb, a = over(rgb, a, (70, 90, 100), 0.6 * ring * (lkz > 0.05))
    rgb, a = over(rgb, a, (52, 66, 84), 0.55 * ink)                     # 墨色のふち
    rgb, a = over(rgb, a, (84, 142, 190), 0.95 * fill)                  # 青の川筋
    O = np.dstack([rgb[..., ::-1], a * 255]).astype(np.uint8)       # BGRA
    cv2.imwrite(out, O)
    return {'川の線の画素': int((fill > 0.3).sum()), '湖の画素': int((lki > 0.5).sum()), '最小の順位': min_order}
