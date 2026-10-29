// ページ編集(画像の文字認識): 直した枠は、元の画像を重ねて見せず、直した状態を見せる / 元の文字を隠す四角が、文字の端で切れない
//   node .claude/skills/pdf-app/scripts/test-studio-ocr-cover.js   (先に make-*-scan.js で form_scan.pdf)
// 元の文字を隠す四角を、文字の端まで広げる処理(growBoxesToInk)は入れたが、保存後に行の下に出る小さなかけらは消えていない(調査中)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await f.evaluate(()=>{document.getElementById('ocrEngine').value='paddle';});
  await fr.locator('[data-m=ocr]').click();await fr.locator('#bOcrPage').click();
  await f.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:400000});
  const n0=await fr.locator('#ov .ibox.ocrf').count(),c0=await fr.locator('#ov .cover.ocrc').count();
  ok('文字認識の直後は、元の画像を重ねて見せる枠・四角になっている(枠 '+n0+' / 四角 '+c0+')',n0>3&&c0>3);
  // 最初の枠を直す
  const box=fr.locator('#ov .ibox').first(),bb=await box.boundingBox();await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await page.waitForTimeout(500);
  await page.keyboard.press('Control+a');await page.keyboard.type('NEWTEXT');await page.waitForTimeout(700);
  const n1=await fr.locator('#ov .ibox.ocrf').count(),c1=await fr.locator('#ov .cover.ocrc').count();
  ok('1つ直すと、その枠・四角だけ「元の画像を重ねる」をやめる(枠 '+n0+'→'+n1+' / 四角 '+c0+'→'+c1+')',n1===n0-1&&c1<c0);
  const op=await f.evaluate(()=>{const cs=[...document.querySelectorAll('#ov .cover:not(.ocrc)')];return cs.length?getComputedStyle(cs[0]).opacity:null;});
  ok('直した枠の下の四角は、不透明(元の文字が見えない): '+op,op==='1');
  // ※ 保存後に、行の下に小さなかけらが残る件(原因の調べ中)は、まだ確かめていない
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
