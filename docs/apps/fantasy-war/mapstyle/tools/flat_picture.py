# ①平坦な絵(世界地図の完成した一枚の絵)を描く。最上位仕様(STATE.md カード0・11-24 ユーザー)の第1工程。
# 海・海岸線・地面の色(群系→高さで岩・雪)・川・湖・森を、すべてこの一枚の絵に描く。②ローポリ ③UV貼りは、この絵を使うだけ(立体側で絵を足さない)。
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
import lowpoly, sea_layer

def draw(H, land, BI, seed, layers=()):
    """H:(h,w)地図の高さ land:(h,w)bool陸(湖を含む) BI:群系 layers:RGBAの透明な層(森・川湖など。下から順)。返す: (h,w,3) uint8 RGB"""
    h, w = H.shape; rs = np.random.RandomState(seed + 3)
    lut = np.zeros((16, 3), np.float32)
    for k in range(16): lut[k] = lowpoly.BASE.get(k, (150, 170, 110))
    hmax = max(np.percentile(H[land], 99.7), 60.0); hz = np.clip((H - 20) / (hmax - 20), 0, 1)
    T = lut[np.clip(BI, 0, 15)].copy(); cold = np.isin(BI, [2, 9, 10, 11])
    rt = np.clip((hz - 0.30) / 0.30, 0, 1)[..., None]; T = T * (1 - rt) + lowpoly.ROCK * rt
    st = np.clip((hz - np.where(cold, 0.45, 0.75)) / 0.15, 0, 1)[..., None]; T = T * (1 - st) + lowpoly.SNOW * st
    nz = sum(ndi.gaussian_filter(rs.randn(h, w).astype(np.float32), s) * a for s, a in ((1.0, 0.5), (3.0, 1.2), (8.0, 1.6)))   # 絵の質感(平坦な絵の中の模様)
    nz = nz / (np.abs(nz).max() + 1e-6); T = np.clip(T * (1 + 0.25 * nz[..., None]), 0, 255)
    for L in layers:                                       # 森・川・湖(陸の上)。陸の外には描かない
        L = np.array(L).astype(np.float32); a = (L[..., 3:4] / 255) * land[..., None]
        T = T * (1 - a) + L[..., :3] * a
    ink = np.array(sea_layer.coast_ink(land)).astype(np.float32); ia = ink[..., 3:4] / 255
    T = T * (1 - ia) + ink[..., :3] * ia                   # 海岸線の墨(陸側の縁)
    sea = np.array(sea_layer.colormap(land, seed)).astype(np.float32)   # 海(深さ・浅瀬・波・氷・海側の縁)
    out = np.where(land[..., None], T, sea)
    return np.clip(out, 0, 255).astype(np.uint8)
