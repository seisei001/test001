// 写真(木目の机・紙の伝票)の上に、大きな枠を置いても、机や紙が「白くかすむ」ことがない。紙の上の小さな枠なら、文字だけ消える
//   node .claude/skills/pdf-app/scripts/test-studio-inkphoto.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  execSync('python3 -W ignore '+path.join(__dirname,'make-photo-scan.py'));
  {const d=await PDFDocument.create(),im=await d.embedJpg(fs.readFileSync('/tmp/photoscan.jpg')),p=d.addPage([595.2,842.4]);p.drawImage(im,{x:0,y:0,width:595.2,height:842.4});fs.writeFileSync('/tmp/photoscan.pdf',await d.save());}
  const SC=150/72,boxes=JSON.parse(fs.readFileSync('/tmp/photoscan_boxes.json','utf8'));
  execSync('pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/photoscan.pdf /tmp/photoscan_orig');
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());page.on('console',m=>{if(/失敗/.test(m.text()))console.log('   console:',m.text().slice(0,400));});
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',['/tmp/photoscan.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
  // (1) 机と紙にまたがる、大きな枠(190〜560 x 280〜520 pt)に「あ」を入れる
  const X=v=>ob.x+v*k,Y=v=>ob.y+v*k;
  await page.mouse.move(X(40),Y(150));await page.mouse.down();await page.mouse.move(X(260),Y(400),{steps:8});await page.mouse.up();await page.waitForTimeout(800);
  await page.keyboard.type('あ');await page.waitForTimeout(1500);
  const st=await f.evaluate(()=>window.pdfEditorDebug.inkState());console.log('   大きな枠の状態:',JSON.stringify(st));
  await page.mouse.click(ob.x+ob.width-8,ob.y+ob.height-8);await page.waitForTimeout(4500);
  const b=await f.evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/photoscan_big.pdf',Buffer.from(b));
  execSync('pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/photoscan_big.pdf /tmp/photoscan_big');
  const diff=execSync(`python3 -W ignore -c "
import numpy as np
from PIL import Image
a=np.array(Image.open('/tmp/photoscan_orig.png').convert('RGB')).astype(int);b=np.array(Image.open('/tmp/photoscan_big.png').convert('RGB')).astype(int)
# 大きな枠の範囲(150dpi: x 83-542, y 312-833)のうち、「あ」の文字のまわり以外で、元と違う画素の割合
r=(slice(312,833),slice(83,542))
d=np.abs(a[r]-b[r]).mean(axis=2)
d[:200,:200]=0   # 入れた「あ」の字(枠の左上)は除く
print(round((d>30).mean()*100,3))"`).toString().trim();
  ok('大きな枠を置いても、枠の範囲の画像が、ほとんど変わらない(変わった画素 '+diff+'%)',+diff<1.0);
  // (2) 紙の上の、1行の文字(「払込受領証」)を覆う小さな枠なら、その文字が消える
  const bx=boxes.find(q=>/払込/.test(q.s));
  await page.mouse.move(X(bx.x0/SC-2),Y(bx.y0/SC-1));await page.mouse.down();await page.mouse.move(X(bx.x1/SC+2),Y(bx.y1/SC+1),{steps:6});await page.mouse.up();await page.waitForTimeout(800);
  await page.keyboard.type('.');await page.waitForTimeout(1200);
  console.log('   小さな枠の状態:',JSON.stringify(await f.evaluate(()=>window.pdfEditorDebug.inkState())));
  console.log('   理由:',await f.evaluate(()=>window.pdfEditorDebug.inkWhy&&window.pdfEditorDebug.inkWhy()));
  await page.mouse.click(ob.x+ob.width-8,ob.y+ob.height-8);await page.waitForTimeout(4500);
  const b2=await f.evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/photoscan_small.pdf',Buffer.from(b2));
  execSync('pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/photoscan_small.pdf /tmp/photoscan_small');
  const left=execSync(`python3 -W ignore -c "
import numpy as np
from PIL import Image
b=np.array(Image.open('/tmp/photoscan_small.png').convert('L')).astype(int);a=np.array(Image.open('/tmp/photoscan_orig.png').convert('L')).astype(int)
x0,y0,x1,y1=${Math.round(bx.x0)},${Math.round(bx.y0)},${Math.round(bx.x1)},${Math.round(bx.y1)}
print(int((a[y0:y1,x0:x1]<120).sum()),int((b[y0:y1,x0:x1]<120).sum()))"`).toString().trim().split(' ').map(Number);
  ok('紙の上の、1行の文字を覆う小さな枠では、その文字が消える(暗い画素 '+left[0]+' → '+left[1]+')',left[1]<left[0]*0.1);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
