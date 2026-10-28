// 罫線編集: 罫線(線・四角の枠・薄い塗り四角)の選択と削除。消した本数・残りの罫線・画面の差を確かめる
//   node .claude/skills/pdf-app/scripts/test-studio-rules.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/rules_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([400,300]);
   for(let i=0;i<4;i++)p.drawLine({start:{x:50,y:250-i*40},end:{x:350,y:250-i*40},thickness:1,color:rgb(0,0,0)});   // 横線4本
   for(let i=0;i<3;i++)p.drawLine({start:{x:50+i*150,y:250},end:{x:50+i*150,y:130},thickness:1,color:rgb(0,0,0)});   // 縦線3本
   p.drawRectangle({x:60,y:60,width:120,height:40,borderWidth:1,borderColor:rgb(0,0,0)});   // 四角の枠(4辺)
   p.drawRectangle({x:220,y:80,width:120,height:0.75,color:rgb(0,0,0)});   // 薄い塗り四角(罫線の代わり)
   p.drawText('ABC',{x:70,y:190,size:14});
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  ok('フォーム名: '+await page.textContent('#formName')+' '+await page.textContent('#formVer'),/罫線編集/.test(await page.textContent('#formName')));
  const R=()=>f.evaluate(()=>window.pdfEditorDebug.rules());
  let r=await R();
  ok('罫線が 横4+縦3+枠4+薄い四角1 = 12 本見つかる: '+(r&&r.length),r&&r.length===12);
  const render=(u8,n)=>{const p='/tmp/rules_'+n;fs.writeFileSync(p+'.pdf',Buffer.from(u8));execSync(`pdftoppm -r 72 -png -singlefile ${p}.pdf ${p}`);return p+'.png';};
  const diff=(a,b)=>{const out=execSync(`python3 -c "
from PIL import Image,ImageChops
a=Image.open('${a}').convert('L');b=Image.open('${b}').convert('L')
d=ImageChops.difference(a,b).point(lambda v:255 if v>60 else 0)
print(d.getbbox(), sum(1 for v in d.getdata() if v))"`).toString().trim();return out;};
  const bytes0=await f.evaluate(()=>window.pdfEditorDebug.bytes());const png0=render(bytes0,'0');
  // 横線を1本タップして消す
  const hz=r.filter(x=>x.kind==='seg'&&Math.abs(x.v[1]-x.v[3])<1);
  await fr.locator('#ov .rl[data-i="'+(hz[1].i)+'"]').dispatchEvent('click');await page.waitForTimeout(200);
  ok('タップで選ばれる',(await R()).filter(x=>x.on).length===1);
  await fr.locator('#rDel').click();await page.waitForTimeout(1800);
  r=await R();ok('1本消えて 11 本: '+(r&&r.length),r&&r.length===11);
  const bytes1=await f.evaluate(()=>window.pdfEditorDebug.bytes());const png1=render(bytes1,'1');
  console.log('    差:',diff(png0,png1));
  ok('文字は残っている',/ABC/.test(execSync(`pdftotext /tmp/rules_1.pdf -`).toString()));
  // 四角の枠の辺を1つ消す(残り3辺が線として残る)
  const edge=r.filter(x=>x.v[1]>120&&x.v[1]<250&&x.v[3]>120&&x.v[3]<250&&(Math.abs(x.v[0]-x.v[2])<1?(x.v[0]>55&&x.v[0]<185):(x.v[0]>55&&x.v[2]<185)));ok('四角の枠の辺は4つ見つかる: '+edge.length,edge.length===4);
  await fr.locator('#ov .rl[data-i="'+(edge[0].i)+'"]').dispatchEvent('click');await fr.locator('#rDel').click();await page.waitForTimeout(1800);
  r=await R();ok('辺を消して 10 本(辺3 + 線として書き直し)',r&&r.length===10);
  // 薄い塗り四角をドラッグで囲んで消す
  const bar=r.filter(x=>x.kind==='bar');ok('薄い塗り四角が罫線になっている',bar.length===1);
  await fr.locator('#ov .rl[data-i="'+(bar[0].i)+'"]').dispatchEvent('click');await fr.locator('#rDel').click();await page.waitForTimeout(1800);
  r=await R();ok('9 本',r&&r.length===9);
  // 全部選んで消す
  await fr.locator('#rAll').click();await fr.locator('#rDel').click();await page.waitForTimeout(2000);
  r=await R();ok('全部消えて 0 本',r&&r.length===0);
  const b2=await f.evaluate(()=>window.pdfEditorDebug.bytes());const png2=render(b2,'2');
  console.log('    最後の画像: 黒い画素',execSync(`python3 -c "
from PIL import Image
a=Image.open('${png2}').convert('L');print(sum(1 for v in a.getdata() if v<128))"`).toString().trim());
  ok('文字は残っている(全部消したあと)',/ABC/.test(execSync(`pdftotext /tmp/rules_2.pdf -`).toString()));
  // 元に戻す
  await fr.locator('#bUndo').click();await page.waitForTimeout(1500);
  r=await R();ok('元に戻すと 9 本に戻る',r&&r.length===9);
  await fr.locator('#embSave').click();await page.waitForTimeout(2500);
  ok('保存でフォームが閉じる',await page.evaluate(()=>document.getElementById('formHost').classList.contains('hidden')));
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
