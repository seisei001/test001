// 「文字だけ消す」(ink)と「文字のところを白抜き」(text)を、難しい合成スキャンで比べる(罫線にまたがる文字・色付き背景・グラデ・近くの印影と矢印)。
//   node .claude/skills/pdf-app/scripts/test-studio-ink2.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  execSync('python3 -W ignore '+path.join(__dirname,'make-ink-scan.py'));
  const SC=150/72;
  {const d=await PDFDocument.create(),im=await d.embedJpg(fs.readFileSync('/tmp/inkscan_scan.jpg')),p=d.addPage([595.2,842.4]);p.drawImage(im,{x:0,y:0,width:595.2,height:842.4});fs.writeFileSync('/tmp/inkscan.pdf',await d.save());}
  const boxes=JSON.parse(fs.readFileSync('/tmp/inkscan_boxes.json','utf8'));
  execSync('pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/inkscan.pdf /tmp/inkscan_orig');
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const measure=png=>execSync(`python3 -W ignore -c "
import numpy as np
from PIL import Image
a=np.array(Image.open('/tmp/inkscan_orig.png').convert('RGB')).astype(int);b=np.array(Image.open('${png}').convert('RGB')).astype(int)
mt=np.array(Image.open('/tmp/inkscan_m_text.png'))>0;mr=np.array(Image.open('/tmp/inkscan_m_rule.png'))>0;mf=np.array(Image.open('/tmp/inkscan_m_fig.png'))>0
gb=b.mean(axis=2)
pure=mt&~mr&~mf
res=(gb[pure]<140).mean()
rk=(gb[mr]<170).mean();fk=(gb[mf]<170).mean() if mf.any() else 1
import cv2
near=cv2.dilate((mt|mr|mf).astype(np.uint8),np.ones((13,13),np.uint8))>0
# 背景: 文字・罫線・図形から離れた所で、箱のまわり(文字を消した範囲の外側を除く)
bgmask=~near
bgd=np.abs(a-b).mean(axis=2)[bgmask].mean()
import sys
go=np.array(Image.open('/tmp/inkscan_orig.png').convert('RGB')).astype(int).mean(axis=2)
rk0=(go[mr]<170).mean();fk0=(go[mf]<170).mean()
print(round(res*100,2),round(rk/rk0*100,2),round(fk/fk0*100,2),round(bgd,3))"`).toString().trim().split(' ').map(Number);
  const run=async mode=>{
    await page.reload();await page.waitForTimeout(2300);
    await page.setInputFiles('#fAdd',['/tmp/inkscan.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const f=page.frames().find(x=>x!==page.mainFrame());
    for(const b of boxes)await f.evaluate(([b,mode,sc])=>window.pdfEditorDebug.addFix({s:b.s,x:b.x0/sc-1,y:b.y0/sc-1,w:(b.x1-b.x0)/sc+2,h:(b.y1-b.y0)/sc+2,size:b.size/sc,mode,txt:'.'}),[b,mode,SC]);
    if(mode==='ink')await f.evaluate(()=>window.pdfEditorDebug.inkAll());else await page.waitForTimeout(1000);
    const st=await f.evaluate(()=>window.pdfEditorDebug.inkState());
    await page.frameLocator('#formFrame').locator('#embSave').click();await page.waitForTimeout(mode==='ink'?9000:5000);
    fs.writeFileSync('/tmp/inkscan_'+mode+'.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
    execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/inkscan_${mode}.pdf /tmp/inkscan_${mode}`);
    return{st,m:measure(`/tmp/inkscan_${mode}.png`)};
  };
  const A=await run('ink'),B=await run('text');
  console.log('   ink のパッチ:',JSON.stringify(A.st.map(s=>s.ink&&(s.ink.failed?'失敗':s.ink.n))));
  console.log('        文字の残り%  罫線の残り%  図形の残り%  背景の変化');
  console.log('   ink ',A.m.join('   '));console.log('   text',B.m.join('   '));
  ok('ink: 文字が消える(残り '+A.m[0]+'%)',A.m[0]<=5);
  ok('ink: 罫線が残る('+A.m[1]+'%)',A.m[1]>=97);
  ok('ink: 図形が残る('+A.m[2]+'%)',A.m[2]>=97);
  ok('ink: 背景が乱れない(変化 '+A.m[3]+')',A.m[3]<1.5);
  ok('ink は text より罫線・図形を残す(罫線 '+A.m[1]+' ≥ '+B.m[1]+')',A.m[1]>=B.m[1]);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
