# 森の塊の試作(R1)。ユーザーの描き方(11-21 06:42):
#  1) 暗い深緑の下地(端は不規則)
#  2) その上に やや暗い木のシルエットをランダムに置き、下地の70%を埋める
#  3) その上に もう少し明るいシルエットを、下地の40%ぶん置く
#  広葉樹と針葉樹は別々に作る。
# 使い方: python3 forest_mass.py out.png [seed]
import sys, math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

SS = 3  # 描画は3倍で行い縮小(輪郭をなめらかに)
import os, glob
_STAMPS = None
def stamps():
    global _STAMPS
    if _STAMPS is None:
        d = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'gv', 'stamps')
        _STAMPS = [Image.open(p).split()[3] for p in sorted(glob.glob(os.path.join(d, 'broad_*.png')))]
    return _STAMPS

def blob_mask(size, rng, r_frac=0.40, rough=0.30):
    """端が不規則な塊(下地)のマスク"""
    W = H = size * SS
    cx = cy = W / 2
    n = 360
    # 角度ごとの半径: 低周波ノイズの和
    ph = rng.uniform(0, 6.28, 6)
    amp = np.array([1.0, .6, .45, .3, .2, .12]) * rough
    fr = np.array([2, 3, 5, 8, 13, 21])
    ang = np.linspace(0, 2 * np.pi, n, endpoint=False)
    r = np.ones(n)
    for a, f, p in zip(amp, fr, ph):
        r += a * np.sin(f * ang + p) / math.sqrt(f)
    r = np.clip(r, 0.35, 1.6) * r_frac * W
    pts = [(cx + r[i] * math.cos(ang[i]), cy + r[i] * math.sin(ang[i])) for i in range(n)]
    im = Image.new('L', (W, H), 0)
    ImageDraw.Draw(im).polygon(pts, fill=255)
    return im

def blob_mask_gauss(size, seed, sigma=0.07, k=0.75, r_frac=0.36):
    """下地の形もガウス揺らぎで決める(ユーザー指示 11-21 07:59):
    なめらかな乱数の場に、中心ほど高い丘を足し、一定の高さ以上を下地にする。"""
    W = size * SS
    rg = np.random.default_rng(seed)
    nz = rg.standard_normal((W, W)).astype(np.float32)
    fld = cv2.GaussianBlur(nz, (0, 0), sigma * W)
    fld = (fld - fld.mean()) / (fld.std() + 1e-9)
    yy, xx = np.mgrid[0:W, 0:W].astype(np.float32)
    rr = np.hypot(xx - W / 2, yy - W / 2) / (r_frac * W)      # 中心0、基準の半径で1
    z = k * fld + 1.3 * (1 - rr ** 2) - 0.0 * rr                          # 丘(中心が高い)+揺らぎ
    m = (z > np.quantile(z, 0.60)).astype(np.uint8)   # 面積を一定(約40%)にそろえる
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n > 1:
        big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); m = (lab == big).astype(np.uint8)
    # 穴をふさぐ(外側につながらない背景を塗る。まわりに1画素の背景をつけて数える)
    inv = np.pad((1 - m).astype(np.uint8), 1, constant_values=1)
    n2, l2, _s, _c = cv2.connectedComponentsWithStats(inv)
    m = (l2[1:-1, 1:-1] != l2[0, 0]).astype(np.uint8)
    return Image.fromarray(m * 255)

def tree_poly(kind, x, y, s, rng):
    """シルエットの多角形/円の描画関数を返す"""
    if kind == 'broad':      # 丸い樹冠(小さな丸のかたまり)
        out = []
        for _ in range(3):
            dx, dy = rng.uniform(-.22, .22) * s, rng.uniform(-.18, .1) * s
            out.append(('e', (x + dx - .5 * s * rng.uniform(.7, .9), y + dy - .5 * s * rng.uniform(.7, .9),
                              x + dx + .5 * s * rng.uniform(.7, .9), y + dy + .5 * s * rng.uniform(.7, .9))))
        return out
    # 針葉樹: 2段の三角
    h = s * rng.choice([1.35, 1.5, 1.7])
    w = s * rng.choice([.55, .62, .72])
    t1 = [(x, y - h / 2), (x - w / 2 * .72, y - h * .02), (x + w / 2 * .72, y - h * .02)]
    t2 = [(x, y - h * .22), (x - w / 2, y + h / 2), (x + w / 2, y + h / 2)]
    return [('p', t1), ('p', t2)]

