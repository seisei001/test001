# 魔力だまり+地脈 第2版(ユーザー指示 11-22 08:02・08:03): 魔力だまりと地脈は同じガウス揺らぎの場から出る。世界は巨大なので、大小いくつもの波を重ねて複雑にする。
# 魔力だまり=場の薄い所の面(大きさ・濃さを持つ)。地脈=薄い所をつないで流れる細い網(薄い所の中心線)。数は薄さのしきい値で決まる(間隔の足切りは使わない)。
# 使い方: python3 -I mana_vein2.py <世界dir(world-data.png)> <出力の前置き> [種] [--oct=7] [--pool=1.0] [--vein=0.0](以上すべて標準値。11-22 の実測と、ハブの記録から決めた) [--decay=0.72(小さい波の強さの割合)] [--base=0.06(最大の波の大きさ=横幅の何割)]
import sys, json, numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import skeletonize

def field(h, w, seed, base, octs, decay=0.72):
    rng = np.random.default_rng(seed); f = np.zeros((h, w), np.float32)
    for k in range(octs):                                   # 大きな波から細かい波まで(波の大きさ=半分ずつ、強さ=約0.7倍ずつ)
        n = rng.standard_normal((h, w)).astype(np.float32); b = cv2.GaussianBlur(n, (0, 0), base / 2 ** k)
        f += (decay ** k) * b / (b.std() + 1e-9)
    return f

def build(wd, seed=1, octs=7, pool_t=1.0, vein_t=0.0, min_px=3, decay=0.9, base=0.03):
    H0, W0 = wd.shape[:2]; land0 = (wd[..., 1] > 0) & (wd[..., 0] >= 20)
    s = 2; h, w = H0 // s, W0 // s
    land = cv2.resize(land0.astype(np.uint8), (w, h), interpolation=cv2.INTER_NEAREST).astype(bool)
    # 四元素(地・水・火・風)の魔素: 各1枚のガウス揺らぎ(種を変えて4枚)。魔力量の場=4枚の重ね合わせ(ユーザー確定 11-24 05:48)
    ELEM = ['地', '水', '火', '風']
    Fe = [field(h, w, seed * 10 + k, base * w, octs, decay) for k in range(4)]
    Ze = [(f - f[land].mean()) / f[land].std() for f in Fe]
    F = sum(Ze); Z = (F - F[land].mean()) / F[land].std()
    deep = -Z                                                # 大きいほど魔力が濃い(場が薄い)
    # 魔力だまり: 濃さがしきい値を超える連結した面
    lab, n = ndi.label((deep > pool_t) & land)
    pools = []
    for i in range(1, n + 1):
        m = lab == i; a = int(m.sum())
        if a < min_px: continue
        ys, xs = np.nonzero(m); k = int(np.argmax(deep[m]))
        el = {ELEM[k]: round(float(-Ze[k][m].mean()), 2) for k in range(4)}   # だまり内の各元素の濃さ(大きいほど濃い)
        pools.append(dict(elem=el, x=int(xs.mean() * s), y=int(ys.mean() * s), area=a * s * s, depth=round(float(deep[m].max()), 2), peak=[int(xs[k] * s), int(ys[k] * s)]))
    # 地脈: 濃さがしきい値(ゆるめ)を超える所の中心線
    V = (deep > vein_t) & land; V = ndi.binary_closing(V, iterations=1) & land
    sk = skeletonize(V)
    nb = ndi.convolve(sk.astype(np.uint8), np.ones((3, 3), np.uint8), mode='constant') - 1
    ends = int((sk & (nb == 1)).sum()); junc = int((sk & (nb >= 3)).sum())
    comp, nc = ndi.label(sk, structure=np.ones((3, 3)))
    sizes = ndi.sum(sk, comp, range(1, nc + 1)) if nc else []
    return dict(pools=pools, vein=dict(length_px=int(sk.sum()) * s, ends=ends, junctions=junc, networks=int(nc), biggest=int(max(sizes)) * s if nc else 0)), sk, V, pool_mask(lab, pools, deep, pool_t), land, Z

def pool_mask(lab, pools, deep, t): return (deep > t)

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    opt = {a.split('=')[0]: a.split('=')[1] for a in sys.argv[1:] if a.startswith('--') and '=' in a}
    wd = np.array(Image.open(args[0] + '/world-data.png')); seed = int(args[2]) if len(args) > 2 else 1
    d, sk, V, P, land, Z = build(wd, seed, int(opt.get('--oct', 7)), float(opt.get('--pool', 1.0)), float(opt.get('--vein', 0.0)), decay=float(opt.get('--decay', 0.9)), base=float(opt.get('--base', 0.03)))
    json.dump(dict(seed=seed, size=[wd.shape[1], wd.shape[0]], pools=d['pools'], vein=d['vein'], note='座標は世界データの画素(2:1や正方形の世界でも同じ)。area=画素数。depth=濃さ(標準偏差の何倍か)'), open(args[1] + '_mana2.json', 'w'), ensure_ascii=False)
    base = np.where(land[..., None], np.array([218, 214, 196], np.uint8), np.array([200, 216, 232], np.uint8)).astype(np.uint8)
    base[V] = (150, 120, 200); base[P & land] = (255, 190, 60); sk2 = cv2.dilate(sk.astype(np.uint8), np.ones((2, 2), np.uint8)).astype(bool); base[sk2] = (90, 40, 150)
    Image.fromarray(base).resize((base.shape[1] * 2, base.shape[0] * 2), Image.NEAREST).save(args[1] + '_mana2.png')
    print(len(d['pools']), '魔力だまり', d['vein'])
