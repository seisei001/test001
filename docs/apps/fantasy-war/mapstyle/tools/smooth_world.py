# 世界データの高さだけをならす(陸と海の区別・群系・国はそのまま)。usage: smooth_world.py <src dir> <out dir> <sigma>
import sys, os, shutil, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out, sg = sys.argv[1], sys.argv[2], float(sys.argv[3]); os.makedirs(out, exist_ok=True)
for f in os.listdir(src):
    if os.path.isfile(os.path.join(src, f)) and f != 'world-data.png': shutil.copy(os.path.join(src, f), os.path.join(out, f))
a = np.array(Image.open(src + '/world-data.png')); R = a[..., 0].astype(np.float32); land = (a[..., 1] > 0) & (R >= 20)
if sg > 0:
    # 陸の高さだけをならす(海の値が混ざらないよう、陸の重みで平均)
    w = ndi.gaussian_filter(land.astype(np.float32), sg); v = ndi.gaussian_filter(np.where(land, R, 0), sg)
    Rn = np.where(land, np.maximum(v / np.maximum(w, 1e-3), 20), R)
    a[..., 0] = np.clip(Rn, 0, 255).astype(np.uint8)
Image.fromarray(a).save(out + '/world-data.png')
