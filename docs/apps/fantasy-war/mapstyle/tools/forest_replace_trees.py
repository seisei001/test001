# 元の地図の木の要素を全部取り(木なしの絵=前の版の絵)、木の多い所に森の塊(第10版)を足す
# 使い方: python3 -I forest_replace_trees.py <木なし.jpg> <木あり.jpg> <出力.png> [種]
# 木の要素 = 木なしの絵と木ありの絵の差。木の多い所 = その差をなめらかにした密度の高い所。
import sys, os, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import forest_mass as fm
base_p, tree_p, out = sys.argv[1], sys.argv[2], sys.argv[3]; seed = int(sys.argv[4]) if len(sys.argv) > 4 else 1
base = Image.open(base_p).convert('RGB'); tree = Image.open(tree_p).convert('RGB')
A = np.array(base).astype(int); T = np.array(tree).astype(int)
M = (np.abs(A - T).sum(2) > 40).astype(np.uint8)
M = cv2.morphologyEx(M, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
D = cv2.GaussianBlur(M.astype(np.float32), (0, 0), 18); D /= D.max()
hsv = cv2.cvtColor(np.array(tree), cv2.COLOR_RGB2HSV)
place = []; order = np.dstack(np.unravel_index(np.argsort(-D.ravel()), D.shape))[0]
for y, x in order[::7]:
    if D[y, x] < 0.14 or len(place) >= 40: break
    if all((x - px) ** 2 + (y - py) ** 2 > (0.9 * (s0 + s) / 2) ** 2 for px, py, s0, _ in place for s in [0]) if False else all((x - px) ** 2 + (y - py) ** 2 > 80 ** 2 for px, py, _, _ in place):
        r = 40; ys, xs = slice(max(0, y - r), y + r), slice(max(0, x - r), x + r)
        m = M[ys, xs] > 0
        pc = np.array(tree)[ys, xs][m].astype(float).mean(0) if m.any() else np.array([0, 1, 1.0])
        ratio = pc[2] / max(pc[1], 1)          # 青/緑: 針葉樹は大きく、広葉樹は小さい
        size = int(80 + 50 * D[y, x])
        place.append((x, y, size, 'conif' if ratio > 0.66 else 'broad'))
reg = cv2.dilate((D > 0.04).astype(np.uint8), np.ones((9, 9), np.uint8))      # 木のあった範囲(はみ出し防止)
canvas = base.convert('RGBA')
for i, (x, y, size, k) in enumerate(place):
    if k == 'broad':
        L, _ = fm.make_mix(size, seed + i, (4.0, 8.4), fm.PAL['broad3'], light_gauss={'seed': i % 3}, base_gauss={'seed': i % 3})
    else:
        L, _ = fm.make_mix(size, seed + i, (4.2, 7.0), fm.PAL['conif'], light_gauss={'seed': i % 3}, base_gauss={'seed': i % 3}, kind_in='conif3_moon', kind_edge='conif3_top')
    f = L[-1].resize((size, size), Image.LANCZOS)
    arr = np.array(f); x0, y0 = int(x - size / 2), int(y - size / 2)
    ys, xs = max(0, y0), max(0, x0); ye, xe = min(base.size[1], y0 + size), min(base.size[0], x0 + size)
    sub = reg[ys:ye, xs:xe]; a = arr[ys - y0:ye - y0, xs - x0:xe - x0, 3].astype(np.float32) * sub
    arr = arr[ys - y0:ye - y0, xs - x0:xe - x0].copy(); arr[..., 3] = a.astype(np.uint8)
    canvas.alpha_composite(Image.fromarray(arr), (xs, ys))
canvas.convert('RGB').save(out, quality=92)
print('木の要素の画素', int(M.sum()), '/ 塊', len(place), 'うち針葉樹', sum(p[3] == 'conif' for p in place))
