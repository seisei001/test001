// 新しく置いた文字の枠(画像のページ)も、PDFにする瞬間に、枠の範囲の下の文字のインクだけを消す(罫線・図形・背景は残す)
//   node .claude/skills/pdf-app/scripts/test-studio-ink3.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  execSync('python3 -W ignore '+path.join(__dirname,'make-ink-scan.py'));
  {const d=await PDFDocument.create(),im=await d.embedJpg(fs.readFileSync('/tmp/inkscan_scan.jpg')),p=d.addPage([595.2,842.4]);p.drawImage(im,{x:0,y:0,width:595.2,height:842.4});fs.writeFileSync('/tmp/inkscan.pdf',await d.save());}
  const boxes=JSON.parse(fs.readFileSync('/tmp/inkscan_boxes.json','utf8')),SC=150/72;
  execSync('pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/inkscan.pdf /tmp/inkscan_orig');
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',['/tmp/inkscan.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
  const targets=boxes.filter(b=>/事務所|通知|グラデ|氏名/.test(b.s));
  for(const b of targets){   // 文字の上に、文字を覆う枠をドラッグで作り、「.」を入力して、空き地をクリック(=確定)
    const x0=b.x0/SC-2,y0=b.y0/SC-1,x1=b.x1/SC+2,y1=b.y1/SC+1;
    await page.mouse.move(ob.x+x0*k,ob.y+y0*k);await page.mouse.down();await page.mouse.move(ob.x+x1*k,ob.y+y1*k,{steps:6});await page.mouse.up();await page.waitForTimeout(500);
    await page.keyboard.type('.');await page.waitForTimeout(600);
    await page.mouse.click(ob.x+ob.width-8,ob.y+ob.height-8);await page.waitForTimeout(3500);
  }
  console.log('   状態:',await f.evaluate(()=>document.querySelector('#status').textContent));
  const b=await f.evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/inkscan_new.pdf',Buffer.from(b));
  execSync('pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/inkscan_new.pdf /tmp/inkscan_new');
  const res=execSync(`python3 -W ignore -c "
import numpy as np,json
from PIL import Image
a=np.array(Image.open('/tmp/inkscan_orig.png').convert('L')).astype(int);b=np.array(Image.open('/tmp/inkscan_new.png').convert('L')).astype(int)
mt=np.array(Image.open('/tmp/inkscan_m_text.png'))>0;mr=np.array(Image.open('/tmp/inkscan_m_rule.png'))>0;mf=np.array(Image.open('/tmp/inkscan_m_fig.png'))>0
bx=json.load(open('/tmp/inkscan_boxes.json'));import re
sel=np.zeros(mt.shape,bool)
for q in bx:
  if re.search('事務所|通知|グラデ|氏名',q['s']):sel[max(0,q['y0']-1):q['y1']+2,max(0,q['x0']-2):q['x1']+3]=True
pure=mt&~mr&~mf&sel
res=(b[pure]<140).mean()
rk=((b[mr&sel]<170).mean())/((a[mr&sel]<170).mean());fk=1.0
print(round(res*100,2),round(rk*100,2))"`).toString().trim().split(' ').map(Number);
  console.log('   枠で覆った文字の残り %, 範囲内の罫線の残り %:',res.join('  '));
  ok('枠で覆った文字が消える(残り '+res[0]+'%。「.」の点が少し入る)',res[0]<=6);
  ok('枠の範囲の罫線は残る('+res[1]+'%)',res[1]>=97);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
