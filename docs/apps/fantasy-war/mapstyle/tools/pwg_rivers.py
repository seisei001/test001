# PWGの流量(disch)と湖(lake)を、世界データと同じ位置(1400x900・中央900・回転)に置く。
# 使い方: python3 pwg_rivers.py <接頭辞(…/w7)> <世界dir> <回転0か1>   出力: river_q.npy(流量) lake.png(湖)
import numpy as np, sys, json, cv2
from scipy import ndimage as ndi
pre, out, rot = sys.argv[1], sys.argv[2].rstrip('/'), int(sys.argv[3])
n = json.load(open(pre + '.json'))['n']
q = np.fromfile(pre + '_disch.bin', np.float32).reshape(n, n); lk = (np.fromfile(pre + '_lake.bin', np.int32).reshape(n, n) >= 0).astype(np.float32)
if rot: q, lk = np.rot90(q), np.rot90(lk)
q = ndi.maximum_filter(np.ascontiguousarray(q), size=2); q9 = cv2.resize(q, (900, 900), interpolation=cv2.INTER_NEAREST)
l9 = cv2.resize(ndi.maximum_filter(np.ascontiguousarray(lk), size=2), (900, 900), interpolation=cv2.INTER_NEAREST)
Q = np.zeros((900, 1400), np.float32); L = np.zeros((900, 1400), np.uint8); Q[:, 250:1150] = q9; L[:, 250:1150] = (l9 > 0) * 255
np.save(out + '/river_q.npy', Q); cv2.imwrite(out + '/lake.png', L)
print('ok', float((Q > 1).sum()), int((L > 0).sum()))
