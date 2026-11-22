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

def river_segs(g, W0, H0, shift, H, min_order=4, wet=None):
    """川の線分(x0,y0,x1,y1,幅)を返す。3Dでは帯(実寸の幅)にするために使う(伸びない川)。"""
    lon, lat, q, st, dn = g['rlon'], g['rlat'], g['rq'], g['rstr'], g['rdown']
    x = (((lon + 180) / 360 * W0 + shift) % W0).astype(np.float32); y = ((90 - lat) / 180 * H0).astype(np.float32)
    n = len(dn); root = np.where(dn >= 0, dn, np.arange(n))
    for _ in range(30): root = root[root]
    reach = np.ones(n, bool)
    if wet is not None:
        near = ndi.binary_dilation(wet, iterations=3)
        reach = near[np.clip(y[root].astype(int), 0, H0 - 1), np.clip(x[root].astype(int), 0, W0 - 1)]
    ok = (dn >= 0) & (st >= min_order) & reach; ok &= (dn != np.arange(n))
    i = np.nonzero(ok)[0]; j = dn[i]
    keep = (np.abs(x[i] - x[j]) < W0 / 2) & (st[j] >= min_order); i, j = i[keep], j[keep]
    wpx = np.clip(0.55 + 1.0 * np.log10(np.maximum(q, 30) / 30), 0.55, 3.2)
    hh = H[np.clip(y[i].astype(int), 0, H0 - 1), np.clip(x[i].astype(int), 0, W0 - 1)]
    vis = 1 - np.clip((hh - 78) / 14, 0, 1)
    m = vis >= 0.3; i, j, vis = i[m], j[m], vis[m]
    return x[i], y[i], x[j], y[j], wpx[j] * vis

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

def make(g, lake, land0, H, out, shift, seed=1, rivers_in_texture=False, min_order=int(__import__('os').environ.get('RIV_ORD', '4'))):
    H0, W0 = H.shape
    lk = lake.astype(bool); lkz = cv2.GaussianBlur(lk.astype(np.float32), (0, 0), 1.5)
    lki = np.clip(lkz * 1.6 - 0.25, 0, 1)
    # 湖の見せ方(ユーザー指示 11-23 00:56): 中=今の色、外周は海と同様に薄く(浅い縁の淡い帯)。小さな湖は目立たせず、大きな湖だけ濃淡(縁が浅く中心が深い)で目立たせる
    lab, nl = ndi.label(lk); area = np.bincount(lab.ravel(), minlength=nl + 1).astype(np.float32)
    edt = ndi.distance_transform_edt(lk); maxd = np.maximum(np.asarray(ndi.maximum(edt, lab, np.arange(nl + 1)), np.float32), 1.0)
    _, (iy, ix) = ndi.distance_transform_edt(~lk, return_indices=True); labn = lab[iy, ix]          # ぼかした縁も最寄りの湖に属させる
    big = np.clip((area - 60.0) / (400.0 - 60.0), 0, 1)[labn]                                       # 0=小さい湖 1=大きい湖(面積の画素数)
    depth = np.clip(edt / maxd[labn], 0, 1)
    shore = np.exp(-np.maximum(edt, 0) / 1.6) * lk                                                  # 外周の浅い縁(淡い帯)
    if rivers_in_texture: ink, fill = river_masks(g, W0, H0, shift, H, min_order, wet=(~land0) | lake)
    else: ink = fill = np.zeros((H0, W0), np.float32)      # 川は絵にせず、3Dで地形に沿う帯にする(絵だと急な面で伸びる 11-22 21:45)
    ink *= (1 - lki); fill *= (1 - lki)
    rgb = np.zeros((H0, W0, 3), np.float32); a = np.zeros((H0, W0), np.float32)
    rgb, a = over(rgb, a, (92, 150, 214), (0.40 + 0.55 * big) * lki)                                # 中=今の色(小さい湖は薄く)
    deep = (depth ** 0.9) * big                                                                     # 大きい湖だけ、中心ほど濃い青
    rgb, a = over(rgb, a, (34, 66, 160), 0.85 * deep * lki)
    rgb, a = over(rgb, a, (205, 228, 242), (0.22 + 0.36 * big) * shore * lki)                       # 外周: 海の浅瀬のように淡く
    rgb, a = over(rgb, a, (70, 130, 175), 0.5 * ink)                     # 墨色のふち
    rgb, a = over(rgb, a, (110, 205, 245), 0.97 * fill)                  # 青の川筋
    O = np.dstack([rgb[..., ::-1], a * 255]).astype(np.uint8)       # BGRA
    cv2.imwrite(out, O)
    return {'川の線の画素': int((fill > 0.3).sum()), '湖の画素': int((lki > 0.5).sum()), '湖の数': int(nl), '大きい湖(>=400画素)': int((area[1:] >= 400).sum()), '最小の順位': min_order}


