# 縮尺: Geminiの飾り(枠と百合の花)を使い、中の棒・目盛り・数字は自分で正確に描き直して、地図に乗算で重ねる。
# 5000km=175px(地図の横幅1400px=地球一周40,075km)。使い方: python3 add_scale2.py <地図.jpg> <飾り.jpg> <出力.jpg>
import cv2, numpy as np, sys
from PIL import Image, ImageDraw, ImageFont
m = cv2.imread(sys.argv[1]).astype(np.float32); g = cv2.imread(sys.argv[2])
INK = (28, 40, 58); CREAM = (170, 215, 232)                                   # BGR
BX0, BX1, BY0, BY1 = 168, 888, 77, 127                                        # 棒(元絵の座標)。4区間×180px
g[56:149, 133:911] = 255                                                       # 中身を白に(枠は残す)
TOP = 90; g = np.vstack([np.full((TOP, g.shape[1], 3), 255, np.uint8), g])      # 数字用の余白(上)
PAD = 110; g = np.hstack([np.full((g.shape[0], PAD, 3), 255, np.uint8), g, np.full((g.shape[0], PAD, 3), 255, np.uint8)]); BX0 += PAD; BX1 += PAD   # 数字用の余白(左右)
by0, by1 = BY0 + TOP, BY1 + TOP; sw = (BX1 - BX0) / 4
for i in range(4):
    x0, x1 = int(round(BX0 + i * sw)), int(round(BX0 + (i + 1) * sw))
    cv2.rectangle(g, (x0, by0), (x1, by1), INK if i % 2 == 0 else CREAM, -1); cv2.rectangle(g, (x0, by0), (x1, by1), INK, 2, cv2.LINE_AA)
for i in range(5):
    x = int(round(BX0 + i * sw)); cv2.line(g, (x, by0 - 18), (x, by1 + 14), INK, 2, cv2.LINE_AA)
pil = Image.fromarray(cv2.cvtColor(g, cv2.COLOR_BGR2RGB)); d = ImageDraw.Draw(pil)
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc', 52, index=2)
for i, t in ((0, '0'), (2, '2,500'), (4, '5,000 km')):
    xc = BX0 + i * sw; w = d.textlength(t, font=f)
    d.text((xc - w / 2 if i < 4 else xc - d.textlength('5,000', font=f) / 2, TOP - 70), t, font=f, fill=(58, 40, 28))
c = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR).astype(np.float32) / 255
s = 175.0 / (BX1 - BX0); c = cv2.resize(c, (int(c.shape[1] * s), int(c.shape[0] * s)), interpolation=cv2.INTER_AREA)
h, w = c.shape[:2]; H, W = m.shape[:2]
x = int(W - 62 - 40 - 175 - BX0 * s - 10); y = int(H - 62 - 48 - (by1 + 25) * s)
m[y:y + h, x:x + w] *= c
cv2.imwrite(sys.argv[3], np.clip(m, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