def draw_tree(d, shapes, col):
    for k, g in shapes:
        if k == 'e': d.ellipse(g, fill=col)
        else: d.polygon(g, fill=col)

def _shade(c, k):
    return tuple(int(max(0, min(255, v * k))) for v in c)

def broad3_tile(s, rng, color, mode=None):
    """丸い樹冠(丸の集まり)+上に明るい三日月(光)+下に暗い三日月(陰)。sは幅の目安(px)"""
    P = int(s * 0.6); T = int(s) + 2 * P
    m = Image.new('L', (T, T), 0); d = ImageDraw.Draw(m)
    cx = cy = T / 2
    lobes = [(0, 0, .50)]
    for _ in range(rng.integers(2, 4)):
        a = rng.uniform(0, 6.28); lobes.append((.30 * math.cos(a), .24 * math.sin(a) + .06, rng.uniform(.30, .40)))
    for dx, dy, r in lobes:
        d.ellipse((cx + (dx - r) * s, cy + (dy - r) * s, cx + (dx + r) * s, cy + (dy + r) * s), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(.6 * SS / 3)).point(lambda v: 255 if v > 127 else 0)
    sh_dx, sh_dy = int(.14 * s), int(.20 * s)
    hi = ImageChops.subtract(m, ImageChops.offset(m, sh_dx, sh_dy))      # 左上の三日月=明るい
    lo = ImageChops.subtract(m, ImageChops.offset(m, -int(.10 * s), -int(.24 * s)))  # 下の三日月=暗い
    tile = Image.new('RGBA', (T, T), (0, 0, 0, 0))
    mode = mode or os.environ.get('FM_BROAD_MODE', 'top')
    if mode == 'moon':            # 上の三日月だけをばら撒く
        tile.paste(_shade(color, 1.15) + (255,), (0, 0), hi)
        return tile, hi
    tile.paste(color + (255,), (0, 0), m)
    if mode == 'both':            # 第3版: 下の暗い三日月も付ける
        tile.paste(_shade(color, 0.78) + (255,), (0, 0), lo)
    tile.paste(_shade(color, 1.32) + (255,), (0, 0), hi)   # 上の明るい三日月
    return tile, m

def conif3_tile(s, rng, color, mode='top'):
    """針葉樹: 2段の三角の樹冠+左側(光の当たる側)の尖った三角。mode='moon'は尖った三角だけ"""
    h = s * rng.choice([1.35, 1.5, 1.7]); w = s * rng.choice([.55, .62, .72])
    P = int(s * .3); TW = int(w) + 2 * P + 2; TH = int(h) + 2 * P + 2
    cx = TW / 2; top = P
    t1 = [(cx, top), (cx - w / 2 * .72, top + h * .50), (cx + w / 2 * .72, top + h * .50)]
    t2 = [(cx, top + h * .28), (cx - w / 2, top + h), (cx + w / 2, top + h)]
    l1 = [(cx, top), (cx - w / 2 * .72, top + h * .50), (cx, top + h * .50)]      # 尖った三角(左半分)
    l2 = [(cx, top + h * .28), (cx - w / 2, top + h), (cx, top + h)]
    def poly(polys):
        m = Image.new('L', (TW, TH), 0); d = ImageDraw.Draw(m)
        for p in polys: d.polygon(p, fill=255)
        return m
    body, lit = poly([t1, t2]), poly([l1, l2])
    tile = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
    if mode == 'moon':
        tile.paste(_shade(color, 1.15) + (255,), (0, 0), lit)
        return tile, lit
    tile.paste(color + (255,), (0, 0), body)
    tile.paste(_shade(color, 1.32) + (255,), (0, 0), lit)
    return tile, body

