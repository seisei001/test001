// ページ編集: PDFの文字がある別の場所があるページでも、画像の文字の上に枠を作れば、読み取った文字が入力枠に入る
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument,StandardFonts}=require(LIB+'pdf-lib');
(async()=>{
  execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile ${WORK}/samples/form_scan.pdf /tmp/mx_src && python3 -W ignore -c "
from PIL import Image
Image.open('/tmp/mx_src.png').crop((200,235,1100,320)).save('/tmp/mx_crop.png')"`);
  {const d=await PDFDocument.create(),p=d.addPage([595,842]),f=await d.embedFont(StandardFonts.Helvetica);
   p.drawText('Header text here',{x:80,y:780,size:18,font:f});
   const img=await d.embedPng(fs.readFileSync('/tmp/mx_crop.png'));p.drawImage(img,{x:80,y:500,width:450,height:42.5});   // 画像の文字(日本語)
   fs.writeFileSync(WORK+'/samples/mixed_ocr.pdf',await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/mixed_ocr.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await f.evaluate(()=>{window.__noAutoOcr=false;window.__noEraseAsk=false;window.__noEraseOcr=true;});
  await fr.locator('[data-m=text]').click();await page.waitForTimeout(400);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595;
  // 画像(y=842-542=300〜342)の、文字の一部の上に枠を作る
  await page.mouse.move(ob.x+230*k,ob.y+298*k);await page.mouse.down();await page.mouse.move(ob.x+420*k,ob.y+345*k,{steps:6});await page.mouse.up();
  for(let i=0;i<40;i++){await page.waitForTimeout(2000);if((await f.evaluate(()=>window.pdfEditorDebug.items())).length)break;}await page.waitForTimeout(1500);
  const its=await f.evaluate(()=>window.pdfEditorDebug.items());console.log('   枠',JSON.stringify(its.map(i=>({t:i.type,txt:i.txt}))));
  chk('PDFの文字がある別の場所があっても、画像の文字を読み取って、入力枠に入れる(空の枠ではない)',its.length>=1&&its.some(i=>(i.txt||'').trim().length>=1)&&!its.some(i=>i.type==='text'&&!(i.txt||'').trim()));
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
