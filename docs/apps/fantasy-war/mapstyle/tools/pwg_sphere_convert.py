# 球体PWG(pwg_sphere_probe.ts の出力 *_elev/_biome/_water.bin、2:1の等距円筒)を、切らず・伸ばさずそのまま
# world-data.png(R=高さ×2.55, G=群系0〜12, B=国)にし、回して見る3D用の面データ(w3d)を書く。
# 使い方: python3 -I pwg_sphere_convert.py <接頭辞 例 .../q31> <出力ディレクトリ> <w3dの名前> [seed]
import sys, os, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
W, Hh = 1400, 700
MAP = {0:0,1:11,2:2,3:10,4:9,5:9,6:6,7:8,8:4,9:4,10:1,11:2,12:3,13:3,14:5,15:7,16:7,17:10,18:11,19:12,20:12,21:12,22:12,23:4,24:1,25:2,26:12,27:12}  # pwg_convert.py と同じ
def main(pre, outdir, name, seed=1):
    el = np.fromfile(pre + '_elev.bin', np.float32).reshape(Hh, W); wa = np.fromfile(pre + '_water.bin', np.uint8).reshape(Hh, W); bi = np.fromfile(pre + '_biome.bin', np.uint8).reshape(Hh, W)
    # 左右が陸続きなら、陸が最も少ない縦の列(周囲も含めて)を新しい左右の端にずらして、海で切る(経度の回転=球体では何も壊れない)
    col = ((el > 0) & (wa != 2))[100:600].sum(0).astype(float); k = 5   # 数えるのは中緯度(上下の極の約14%を除く。極の陸は伸びた帯で、切れ目には使えない)
    sm = np.convolve(np.concatenate([col[-k:], col, col[:k]]), np.ones(2 * k + 1) / (2 * k + 1), 'valid')
    cut_col = int(np.argmin(sm)); shift = -cut_col
    el = np.roll(el, shift, 1); wa = np.roll(wa, shift, 1); bi = np.roll(bi, shift, 1)
    print('切れ目の列', cut_col, '端の陸(中緯度・画素)', int(((el[100:600, 0] > 0) & (wa[100:600, 0] != 2)).sum()), '(元の最大', int(col.max()), '平均', round(float(col.mean()), 1), ')')
    POLEMASK = np.ones((Hh, 1), bool)                                   # 極の沈め処理は無し(11-24 23:17 ユーザー: 不要。両極は雪や氷を絵で表現する=絵の問題だけ)
    lake = (wa == 2)
    D = None
    G = None
    if os.path.exists(pre + '_rlon.bin'): import water_layer; G = water_layer.load_graph(pre)
    if os.path.exists(pre + '_disch.bin'):     # 川・湖(pwg_sphere_probe2.ts の出力。2800x1400で標本→2x2の最大値)
        D = np.fromfile(pre + '_disch.bin', np.float32).reshape(2 * Hh, 2 * W).reshape(Hh, 2, W, 2).max(axis=(1, 3))
        LK = (np.fromfile(pre + '_lake.bin', np.int32).reshape(2 * Hh, 2 * W) >= 0).reshape(Hh, 2, W, 2).max(axis=(1, 3))
        D = np.roll(D, shift, 1); lake = lake | np.roll(LK, shift, 1)
        lake = lake & POLEMASK; D = np.where(POLEMASK, D, 0)
    land = (el > 0) | lake                      # 湖も面を残し、湖面として描く(穴にしない)
    land0 = land & ~lake
    el = ndi.gaussian_filter(el, 0.8)
    lm = el[land0]; q = np.quantile(lm, 0.94); mx = lm.max()
    H = np.where(land, np.where(el <= q, 20.3 + 45.7 * np.clip(el, 0, None) / q, 66 + 34 * np.clip((el - q) / max(mx - q, 1), 0, 1)), 19.5)
    if D is not None:                           # 湖=まわりの陸の高さのまま(水の高さは地図データが持たない 11-24 23:17)
        w_ = (land0).astype(np.float32); Hn = ndi.gaussian_filter(H * w_, 4) / (ndi.gaussian_filter(w_, 4) + 1e-6); H = np.where(lake, Hn, H)
    BI = np.zeros((Hh, W), int)
    for k, v in MAP.items(): BI[bi == k] = v
    BI[~land] = 0
    # 極: データ(群系・国)は変えない。両極の雪や氷は絵だけで表す(11-24 23:17 ユーザー)。国の置き方は未定=仮の12分割を陸全体で行う。
    latr = np.abs(90 - 180 * (np.arange(Hh) + 0.5) / Hh)[:, None] * np.ones((1, W)); BIpic = BI.copy(); BIpic[land & (latr >= 70)] = 11   # 絵と面の色だけに使う
    hab = land
    rs = np.random.RandomState(seed); ys, xs = np.nonzero(hab); idx = rs.choice(len(ys), 12, replace=False)
    seeds = np.stack([ys[idx], xs[idx]], 1); ST = np.zeros((Hh, W), int)
    d2 = ((ys[:, None] - seeds[None, :, 0]) ** 2 + (xs[:, None] - seeds[None, :, 1]) ** 2); ST[ys, xs] = d2.argmin(1) + 1
    os.makedirs(outdir, exist_ok=True)
    dat = np.zeros((Hh, W, 3), np.uint8); dat[..., 0] = np.clip(H * 2.55, 0, 255).astype(np.uint8); dat[..., 1] = BI; dat[..., 2] = ST
    Image.fromarray(dat).save(outdir + '/world-data.png')
    for k_, v_ in (('FM_LP_GENTLE', '1'), ('FM_LP_BASE', '0.37'), ('FM_LP_PEXP', '1.9'), ('FM_LP_SMOOTH', '1.5'), ('FM_LP_EMPH', '0.775'), ('FM_LP_D0', '0.17'), ('FM_LP_SP', '1.3'), ('FM_LP_RING', '1')): os.environ.setdefault(k_, v_)   # ハブ(カード6E mapstyle40)の山の強調の基準 11-22 22:05
    # ---- ①平坦な絵を先に描く(最上位仕様 11-24。STATE.md カード0): 海・海岸線・地面の色・川・湖・森を一枚に ----
    os.environ['FM_LP_UV'] = '1'; os.environ['FM_LP_ATLAS'] = '1'; os.environ['FM_LP_DUMP'] = name
    import cv2, forest_world_layer, flat_picture; from PIL import Image as _I
    layers = []
    datpic = dat.copy(); datpic[..., 1] = BIpic; layers.append(forest_world_layer.build(datpic, seed))                               # 森の塊(第10版)
    if D is not None:
        import water_layer
        wo = outdir + '/water-only.png'; print(water_layer.make(G, lake, land0, H, wo, shift, seed, rivers_in_texture=True, min_order=5))   # 川と湖も絵の中に描く
        wl = cv2.imread(wo, cv2.IMREAD_UNCHANGED); layers.append(_I.fromarray(cv2.cvtColor(wl, cv2.COLOR_BGRA2RGBA)))
    pic = flat_picture.draw(H, land, BIpic, seed, layers)
    pp = outdir + '/world-picture.png'; cv2.imwrite(pp, cv2.cvtColor(pic, cv2.COLOR_RGB2BGR)); _I.fromarray(pic).save(name + '_sea.jpg', quality=92)   # 海の面にも同じ絵を貼る(陸は立体が覆う)
    # ---- ②ローポリを作り ③その絵をUVで貼る(絵はそのまま。立体側で足さない) ----
    os.environ['FM_LP_PICTURE'] = pp; os.environ.pop('FM_LP_OVERLAY', None)
    import lowpoly
    img = np.zeros((Hh, W, 3), np.float32) + np.array([206, 223, 235], np.float32)
    lowpoly.paint(img, H, land, BIpic, seed)
    return {'land': float(land.mean()), 'w': W, 'h': Hh}
if __name__ == '__main__':
    print(main(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 1))
