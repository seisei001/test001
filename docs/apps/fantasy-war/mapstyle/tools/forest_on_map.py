# 森の塊(第10版)を世界地図の絵にそのまま置く試験(ユーザー指示 11-21 08:09「まず今のまま、どう乗せるか」)
# 使い方: python3 -I forest_on_map.py <地図の絵.jpg> <出力.png> [種]
import sys, numpy as np, cv2
from PIL import Image
sys.argv_backup = sys.argv; 
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import forest_mass as fm
src, out = sys.argv[1], sys.argv[2]; seed = int(sys.argv[3]) if len(sys.argv) > 3 else 1
im = Image.open(src).convert('RGB'); W, H = im.size
a = np.array(im).astype(np.float32); R, G, B = a[..., 0], a[..., 1], a[..., 2]
hsv = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2HSV).astype(np.float32)
green = ((hsv[..., 0] > 30) & (hsv[..., 0] < 70) & (hsv[..., 1] > 60) & (hsv[..., 2] > 60) & (G > R + 2) & (G > B + 10)).astype(np.uint8)
green[:90] = 0; green[890:] = 0; green[:, :60] = 0; green[:, 1440:] = 0
green = cv2.erode(green, np.ones((3, 3), np.uint8))
dist = cv2.distanceTransform(green, cv2.DIST_L2, 5)        # 緑の内側ほど大きい
rng = np.random.default_rng(seed)
placed = []
cand = np.argwhere(dist > 10)
rng.shuffle(cand)
for y, x in cand:
    if len(placed) >= 14: break
    if all((x - px) ** 2 + (y - py) ** 2 > 105 ** 2 for px, py, _ in placed):
        placed.append((x, y, 'conif' if y < 330 else 'broad'))
canvas = im.convert('RGBA')
for i, (x, y, k) in enumerate(placed):
    size = int(rng.choice([90, 100, 115]))
    if k == 'broad':
        layers, _ = fm.make_mix(size, seed + i, (4.0, 8.4), fm.PAL['broad3'], light_gauss={'seed': i % 3}, base_gauss={'seed': i % 3})
    else:
        layers, _ = fm.make_mix(size, seed + i, (4.2, 7.0), fm.PAL['conif'], light_gauss={'seed': i % 3}, base_gauss={'seed': i % 3}, kind_in='conif3_moon', kind_edge='conif3_top')
    f = layers[-1].resize((size, size), Image.LANCZOS)
    canvas.alpha_composite(f, (int(x - size / 2), int(y - size / 2)))
canvas.convert('RGB').save(out, quality=92)
print('置いた数', len(placed), [(int(x), int(y), k) for x, y, k in placed])
