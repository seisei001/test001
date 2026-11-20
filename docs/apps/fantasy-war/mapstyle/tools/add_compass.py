# 方位記号(Geminiの絵・白背景)を、できあがった地図の隅に乗算で重ねる。
# 使い方: python3 add_compass.py <地図.jpg> <方位.jpg> <出力.jpg> [大きさpx=210] [位置 bl|br|tl|tr]
import cv2, numpy as np, sys
m = cv2.imread(sys.argv[1]).astype(np.float32); c = cv2.imread(sys.argv[2]).astype(np.float32)
size = int(sys.argv[4]) if len(sys.argv) > 4 else 210; pos = sys.argv[5] if len(sys.argv) > 5 else 'bl'
bg = np.percentile(c.reshape(-1, 3), 97, axis=0); c = np.clip(c / bg, 0, 1)           # 紙の白を完全な白に
c = np.clip((c - 0.90) / 0.10, 0, 1) * 0.0 + np.where(c > 0.93, 1.0, c / 0.93)         # ほぼ白は完全な白(透明)
ys, xs = np.nonzero(c.min(axis=2) < 0.9); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
c = c[y0:y1 + 1, x0:x1 + 1]; s = size / max(c.shape[:2]); c = cv2.resize(c, (int(c.shape[1] * s), int(c.shape[0] * s)), interpolation=cv2.INTER_AREA)
h, w = c.shape[:2]; H, W = m.shape[:2]; pad = 62                                       # 枠(50px)の内側に余白
x = pad if pos[1] == 'l' else W - pad - w; y = H - pad - 48 - h if pos[0] == 'b' else pad + 48   # 氷の帯(上下約45px)を避ける
m[y:y + h, x:x + w] *= c
cv2.imwrite(sys.argv[3], np.clip(m, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
