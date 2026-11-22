# 世界データ(world-data.png)の森の群系に、森の塊(第10版)を透明な層として置く。層は地図と同じ位置(UV同位置)。
# 使い方: python3 -I forest_world_layer.py <世界dir> <出力.png> [種]
# 群系(Azgaar番号): 5熱帯季節林 6温帯落葉樹林 7熱帯雨林 8温帯雨林=広葉樹 / 9タイガ=針葉樹
import sys, os, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import forest_mass as fm
def build(wd, seed=1, dmin=None, sp=None):
    DMIN = float(os.environ.get('FM_FOREST_DMIN', '0.08')) if dmin is None else dmin; SP = int(os.environ.get('FM_FOREST_SP', '50')) if sp is None else sp
    H0, W0 = wd.shape[:2]; bio = wd[..., 1]; R = wd[..., 0].astype(np.float32); land = (bio > 0) & (R >= 20)
    Hh = R / 2.55
    broad = np.isin(bio, [5, 6, 7, 8]) & land; conif = (bio == 9) & land
    low = Hh < 55                                         # 高い山の上には置かない
    layer = Image.new('RGBA', (W0, H0), (0, 0, 0, 0)); placed = []
    for kind, msk in (('broad', broad & low), ('conif', conif & low)):
        m = cv2.erode(msk.astype(np.uint8), np.ones((5, 5), np.uint8))
        D = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 14)
        order = np.dstack(np.unravel_index(np.argsort(-D.ravel()), D.shape))[0]
        reg = cv2.dilate((D > 0.1).astype(np.uint8), np.ones((7, 7), np.uint8))
        for y, x in order[::9]:
            if D[y, x] < DMIN: break
            if all((x - px) ** 2 + (y - py) ** 2 > SP ** 2 for px, py, _ in placed):
                size = int(SP + 45 * D[y, x]); i = len(placed); placed.append((x, y, kind))
                L = None
                for t in range(6):          # 内側が空になる小さな塊は、種を変えてやり直す
                    try:
                        if kind == 'broad': L, _ = fm.make_mix(size, seed + i + 97 * t, (4.0, 8.4), fm.PAL['broad3'], light_gauss={'seed': i % 3}, base_gauss={'seed': (i + t) % 3})
                        else: L, _ = fm.make_mix(size, seed + i + 97 * t, (4.2, 7.0), fm.PAL['conif'], light_gauss={'seed': i % 3}, base_gauss={'seed': (i + t) % 3}, kind_in='conif3_moon', kind_edge='conif3_top')
                        break
                    except ValueError: L = None
                if L is None: continue
                arr = np.array(L[-1].resize((size, size), Image.LANCZOS)); x0, y0 = int(x - size / 2), int(y - size / 2)
                ys, xs = max(0, y0), max(0, x0); ye, xe = min(H0, y0 + size), min(W0, x0 + size)
                a = arr[ys - y0:ye - y0, xs - x0:xe - x0].copy(); a[..., 3] = (a[..., 3] * reg[ys:ye, xs:xe]).astype(np.uint8)
                layer.alpha_composite(Image.fromarray(a), (xs, ys))
    print('森の塊', len(placed), '針葉樹', sum(p[2] == 'conif' for p in placed)); return layer

if __name__ == "__main__":
    wd = np.array(Image.open(sys.argv[1].rstrip('/') + '/world-data.png')); out = sys.argv[2]; seed = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    build(wd, seed).save(out)
