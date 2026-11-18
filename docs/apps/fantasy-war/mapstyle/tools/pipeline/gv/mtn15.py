# 山の絵(段階15): 下の地図の絵・高さの細部を無視し、山の「記号」を独立に描いて載せる。
# 位置と大きさの目安だけを高さ(山岳地帯)から取り、形・陰・線はこのプログラムが決める。
# 手本=Geminiの山(非対称な裾広がりの峰・明るい面と暗い面・頂上から扇状の筋・暗い輪郭・重なり)。
import numpy as np, cv2, math
from scipy import ndimage as ndi
S = 3  # 描くときの拡大率(縮めて滑らかにする)

def _n1(rs, n, scale):
    """1次元のなめらかな乱数(0〜1)"""
    k = max(2, int(n / scale) + 2); a = rs.rand(k)
    return np.interp(np.linspace(0, k - 1, n), np.arange(k), a)

def _fbm2(rs, H_, W_, scales):
    o = np.zeros((H_, W_), np.float32); tot = 0
    for sc, am in scales:
        a = rs.rand(max(2, int(H_ / sc) + 2), max(2, int(W_ / sc) + 2)).astype(np.float32)
        o += am * cv2.resize(a, (W_, H_), interpolation=cv2.INTER_CUBIC); tot += am
    return o / tot