def fill_layer(base_mask, kind, rng, color, target, size_range, existing=None, accept=None):
    """base_mask内に、被覆率が target(0-1)になるまで木を置く。被覆はbase_maskに対する割合"""
    W, H = base_mask.size
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    cov = Image.new('L', (W, H), 0)
    area = (np.array(base_mask) > 127).sum()
    bm = np.array(base_mask) > 127
    ys, xs = np.nonzero(bm)
    covd = ImageDraw.Draw(cov); layd = ImageDraw.Draw(layer)
    c = 0.0; tries = 0
    while c < target and tries < 60000:
        tries += 1
        i = rng.integers(len(xs)); x, y = xs[i], ys[i]
        if accept is not None and rng.random() > accept[y, x]:
            continue
        s = rng.uniform(*size_range) * SS
        if kind == 'broad':      # 参考絵から取った影絵(複数)を、反転・大きさをランダムにして置く
            st = stamps()[rng.integers(len(stamps()))]
            if rng.random() < .5: st = st.transpose(Image.FLIP_LEFT_RIGHT)
            k = s * 1.15 / max(st.size)
            st = st.resize((max(2, int(st.width * k)), max(2, int(st.height * k))), Image.LANCZOS)
            pos = (int(x - st.width / 2), int(y - st.height / 2))
            layer.paste(Image.new('RGBA', st.size, color + (255,)), pos, st)
            cov.paste(255, pos, st)
            if tries % 6 == 0:
                c = ((np.array(cov) > 127) & bm).sum() / area
            continue
        if kind.startswith('conif3'):
            tile, tm = conif3_tile(s, rng, color, kind.split('_')[1])
            pos = (int(x - tile.width / 2), int(y - tile.height * .62))
            layer.paste(tile, pos, tile); cov.paste(255, pos, tm)
            if tries % 6 == 0:
                c = ((np.array(cov) > 127) & bm).sum() / area
            continue
        if kind.startswith('broad3'):     # 丸い樹冠+上の明るい三日月+下の暗い三日月。大きさは少しランダム
            tile, tm = broad3_tile(s, rng, color, kind.split('_')[1] if '_' in kind else None)
            pos = (int(x - tile.width / 2), int(y - tile.height / 2))
            layer.alpha_composite(tile, pos) if pos[0] >= 0 and pos[1] >= 0 and pos[0] + tile.width <= W and pos[1] + tile.height <= H else layer.paste(tile, pos, tile)
            cov.paste(255, pos, tm)
            if tries % 6 == 0:
                c = ((np.array(cov) > 127) & bm).sum() / area
            continue
        sh = tree_poly(kind, x, y, s, rng)
        # 下の木が上に描かれる順序: y が大きい(手前)ほど後に描くため、ここでは単純に追加
        draw_tree(layd, sh, color + (255,))
        draw_tree(covd, sh, 255)
        if tries % 6 == 0:
            c = ((np.array(cov) > 127) & bm).sum() / area
    return layer, ((np.array(cov) > 127) & bm).sum() / area

def make(kind, size, seed, tree_px, pal):
    rng = np.random.default_rng(seed)
    bm = blob_mask(size, rng)
    W = size * SS
    img = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    stages = []
    # 1) 下地
    base = Image.new('RGBA', (W, W), pal['base'] + (255,))
    base.putalpha(bm)
    img = Image.alpha_composite(img, base); stages.append(img.copy())
    # 2) やや暗い影 70%
    l2, c2 = fill_layer(bm, kind, rng, pal['dark'], 0.70, tree_px)
    img = Image.alpha_composite(img, l2); stages.append(img.copy())
    # 3) 明るい影 40%
    l3, c3 = fill_layer(bm, kind, rng, pal['light'], 0.40, tree_px)
    img = Image.alpha_composite(img, l3); stages.append(img.copy())
    return stages, (c2, c3)

