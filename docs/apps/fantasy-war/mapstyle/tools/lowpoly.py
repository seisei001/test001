# 地形をローポリの立体にして描く(段階18): 絵を描く技法のプログラム再現。
# ユーザー案(11-20): 一番高い稜線から手前へ少しずつ距離を変えて並べ、投稿線(断面の線)のように立体を作る。形は山並みらしくデフォルメして
#  立体化する。陰は「左斜め上から光が当たったらどう付くか」を立体に対して計算する(ローポリの面ごとの陰)。ローポリの輪郭が稜線になる。
#  山だけでなく全部の地形を同じ手法で、遠景から近景へ(奥から手前へ)描く。色は下地の種類(群系)で決める。
# デフォルメ=平均でならさず、頂を拾って(最大値)・高い所はより尖らせ・低い所はより平らに・面を粗くする。
import os, numpy as np, cv2
from scipy import ndimage as ndi
from scipy.spatial import Delaunay

BASE = {1: (226, 198, 136), 2: (212, 202, 172), 3: (205, 190, 120), 4: (160, 192, 104), 5: (128, 170, 88), 6: (122, 168, 90), 7: (96, 150, 84), 8: (108, 156, 100),
        9: (104, 140, 104), 10: (176, 186, 160), 11: (236, 242, 246), 12: (126, 160, 120)}
ROCK = np.array([158, 140, 112], np.float32); SNOW = np.array([244, 246, 250], np.float32)
INK = np.array([62, 46, 34], np.float32)
LIGHT = np.array([-0.55, -0.55, 0.63], np.float32); LIGHT /= np.linalg.norm(LIGHT)       # 左斜め上から