def sprite(hw, h, rs, snow=0.5, tint=None, xa_frac=None, shoulder=True):
    """1つの峰。単位=最終画素。戻り: (rgb[H,W,3] float, alpha[H,W]), 原点(底の中心)の位置(ox,oy)(最終画素)"""
    pad = 6
    b = 0.13 * h                                   # 底のふくらみ(下向き)
    Wf = int(2 * hw + 2 * pad); Hf = int(h * 1.08 + b + 2 * pad)
    ox = Wf / 2.0; oy = h * 1.08 + pad
    W_, H_ = Wf * S, Hf * S
    xs = (np.arange(W_) + 0.5) / S - ox
    ys = (np.arange(H_) + 0.5) / S - oy
    X, Y = np.meshgrid(xs, ys)
    xa = (rs.uniform(-0.22, 0.22) if xa_frac is None else xa_frac) * hw
    pl, pr = rs.uniform(1.15, 1.55), rs.uniform(1.0, 1.35)   # 外側へふくらむ裾(大きいほど凹)
    # 輪郭 top(x): 頂点から左右へ(1-|u|)^p
    prof = np.zeros_like(xs)
    for i, x in enumerate(xs):
        if x < xa:
            u = (xa - x) / (hw + xa + 1e-6)
            prof[i] = max(0.0, 1 - u) ** pl if u < 1 else 0
        else:
            u = (x - xa) / (hw - xa + 1e-6)
            prof[i] = max(0.0, 1 - u) ** pr if u < 1 else 0
    # 肩(小さな副峰)
    if shoulder and rs.rand() < 0.7:
        sx = xa + rs.choice([-1, 1]) * rs.uniform(0.35, 0.6) * hw
        sw = rs.uniform(0.30, 0.45) * hw; sh = rs.uniform(0.38, 0.6)
        u = np.abs(xs - sx) / sw
        prof = np.maximum(prof, sh * np.clip(1 - u, 0, 1) ** 1.3 * (np.abs(xs) < hw))
    nz = (_n1(rs, len(xs), 9.0 * S) - 0.5) * 0.16 + (_n1(rs, len(xs), 3.0 * S) - 0.5) * 0.05
    prof = np.clip(prof * (1 + nz), 0, None)
    top = -h * prof                                    # 負=上
    edge_ok = np.abs(xs) < hw
    bottom = b * np.sqrt(np.clip(1 - (xs / hw) ** 2, 0, 1))
    A = (Y >= top[None, :]) & (Y <= bottom[None, :]) & edge_ok[None, :] & (prof[None, :] > 0.004)
    # 高さの割合 t (底=0, 頂点=1)
    span = (bottom - top)[None, :] + 1e-6
    T = np.clip((bottom[None, :] - Y) / span, 0, 1) * np.clip(prof[None, :] * h / (h + 1e-6) / max(prof.max(), 1e-6), 0, 1) ** 0 
    Tabs = np.clip((bottom[None, :] - Y) / (h + b), 0, 1)           # 絶対の高さの割合(0〜1)
    # 稜線(頂点から底へ曲がって下りる線): 左=明るい面 / 右=暗い面
    bend = rs.uniform(-0.18, 0.18) * hw
    wob = (_n1(rs, H_, 10.0 * S) - 0.5) * 0.10 * hw
    xr = xa + bend * (1 - Tabs) * 1.0 + wob[:, None] * 0 
    wobY = wob[:, None]
    xr = xa + bend * (1 - Tabs) + wobY * (1 - Tabs)
    d = (X - xr)                                        # 負=明るい面
    soft = 0.05 * hw
    sh = np.clip(d / soft * 0.5 + 0.5, 0, 1)            # 0=明るい 1=暗い
    # 色
    cream = np.array([234, 227, 210], np.float32); white = np.array([253, 252, 248], np.float32)
    shade_l = np.array([206, 196, 176], np.float32)
    dark = np.array([172, 158, 142], np.float32); dark2 = np.array([124, 108, 92], np.float32)
    if tint is not None:
        t_ = np.asarray(tint, np.float32)
        cream = cream * 0.80 + t_ * 0.20; shade_l = shade_l * 0.7 + t_ * 0.3; dark = dark * 0.80 + t_ * 0.14
    snowline = 0.58 - 0.36 * snow                         # 雪が多いほど低い所から白
    sn = np.clip((Tabs - snowline) / 0.18, 0, 1)
    # 明るい面: 底は暗めのクリーム→上へ明るく。雪は上だけ(真っ白にしない)。まだら
    m1 = _fbm2(rs, H_, W_, [(5 * S, 1.0), (13 * S, 0.8)])
    tone = 0.78 + 0.22 * np.clip(Tabs * 1.6, 0, 1)
    litc = cream[None, None, :] * tone[..., None]
    litc = litc * (0.88 + 0.22 * m1[..., None])
    litc = litc * (1 - 0.16 * np.exp(np.clip(d, -1e3, 0) / (0.35 * hw)))[..., None]
    gray = np.clip((m1 - 0.62) / 0.2, 0, 1) * 0.45                    # 灰色のにじみ
    litc = litc * (1 - gray[..., None]) + np.array([172, 166, 158], np.float32) * gray[..., None]
    snowc = np.array([247, 245, 239], np.float32)
    litc = litc * (1 - sn[..., None] * 0.9) + snowc * (0.93 + 0.08 * m1[..., None]) * sn[..., None] * 0.9
    # 暗い面: 頂点からの扇状の筋(角度に沿った乱数)
    ang = np.arctan2(X - xa, (Y + h) + 1e-3)
    k = 7.0 + 5.0 * rs.rand(); a0 = rs.rand() * 10
    st = 0.5 * np.sin(ang * k * 3 + a0 + 2 * np.sin(Y / (hw * 0.6))) + 0.5 * np.sin(ang * k * 7.3 + a0 * 1.7)
    st = np.clip(0.5 + 0.5 * st + (m1 - 0.5) * 0.5, 0, 1) ** 1.2
    shc = dark2[None, None, :] * (1 - st[..., None]) + dark * st[..., None]
    shc = shc * (0.78 + 0.34 * np.clip(Tabs * 1.4, 0, 1)[..., None])
    sn2 = np.clip((Tabs - snowline - 0.15) / 0.25, 0, 1) * 0.5
    shc = shc * (1 - sn2[..., None]) + (snowc * 0.78)[None, None, :] * sn2[..., None]
    # 裾: 地面の色へなじむ茶色の帯(明暗どちらにも)
    sk = np.clip(1 - Tabs / 0.32, 0, 1) ** 1.2
    skc = (tint if tint is not None else np.array([150, 120, 84], np.float32)) * 0.55 + np.array([140, 112, 76], np.float32) * 0.45
    litc = litc * (1 - 0.75 * sk[..., None]) + skc * (0.95 + 0.1 * m1[..., None]) * 0.75 * sk[..., None]
    shc = shc * (1 - 0.7 * sk[..., None]) + skc * 0.62 * 0.7 * sk[..., None]
    # 面の分かれ(頂点から扇形に区切り、面ごとに明暗を変える。境目に細い線)
    secw = rs.uniform(0.30, 0.46); q = (ang + (m1 - 0.5) * 0.30) / secw
    sid = np.floor(q); frac = q - sid
    rr = np.abs(np.sin(sid * 12.9898 + a0 * 3.1) * 43758.5453) % 1.0
    off = (rr - 0.5) * 0.30
    litc = litc * (1 + off[..., None]); shc = shc * (1 + off[..., None] * 0.8)
    rad = np.hypot(X - xa, Y + h)
    bnd = np.clip(1 - np.minimum(frac, 1 - frac) * secw * rad / (0.8 + 0.0 * rad), 0, 1) * np.clip(rad / (0.12 * h), 0, 1)
    rgb = litc * (1 - sh[..., None]) + shc * sh[..., None]
    rgb = rgb * (1 - bnd[..., None] * (0.30 + 0.25 * sh[..., None])) + np.array([70, 54, 44], np.float32) * bnd[..., None] * (0.30 + 0.25 * sh[..., None])
    alpha = A.astype(np.float32)
    fadeb = np.clip((Tabs + (m1 - 0.5) * 0.10) / 0.06, 0, 1)
    alpha = alpha * fadeb
    # 輪郭: 暗い面側=濃く太く / 明るい面側=薄く細く
    Am = A.astype(np.uint8)
    er1 = cv2.erode(Am, np.ones((int(1.9 * S) | 1,) * 2, np.uint8)); ring1 = (Am - er1).astype(np.float32)
    er2 = cv2.erode(Am, np.ones((int(0.7 * S) | 1,) * 2, np.uint8)); ring2 = (Am - er2).astype(np.float32)
    ink = np.array([84, 66, 52], np.float32)
    rgb = rgb * (1 - ring1[..., None] * sh[..., None] * 0.95) + ink * ring1[..., None] * sh[..., None] * 0.95
    rgb = rgb * (1 - ring2[..., None] * (1 - sh)[..., None] * 0.5) + (ink * 1.3) * ring2[..., None] * (1 - sh)[..., None] * 0.5
    # 稜線(頂点から底へ): 暗い細線
    xr_line = xa + bend * (1 - np.linspace(0, 1, 60)) * 1.0
    pts = []
    for tt in np.linspace(0, 1, 60):                   # 頂点→底
        yy = (-h * prof[np.argmin(np.abs(xs - xa))]) + tt * (h * prof[np.argmin(np.abs(xs - xa))] + 0.6 * b)
        xx = xa + bend * tt + (_n1(rs, 61, 20)[int(tt * 60)] - 0.5) * 0.10 * hw * tt
        pts.append(((xx + ox) * S, (yy + oy) * S))
    line = np.zeros((H_, W_), np.float32)
    cv2.polylines(line, [np.array(pts, np.int32)], False, 1.0, max(1, int(1.1 * S)), cv2.LINE_AA)
    # 暗い面に追加の筋(頂点から斜めに2〜3本)
    for _ in range(rs.randint(2, 4)):
        e = rs.uniform(0.25, 0.9) * hw * rs.choice([1])
        top_y = (-h * prof[np.argmin(np.abs(xs - xa))])
        p0 = ((xa + 0.02 * hw + ox) * S, (top_y + 0.05 * h + oy) * S)
        p1 = ((xa + e * 0.5 + ox) * S, (top_y + 0.45 * h + oy) * S)
        p2 = ((xa + e + ox) * S, (0.2 * b + oy) * S)
        q = np.array([[(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]] for t in np.linspace(0, 1, 40)], np.int32)
        l2 = np.zeros((H_, W_), np.float32); cv2.polylines(l2, [q], False, 1.0, max(1, int(0.9 * S)), cv2.LINE_AA)
        line = np.maximum(line, l2 * 0.75)
    line = line * A
    rgb = rgb * (1 - line[..., None] * 0.65) + ink * line[..., None] * 0.65
    # 影(接地): 底の下にやわらかい暗い楕円(別層)
    sd = np.zeros((H_, W_), np.float32)
    cv2.ellipse(sd, (int(ox * S), int((oy + 0.55 * b) * S)), (int(hw * 1.02 * S), int(max(b * 0.9, 2.0) * S)), 0, 0, 360, 1.0, -1, cv2.LINE_AA)
    sd = cv2.GaussianBlur(sd, (0, 0), 1.6 * S) * 0.42
    # 縮小(プリマルチプライ)
    pre = np.concatenate([rgb * alpha[..., None], alpha[..., None]], 2)
    pre = cv2.resize(pre, (Wf, Hf), interpolation=cv2.INTER_AREA)
    sdr = cv2.resize(sd, (Wf, Hf), interpolation=cv2.INTER_AREA)
    a = pre[..., 3]
    col = pre[..., :3] / np.maximum(a[..., None], 1e-4)
    return col, a, sdr, (ox, oy)