def make_mix(size, seed, tree_px, pal, band_frac=0.14, cov_edge=(0.60, 0.40), cov_in=(0.70, 0.40), light_lower=None, light_dome=0.0, light_gauss=None, kind_in='broad3_moon', kind_edge='broad3_top', base_gauss=None):
    """ユーザー指示(11-21 07:01): 暗い緑の下地→周りに『上の広葉樹』(丸い樹冠+上の三日月)を適度に→中は『下の三日月』(三日月だけ)を置く"""
    import cv2
    rng = np.random.default_rng(seed)
    bm = blob_mask_gauss(size, seed + 500 + base_gauss.get('seed', 0), base_gauss.get('sigma', 0.07), base_gauss.get('k', 1.0)) if base_gauss else blob_mask(size, rng)
    W = size * SS
    dist = cv2.distanceTransform((np.array(bm) > 127).astype(np.uint8), cv2.DIST_L2, 5)
    edge = Image.fromarray(((dist > 0) & (dist <= band_frac * W)).astype(np.uint8) * 255)
    inner = Image.fromarray((dist > band_frac * W).astype(np.uint8) * 255)
    img = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    base = Image.new('RGBA', (W, W), pal['base'] + (255,)); base.putalpha(bm)
    img = Image.alpha_composite(img, base); stages = [img.copy()]
    covs = []
    # 暗い層: 中=三日月、周り=上の広葉樹
    li, c1 = fill_layer(inner, kind_in, rng, pal['dark'], cov_in[0], tree_px)
    le, c2 = fill_layer(edge, kind_edge, rng, pal['dark'], cov_edge[0], tree_px)
    img = Image.alpha_composite(Image.alpha_composite(img, li), le); stages.append(img.copy())
    zi, ze = inner, edge
    if light_lower:   # ユーザー指示(11-21 07:42): 中の暗い層を下地にして、明るい層は小さな範囲(手前=下側)だけ上書きする
        ys = np.nonzero(np.array(bm) > 127)[0]
        y0, y1 = ys.min(), ys.max()
        r2 = np.random.default_rng(seed + 99)
        ph = r2.uniform(0, 6.28, 3)
        xs = np.arange(W)
        wob = (np.sin(xs / W * 9 + ph[0]) * .5 + np.sin(xs / W * 17 + ph[1]) * .3 + np.sin(xs / W * 31 + ph[2]) * .2) * 0.06 * (y1 - y0)
        line = y0 + (1 - light_lower) * (y1 - y0) + wob
        if light_dome:   # ユーザー指示(11-21 07:50): 明るい部分の上側を、少し上へ丸く(半円状に)持ち上げる
            xm = np.nonzero(np.array(bm).max(axis=0) > 127)[0]
            cxm, hw = (xm.min() + xm.max()) / 2, (xm.max() - xm.min()) / 2
            u = np.clip((xs - cxm) / hw, -1, 1)
            line = line - light_dome * (y1 - y0) * np.sqrt(np.clip(1 - u ** 2, 0, 1))
        reg = (np.arange(W)[:, None] > line[None, :]).astype(np.uint8) * 255
        reg = Image.fromarray(reg)
        zi = ImageChops.multiply(inner, reg); ze = ImageChops.multiply(edge, reg)
    acc = None; ci, ce = cov_in[1], cov_edge[1]
    if light_gauss:   # ユーザー指示(11-21 07:52): 明るい部分の形・濃淡は、ガウス揺らぎ(なめらかな乱数の場)に任せる
        ys_ = np.nonzero(np.array(bm) > 127)[0]; y0_, y1_ = ys_.min(), ys_.max()
        rg = np.random.default_rng(seed + 1000 + light_gauss.get('seed', 0))
        nz = rg.standard_normal((W, W)).astype(np.float32)
        fld = cv2.GaussianBlur(nz, (0, 0), light_gauss.get('sigma', 0.11) * W)
        fld = (fld - fld.mean()) / fld.std()
        yy = (np.arange(W)[:, None] - y0_) / (y1_ - y0_) * 2 - 1       # 上=-1 … 下=+1
        z = light_gauss.get('k', 1.8) * fld + light_gauss.get('bias', 0.5) * yy
        acc = 1 / (1 + np.exp(-z))
        ci = ce = light_gauss.get('cov', 0.22)
    li, c3 = fill_layer(zi, kind_in, rng, pal['light'], ci, tree_px, accept=acc)
    le, c4 = fill_layer(ze, kind_edge, rng, pal['light'], ce, tree_px, accept=acc)
    img = Image.alpha_composite(Image.alpha_composite(img, li), le); stages.append(img.copy())
    return stages, (c1, c2, c3, c4)

PAL = {
    'broad3': {'base': (38, 66, 34), 'dark': (58, 94, 44), 'light': (96, 138, 60)},
    'broad': {'base': (38, 66, 34), 'dark': (58, 94, 44), 'light': (96, 138, 60)},
    'conif': {'base': (24, 52, 46), 'dark': (36, 78, 62), 'light': (62, 112, 82)},
}