def paint(img, Hh, land, bio, seed=1, spacing=10, zmax=64.0, levels=4, out_ink=True):
    rs = np.random.RandomState(seed * 5 + 1)
    spacing = spacing * float(os.environ.get('FM_LP_SPMUL', '1.0'))      # 面の数を変える倍率(面を半分=1.414)
    H0, W0 = Hh.shape; img = img.astype(np.float32).copy()
    # ---- 地形のデフォルメ: 平均でならさず、近くの最大(頂・稜線)を拾い、高い所は尖らせ、低い所は平らにする
    Hl = np.where(land, Hh, 0).astype(np.float32)
    hmax = max(np.percentile(Hh[land], 99.7), 60.0)
    Hmx = ndi.gaussian_filter(ndi.maximum_filter(Hl, size=13), 2.0)       # 頂・稜線を拾う
    Hsm = ndi.gaussian_filter(Hl, 7.0)                                    # 低地は大きくならして平らに
    hx = np.clip((Hmx - 20) / (hmax - 20), 0, 1)
    wm = np.clip((hx - 0.25) / 0.3, 0, 1)                                 # 山らしさ: 0=低地 1=山
    Hm = Hsm * (1 - wm) + Hmx * wm
    hn = np.clip((Hm - 20) / (hmax - 20), 0, 1)
    z = zmax * (hn ** 2.0) * (1 + 0.9 * hn ** 2.0) * (0.25 + 0.75 * wm)  # 山は高く尖らせ、低地は低く
    gentle = os.environ.get('FM_LP_GENTLE', '0') == '1'
    if gentle:
        # ゆるい3D(11-20 ユーザー案): 最大値で頂を広げない。地図全体を軽くならした高さでゆるく盛り上げ、
        # 高い山が集まる所(高い所の密度が高い所)だけ、少し強調する。
        Hg = ndi.gaussian_filter(Hl, 2.5)
        hn = np.clip((Hg - 20) / (hmax - 20), 0, 1)
        dens = ndi.gaussian_filter((hn > 0.5).astype(np.float32), 22.0)       # 高い所が集まっている度合い
        d0 = float(os.environ.get('FM_LP_D0', '0.12')); we = np.clip((dens - d0) / 0.25, 0, 1) * np.clip((hn - 0.35) / 0.25, 0, 1)   # 強調: 山が集まる所の高い部分だけ
        z = zmax * float(os.environ.get('FM_LP_BASE', '0.45')) * hn ** 1.3 * (1 + float(os.environ.get('FM_LP_EMPH', '1.0')) * we)   # 既定=mapstyle38。mapstyle39は 0.62 / 0.55
        wm = np.maximum(we, np.clip((hn - 0.5) / 0.3, 0, 1)); Hm = Hg
    z = np.where(land, z, 0).astype(np.float32)
    zden = (np.percentile(z[land], 99.5) if gentle else zmax * 1.9)
    pts = []
    sp = spacing * float(os.environ.get('FM_LP_SP', '2.6'))                # 低地: 大きな面(mapstyle40は1.3=目の細かさ2倍)
    for y in np.arange(-sp, H0 + sp, sp):
        for x in np.arange(-sp, W0 + sp, sp):
            pts.append((x + rs.uniform(-0.4, 0.4) * sp, y + rs.uniform(-0.4, 0.4) * sp))
    sp2 = spacing * 0.9                                                   # 山: 細かい面
    for y in np.arange(0, H0, sp2):
        for x in np.arange(0, W0, sp2):
            yy, xx = int(min(y, H0 - 1)), int(min(x, W0 - 1))
            if wm[yy, xx] > 0.3: pts.append((x + rs.uniform(-0.4, 0.4) * sp2, y + rs.uniform(-0.4, 0.4) * sp2))
    if gentle and os.environ.get('FM_LP_RING', '0') == '1':
        # 山の縁(山の範囲のまわりの帯): 低地の目と山の目の中間の細かさにする
        core = wm > 0.3; ring = ndi.binary_dilation(core, iterations=14) & ~core
        spr = (sp + sp2) / 2
        for y in np.arange(0, H0, spr):
            for x in np.arange(0, W0, spr):
                yy, xx = int(min(y, H0 - 1)), int(min(x, W0 - 1))
                if ring[yy, xx]: pts.append((x + rs.uniform(-0.4, 0.4) * spr, y + rs.uniform(-0.4, 0.4) * spr))
    pk = (Hm == ndi.maximum_filter(Hm, size=21)) & (hn > 0.3)
    py, px = np.nonzero(pk); pts += [(x, y) for x, y in zip(px, py)]
    # 海岸の点(海岸を面で縁取る)
    edgem = land & ~ndi.binary_erosion(land, iterations=2)
    ey, ex = np.nonzero(edgem); sel = rs.rand(len(ey)) < 0.02; pts += [(x, y) for x, y in zip(ex[sel], ey[sel])]
    P = np.array(pts, np.float32); P[:, 0] = np.clip(P[:, 0], 0, W0 - 1); P[:, 1] = np.clip(P[:, 1], 0, H0 - 1)
    P = np.unique(P.round(1), axis=0)
    zi = np.clip(P[:, 1].astype(int), 0, H0 - 1); xi = np.clip(P[:, 0].astype(int), 0, W0 - 1)
    Z = z[zi, xi]
    tri = Delaunay(P).simplices
    A, B, C = P[tri[:, 0]], P[tri[:, 1]], P[tri[:, 2]]
    cen = (A + B + C) / 3; cy = np.clip(cen[:, 1].astype(int), 0, H0 - 1); cx = np.clip(cen[:, 0].astype(int), 0, W0 - 1)
    keep = land[cy, cx]
    za, zb, zc = Z[tri[:, 0]], Z[tri[:, 1]], Z[tri[:, 2]]
    # ---- 面の向きと陰(左斜め上から): 地図の上=奥、画面の下=手前。縦の高さは画面で上へ立ち上がる
    e1 = np.stack([B[:, 0] - A[:, 0], B[:, 1] - A[:, 1], (zb - za) * 1.0], 1); e2 = np.stack([C[:, 0] - A[:, 0], C[:, 1] - A[:, 1], (zc - za) * 1.0], 1)
    n = np.cross(e1, e2); n[n[:, 2] < 0] *= -1; n /= (np.linalg.norm(n, axis=1, keepdims=True) + 1e-6)
    lam = np.clip(n @ LIGHT, 0, 1)
    shade = 1.0 + 1.05 * (lam - 0.63); shade = np.clip(np.round(shade * levels * 1.5) / (levels * 1.5), 0.5, 1.3)               # 陰を少数の段にする(単純に)
    # ---- 色: 下地の種類(群系)で決め、高いほど岩・雪へ
    cb = bio[cy, cx]; hzn = (za + zb + zc) / 3 / zden
    base = np.array([BASE.get(int(b), (150, 170, 110)) for b in cb], np.float32)
    cold = np.isin(cb, [2, 9, 10, 11])
    rock_t = np.clip((hzn - 0.30) / 0.35, 0, 1)[:, None]; col = base * (1 - rock_t) + ROCK * rock_t
    snow_t = np.clip((hzn - np.where(cold, 0.45, 0.78)) / 0.15, 0, 1)[:, None]; col = col * (1 - snow_t) + SNOW * snow_t
    col = col * shade[:, None] * rs.uniform(0.99, 1.01, (len(tri), 1))
    uv = os.environ.get('FM_LP_UV', '0') == '1'
    if uv:
        # 面のUV加工: 地図の平面(UV=地図上の位置)に色の絵(テクスチャ)を作り、各面にその一部を貼って色を付ける。陰は面ごとに掛ける。
        lut = np.zeros((16, 3), np.float32)
        for k in range(16): lut[k] = BASE.get(k, (150, 170, 110))
        T = lut[np.clip(bio, 0, 15)].copy()
        hz = np.clip((Hh - 20) / (hmax - 20), 0, 1); coldm = np.isin(bio, [2, 9, 10, 11])
        rt = np.clip((hz - 0.30) / 0.30, 0, 1)[..., None]; T = T * (1 - rt) + ROCK * rt
        st_ = np.clip((hz - np.where(coldm, 0.45, 0.75)) / 0.15, 0, 1)[..., None]; T = T * (1 - st_) + SNOW * st_
        nz = sum(ndi.gaussian_filter(rs.randn(H0, W0).astype(np.float32), s) * a for s, a in ((1.0, 0.5), (3.0, 1.2), (8.0, 1.6)))
        nz = nz / (np.abs(nz).max() + 1e-6)
        # 急な面ほど絵が平面貼りで伸びるので、細かい模様(ノイズ)を弱める(11-22 21:45)。傾きは3D表示の高さ倍率1.1で測る
        gy_, gx_ = np.gradient(ndi.gaussian_filter(Hh.astype(np.float32), 1.2)); sl2 = 1.0 + (1.1 * np.hypot(gx_, gy_)) ** 2
        nzf = np.clip(1.0 / sl2, 0.12, 1.0)
        T = np.clip(T * (1 + 0.30 * (nz * nzf)[..., None]), 0, 255)
        ov = os.environ.get('FM_LP_OVERLAY', '')
        if ov:
            # 透明な層(地図と同じ位置=UV同位置の絵。例: 森の下地+木)をテクスチャに重ねる。面に貼られ、面の陰が掛かる(ユーザー案 11-21)
            O = cv2.imread(ov, cv2.IMREAD_UNCHANGED)
            if O is not None and O.shape[2] == 4:
                if O.shape[:2] != (H0, W0): O = cv2.resize(O, (W0, H0), interpolation=cv2.INTER_AREA)
                oa = (O[..., 3:4].astype(np.float32) / 255) * float(os.environ.get('FM_LP_OVA', '1.0'))
                T = T * (1 - oa) + O[..., 2::-1].astype(np.float32) * oa
        T8 = T.astype(np.uint8)[..., ::-1].copy()
    dump = os.environ.get('FM_LP_DUMP', '')
    if dump and uv:
        # 3D表示用に、面(位置・高さ・面の並び)とテクスチャを書き出す(three.jsの試作が読む)
        import json
        fi = np.nonzero(keep)[0]; used = np.unique(tri[fi].ravel()); remap = -np.ones(len(P), int); remap[used] = np.arange(len(used))
        json.dump({'w': W0, 'h': H0, 'zmax': float(zmax), 'p': [[round(float(P[k, 0]), 1), round(float(P[k, 1]), 1), round(float(Z[k]), 1)] for k in used],
                   'f': remap[tri[fi]].ravel().tolist()}, open(dump + '.json', 'w'), separators=(',', ':'))
        cv2.imwrite(dump + '.jpg', T8, [cv2.IMWRITE_JPEG_QUALITY, 82])
    # ---- 奥(地図の上)から手前(下)へ重ねる。高さは画面の上へ
    kv = 0.9
    def proj(Q, zz): return np.stack([Q[:, 0], Q[:, 1] - zz * kv], 1)
    SA, SB, SC = proj(A, za), proj(B, zb), proj(C, zc)
    depth = np.maximum(np.maximum(A[:, 1], B[:, 1]), C[:, 1]) + 0.01 * cen[:, 0]
    order = np.argsort(depth)
    cv8 = np.clip(img, 0, 255).astype(np.uint8)[..., ::-1].copy()
    # 稜線(輪郭): 面の陰が大きく変わる辺・手前が奥の山を隠す辺に細い墨線を引く
    from collections import defaultdict
    edge = defaultdict(list)
    for i in range(len(tri)):
        for a, b in ((0, 1), (1, 2), (2, 0)):
            k = tuple(sorted((int(tri[i, a]), int(tri[i, b])))); edge[k].append(i)
    crease = {}
    for k, fs in edge.items():
        if len(fs) == 2:
            i, j = fs; d = abs(shade[i] - shade[j]); zz = (Z[k[0]] + Z[k[1]]) / 2 / zmax
            crease[k] = d > 0.2 and zz > 0.2
    for i in order:
        if not keep[i]: continue
        poly = np.array([SA[i], SB[i], SC[i]]); c = tuple(int(v) for v in np.clip(col[i], 0, 255)[::-1])
        pi = np.round(poly * 16).astype(np.int32)
        if uv:
            sp3 = poly.astype(np.float32); x0b = int(max(np.floor(sp3[:, 0].min()) - 1, 0)); y0b = int(max(np.floor(sp3[:, 1].min()) - 1, 0))
            x1b = int(min(np.ceil(sp3[:, 0].max()) + 2, W0)); y1b = int(min(np.ceil(sp3[:, 1].max()) + 2, H0))
            if x1b <= x0b or y1b <= y0b: continue
            M = cv2.getAffineTransform(np.array([A[i], B[i], C[i]], np.float32), sp3 - np.array([x0b, y0b], np.float32))
            wp = cv2.warpAffine(T8, M, (x1b - x0b, y1b - y0b), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            wp = np.clip(wp.astype(np.float32) * float(shade[i]), 0, 255)
            mk = np.zeros((y1b - y0b, x1b - x0b), np.uint8); cv2.fillConvexPoly(mk, np.round((poly - np.array([x0b, y0b])) * 16).astype(np.int32), 255, lineType=cv2.LINE_AA, shift=4)
            a_ = (mk.astype(np.float32) / 255)[..., None]; reg = cv8[y0b:y1b, x0b:x1b].astype(np.float32)
            cv8[y0b:y1b, x0b:x1b] = (reg * (1 - a_) + wp * a_).astype(np.uint8)
        else:
            cv2.fillConvexPoly(cv8, pi, c, lineType=cv2.LINE_AA, shift=4)
        if out_ink:
            for a, b in ((0, 1), (1, 2), (2, 0)):
                k = tuple(sorted((int(tri[i, a]), int(tri[i, b]))))
                if crease.get(k, False):
                    p1 = np.round(proj(P[[k[0]]], Z[[k[0]]])[0] * 16).astype(np.int32); p2 = np.round(proj(P[[k[1]]], Z[[k[1]]])[0] * 16).astype(np.int32)
                    cv2.line(cv8, tuple(p1), tuple(p2), tuple(int(v) for v in (INK * 0.9)[::-1]), 1, cv2.LINE_AA, shift=4)
    return cv8[..., ::-1].astype(np.float32), int(keep.sum())
