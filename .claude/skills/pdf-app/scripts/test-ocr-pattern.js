// 模様入りスキャンをOCR → 部品がページ内に収まるか・隠す色が暗くないかを確認
//   node .claude/skills/pdf-app/scripts/test-ocr-pattern.js
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',WORK+'/samples/scan_pattern.pdf');await page.waitForTimeout(2000);
  await page.click('[data-m=ocr]');
  if(process.env.OCR_CLEAN==='0')await page.uncheck('#ocrClean');   // 背景処理なしと比べる: OCR_CLEAN=0 node ...
  await page.click('#bOcrPage');
  await page.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:120000});
  console.log('状態:',await page.textContent('#status'));
  const r=await page.evaluate(()=>{
    const ov=document.querySelector('#ov').getBoundingClientRect();
    const boxes=[...document.querySelectorAll('.ibox')].map(b=>{const r=b.getBoundingClientRect();return{t:b.querySelector('.t')?.innerText.slice(0,14),out:r.left<ov.left-1||r.top<ov.top-1||r.right>ov.right+1||r.bottom>ov.bottom+1};});
    const covers=[...document.querySelectorAll('.cover')].map(c=>{const m=getComputedStyle(c).backgroundColor.match(/\d+/g).map(Number);return Math.round(m[0]*.3+m[1]*.59+m[2]*.11);});
    return{boxes,minCoverLum:Math.min(...covers),covers:covers.length};
  });
  console.log('認識した文字:',JSON.stringify(await page.locator('.ibox .t').allInnerTexts()));
  console.log('ページ外にはみ出した部品:',r.boxes.filter(b=>b.out).map(b=>b.t));
  console.log('隠す色の最も暗い明るさ(0=黒,255=白):',r.minCoverLum,'/ 枠の数',r.covers);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_pattern.png'});
  console.log('見る:',WORK+'/shot_pattern.png');
  await browser.close();
})();
