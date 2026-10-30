# 写真風の合成スキャン(木目の机の上に、紙の伝票が並ぶ)。すべて架空。紙の上の小さな文字と、机の模様
import numpy as np, cv2, json
from PIL import Image, ImageDraw, ImageFont
W,H=1240,1755
rng=np.random.default_rng(5)
yy,xx=np.mgrid[0:H,0:W]
wood=np.zeros((H,W,3),np.float32)
base=np.array([90,60,40],np.float32)
stripe=(np.sin(yy/9.0+np.sin(xx/70.0)*3)*0.5+0.5)
n=rng.normal(0,14,(H,W))
for c in range(3):wood[...,c]=base[c]*(0.7+0.5*stripe)+n*(0.6+0.1*c)
img=np.clip(wood,0,255).astype(np.uint8)
# 紙(白っぽい帯)
cv2.rectangle(img,(200,300),(560,1500),(238,236,230),-1)
im=Image.fromarray(img);d=ImageDraw.Draw(im)
JP='/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'
boxes=[]
def text(x,y,s,size):
    f=ImageFont.truetype(JP,size);d.text((x,y),s,font=f,fill=(30,30,40));bb=f.getbbox(s);boxes.append(dict(s=s,x0=x+bb[0],y0=y+bb[1],x1=x+bb[2],y1=y+bb[3],size=size))
text(230,360,'払込受領証',40);text(230,450,'北山 裕司 様',34);text(230,560,'請求番号',30);text(230,640,'310012001695',34)
im.save('/tmp/photoscan.jpg',quality=80);json.dump(boxes,open('/tmp/photoscan_boxes.json','w'),ensure_ascii=False)
print(len(boxes))
