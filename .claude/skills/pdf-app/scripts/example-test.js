// 動作確認の例: 画像だけのPDFをOCR → 書き換え → 確定 → ダウンロード → 画像にして目で確認
//   node .claude/skills/pdf-app/scripts/example-test.js
const {launch,drag,save,WORK}=require('./harness');
const {execSync}=require('child_process');
(async()=>{
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',WORK+'/samples/scan.pdf');await page.waitForTimeout(2000);
  await page.click('[data-m=ocr]');
  await drag(page,0.03,0.30,0.97,0.62);
  await page.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:120000});
  console.log('状態:',await page.textContent('#status'));
  console.log('部品:',JSON.stringify(await page.locator('.ibox .t').allInnerTexts()));
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_preview.png'});   // 入力中の見た目
  await page.click('#bCommit');await page.waitForTimeout(6000);
  await save(page,WORK+'/out.pdf');
  execSync(`pdftoppm -png -scale-to 546 ${WORK}/out.pdf ${WORK}/shot_out`);       // 確定後の見た目 → shot_out-1.png
  console.log('見る: ',WORK+'/shot_preview.png と '+WORK+'/shot_out-1.png');
  await browser.close();
})();
