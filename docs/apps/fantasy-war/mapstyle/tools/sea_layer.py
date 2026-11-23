# 海の深さの色と浅瀬を、透明な層(地図と同じ位置のUV)にする。illus.py の FM_DEPTH(岸からの距離で浅い=明るい・沖=濃い青+沖の深み)と
# FM_COAST=2 の浅瀬(岸ぞいの明るい青緑)の考え方を、3D用の層にしたもの(2Dの絵の羊皮紙の上でなく、3Dの海の面の上に重ねる)。
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
def build(land, seed=1, depth_k=0.8, depth_d=230.0, shallow_k=0.8, shallow_d=30.0, deep2_k=0.7, wave_k=1.0):
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
    # 波線(mapstyle45の考え方): 岸から一定の間隔の細い等距離線を、手描き風にゆらし、ところどころ切って白く引く
    if wave_k > 0:
        nz2 = ndi.gaussian_filter(np.random.RandomState(seed + 77).randn(H, W).astype(np.float32), 5); nz2 /= (nz2.std() + 1e-6)
        brk = ndi.gaussian_filter(np.random.RandomState(seed + 78).randn(H, W).astype(np.float32), 9); brk /= (brk.std() + 1e-6)
        dq = ndi.gaussian_filter(dist, 1.2) + 1.6 * nz2
        for d0, k in ((5.0, 0.55), (11.0, 0.42), (19.0, 0.30), (30.0, 0.20)):
            ln = np.clip(1.0 - np.abs(dq - d0) / 0.75, 0, 1) * np.clip((brk + 0.35) * 3, 0, 1)
            over((250, 252, 248), ln * k * wave_k)
    # 海氷(極寒の海): 緯度66度より極側で、白い氷が極に向かって増える(ところどころ割れる)
    lat = np.abs(90 - 180 * (np.arange(H) + 0.5) / H)[:, None] * np.ones((1, W), np.float32)
    ice_n = ndi.gaussian_filter(np.random.RandomState(seed + 91).randn(H, W).astype(np.float32), 7); ice_n /= (ice_n.std() + 1e-6)
    ice = np.clip((lat - 66.0) / 14.0 + 0.25 * ice_n * np.clip((lat - 60.0) / 10.0, 0, 1), 0, 1)
    over((238, 246, 250), ice * 0.88)
    a = a * sea; out = np.dstack([rgb, a * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

def colormap(land, seed=1, base=(180, 196, 192)):
    """3Dの海の面に貼る、不透明な色の地図(1400x700 RGB)。層(build)を、海の基本色の上に重ねたもの。陸の所は基本色のまま(陸は地形の面が覆う)。"""
    lay = np.array(build(land, seed)).astype(np.float32); a = lay[..., 3:4] / 255
    rgb = np.array(base, np.float32) * (1 - a) + lay[..., :3] * a
    ink = np.array(coast_ink(~ndi.binary_erosion(~land, iterations=1))).astype(np.float32); ia = ink[..., 3:4] / 255 * (~land)[..., None]   # 海側の縁
    rgb = rgb * (1 - ia) + ink[..., :3] * ia
    return Image.fromarray(rgb.clip(0, 255).astype(np.uint8), 'RGB')


def coast_ink(land, color=(78, 66, 54), alpha=0.85):
    """海岸線の細い墨線(陸側の縁の1画素)。陸の絵(3Dの地面)に重ねる透明な層。"""
    er = ndi.binary_erosion(land, iterations=1)
    edge = (land & ~er).astype(np.float32); edge = ndi.gaussian_filter(edge, 0.5); edge = np.clip(edge * 2.2, 0, 1)
    H, W = land.shape; out = np.zeros((H, W, 4), np.uint8); out[..., :3] = color; out[..., 3] = (edge * alpha * 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')
