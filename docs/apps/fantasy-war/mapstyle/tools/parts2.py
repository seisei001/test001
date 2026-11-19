# 新しい絵部品(木・草・町・海の飾り・遺跡)を地図に置く。部品は parts/new/*.png(cut_sheet.py で作成)
import os, json, glob
import numpy as np, cv2
from scipy import ndimage as ndi
NEW = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'parts', 'new')
_c = {}
def load(pid):
    if pid not in _c:
        im = cv2.imread(os.path.join(NEW, pid + '.png'), cv2.IMREAD_UNCHANGED)
        if im is None: _c[pid] = None
        else:
            a = im[..., 3]; ys, xs = np.nonzero(a > 80)
            im = im[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
            _c[pid] = (im[..., :3][..., ::-1].astype(np.float32), im[..., 3].astype(np.float32) / 255)
    return _c[pid]
TINT = {'tree': (0.70, 0.86, 0.56), 'grass': (0.86, 0.95, 0.60), 'wave': (0.72, 0.82, 0.86), 'none': (1, 1, 1)}
def draw(out, items, allow):
    """items: (y,x,pid,width,tint) を奥(上)から順に貼る。allow=置いてよい場所(真偽)"""
    H, W = allow.shape; n = 0
    for (by, bx, pid, wd, tn) in sorted(items, key=lambda t: t[0]):
        p = load(pid)
        if p is None: continue
        rgb, al = p; sc = wd / rgb.shape[1]; nw, nh = max(6, int(rgb.shape[1] * sc)), max(5, int(rgb.shape[0] * sc))
        r = cv2.resize(rgb, (nw, nh), interpolation=cv2.INTER_AREA) * np.array(TINT[tn], np.float32)
        a = cv2.resize(al, (nw, nh), interpolation=cv2.INTER_AREA)
        x0, y0 = int(bx - nw / 2), int(by - nh); ya, yb, xa, xb = max(y0, 0), min(y0 + nh, H), max(x0, 0), min(x0 + nw, W)
        if ya >= yb or xa >= xb: continue
        sy, sx = ya - y0, xa - x0; ey, ex = sy + yb - ya, sx + xb - xa
        if not allow[int(min(by, H - 1)), int(min(bx, W - 1))]: continue
        aa = a[sy:ey, sx:ex][..., None] * allow[ya:yb, xa:xb][..., None]
        out[ya:yb, xa:xb] = out[ya:yb, xa:xb] * (1 - aa) + r[sy:ey, sx:ex] * aa; n += 1
    return n

def field(rs, shape, sc):
    g = rs.rand(shape[0] // sc + 3, shape[1] // sc + 3).astype(np.float32)
    f = cv2.resize(g, (shape[1], shape[0]), interpolation=cv2.INTER_CUBIC); return (f - f.min()) / (f.max() - f.min())

def sample(rs, mask, spacing, prob=None):
    ys, xs = np.nonzero(mask)
    if len(ys) == 0: return []
    n = int(len(ys) / spacing ** 2)
    k = rs.choice(len(ys), min(n, len(ys)), replace=False)
    out = []
    for i in k:
        if prob is not None and rs.rand() > prob[ys[i], xs[i]]: continue
        out.append((ys[i], xs[i]))
    return out

def ids(pre, a, b): return [f'{pre}{i:02d}' for i in range(a, b + 1)]
CON = ids('tr', 1, 9) + ['tr17', 'tr19', 'tr20']; BROAD = ids('tr', 10, 16) + ['tr18', 'tr29']; PALM = ['tr24', 'tr26', 'tr27']; DEAD = ['tr25', 'tr28']

def _kind(pid): return {'tr': 'veg', 'gr': 'veg', 'tw': 'town', 'ms': 'misc'}.get(pid[:2], 'veg')
def _out(items, land, out, collect):
    if collect is None: return draw(out, items, land)
    for (y, x, pid, w, tn) in items:
        k = _kind(pid); collect.append(dict(y=y, x=x, pid=pid, w=float(w), kind=k, tint=tn, shadow=0.0 if k == 'veg' else 0.18, hmax=140))
    return len(items)

def ground(out, land, bio, Hh, rs, collect=None, avoid=None):
    """山より先に: 森・草・低木・湿地"""
    H, W = land.shape; items = []; low = land & (Hh < 46)
    if avoid is not None: low &= ~avoid
    ff = field(rs, (H, W), 70) * 0.7 + field(rs, (H, W), 22) * 0.3
    # 森(群系ごとに樹種を変える)
    for bset, kinds, thr, sp, wr in [({9}, [CON], .42, 11, (16, 24)), ({6, 8}, [CON, BROAD], .50, 12, (16, 26)), ({5, 7}, [BROAD, PALM], .46, 11, (18, 28)), ({4}, [BROAD], .70, 16, (16, 24)), ({10}, [CON], .78, 17, (12, 18)), ({12}, [BROAD], .60, 15, (16, 22))]:
        m = low & np.isin(bio, list(bset)); m = ndi.binary_erosion(m, iterations=4)
        for (y, x) in sample(rs, m, sp, (ff > thr).astype(np.float32)):
            ks = kinds[rs.randint(len(kinds))]; pid = ks[rs.randint(len(ks))]
            items.append((y + rs.randint(-3, 4), x + rs.randint(-3, 4), pid, rs.uniform(*wr) * (1.6 if pid in ('tr17', 'tr18', 'tr19', 'tr20', 'tr29') else 1) * (1.25 if pid in PALM else 1), 'tree'))
    # 砂漠・サバンナ: 枯れ木とヤシをまばらに
    m = low & np.isin(bio, [1, 2, 3]); m = ndi.binary_erosion(m, iterations=6)
    for (y, x) in sample(rs, m, 60): items.append((y, x, (DEAD + PALM)[rs.randint(5)], rs.uniform(18, 26), 'tree' if rs.rand() < .5 else 'none'))
    # 草・低木
    m = low & np.isin(bio, [3, 4, 5, 6]); m = ndi.binary_erosion(m, iterations=4)
    for (y, x) in sample(rs, m, 20): items.append((y, x, ids('gr', 1, 8)[rs.randint(8)], rs.uniform(12, 18), 'grass'))
    for (y, x) in sample(rs, m, 34): items.append((y, x, ids('gr', 9, 14)[rs.randint(6)], rs.uniform(22, 30), 'grass'))
    for (y, x) in sample(rs, m & (ff > .6), 40): items.append((y, x, ids('gr', 25, 27)[rs.randint(3)], rs.uniform(36, 52), 'grass'))
    # 湿地: 葦と池
    m = low & (bio == 12); m = ndi.binary_erosion(m, iterations=3)
    for (y, x) in sample(rs, m, 16): items.append((y, x, ids('gr', 15, 20)[rs.randint(6)], rs.uniform(18, 26), 'grass'))
    for (y, x) in sample(rs, m, 36): items.append((y, x, ids('gr', 21, 24)[rs.randint(4)], rs.uniform(44, 64), 'none'))
    return _out(items, land, out, collect)

def sea(out, land, rs):
    """海: 波・帆船・怪物・渦・羅針盤"""
    H, W = land.shape; dist = ndi.distance_transform_edt(~land); items = []
    edge = np.zeros((H, W), bool); edge[70:H - 50, 60:W - 60] = True
    sm = (dist > 30) & (dist < 400) & edge
    for (y, x) in sample(rs, sm, 105): items.append((y, x, ids('sa', 20, 23)[rs.randint(4)], rs.uniform(56, 80), 'wave'))
    for (y, x) in sample(rs, (dist > 40) & (dist < 160) & edge, 240): items.append((y, x, ids('sa', 1, 7)[rs.randint(7)], rs.uniform(56, 84), 'none'))
    for (y, x) in sample(rs, (dist > 90) & edge, 300): items.append((y, x, (['sa08', 'sa09', 'sa10', 'sa11', 'sa12', 'sa15', 'sa16'])[rs.randint(7)], rs.uniform(64, 96), 'none'))
    # 羅針盤: 右下の海
    m = np.zeros((H, W), bool); m[int(H * .72):int(H * .95), int(W * .78):int(W * .97)] = True; m &= dist > 25
    ys, xs = np.nonzero(m)
    if len(ys): k = rs.randint(len(ys)); items.append((ys[k] + 50, xs[k], 'sa13', 110, 'none'))
    return draw(out, items, ~land)

def town(out, land, bio, Hh, rs, wdir, collect=None, avoid=None):
    """町・城・遺跡・洞窟・天幕など(山のあとに置く)"""
    H, W = land.shape; items = []; ok = land & (Hh < 62)
    if avoid is not None: ok &= ~avoid
    try: cities = json.load(open(wdir + '/world-extra.json'))['cities']
    except Exception: cities = []
    seen = set(); near = np.zeros((H, W), bool)
    for c in sorted(cities, key=lambda c: -c['flux']):
        x, y = int(c['x']), int(c['y']); cap = c['state'] not in seen; seen.add(c['state'])
        pid = (['tw13', 'tw14', 'tw15', 'tw10', 'tw12'])[rs.randint(5)] if cap else (['tw06', 'tw07', 'tw08', 'tw09'])[rs.randint(4)]
        items.append((y + 12, x, pid, 78 if cap else 52, 'none')); cv2.circle(near.view(np.uint8), (x, y), 45, 1, -1)
    # 村・砦・風車を各地に
    m = ok & np.isin(bio, [3, 4, 5, 6, 8]) & ~near.astype(bool); m = ndi.binary_erosion(m, iterations=14)
    for (y, x) in sample(rs, m, 90): items.append((y, x, ids('tw', 1, 5)[rs.randint(5)], rs.uniform(32, 44), 'none'))
    for (y, x) in sample(rs, m, 230): items.append((y, x, ['tw16', 'tw17', 'tw18', 'tw19', 'tw20', 'tw21'][rs.randint(6)], rs.uniform(30, 44), 'none'))
    mh = ok & (Hh > 28) & ~near.astype(bool); mh = ndi.binary_erosion(mh, iterations=8)
    for (y, x) in sample(rs, mh, 210): items.append((y, x, ['ms05', 'ms06', 'ms08', 'ms10', 'ms13', 'ms14', 'ms15', 'ms16', 'ms17'][rs.randint(9)], rs.uniform(30, 44), 'none'))
    for (y, x) in sample(rs, mh & (Hh > 44), 190): items.append((y, x, ['ms20', 'ms21', 'ms24', 'ms25'][rs.randint(4)], rs.uniform(32, 42), 'none'))
    for (y, x) in sample(rs, m, 260): items.append((y, x, ['ms23', 'ms26', 'ms27', 'ms18', 'ms19'][rs.randint(5)], rs.uniform(16, 24), 'none'))
    for (y, x) in sample(rs, m, 420): items.append((y, x, ['ms11', 'ms12', 'ms22'][rs.randint(3)], rs.uniform(34, 44), 'none'))
    return _out(items, land, out, collect)
