// 罫線編集(その3): 選んだ線の、いまの太さ・色を欄に出す / 「範囲で選ぶ」(指でも)
//   node .claude/skills/pdf-app/scripts/test-studio-rules3.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/rules3_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([400,300]);
   p.drawLine({start:{x:50,y:250},end:{x:350,y:250},thickness:2.5,color:rgb(1,0,0)});
   p.drawLine({start:{x:50,y:200},end:{x:350,y:200},thickness:1,color:rgb(0,0,1)});
   p.drawLine({start:{x:50,y:150},end:{x:350,y:150},thickness:1,color:rgb(0,0,0)});
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),F=()=>page.frames().find(x=>x!==page.mainFrame());
  const R=()=>F().evaluate(()=>window.pdfEditorDebug.rules());
  let r=await R();const red=r.filter(x=>Math.abs(x.t-2.5)<0.01)[0],blue=r.filter(x=>x.t<1.5).sort((a,b)=>a.v[1]-b[1])[0];
  await fr.locator(`#ov .rl[data-i="${red.i}"]`).dispatchEvent('click');await page.waitForTimeout(200);
  ok('赤い線を選ぶと、太さの欄が 2.5: '+await fr.locator('#rW').inputValue(),(await fr.locator('#rW').inputValue())==='2.5');
  ok('色の欄が赤: '+await fr.locator('#rC').inputValue(),(await fr.locator('#rC').inputValue())==='#ff0000');
  await fr.locator('#rClr').click();
  await fr.locator(`#ov .rl[data-i="${blue.i}"]`).dispatchEvent('click');await page.waitForTimeout(200);
  ok('青い線を選ぶと、色の欄が青: '+await fr.locator('#rC').inputValue(),(await fr.locator('#rC').inputValue())==='#0000ff');
  await fr.locator('#rClr').click();
  // 範囲で選ぶ(指=pointerType touch)
  await fr.locator('#rBand').click();
  const ob=await fr.locator('#ov').boundingBox();
  await F().evaluate(([x0,y0,x1,y1])=>{const ov=document.getElementById('ov'),mk=(t,x,y)=>new PointerEvent(t,{pointerType:'touch',pointerId:7,isPrimary:true,button:0,clientX:x,clientY:y,bubbles:true,cancelable:true});
    ov.dispatchEvent(mk('pointerdown',x0,y0));document.dispatchEvent(mk('pointermove',(x0+x1)/2,(y0+y1)/2));document.dispatchEvent(mk('pointermove',x1,y1));document.dispatchEvent(mk('pointerup',x1,y1));},[ob.x+5,ob.y+ob.height*0.1,ob.x+ob.width-5,ob.y+ob.height*0.55]);
  await page.waitForTimeout(400);
  const sel=(await R()).filter(x=>x.on).length;ok('指のドラッグで、範囲を通る罫線をまとめて選べる(上の2本=2本): '+sel,sel===2);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
