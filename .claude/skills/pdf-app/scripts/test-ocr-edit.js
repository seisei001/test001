// OCRで文字にした後に、部品を選択・訂正できること(範囲指定の後に操作できなくなる不具合の回帰テスト)
//   node .claude/skills/pdf-app/scripts/test-ocr-edit.js   (先に make-scan-layout.js)
const fs=require('fs');
const {launch,WORK}=require('./harness');
const truth=JSON.parse(fs.readFileSync(WORK+'/samples/layout_truth.json','utf8'));
(async()=>{
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',WORK+'/samples/layout_scan.pdf');await page.waitForTimeout(2500);
  await page.click('[data-m=ocr]');
  const {VW}=await page.evaluate(()=>window.pdfEditorDebug.page());
  const t=truth.find(b=>b.name==='head'),b2=truth.find(b=>b.name==='body');
  const ov=await page.locator('#ov').boundingBox(),k=ov.width/VW;
  await page.mouse.move(ov.x+(t.x0-10)*k,ov.y+(t.top-8)*k);await page.mouse.down();await page.mouse.move(ov.x+(b2.x1+10)*k,ov.y+(b2.bottom+8)*k,{steps:6});await page.mouse.up();
  await page.waitForFunction(()=>/done|fail/.test(document.querySelector('#job').className),null,{timeout:300000});
  await page.waitForTimeout(600);
  console.log('変換後のモード:',await page.evaluate(()=>document.querySelector('#modeSeg .on').dataset.m));
  // 1) 部品をクリックして選択できる 2) 文字を打って訂正できる
  const box=page.locator('.ibox').first();
  const bb=await box.boundingBox();
  await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await page.waitForTimeout(400);
  const selected=await page.evaluate(()=>!!document.querySelector('.ibox.sel,.ibox.cur,.ibox.on')||!document.querySelector('#selPanel')?.classList.contains('hidden'));
  console.log('クリックで選択できた:',selected);
  const before=(await page.evaluate(()=>window.pdfEditorDebug.items()))[0].txt;
  await page.keyboard.type('訂正');await page.waitForTimeout(300);
  const after=(await page.evaluate(()=>window.pdfEditorDebug.items()))[0].txt;
  console.log('訂正できた:',before!==after,JSON.stringify(before),'→',JSON.stringify(after));
  // 3) 別の部品もクリックで選べる
  const bb2=await page.locator('.ibox').nth(1).boundingBox();
  await page.mouse.click(bb2.x+bb2.width/2,bb2.y+bb2.height/2);await page.waitForTimeout(300);
  console.log('2つ目も選べた:',await page.evaluate(()=>document.activeElement&&document.activeElement.classList.contains('t')));
  // OCRモードに戻しても、部品をタップすれば選択・訂正に切り替わる
  await page.click('[data-m=ocr]');await page.waitForTimeout(300);
  const bb3=await page.locator('.ibox').nth(1).boundingBox();
  await page.mouse.click(bb3.x+bb3.width/2,bb3.y+bb3.height/2);await page.waitForTimeout(400);
  console.log('OCRモードで部品をタップ→選択モードへ:',await page.evaluate(()=>document.querySelector('#modeSeg .on').dataset.m==='sel'&&document.activeElement.classList.contains('t')));
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_edit.png'});
  await browser.close();
})();
