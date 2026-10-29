# 合成スキャン(150dpi, A4相当 1240x1755)。表の罫線に文字がまたがる/色付き背景/近くの印影。すべて架空
import json, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
W,H=1240,1755
JP='/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'
rng=np.random.default_rng(3)
img=np.full((H,W,3),255,np.uint8)
img[300:420,100:1140]=(255,248,200)   # 薄い黄色の帯(色付き背景)
img[900:1100,100:1140]=np.linspace(235,255,1040)[None,:,None].astype(np.uint8)*np.array([1,1,1])  # ゆるいグラデ
im=Image.fromarray(img);d=ImageDraw.Draw(im)
m_text=np.zeros((H,W),np.uint8);m_rule=np.zeros((H,W),np.uint8);m_fig=np.zeros((H,W),np.uint8)
boxes=[]
def rule_h(y,x0,x1,t=2):
    d.rectangle([x0,y,x1,y+t-1],fill=(0,0,0));m_rule[y:y+t,x0:x1+1]=1
def rule_v(x,y0,y1,t=2):
    d.rectangle([x,y0,x+t-1,y1],fill=(0,0,0));m_rule[y0:y1+1,x:x+t]=1
def text(x,y,s,size):  # y=上端
    f=ImageFont.truetype(JP,size)
    tm=Image.new('L',(W,H),0);ImageDraw.Draw(tm).text((x,y),s,font=f,fill=255)
    t=np.array(tm)>100;m_text[t]=1
    d.text((x,y),s,font=f,fill=(0,0,0))
    bb=f.getbbox(s);boxes.append(dict(s=s,x0=x+bb[0],y0=y+bb[1],x1=x+bb[2],y1=y+bb[3],size=size))
# 表(3行 x 2列)
for y in (200,300,420,520):rule_h(y,100,1140)
for x in (100,520,1140):rule_v(x,200,520)
text(120,240,'氏名又は名称',34)
text(540,240,'ABCDEFG',34)
text(120,330,'登録番号等',34)       # 色付き背景の上
text(540,330,'E0123456',34)
# 文字が下の罫線に重なる(下端が罫線にかかる)
text(120,468,'事務所',40)          # 40px: 468〜(約)512+ → 罫線 y=520 にはかからない ので少し下げる
text(540,486,'通知 C03',38)        # 下端が罫線(520)に触れる/またぐ
# グラデ背景の上の文字
text(120,940,'グラデの上の文字',34)
# 図形: 印影(赤い丸)・矢印
cv=np.array(im);cv2.circle(cv,(900,1300),50,(200,0,0),4);m_fig[...]=m_fig
mf=np.zeros((H,W),np.uint8);cv2.circle(mf,(900,1300),50,1,6);m_fig|=mf
cv2.arrowedLine(cv,(300,1300),(420,1300),(0,0,0),3,tipLength=0.25);mf=np.zeros((H,W),np.uint8);cv2.arrowedLine(mf,(300,1300),(420,1300),1,5,tipLength=0.25);m_fig|=mf
im=Image.fromarray(cv);d=ImageDraw.Draw(im)
text(450,1285,'近くの文字',34)     # 矢印の右・印影の左にある文字
im.save('/tmp/inkscan_scan.jpg',quality=75)
Image.fromarray(m_text*255).save('/tmp/inkscan_m_text.png');Image.fromarray(m_rule*255).save('/tmp/inkscan_m_rule.png');Image.fromarray(m_fig*255).save('/tmp/inkscan_m_fig.png')
json.dump(boxes,open('/tmp/inkscan_boxes.json','w'),ensure_ascii=False)
print(len(boxes),'boxes')
