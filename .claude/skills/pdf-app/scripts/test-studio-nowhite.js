// 新しい文字の枠: 枠のまわり(枠全体)を白くしない。画像の上の枠は、下の文字のインクだけを消す
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
// 大きめの枠(ページの高さの10%): 表の罫線にまたがる所
await page.mouse.move(ob.x+100*k,ob.y+140*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+230*k,{steps:6});await page.mouse.up();await page.waitForTimeout(700);
await page.keyboard.type('NEW');
const frameArea=await f.evaluate(()=>{const e=document.querySelector('.ibox.on').getBoundingClientRect();return e.width*e.height;});
let maxCover=0;for(let i=0;i<12;i++){await page.waitForTimeout(300);const a=await f.evaluate(()=>Math.max(0,...[...document.querySelectorAll('#ov .cover:not(.inkp)')].map(e=>{const r=e.getBoundingClientRect();return r.width*r.height;})));maxCover=Math.max(maxCover,a);}
chk('入力中も後も、枠の全体を覆う白い四角は出ない(最大 '+Math.round(maxCover)+' / 枠 '+Math.round(frameArea)+')',maxCover<frameArea*0.5);
const mode=await f.evaluate(()=>window.pdfEditorDebug.bgModes());
chk('新しい枠の下地は、「そのまま重ねる」が既定(勝手に消さない): '+mode,mode[0]==='none');
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
