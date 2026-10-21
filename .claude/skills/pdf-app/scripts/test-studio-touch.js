// PDFスタジオ(束デスク)の指の操作の確認: 最初は左上が選択 / ちょうど1つ選んでいる束だけ本体をつかんで動かせる / ⋮ でメニュー
//   node .claude/skills/pdf-app/scripts/test-studio-touch.js   (先に make-studio-pdfs.js)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  const cdp=await page.context().newCDPSession(page);
  const touch=async(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  const swipe=async(x0,y0,x1,y1)=>{await touch('touchStart',x0,y0);for(let i=1;i<=12;i++){await touch('touchMove',x0+(x1-x0)*i/12,y0+(y1-y0)*i/12);await page.waitForTimeout(16);}await touch('touchEnd');await page.waitForTimeout(400);};
  const names=()=>page.evaluate(()=>window.pdfStudioDebug.bundles().map(b=>b.name.replace('studio_','').replace('.pdf','')).join(','));
  const mvs=()=>page.evaluate(()=>[...document.querySelectorAll('.card')].map(c=>c.classList.contains('mv')?1:0).join(''));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[S+'studio_A4.pdf',S+'studio_B1.pdf',S+'studio_C7.pdf',S+'studio_D2.pdf']);await page.waitForTimeout(2500);
  ok('最初は左上の束が選択され、動かせる状態: '+await mvs(),await mvs()==='1000'&&(await page.evaluate(()=>window.pdfStudioDebug.bundles()[0].sel)));
  const box=async i=>(await page.locator('.card').nth(i).locator('canvas').boundingBox());
  let b0=await box(0),b2=await box(2);
  // 選択していない束(3つ目)を指で動かしても、並びは変わらない
  const n0=await names();await swipe(b2.x+b2.width/2,b2.y+b2.height/2,b0.x+10,b0.y+10);
  ok('未選択の束は、指で動かせない: '+await names(),await names()===n0);
  // 選択している左上の束を、右へ動かす
  b0=await box(0);let b1=await box(1);
  await swipe(b0.x+b0.width/2,b0.y+b0.height/2,b1.x+b1.width-4,b1.y+b1.height/2);
  console.log('    動かしたあと:',await names());
  ok('選択している束は、指で動かせる(Aが2番目以降に)',(await names()).split(',')[0]!=='A4');
  // 2つ選ぶと、どれも動かせない
  await page.locator('.card').nth(2).locator('input[type=checkbox]').check();
  ok('2つ選ぶと、動かせる束がない: '+await mvs(),(await mvs())==='0000');
  const n1=await names();b0=await box(0);b2=await box(2);await swipe(b0.x+b0.width/2,b0.y+b0.height/2,b2.x+b2.width-4,b2.y+b2.height/2);
  ok('2つ選択中は、指で動かしても並びが変わらない',await names()===n1);
  // ⋮ でメニュー
  await page.locator('.card').nth(1).locator('.mnb').click();await page.waitForTimeout(300);
  ok('⋮ ボタンで機能メニューが開く',await page.evaluate(()=>!document.getElementById('menu').classList.contains('hidden')));
  await page.screenshot({path:WORK+'/shot_studio_touch.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));
  await browser.close();
})();