def _paste(img, col, a, sdr, ox, oy, bx, by):
    Hf, Wf = a.shape
    x0 = int(round(bx - ox)); y0 = int(round(by - oy))
    xs0, ys0 = max(x0, 0), max(y0, 0); xs1, ys1 = min(x0 + Wf, img.shape[1]), min(y0 + Hf, img.shape[0])
    if xs1 <= xs0 or ys1 <= ys0: return
    sub = (slice(ys0, ys1), slice(xs0, xs1)); psub = (slice(ys0 - y0, ys1 - y0), slice(xs0 - x0, xs1 - x0))
    tgt = img[sub]
    sdw = sdr[psub][..., None]
    tgt = tgt * (1 - sdw) + np.array([52, 42, 30], np.float32) * sdw
    aw = a[psub][..., None]
    img[sub] = tgt * (1 - aw) + col[psub] * aw

def paint(img, Hh, land, bio, seed=1, scale=1.0, dens=1.0, hi=64.0, min_region=900):
    """img: 陸の色(float32, H×W×3)に山を載せて返す。Hh=高さ(0〜100)、land=陸、bio=群系。"""
    rs = np.random.RandomState(seed * 7 + 3)
    H0, W0 = Hh.shape
    Hs = ndi.gaussian_filter(Hh, 1.5)
    core = (Hs >= hi) & land
    core = ndi.binary_closing(core, iterations=3); core = ndi.binary_opening(core, iterations=1)
    lab, nl = ndi.label(core)
    areas = ndi.sum(core, lab, range(1, nl + 1)) if nl else []
    keep = [i + 1 for i, a in enumerate(areas) if a >= min_region]
    region = np.isin(lab, keep)
    if not region.any(): return img, 0
    dist = ndi.distance_transform_edt(region)
    hn = np.clip((Hs - hi) / max(np.percentile(Hh[land], 99.5) - hi, 1.0), 0, 1)
    cold = ndi.gaussian_filter(np.isin(bio, [10, 11]).astype(np.float32), 8)
    ground = cv2.GaussianBlur(img, (0, 0), 10)
    clump = ndi.gaussian_filter(rs.rand(H0, W0).astype(np.float32), 18); clump = (clump - clump.min()) / (clump.max() - clump.min() + 1e-6)
    items = []
    for rid in keep:
        m = lab == rid; ys, xs = np.nonzero(m)
        y_lo, y_hi = ys.min(), ys.max()
        step = 15 * scale / math.sqrt(dens)
        y = y_lo + 6
        while y <= y_hi + 14:
            row = np.nonzero(m[min(int(y), H0 - 1)])[0]
            if len(row):
                x = row.min() + rs.uniform(0, 14)
                while x <= row.max() + 4:
                    xi, yi = int(min(x, W0 - 1)), int(min(y, H0 - 1))
                    if m[yi, xi] and clump[yi, xi] > 0.28 + 0.25 * rs.rand():
                        c = min(dist[yi, xi] / 24.0, 1.0)
                        hw = (9 + 30 * hn[yi, xi] ** 1.1 + 6 * c) * (0.55 + 0.9 * clump[yi, xi]) * rs.uniform(0.75, 1.3) * scale
                        items.append((y, x, hw, cold[yi, xi]))
                        x += hw * rs.uniform(1.0, 1.5)
                    else:
                        x += 4
            y += step * rs.uniform(0.8, 1.2)
    items.sort()
    out = img.copy()
    for (by, bx, hw, cd) in items:
        h = hw * (0.42 + 0.30 * rs.rand() + 0.22 * min(hw / 40.0, 1.0))
        tint = ground[int(min(by, H0 - 1)), int(min(bx, W0 - 1))]
        col, a, sdr, (ox, oy) = sprite(hw, h, rs, snow=0.5 + 0.4 * cd, tint=tint)
        _paste(out, col, a, sdr, ox, oy, bx, by)
    return out, len(items)