def river_chains(g, W0, H0, shift, H, min_order, wet):
    """選んだ川の線分を、合流点までの一本の連なり(節点列と幅)にまとめる。"""
    lon, lat, q, st, dn = g['rlon'], g['rlat'], g['rq'], g['rstr'], g['rdown']
    x = (((lon + 180) / 360 * W0 + shift) % W0).astype(np.float32); y = ((90 - lat) / 180 * H0).astype(np.float32)
    n = len(dn); root = np.where(dn >= 0, dn, np.arange(n))
    for _ in range(30): root = root[root]
    near = ndi.binary_dilation(wet, iterations=3)
    reach = near[np.clip(y[root].astype(int), 0, H0 - 1), np.clip(x[root].astype(int), 0, W0 - 1)]
    ok = (dn >= 0) & (st >= min_order) & reach & (dn != np.arange(n))
    # 特徴的な川だけ選ぶ(ユーザー指示 11-22 22:01): 流域の最大の順位がbasin_min以上の大河の系統だけ描く
    rmax = np.zeros(n, np.int32); np.maximum.at(rmax, root, st.astype(np.int32))
    ok &= rmax[root] >= int(__import__('os').environ.get('RIV_BASIN', '6'))
    keep = np.zeros(n, bool); idx = np.nonzero(ok)[0]
    k2 = (np.abs(x[idx] - x[dn[idx]]) < W0 / 2) & (st[dn[idx]] >= min_order); ok[idx[~k2]] = False
    wpx = np.clip(0.55 + 1.0 * np.log10(np.maximum(q, 30) / 30), 0.55, 3.2)
    hh = H[np.clip(y.astype(int), 0, H0 - 1), np.clip(x.astype(int), 0, W0 - 1)]
    vis = 1 - np.clip((hh - 78) / 14, 0, 1); ok &= vis >= 0.3
    indeg = np.zeros(n, int); np.add.at(indeg, dn[ok], 1)
    chains = []
    heads = np.nonzero(ok & (indeg != 1))[0]            # 源流・合流の直後から始める
    for h in heads:
        c = [int(h)]; cur = int(h)
        while True:
            nx = int(dn[cur])
            c.append(nx)
            if not ok[nx] or indeg[nx] != 1: break          # 合流点か、選ばれない節点で終える(その点は含む)
            cur = nx
        chains.append(c)
    return x, y, wpx * vis, chains

def write_ribbons(g, land0, lake, H, shift, name, min_order=None, step=1.7, lift=0.7):
    """川を、地形の面の上に置く帯(実寸の幅)にして <name>_riv.json に書く。絵(UV)にしないので、急な面でも伸びない。
    形式: q=座標の倍率10、v=int16(x,y,z)の並びをbase64、c=連なりごとの(左右の対)の数。ビューアが x-w/2, z*VS, y-h/2 に置く。"""
    import json, base64, matplotlib.tri as mtri
    min_order = int(__import__('os').environ.get('RIV_ORD', '5')) if min_order is None else min_order
    H0, W0 = H.shape
    d = json.load(open(name + '.json')); P = np.array(d['p'], np.float64); F = np.array(d['f']).reshape(-1, 3)
    interp = mtri.LinearTriInterpolator(mtri.Triangulation(P[:, 0], P[:, 1], F), P[:, 2])
    x, y, w, chains = river_chains(g, W0, H0, shift, H, min_order, (~land0) | lake)
    WID = float(__import__('os').environ.get('RIV_WID', '1.8')); V = []; C = []   # 特徴的な川は太めに強調
    for ch in chains:
        a = np.array(ch); px, py, pw = x[a].astype(np.float64), y[a].astype(np.float64), w[a].astype(np.float64)
        pw[-1] = max(pw[-1], pw[-2] if len(pw) > 1 else 0)
        if len(px) < 2: continue
        seg = np.hypot(np.diff(px), np.diff(py)); s = np.concatenate([[0], np.cumsum(seg)])
        if s[-1] < 0.5: continue
        m = max(2, int(np.ceil(s[-1] / step)) + 1); t = np.linspace(0, s[-1], m)
        qx, qy, qw = np.interp(t, s, px), np.interp(t, s, py), np.interp(t, s, pw)
        dx, dy = np.gradient(qx), np.gradient(qy); nrm = np.hypot(dx, dy) + 1e-9; nx, ny = -dy / nrm, dx / nrm
        hw = qw * WID / 2
        lx, ly, rx, ry = qx + nx * hw, qy + ny * hw, qx - nx * hw, qy - ny * hw
        zl, zr, zc = interp(lx, ly), interp(rx, ry), interp(qx, qy)
        okp = ~(np.ma.getmaskarray(zl) | np.ma.getmaskarray(zr) | np.ma.getmaskarray(zc))
        zz = np.maximum(np.maximum(np.ma.filled(zl, 0), np.ma.filled(zr, 0)), np.ma.filled(zc, 0)) + lift
        run = []
        for k in range(m + 1):                                       # 面の外にかかる所で連なりを切る
            if k < m and okp[k]: run.append(k)
            else:
                if len(run) >= 2:
                    for r in run: V += [[lx[r], ly[r], zz[r]], [rx[r], ry[r], zz[r]]]
                    C.append(len(run))
                run = []
    V = np.round(np.array(V, np.float64) * 10).astype(np.int16)
    json.dump({'q': 10, 'v': base64.b64encode(V.tobytes()).decode(), 'c': C}, open(name + '_riv.json', 'w'), separators=(',', ':'))
    print({'帯の連なり': len(C), '頂点': int(len(V))})
