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
    lake = (wa == 2)
    D = None
    G = None
    if os.path.exists(pre + '_rlon.bin'): import water_layer; G = water_layer.load_graph(pre)
    if os.path.exists(pre + '_disch.bin'):     # 川・湖(pwg_sphere_probe2.ts の出力。2800x1400で標本→2x2の最大値)
        D = np.fromfile(pre + '_disch.bin', np.float32).reshape(2 * Hh, 2 * W).reshape(Hh, 2, W, 2).max(axis=(1, 3))
        LK = (np.fromfile(pre + '_lake.bin', np.int32).reshape(2 * Hh, 2 * W) >= 0).reshape(Hh, 2, W, 2).max(axis=(1, 3))
        D = np.roll(D, shift, 1); lake = lake | np.roll(LK, shift, 1)
    land = (el > 0) | lake                      # 湖も面を残し、湖面として描く(穴にしない)
    land0 = land & ~lake
    el = ndi.gaussian_filter(el, 0.8)
    lm = el[land0]; q = np.quantile(lm, 0.94); mx = lm.max()
    H = np.where(land, np.where(el <= q, 20.3 + 45.7 * np.clip(el, 0, None) / q, 66 + 34 * np.clip((el - q) / max(mx - q, 1), 0, 1)), np.where(el > 0, 19.0, np.clip(19.5 + el / 250, 2, 19.5)))
    if D is not None:                           # 湖面=まわりの陸の高さより少し下
        w_ = (land0).astype(np.float32); Hn = ndi.gaussian_filter(H * w_, 4) / (ndi.gaussian_filter(w_, 4) + 1e-6); H = np.where(lake, np.maximum(Hn - 1.0, 20.0), H)
    BI = np.zeros((Hh, W), int)
    for k, v in MAP.items(): BI[bi == k] = v
    BI[~land] = 0
    rs = np.random.RandomState(seed); ys, xs = np.nonzero(land); idx = rs.choice(len(ys), 12, replace=False)
    seeds = np.stack([ys[idx], xs[idx]], 1); ST = np.zeros((Hh, W), int)
    d2 = ((ys[:, None] - seeds[None, :, 0]) ** 2 + (xs[:, None] - seeds[None, :, 1]) ** 2); ST[ys, xs] = d2.argmin(1) + 1
    os.makedirs(outdir, exist_ok=True)
    dat = np.zeros((Hh, W, 3), np.uint8); dat[..., 0] = np.clip(H * 2.55, 0, 255).astype(np.uint8); dat[..., 1] = BI; dat[..., 2] = ST
    Image.fromarray(dat).save(outdir + '/world-data.png')
    os.environ['FM_LP_UV'] = '1'; os.environ['FM_LP_ATLAS'] = '1'; os.environ['FM_LP_DUMP'] = name
    if D is not None:
        import water_layer
        ov = outdir + '/water-layer.png'; print(water_layer.make(G, lake, land0, H, ov, shift, seed)); os.environ['FM_LP_OVERLAY'] = ov
    import lowpoly
    img = np.zeros((Hh, W, 3), np.float32) + np.array([206, 223, 235], np.float32)
    lowpoly.paint(img, H, land, BI, seed)
    if D is not None: water_layer.write_ribbons(G, land0, lake, H, shift, name)      # 川=地形に沿う帯(3D) 11-22 21:45
    return {'land': float(land.mean()), 'w': W, 'h': Hh}
if __name__ == '__main__':
    print(main(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 1))
