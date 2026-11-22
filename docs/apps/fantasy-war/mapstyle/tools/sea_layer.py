# 海の深さの色と浅瀬を、透明な層(地図と同じ位置のUV)にする。illus.py の FM_DEPTH(岸からの距離で浅い=明るい・沖=濃い青+沖の深み)と
# FM_COAST=2 の浅瀬(岸ぞいの明るい青緑)の考え方を、3D用の層にしたもの(2Dの絵の羊皮紙の上でなく、3Dの海の面の上に重ねる)。
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
def build(land, seed=1, depth_k=0.8, depth_d=230.0, shallow_k=0.8, shallow_d=30.0, deep2_k=0.7):
    H, W = land.shape; sea = ~land
    dist = ndi.distance_transform_edt(~land).astype(np.float32)
    dd = ndi.gaussian_filter(dist, 6); dep = np.clip(dd / depth_d, 0, 1) ** 0.85
    nz = ndi.gaussian_filter(np.random.RandomState(seed + 41).randn(H, W).astype(np.float32), 28); nz /= (nz.std() + 1e-6)
    far = np.clip((dd - 110.0) / 90.0, 0, 1); core = ndi.gaussian_filter(np.clip(far * (0.65 + 0.35 * nz), 0, 1), 5) * deep2_k
    closed = ndi.binary_closing(land, structure=np.ones((3, 3), bool), iterations=7)
    dw = ndi.gaussian_filter(ndi.distance_transform_edt(~closed).astype(np.float32), 2.5); sh = np.exp(-dw / shallow_d) * shallow_k
    rgb = np.zeros((H, W, 3), np.float32); a = np.zeros((H, W), np.float32)
    def over(c, k):
        nonlocal rgb, a
        k = np.clip(k, 0, 1); na = k + a * (1 - k); rgb = np.where(na[..., None] > 0, (np.array(c, np.float32) * k[..., None] + rgb * (a * (1 - k))[..., None]) / np.maximum(na[..., None], 1e-6), rgb); a = na
    over((86, 122, 150), dep * depth_k * 0.9)          # 沖ほど濃い青灰
    over((42, 74, 112), core)                           # 沖の深み(最濃の青の塊)
    over((206, 232, 222), sh)                           # 岸ぞいの浅瀬
    a = a * sea; out = np.dstack([rgb, a * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

def colormap(land, seed=1, base=(180, 196, 192)):
    """3Dの海の面に貼る、不透明な色の地図(1400x700 RGB)。層(build)を、海の基本色の上に重ねたもの。陸の所は基本色のまま(陸は地形の面が覆う)。"""
    lay = np.array(build(land, seed)).astype(np.float32); a = lay[..., 3:4] / 255
    rgb = np.array(base, np.float32) * (1 - a) + lay[..., :3] * a
    return Image.fromarray(rgb.clip(0, 255).astype(np.uint8), 'RGB')
