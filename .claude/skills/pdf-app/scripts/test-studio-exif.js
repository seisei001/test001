// ページ編集: 向き(EXIF)つきの写真を貼っても、縦横・上下が変わらない
//   node .claude/skills/pdf-app/scripts/test-studio-exif.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  // 横長(200x100)の画像。左=赤・右=青。EXIFの向き=6(右に90度回して見る)→ 見た目は縦長で、上=赤・下=青
  execSync(`python3 -W ignore -c "
from PIL import Image
im=Image.new('RGB',(200,100));
for x in range(200):
  for y in range(100): im.putpixel((x,y),(255,0,0) if x<100 else (0,0,255))
ex=im.getexif();ex[0x0112]=6;im.save('/tmp/exif6.jpg',exif=ex.tobytes(),quality=95)"`);
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[S+'studio_A4.pdf']);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=img]').click();await fr.locator('#fImg').setInputFiles('/tmp/exif6.jpg');await page.waitForTimeout(800);
  const ob=await fr.locator('#ov').boundingBox();
  await page.mouse.click(ob.x+ob.width*0.5,ob.y+ob.height*0.5);await page.waitForTimeout(800);   // タップで貼る(幅150)
  const it=(await f.evaluate(()=>window.pdfEditorDebug.items())).pop();
  ok('枠は縦長(見た目どおり): '+Math.round(it.vw)+'x'+Math.round(it.vh),it.vh>it.vw);
  await fr.locator('#embSave').click();await page.waitForTimeout(3000);
  const u=await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)));fs.writeFileSync('/tmp/exif_out.pdf',Buffer.from(u));
  execSync('pdftoppm -r 72 -png -f 1 -l 1 -singlefile /tmp/exif_out.pdf /tmp/exif_out');
  const res=execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/exif_out.png').convert('RGB');W,H=a.size
px=a.load()
red=[(x,y) for x in range(W) for y in range(H) if px[x,y][0]>200 and px[x,y][1]<60 and px[x,y][2]<60]
blue=[(x,y) for x in range(W) for y in range(H) if px[x,y][2]>200 and px[x,y][0]<60 and px[x,y][1]<60]
def bb(l): return (min(p[0] for p in l),min(p[1] for p in l),max(p[0] for p in l),max(p[1] for p in l)) if l else None
print(len(red),len(blue),bb(red),bb(blue))"`).toString().trim();
  console.log('   ',res);
  const m=res.match(/^(\d+) (\d+) \((\d+), (\d+), (\d+), (\d+)\) \((\d+), (\d+), (\d+), (\d+)\)/);
  ok('赤と青が両方ある',!!m&&+m[1]>500&&+m[2]>500);
  if(m){const [rx0,ry0,rx1,ry1,bx0,by0,bx1,by1]=m.slice(3).map(Number);
    ok('赤が上・青が下(上下の向きが正しい)',ry1<=by0+3);
    ok('左右にずれていない(赤と青の横の範囲がほぼ同じ)',Math.abs(rx0-bx0)<4&&Math.abs(rx1-bx1)<4);
    ok('縦長: 全体 幅'+(rx1-rx0+1)+' < 高さ'+(by1-ry0+1),(rx1-rx0+1)<(by1-ry0+1));}
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