if __name__ == '__main__':
    out = sys.argv[1]; seed = int(sys.argv[2]) if len(sys.argv) > 2 else 3
    if len(sys.argv) > 3 and sys.argv[3] == 'gbase':
        ground = (214, 198, 150); S = 300
        def flat(im, size):
            bg = Image.new('RGBA', im.size, ground + (255,))
            return Image.alpha_composite(bg, im).convert('RGB').resize((size, size), Image.LANCZOS)
        kw = dict(kind_in='conif3_moon', kind_edge='conif3_top')
        cols = []
        for bs in (0, 1, 2):
            b, _ = make_mix(S, seed, (11, 24), PAL['broad3'], light_gauss={'seed': 0}, base_gauss={'seed': bs})
            c, cv = make_mix(S, seed, (11, 22), PAL['conif'], light_gauss={'seed': 0}, base_gauss={'seed': bs}, **kw)
            print('seed', bs, 'conif cov', ['%.2f' % x for x in cv]); cols.append((b[2], c[2]))
        sheet = Image.new('RGB', (S * 3 + 20, S * 2 + 10), (244, 236, 216))
        for ci, (b, c) in enumerate(cols):
            sheet.paste(flat(b, S), (ci * (S + 10), 0)); sheet.paste(flat(c, S), (ci * (S + 10), S + 10))
        sheet.save(out, quality=92); sys.exit()
    if len(sys.argv) > 3 and sys.argv[3] == 'conif':
        ground = (214, 198, 150)
        def flat(im, size):
            bg = Image.new('RGBA', im.size, ground + (255,))
            return Image.alpha_composite(bg, im).convert('RGB').resize((size, size), Image.LANCZOS)
        S = 300
        kw = dict(kind_in='conif3_moon', kind_edge='conif3_top')
        b8, _ = make_mix(S, seed, (11, 24), PAL['broad3'], light_gauss={'seed': 0})
        c1, cv = make_mix(S, seed, (11, 22), PAL['conif'], light_gauss={'seed': 0}, **kw)
        c2, _ = make_mix(S, seed, (11, 22), PAL['conif'], light_gauss={'seed': 1}, **kw)
        print('conif coverage:', ['%.2f' % c for c in cv])
        r1, _ = make_mix(100, seed + 1, (4.0, 8.0), PAL['broad3'], light_gauss={'seed': 0})
        r2, _ = make_mix(100, seed + 1, (4.0, 8.0), PAL['conif'], light_gauss={'seed': 0}, **kw)
        # 部品の拡大見本(上=全体の三角、下=尖った三角だけ)
        rng = np.random.default_rng(5)
        strip = Image.new('RGB', (S * 3 + 20, 130), (214, 198, 150))
        for k in range(5):
            for row, mode in enumerate(('top', 'moon')):
                tl, _m = conif3_tile(40, rng, PAL['conif']['dark'], mode)
                strip.paste(tl, (10 + k * 70 + (70 - tl.width) // 2, 5 + row * 62), tl)
        sheet = Image.new('RGB', (S * 3 + 20, S + 120 + 140), (244, 236, 216))
        for c, im in enumerate((b8[2], c1[2], c2[2])): sheet.paste(flat(im, S), (c * (S + 10), 0))
        sheet.paste(flat(r1[-1], 100), (0, S + 10)); sheet.paste(flat(r2[-1], 100), (110, S + 10))
        sheet.paste(strip, (0, S + 120))
        sheet.save(out, quality=92); sys.exit()
    if len(sys.argv) > 3 and sys.argv[3] == 'gauss':
        ground = (214, 198, 150)
        def flat(im, size):
            bg = Image.new('RGBA', im.size, ground + (255,))
            return Image.alpha_composite(bg, im).convert('RGB').resize((size, size), Image.LANCZOS)
        S = 300
        old, _ = make_mix(S, seed, (11, 24), PAL['broad3'], light_lower=0.45, light_dome=0.16)
        g1, cv = make_mix(S, seed, (11, 24), PAL['broad3'], light_gauss={'seed': 0})
        g2, _ = make_mix(S, seed, (11, 24), PAL['broad3'], light_gauss={'seed': 1})
        print('gauss coverage:', ['%.2f' % c for c in cv])
        r, _ = make_mix(100, seed + 1, (4.0, 8.4), PAL['broad3'], light_gauss={'seed': 0})
        sheet = Image.new('RGB', (S * 3 + 20, S + 120), (244, 236, 216))
        for c, im in enumerate((old[2], g1[2], g2[2])): sheet.paste(flat(im, S), (c * (S + 10), 0))
        sheet.paste(flat(r[-1], 100), (0, S + 10))
        sheet.save(out, quality=92); sys.exit()
    if len(sys.argv) > 3 and sys.argv[3] == 'dome':
        ground = (214, 198, 150)
        def flat(im, size):
            bg = Image.new('RGBA', im.size, ground + (255,))
            return Image.alpha_composite(bg, im).convert('RGB').resize((size, size), Image.LANCZOS)
        S = 300
        new, cv = make_mix(S, seed, (11, 24), PAL['broad3'], light_lower=0.45, light_dome=0.16)
        old, _ = make_mix(S, seed, (11, 24), PAL['broad3'], light_lower=0.45)
        print('dome coverage:', ['%.2f' % c for c in cv])
        r, _ = make_mix(100, seed + 1, (4.0, 8.4), PAL['broad3'], light_lower=0.45, light_dome=0.16)
        sheet = Image.new('RGB', (S * 2 + 10, S + 120), (244, 236, 216))
        for c, im in enumerate((old[2], new[2])): sheet.paste(flat(im, S), (c * (S + 10), 0))
        sheet.paste(flat(r[-1], 100), (0, S + 10))
        sheet.save(out, quality=92); sys.exit()
    if len(sys.argv) > 3 and sys.argv[3] == 'lowlight':
        ground = (214, 198, 150)
        def flat(im, size):
            bg = Image.new('RGBA', im.size, ground + (255,))
            return Image.alpha_composite(bg, im).convert('RGB').resize((size, size), Image.LANCZOS)
        S = 300
        new, cv = make_mix(S, seed, (11, 24), PAL['broad3'], light_lower=0.45)
        old, _ = make_mix(S, seed, (11, 24), PAL['broad3'])
        print('new coverage (in dark/edge dark/in light/edge light, 各ゾーンに対する割合):', ['%.2f' % c for c in cv])
        r, _ = make_mix(100, seed + 1, (4.0, 8.4), PAL['broad3'], light_lower=0.45)
        sheet = Image.new('RGB', (S * 3 + 20, S + 120), (244, 236, 216))
        for c, im in enumerate((new[1], new[2], old[2])): sheet.paste(flat(im, S), (c * (S + 10), 0))
        sheet.paste(flat(r[-1], 100), (0, S + 10))
        sheet.save(out, quality=92); sys.exit()
    if len(sys.argv) > 3 and sys.argv[3] == 'mix':
        ground = (214, 198, 150)
        def flat(im, size):
            bg = Image.new('RGBA', im.size, ground + (255,))
            return Image.alpha_composite(bg, im).convert('RGB').resize((size, size), Image.LANCZOS)
        S = 300
        st, cv = make_mix(S, seed, (11, 24), PAL['broad3'])
        print('mix coverage inner dark/light, edge dark/light:', ['%.2f' % c for c in cv])
        st2, _ = make_mix(100, seed + 1, (4.0, 8.4), PAL['broad3'])
        sheet = Image.new('RGB', (S * 3 + 20, S + 120), (244, 236, 216))
        for c, im in enumerate(st): sheet.paste(flat(im, S), (c * (S + 10), 0))
        sheet.paste(flat(st2[-1], 100), (0, S + 10))
        sheet.save(out, quality=92); sys.exit()
    out = sys.argv[1]; seed = int(sys.argv[2]) if len(sys.argv) > 2 else 3
    ground = (214, 198, 150)
    def flat(im, size):
        bg = Image.new('RGBA', im.size, ground + (255,))
        im = Image.alpha_composite(bg, im).convert('RGB')
        return im.resize((size, size), Image.LANCZOS)
    S = 300
    rows = []
    for kind, tp in (('broad3', (11, 24)), ('conif', (12, 18))):
        st, cv = make(kind, S, seed, tp, PAL[kind])
        print(kind, 'coverage L2=%.2f L3=%.2f' % cv)
        rows.append([flat(s, S) for s in st])
    # 実寸(世界地図用): 塊を小さく、木も小さく
    s2 = 100
    real = []
    for kind, tp in (('broad3', (4.0, 8.4)), ('conif', (4.2, 6.4))):
        st, cv = make(kind, s2, seed + 1, tp, PAL[kind])
        real.append(flat(st[-1], s2))
    sheet = Image.new('RGB', (S * 3 + 20, S * 2 + s2 + 30), (244, 236, 216))
    for r, row in enumerate(rows):
        for c, im in enumerate(row):
            sheet.paste(im, (c * (S + 10), r * (S + 10)))
    for i, im in enumerate(real):
        sheet.paste(im, (i * (s2 + 10), 2 * (S + 10)))
    sheet.save(out, quality=92)

