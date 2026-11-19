# 絵の重ね方(統一の描画): 山・丘・木・町など全部を「奥から手前へ」1本の順番で重ねる。
# 研究(mapstyle4/10/11, mapcraft1)の決まりを実装: 奥ほど小さく薄く青み(空気遠近)/手前の物が奥の物の足もとを隠す/
#  光は1方向(左上)=部品は明るい面を左に向ける/手前の物は奥に影を落とす(右下へ)/足もとは地面になじませる。
import os, json
import numpy as np, cv2
from scipy import ndimage as ndi
HERE = os.path.dirname(os.path.abspath(__file__)); FW = os.path.abspath(os.path.join(HERE, '..', '..'))
NEWD = os.path.join(FW, 'mapstyle', 'parts', 'new'); FIXD = os.path.join(FW, 'mapstyle', 'parts', 'fixed')
_ids = None; _cache = {}
HAZE = np.array([188, 203, 217], np.float32)
TINT = {'tree': (0.70, 0.86, 0.56), 'grass': (0.86, 0.95, 0.60), 'wave': (0.72, 0.82, 0.86), 'none': (1, 1, 1)}
def _path(pid):
    global _ids
    p = os.path.join(NEWD, pid + '.png')
    if os.path.exists(p): return p
    if os.environ.get('FM_FIXED', '1') != '0':
        p = os.path.join(FIXD, pid + '.png')
        if os.path.exists(p): return p
    if _ids is None:
        _ids = {r['id']: os.path.join(FW, r['img']) for r in json.load(open(os.path.join(HERE, 'parts_scores.json')))['parts']}
    return _ids.get(pid)
def load(pid, light=False):
    k = (pid, light)
    if k in _cache: return _cache[k]
    p = _path(pid); im = cv2.imread(p, cv2.IMREAD_UNCHANGED) if p else None
    if im is None or im.ndim < 3 or im.shape[2] < 4: _cache[k] = None; return None
    a = im[..., 3].astype(np.float32) / 255; ys, xs = np.nonzero(a > 0.3)
    if len(ys) < 30: _cache[k] = None; return None
    im = im[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    rgb = im[..., :3][..., ::-1].astype(np.float32)
    if light:   # 光は左上: 明るい面が左に来るよう、右が明るい部品は左右を反転
        L = rgb.mean(2) * a; w = L.shape[1] // 2
        if L[:, w:].sum() > L[:, :w].sum() * 1.06: rgb = rgb[:, ::-1].copy(); a = a[:, ::-1].copy()
    _cache[k] = (rgb, a); return _cache[k]

def render(out, items, land, ground_tint=None):
    """items: dict(y,x,pid,w,kind,haze,tint,shadow,foot) を y の小さい(奥)順に貼る。out は直接書き換える。"""
    H, W = land.shape; n = 0
    for it in sorted(items, key=lambda d: d['y']):
        by, bx = int(it['y']), int(it['x'])
        if not (0 <= by < H and 0 <= bx < W) or not land[by, bx]: continue
        kind = it.get('kind', 'veg'); p = load(it['pid'], light=kind in ('mtn', 'hill'))
        if p is None: continue
        rgb, al = p; wd = it['w']; sc = wd / rgb.shape[1]
        if rgb.shape[0] * sc > it.get('hmax', 230): sc = it.get('hmax', 230) / rgb.shape[0]
        nw, nh = max(6, int(rgb.shape[1] * sc)), max(5, int(rgb.shape[0] * sc))
        r = cv2.resize(rgb, (nw, nh), interpolation=cv2.INTER_AREA) * np.array(TINT[it.get('tint', 'none')], np.float32)
        a = cv2.resize(al, (nw, nh), interpolation=cv2.INTER_AREA)
        hz = it.get('haze', 0.0)
        if hz > 0: r = r * (1 - hz) + HAZE * hz                         # 空気遠近: 奥ほど青く薄く
        ft = it.get('foot', 0.0)
        if ft > 0:                                                      # 足もとをなじませる
            k = max(3, int(nh * ft)); f = np.ones(nh, np.float32); f[-k:] = np.linspace(1, 0.0, k) ** 1.1; a = a * f[:, None]
        x0, y0 = int(bx - nw / 2), int(by - nh)
        ya, yb, xa, xb = max(y0, 0), min(y0 + nh, H), max(x0, 0), min(x0 + nw, W)
        if ya >= yb or xa >= xb: continue
        sy, sx = ya - y0, xa - x0; ey, ex = sy + yb - ya, sx + xb - xa
        # 影: 手前の物が、奥の物や地面に、右下へ影を落とす
        sd = it.get('shadow', 0.0)
        if sd > 0:
            dx, dy = max(2, int(nw * 0.10)), max(1, int(nh * 0.06)); pad = dx + 8
            sh = np.zeros((nh + pad, nw + pad), np.float32); sh[dy:dy + nh, dx:dx + nw] = a
            sh = cv2.GaussianBlur(sh, (0, 0), max(1.2, nw * 0.015))
            ya2, yb2, xa2, xb2 = max(y0, 0), min(y0 + nh + pad, H), max(x0, 0), min(x0 + nw + pad, W)
            if ya2 < yb2 and xa2 < xb2:
                s2 = sh[ya2 - y0:yb2 - y0, xa2 - x0:xb2 - x0] * (1 - np.pad(a, ((0, pad), (0, pad)))[ya2 - y0:yb2 - y0, xa2 - x0:xb2 - x0])
                lm = land[ya2:yb2, xa2:xb2].astype(np.float32)
                out[ya2:yb2, xa2:xb2] *= (1 - sd * s2 * lm)[..., None]
        aa = a[sy:ey, sx:ex][..., None]
        rr = r[sy:ey, sx:ex]
        if ground_tint is not None and kind in ('mtn', 'hill'):         # 下の地面の色味を少しだけ掛ける
            g = ground_tint[ya:yb, xa:xb]; rr = rr * np.clip(0.82 + 0.18 * g / (g.mean(2, keepdims=True) + 1e-6), 0.88, 1.1)
        out[ya:yb, xa:xb] = out[ya:yb, xa:xb] * (1 - aa) + rr * aa; n += 1
    return n
