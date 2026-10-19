// 歪み補正: 一括でも、中の点を動かすと曲線で曲がる(間中だけの歪み)/ エラーが出ないこと
//   node .claude/skills/pdf-app/scripts/test-warp-curve.js   (先に make-warp-photo.js)
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.setInputFiles('#fOpen',WORK+'/samples/photo_curve.pdf');await page.waitForTimeout(2200);
  await page.click('[data-m=warp]');await page.waitForTimeout(800);
  const n=await page.locator('svg.warp circle').count();console.log('一括の点の数(25が正解):',n);
  const before=await page.locator('svg.warp polyline').nth(5).getAttribute('points');
  const bb=await page.locator('svg.warp circle[data-h="2_2"]').boundingBox();
  await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await page.mouse.down();await page.mouse.move(bb.x+bb.width/2+25,bb.y+bb.height/2+30,{steps:5});await page.mouse.up();await page.waitForTimeout(800);
  const after=await page.locator('svg.warp polyline').nth(5).getAttribute('points');
  console.log('中の点を動かすと、格子の線が曲がる:',before!==after);
  console.log('プレビュー表示:',!(await page.locator('#wPrevBox').getAttribute('class')).includes('hidden'));
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_warp_curve.png'});
  await page.click('#wApply');await page.waitForFunction(()=>/補正しました|エラー/.test(document.querySelector('#status').textContent),null,{timeout:60000});
  console.log('状態:',await page.textContent('#status'),'| JSエラー:',errs.length);
  await browser.close();
})();
