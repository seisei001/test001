// ページ編集: 画像の文字の上に枠を作ると、その範囲を文字認識して、認識した文字が入力枠に入る(「あ」の見本ではなく)。確定のとき、元の文字は消去されると表示し、残すかを聞く
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs');const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await f.evaluate(()=>{window.__noAutoOcr=false;window.__noEraseAsk=false;window.__noEraseOcr=true;});
  await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
  await page.mouse.move(ob.x+120*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+150*k,{steps:6});await page.mouse.up();
  for(let i=0;i<40;i++){await page.waitForTimeout(2000);if((await f.evaluate(()=>window.pdfEditorDebug.items())).length)break;}
  await page.waitForTimeout(1500);
  const its=await f.evaluate(()=>window.pdfEditorDebug.items());console.log('   枠',JSON.stringify(its.map(i=>({t:i.type,txt:i.txt}))));
  chk('認識した文字が入った枠ができる(空の枠ではない)',its.length>=1&&its.some(i=>(i.txt||'').trim().length>=1)&&!its.some(i=>i.type==='text'&&!(i.txt||'').trim()));
  await fr.locator('#embHead #sClose').click({timeout:3000}).catch(()=>{});await page.waitForTimeout(800);
  await fr.locator('#embSave').click();
  const dlg=await fr.locator('#eraseAsk').waitFor({timeout:30000}).then(()=>true).catch(()=>false);
  const info=dlg?await fr.locator('#eraseAsk').innerText():'';console.log('   確認',JSON.stringify(info.slice(0,120)));
  chk('確定のとき、元の文字は消去されると表示し、残すかを聞く',dlg&&/元の文字は、消去されます/.test(info)&&/いいえ/.test(info)&&/残して/.test(info));
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
