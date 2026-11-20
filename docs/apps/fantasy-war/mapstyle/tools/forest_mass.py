# 森の塊の試作(R1)。ユーザーの描き方(11-21 06:42):
#  1) 暗い深緑の下地(端は不規則)
#  2) その上に やや暗い木のシルエットをランダムに置き、下地の70%を埋める
#  3) その上に もう少し明るいシルエットを、下地の40%ぶん置く
#  広葉樹と針葉樹は別々に作る。
# 使い方: python3 forest_mass.py out.png [seed]
import sys, math
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

def broad3_tile(s, rng, color):
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
    tile.paste(color + (255,), (0, 0), m)
    tile.paste(_shade(color, 0.78) + (255,), (0, 0), lo)
    tile.paste(_shade(color, 1.32) + (255,), (0, 0), hi)
    return tile, m

def fill_layer(base_mask, kind, rng, color, target, size_range, existing=None):
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
        if kind == 'broad3':     # 丸い樹冠+上の明るい三日月+下の暗い三日月。大きさは少しランダム
            tile, tm = broad3_tile(s, rng, color)
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

PAL = {
    'broad3': {'base': (38, 66, 34), 'dark': (58, 94, 44), 'light': (96, 138, 60)},
    'broad': {'base': (38, 66, 34), 'dark': (58, 94, 44), 'light': (96, 138, 60)},
    'conif': {'base': (24, 52, 46), 'dark': (36, 78, 62), 'light': (62, 112, 82)},
}

if __name__ == '__main__':
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
