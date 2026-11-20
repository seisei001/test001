# 森の塊の試作(R1)。ユーザーの描き方(11-21 06:42):
#  1) 暗い深緑の下地(端は不規則)
#  2) その上に やや暗い木のシルエットをランダムに置き、下地の70%を埋める
#  3) その上に もう少し明るいシルエットを、下地の40%ぶん置く
#  広葉樹と針葉樹は別々に作る。
# 使い方: python3 forest_mass.py out.png [seed]
import sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SS = 3  # 描画は3倍で行い縮小(輪郭をなめらかに)

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
    h = s * 1.5
    w = s * .62
    t1 = [(x, y - h / 2), (x - w / 2 * .72, y - h * .02), (x + w / 2 * .72, y - h * .02)]
    t2 = [(x, y - h * .22), (x - w / 2, y + h / 2), (x + w / 2, y + h / 2)]
    return [('p', t1), ('p', t2)]

def draw_tree(d, shapes, col):
    for k, g in shapes:
        if k == 'e': d.ellipse(g, fill=col)
        else: d.polygon(g, fill=col)

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
    for kind, tp in (('broad', (13, 20)), ('conif', (12, 18))):
        st, cv = make(kind, S, seed, tp, PAL[kind])
        print(kind, 'coverage L2=%.2f L3=%.2f' % cv)
        rows.append([flat(s, S) for s in st])
    # 実寸(世界地図用): 塊を小さく、木も小さく
    s2 = 100
    real = []
    for kind, tp in (('broad', (4.6, 7)), ('conif', (4.2, 6.4))):
        st, cv = make(kind, s2, seed + 1, tp, PAL[kind])
        real.append(flat(st[-1], s2))
    sheet = Image.new('RGB', (S * 3 + 20, S * 2 + s2 + 30), (244, 236, 216))
    for r, row in enumerate(rows):
        for c, im in enumerate(row):
            sheet.paste(im, (c * (S + 10), r * (S + 10)))
    for i, im in enumerate(real):
        sheet.paste(im, (i * (s2 + 10), 2 * (S + 10)))
    sheet.save(out, quality=92)
