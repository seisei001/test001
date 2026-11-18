# セル(点)ごとの値のJSON → 1400×900 の world-data.png(R=高さ×2.55, G=群系0〜12, B=国)
# 使い方: python3 -I rasterize.py az <入力json> <出力ディレクトリ>   (Azgaarのセル点 → 画素。PWGは pwg_convert.py、簡易生成は export_simple.py が直接作る)
import sys, json, os, numpy as np
from PIL import Image
from scipy.interpolate import LinearNDInterpolator, NearestNDInterpolator
from scipy import ndimage as ndi
W, Hh = 1400, 900
def warp(shape, seed, amp):
    rs = np.random.RandomState(seed)
    out = []
    for _ in range(2):
        n = ndi.gaussian_filter(rs.randn(*shape), 12); n /= np.abs(n).max(); out.append(n * amp)
    return out
def run(kind, src, outdir):
    d = json.load(open(src)); x = np.array(d['x'], float); y = np.array(d['y'], float)
    gx, gy = np.meshgrid(np.arange(W), np.arange(Hh))
    if True:
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
    BI = np.where(land, BI, 0)
    os.makedirs(outdir, exist_ok=True)
    dat = np.zeros((Hh, W, 3), np.uint8)
    dat[..., 0] = np.clip(H * 2.55, 0, 255).astype(np.uint8); dat[..., 1] = BI; dat[..., 2] = np.clip(ST, 0, 255)
    Image.fromarray(dat).save(outdir + '/world-data.png')
    Image.fromarray(np.zeros((Hh, W, 3), np.uint8) + np.array([120, 160, 190], np.uint8)).save(outdir + '/world-map.jpg')
    ls = land.mean(); print(kind, 'land', round(float(ls), 3), 'biomes', {int(k): round(float((BI[land] == k).mean()), 3) for k in np.unique(BI[land])})
if __name__ == '__main__':
    run(*sys.argv[1:4])
