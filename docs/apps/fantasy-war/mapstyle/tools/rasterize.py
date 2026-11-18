# セル(点)ごとの値のJSON → 1400×900 の world-data.png(R=高さ×2.55, G=群系0〜12, B=国)
# 使い方: python3 rasterize.py <az|own> <入力json> <出力ディレクトリ>
import sys, json, os, numpy as np
from PIL import Image
from scipy.interpolate import LinearNDInterpolator, NearestNDInterpolator
from scipy import ndimage as ndi
W, Hh = 1400, 900
# 自作の群系(0海,1氷雪,2ツンドラ,3亜寒帯林,4寒冷草原,5砂漠,6温暖草原,7地中海性,8温帯林,9温帯海洋林,10サバナ,11熱帯雨林,12高山) → Azgaar番号
OWN2AZ = {0:0, 1:11, 2:10, 3:9, 4:4, 5:1, 6:4, 7:6, 8:6, 9:8, 10:3, 11:7, 12:10}
def warp(shape, seed, amp):
    rs = np.random.RandomState(seed)
    out = []
    for _ in range(2):
        n = ndi.gaussian_filter(rs.randn(*shape), 12); n /= np.abs(n).max(); out.append(n * amp)
    return out
def run(kind, src, outdir):
    d = json.load(open(src)); x = np.array(d['x'], float); y = np.array(d['y'], float)
    gx, gy = np.meshgrid(np.arange(W), np.arange(Hh))
    if kind == 'az':
        sx, sy = (W - 1) / d['W'], (Hh - 1) / d['H']; px, py = x * sx, y * sy; ox = oy = 0
        h = np.array(d['h'], float); bio = np.array(d['biome']); st = np.array(d['state'])
        pts = np.stack([px, py], 1)
        # 境界の外側(端の外)は最寄りの値で埋める
        Hi = LinearNDInterpolator(pts, h, fill_value=5.0)(gx, gy)
        Hi = np.where(np.isnan(Hi), 5.0, Hi)
        wx, wy = warp(Hi.shape, 3, 4)
        ix = np.clip(gx + wx, 0, W - 1); iy = np.clip(gy + wy, 0, Hh - 1)
        BI = NearestNDInterpolator(pts, bio)(ix, iy); ST = NearestNDInterpolator(pts, st)(ix, iy)
        land = Hi >= 20
        H = np.where(land, Hi, np.minimum(Hi, 19.5))
    else:
        s = (W - 1) / d['W']; px, py = x * s, y * s
        oy = (Hh - d['H'] * s) / 2; py = py + oy
        pts = np.stack([px, py], 1)
        el = np.array(d['elev'], float); lnd = np.array(d['land']).astype(bool)
        el = np.where(lnd, np.maximum(el, 1.0), np.minimum(el, -1.0))
        Ei = LinearNDInterpolator(pts, el, fill_value=-4000.0)(gx, gy); Ei = np.where(np.isnan(Ei), -4000.0, Ei)
        Ei = ndi.gaussian_filter(Ei, 1.0)
        land = Ei > 0
        wx, wy = warp(Ei.shape, 5, 9)
        ix = np.clip(gx + wx, 0, W - 1); iy = np.clip(gy + wy, 0, Hh - 1)
        bio = np.array([OWN2AZ[int(b)] for b in d['biome']]); bio[~lnd] = 0
        BI = NearestNDInterpolator(pts, bio)(ix, iy)
        cont = np.array(d['cont']); ST = NearestNDInterpolator(pts, cont % 250 + 1)(ix, iy)
        # 陸なのに群系0の画素は最寄りの陸群系で埋める
        z = land & (BI == 0)
        if z.any():
            idx = ndi.distance_transform_edt(BI == 0, return_distances=False, return_indices=True); BI = np.where(z, BI[idx[0], idx[1]], BI)
        lm = Ei[land]; q = np.quantile(lm, 0.94); mx = lm.max()
        H = np.where(land, np.where(Ei <= q, 20.3 + 45.7 * np.clip(Ei, 0, None) / q, 66 + 34 * np.clip((Ei - q) / max(mx - q, 1), 0, 1)),
                     np.clip(19.5 + Ei / 250, 2, 19.5))
    BI = np.where(land, BI, 0)
    os.makedirs(outdir, exist_ok=True)
    dat = np.zeros((Hh, W, 3), np.uint8)
    dat[..., 0] = np.clip(H * 2.55, 0, 255).astype(np.uint8); dat[..., 1] = BI; dat[..., 2] = np.clip(ST, 0, 255)
    Image.fromarray(dat).save(outdir + '/world-data.png')
    Image.fromarray(np.zeros((Hh, W, 3), np.uint8) + np.array([120, 160, 190], np.uint8)).save(outdir + '/world-map.jpg')
    ls = land.mean(); print(kind, 'land', round(float(ls), 3), 'biomes', {int(k): round(float((BI[land] == k).mean()), 3) for k in np.unique(BI[land])})
if __name__ == '__main__':
    run(*sys.argv[1:4])
