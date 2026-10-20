// 字間のある文字を、確定してPDFに書き込んだとき、位置が合っているか(画像にして目で確認)
//   node .claude/skills/pdf-app/scripts/test-track-commit.js   (先に LAYOUT_SET=track LAYOUT_TAG=track node make-scan-layout.js)
const {launch,save,WORK}=require('./harness');
const {execSync}=require('child_process');
(async()=>{
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',WORK+'/samples/track_scan.pdf');await page.waitForTimeout(2500);
  await page.click('[data-m=ocr]');await page.click('#bOcrPage');
  await page.waitForFunction(()=>/done|fail/.test(document.querySelector('#job').className),null,{timeout:300000});
  await page.click('#bCommit');await page.waitForTimeout(6000);
  await save(page,WORK+'/out_track.pdf');
  execSync(`pdftoppm -png -r 110 -x 0 -y 100 -W 700 -H 300 ${WORK}/out_track.pdf ${WORK}/shot_track_out`);
  execSync(`pdftotext ${WORK}/out_track.pdf ${WORK}/out_track.txt`);
  console.log('PDFの文字(検索・コピーできる):',require('fs').readFileSync(WORK+'/out_track.txt','utf8').replace(/\s+/g,' ').slice(0,120));
  console.log('見る:',WORK+'/shot_track_out-1.png');
  await browser.close();
})();
