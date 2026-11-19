# 絵として描く世界地図(段階17): 地図の色塗りや質感は使わず、絵の部品と水彩の薄い色だけで組み立てる。
#  羊皮紙→海(岸に沿った波線)→陸の水彩(薄い色)→海岸のインク線→川→山・丘・砂漠の小物を絵部品で置く
# 使い方: python3 -I illus.py <世界dir> <出力jpg> "題" [seed]   (世界dirは world-data.png と、あれば rivers.png)
import sys, os, math, json
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, 'pipeline', 'gv'))
sys.path.insert(0, HERE); import mtn16, parts2

def wob(rs, n, amp, sc): # 手描きのゆらぎ
    a = rs.randn(n); k = np.ones(sc) / sc; return np.convolve(a, k, 'same') * amp

def main(wdir, outp, title, seed=1):
    rs = np.random.RandomState(seed); wdir = wdir.rstrip('/')
    wd = np.array(Image.open(wdir + '/world-data.png')); H0, W0 = wd.shape[:2]
    R = wd[..., 0].astype(np.float32); bio = wd[..., 1]; land = (bio > 0) & (R >= 20); Hh = R / 2.55
    # --- 羊皮紙
    def noise(sc):
        g = rs.rand(H0 // sc + 3, W0 // sc + 3).astype(np.float32); return cv2.resize(g, (W0, H0), interpolation=cv2.INTER_CUBIC)
    pn = 0.5 * noise(120) + 0.3 * noise(30) + 0.2 * noise(8); pn = (pn - pn.min()) / (pn.max() - pn.min())
    parch = np.array([226, 208, 168], np.float32) * (0.90 + 0.18 * pn)[..., None]
    # --- 海: 紙に薄い青灰色を重ね、岸から離れるほど少し濃く。岸に沿った波線を引く
    dist = ndi.distance_transform_edt(~land)
    sea_t = np.array([170, 190, 190], np.float32)
    k = np.clip(dist / 140.0, 0, 1) * 0.35 + 0.35
    img = parch * (1 - k[..., None]) + sea_t * k[..., None] * (0.92 + 0.12 * pn[..., None])
    # --- 陸の水彩(群系ごとの薄い色)
    wash = {1: (232, 205, 140), 2: (214, 202, 170), 3: (206, 198, 126), 4: (176, 204, 126), 5: (150, 186, 108), 6: (150, 192, 112), 7: (120, 172, 108), 8: (132, 176, 124), 9: (128, 160, 122), 10: (190, 200, 184), 11: (240, 244, 248), 12: (150, 186, 160)}
    wl = np.zeros((H0, W0, 3), np.float32); 
    for b, c in wash.items(): wl[bio == b] = c
    wl = cv2.GaussianBlur(wl, (0, 0), 6)
    lw = cv2.GaussianBlur(land.astype(np.float32), (0, 0), 3)
    a = (0.55 * (0.85 + 0.3 * noise(40)))[..., None] * lw[..., None]
    land_base = parch * (1 - 0.55) + wl * 0.55
    img = img * (1 - lw[..., None]) + (parch * (1 - a) + wl * a) * lw[..., None]
    # --- 波線(岸に沿った3本)
    ink_sea = np.zeros((H0, W0), np.float32)
    for d0, w in [(10, 1.3), (24, 1.0), (42, 0.8)]:
        m = (dist < d0).astype(np.uint8) * 255
        cs, _ = cv2.findContours(m, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
        for c in cs:
            if len(c) < 60: continue
            pts = c[:, 0, :].astype(np.float32); n = len(pts)
            pts[:, 0] += wob(rs, n, 2.2, 15); pts[:, 1] += wob(rs, n, 2.2, 15)
            # 破線(波のかたまり)にする
            on = (np.sin(np.arange(n) / 14.0 + rs.rand() * 6) > -0.3)
            for i in range(0, n - 1):
                if on[i]: cv2.line(ink_sea, tuple(pts[i].astype(int)), tuple(pts[i + 1].astype(int)), 1.0, 1, cv2.LINE_AA)
    ink_sea = cv2.GaussianBlur(ink_sea, (0, 0), 0.6) * (~land)
    img = img * (1 - 0.55 * ink_sea[..., None]) + np.array([90, 110, 120], np.float32) * 0.55 * ink_sea[..., None]
    n_sea = 0 if os.environ.get('FM_LOWPOLY', '0') == '1' else parts2.sea(img, land, np.random.RandomState(seed + 11))
    # --- 海岸のインク線(ゆらぎつき)
    cs, _ = cv2.findContours(land.astype(np.uint8) * 255, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    cl = np.zeros((H0, W0), np.float32)
    for c in cs:
        if len(c) < 30: continue
        pts = c[:, 0, :].astype(np.float32); n = len(pts)
        pts[:, 0] += wob(rs, n, 1.2, 9); pts[:, 1] += wob(rs, n, 1.2, 9)
        cv2.polylines(cl, [pts.astype(np.int32).reshape(-1, 1, 2)], True, 1.0, 2, cv2.LINE_AA)
    img = img * (1 - 0.9 * cl[..., None]) + np.array([58, 40, 28], np.float32) * 0.9 * cl[..., None]
    # --- 川(あれば。細い青灰のインク線)
    if os.path.exists(wdir + '/rivers.png'):
        rv = (np.array(Image.open(wdir + '/rivers.png').convert('L'), np.float32) / 255) * land; rv = cv2.GaussianBlur(rv, (0, 0), 0.7)
        img = img * (1 - 0.8 * rv[..., None]) + np.array([80, 108, 128], np.float32) * 0.8 * rv[..., None]
    if os.environ.get('FM_LOWPOLY', '0') == '1':
        import lowpoly
        img, nm = lowpoly.paint(img, Hh, land, bio, seed); n_gr = n_tw = 0; n2 = (img, 0)
    elif os.environ.get('FM_V3', '1') == '1':
        import compose, mtn17
        mitems, region = mtn17.plan(Hh, land, bio, seed)
        avoid = ndi.binary_dilation(region, iterations=8)
        its = list(mitems); n_gr = parts2.ground(img, land, bio, Hh, np.random.RandomState(seed + 12), collect=its, avoid=avoid)
        its += hills(land, bio, Hh, np.random.RandomState(seed + 14), avoid)
        n_tw = parts2.town(img, land, bio, Hh, np.random.RandomState(seed + 13), wdir, collect=its, avoid=avoid)
        nm = compose.render(img, its, land, ground_tint=cv2.GaussianBlur(img, (0, 0), 10)); n2 = (img, 0)
    else:
        n_gr = parts2.ground(img, land, bio, Hh, np.random.RandomState(seed + 12))
        img, nm = mtn16.paint(img.astype(np.float32), Hh, land, bio, seed=seed, native=True, hi=52.0, dens=0.6)
        n2 = scatter(img, land, bio, Hh, rs, seed); img = n2[0]
        n_tw = parts2.town(img, land, bio, Hh, np.random.RandomState(seed + 13), wdir)
    # --- 枠と題
    OW, OH = 1500, 1000; ox, oy = (OW - W0) // 2, (OH - H0) // 2
    canvas = np.zeros((OH, OW, 3), np.float32) + np.array([222, 198, 152], np.float32)
    canvas[oy:oy + H0, ox:ox + W0] = img
    pil = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(pil)
    d.rectangle([ox - 6, oy - 6, ox + W0 + 5, oy + H0 + 5], outline=(70, 44, 26), width=4)
    d.rectangle([ox - 14, oy - 14, ox + W0 + 13, oy + H0 + 13], outline=(70, 44, 26), width=2)
    fp = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
    try:
        f = ImageFont.truetype(fp, 40, index=2); tw = d.textlength(title, font=f)
        d.rectangle([OW / 2 - tw / 2 - 40, 34, OW / 2 + tw / 2 + 40, 86], fill=(196, 160, 104), outline=(70, 44, 26), width=3)
        d.text((OW / 2, 60), title, font=f, fill=(46, 28, 16), anchor='mm')
    except Exception: pass
    pil.save(outp, quality=93)
    return dict(mountain_parts=nm, small_parts=n2[1], sea=n_sea, ground=n_gr, town=n_tw)

def hills(land, bio, Hh, rs, avoid):
    """低地の丘・砂丘・サボテンなどを「重ねの部品」として返す(奥から手前の順番に混ぜて描かれる)。"""
    J = json.load(open(mtn16._SC)); lib = {}
    for r in J['parts']:
        if r['id'] in {'h33', 'm15', 'd06', 'd08', 'd24', 'd02', 'n07'}: continue
        lib.setdefault(r['cat'], []).append(r['id'])
    items = []
    def samp(mask, sp):
        ys, xs = np.nonzero(mask); n = int(len(ys) / sp ** 2)
        return [(ys[k], xs[k]) for k in rs.choice(len(ys), min(n, len(ys)), replace=False)] if len(ys) else []
    low = land & ~avoid
    for bset, cats, sp, wr, hmax in [({4, 5, 6, 8, 12}, ['草の丘', '丘陵の連なり'], 30, (46, 90), 48), ({3, 9, 10, 2}, ['丘陵の連なり'], 44, (46, 84), 52), ({1, 2}, ['砂丘'], 32, (56, 110), 60)]:
        m = ndi.binary_erosion(low & np.isin(bio, list(bset)) & (Hh < hmax), iterations=10)
        for (y, x) in samp(m, sp):
            cs = [c for c in cats if c in lib]
            if cs: items.append(dict(y=y, x=x, pid=lib[cs[0] if len(cs) == 1 else cs[rs.randint(len(cs))]][0] if False else (lambda L: L[rs.randint(len(L))])(lib[cs[rs.randint(len(cs))]]), w=rs.uniform(*wr), kind='hill', foot=0.3, shadow=0.12, haze=0.0, hmax=70))
    deco = ['d07', 'd09', 'd10', 'd11', 'd12', 'd13', 'd14', 'd15', 'd16', 'd17', 'd18', 'd19', 'd20', 'd21', 'd23', 'd39']
    md = ndi.binary_erosion(low & np.isin(bio, [1, 3]) & (Hh < 60), iterations=8)
    for (y, x) in samp(md, 70): items.append(dict(y=y, x=x, pid=deco[rs.randint(len(deco))], w=rs.uniform(22, 38), kind='veg', shadow=0.1, hmax=90))
    return items

def scatter(img, land, bio, Hh, rs, seed):
    """丘・砂丘・サボテン・岩・オアシスなどの小さな絵部品を、群系に合わせてまばらに置く(絵そのまま)。"""
    J = json.load(open(mtn16._SC)); FW = mtn16._FW
    lib = {}
    for r in J['parts']:
        fp = os.path.join(FW, r['img'])
        fx = os.path.join(FW, 'mapstyle', 'parts', 'fixed', r['id'] + '.png')
        if os.environ.get('FM_FIXED', '1') != '0' and os.path.exists(fx): fp = fx
        if not os.path.exists(fp): continue
        if r['id'] in {'h33','m15','d06','d08','d24','d02','n07'}: continue
        lib.setdefault(r['cat'], []).append((r['id'], fp))
    cache = {}
    def get(fp):
        if fp not in cache:
            im = cv2.imread(fp, cv2.IMREAD_UNCHANGED); cache[fp] = im
        return cache[fp]
    H0, W0 = land.shape
    # 小物の種類: 砂漠の飾りのうちサボテン・枯れ木・オアシス・岩(らくだ・天幕・動物などは使わない)
    deco_ok = {'d07', 'd09', 'd10', 'd11', 'd12', 'd13', 'd14', 'd15', 'd16', 'd17', 'd18', 'd19', 'd20', 'd21', 'd23', 'd39'}
    deco = [x for x in lib.get('砂漠の飾り', []) if x[0] in deco_ok]
    rule = [   # (群系の集合, 部品の種類, 数(1000画素あたり), 幅の範囲, 高さの上限)
        ({4, 5, 6, 8, 12}, ['丘陵の連なり', '草の丘'], 0.020, (50, 110), 52),
        ({3, 9, 10, 2}, ['丘陵の連なり'], 0.012, (50, 100), 55),
        ({1, 2}, ['砂丘'], 0.020, (60, 130), 62),
        ({1, 3, 2}, ['岩場・岩塊'], 0.006, (24, 44), 70),
    ]
    items = []
    for bset, cats, dens, wr, hmax in rule:
        m = land & np.isin(bio, list(bset)) & (Hh < hmax)
        m = ndi.binary_erosion(m, iterations=10)
        ys, xs = np.nonzero(m)
        if len(ys) == 0: continue
        n = int(len(ys) / 1000.0 * dens * 1000 / 6)
        for k in rs.choice(len(ys), min(n, len(ys)), replace=False):
            cs = [c for c in cats if c in lib]
            if not cs: continue
            cat = cs[rs.randint(len(cs))]; pid, fp = lib[cat][rs.randint(len(lib[cat]))]
            items.append((ys[k], xs[k], fp, rs.uniform(*wr)))
    # 砂漠の小物(サボテン・枯れ木・オアシス・岩)
    md = land & np.isin(bio, [1, 3]) & (Hh < 60); md = ndi.binary_erosion(md, iterations=8); ys, xs = np.nonzero(md)
    if len(ys) and deco:
        for k in rs.choice(len(ys), min(len(ys) // 1500, 80), replace=False):
            pid, fp = deco[rs.randint(len(deco))]; items.append((ys[k], xs[k], fp, rs.uniform(22, 40) * (1.3 if pid == 'd07' else 1)))
    items.sort(key=lambda t: t[0]); out = img.copy(); n = 0
    for (by, bx, fp, wd) in items:
        im = get(fp)
        if im is None or im.shape[2] < 4: continue
        a = im[..., 3].astype(np.float32) / 255; ys_, xs_ = np.nonzero(a > 0.3)
        if len(ys_) < 40: continue
        y0, y1, x0, x1 = ys_.min(), ys_.max() + 1, xs_.min(), xs_.max() + 1
        rgb = im[y0:y1, x0:x1, :3][..., ::-1].astype(np.float32); al = a[y0:y1, x0:x1]
        sc = wd / rgb.shape[1]; nw, nh = max(8, int(rgb.shape[1] * sc)), max(6, int(rgb.shape[0] * sc))
        if nh > 90: sc = 90.0 / rgb.shape[0]; nw, nh = max(8, int(rgb.shape[1] * sc)), 90
        rgb = cv2.resize(rgb, (nw, nh), interpolation=cv2.INTER_AREA); al = cv2.resize(al, (nw, nh), interpolation=cv2.INTER_AREA)
        fade = np.ones(nh, np.float32); kf = max(2, int(nh * 0.2)); fade[-kf:] = np.linspace(1, 0.1, kf); al = al * fade[:, None]
        x0_, y0_ = int(bx - nw / 2), int(by - nh); ya, yb, xa, xb = max(y0_, 0), min(y0_ + nh, H0), max(x0_, 0), min(x0_ + nw, W0)
        if ya >= yb or xa >= xb: continue
        sy, sx = ya - y0_, xa - x0_; ey, ex = sy + (yb - ya), sx + (xb - xa)
        # 陸の上だけに置く
        lm = land[ya:yb, xa:xb][..., None].astype(np.float32); aa = al[sy:ey, sx:ex][..., None] * lm
        out[ya:yb, xa:xb] = out[ya:yb, xa:xb] * (1 - aa) + rgb[sy:ey, sx:ex] * aa; n += 1
    return out, n

if __name__ == '__main__':
    print(json.dumps(main(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 1), ensure_ascii=False))
