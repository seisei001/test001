# 縮尺(スケールバー)を地図の隅に描く。地図の横幅1400px=地球一周40,075km(ユーザー確定 11-20)。1px≒28.6km。
# 使い方: python3 add_scale.py <地図.jpg> <出力.jpg> [位置 br|bl|...]
import sys
from PIL import Image, ImageDraw, ImageFont
KM_PER_PX = 40075.0 / 1400
src, dst = sys.argv[1], sys.argv[2]; pos = sys.argv[3] if len(sys.argv) > 3 else 'br'
im = Image.open(src).convert('RGB'); W, H = im.size; d = ImageDraw.Draw(im)
total = 5000; segs = 4; L = total / KM_PER_PX; sw = L / segs            # 5000kmを4区間(1250kmずつ)
INK = (58, 40, 28); CREAM = (240, 228, 190)
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc', 15, index=2)
x0 = (W - 62 - 40 - L) if pos[1] == 'r' else 62; y0 = (H - 62 - 48 - 8) if pos[0] == 'b' else 62 + 48 + 20   # 氷の帯を避ける
for i in range(segs):
    d.rectangle([x0 + i * sw, y0, x0 + (i + 1) * sw, y0 + 7], fill=INK if i % 2 == 0 else CREAM, outline=INK, width=1)
for i in range(segs + 1):
    x = x0 + i * sw; d.line([x, y0 - 5, x, y0 + 12], fill=INK, width=1)
for i, t in ((0, '0'), (2, '2,500'), (4, '5,000 km')):
    w = d.textlength(t, font=f); xc = x0 + i * sw
    d.text((xc - (w if i == 4 else w / 2) + (d.textlength(' km', font=f) if i == 4 else 0), y0 - 26), t, font=f, fill=INK)
im.save(dst, quality=93)
