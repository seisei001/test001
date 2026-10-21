// PDFスタジオ: 暗号化されたPDFを、各ページの画像にして読み込めるか(先に pypdf で enc_owner.pdf / enc_user.pdf(パスワード abc)を作る)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  const st=()=>page.evaluate(()=>window.pdfStudioDebug.bundles());
  await page.waitForTimeout(2300);
  // 編集の制限だけの暗号化(パスワードなしで開ける)
  await page.setInputFiles('#fAdd',[S+'enc_owner.pdf']);await page.waitForTimeout(5000);
  let b=await st();console.log('    状態:',await page.textContent('#status'));
  ok('制限つきPDFが、4ページの束として読み込める: '+JSON.stringify(b.map(x=>[x.name,x.n])),b.length===1&&b[0].n===4);
  await page.locator('.card canvas').first().screenshot({path:WORK+'/shot_enc_owner.png'});
  // パスワード付き(正しいパスワード)
  page.once('dialog',d=>{console.log('    ダイアログ:',d.message());d.accept('abc');});
  await page.setInputFiles('#fAdd',[S+'enc_user.pdf']);await page.waitForTimeout(6000);
  b=await st();ok('パスワード abc で読み込める: '+JSON.stringify(b.map(x=>[x.name,x.n])),b.length===2&&b[1].n===4);
  // パスワードを入れない(キャンセル)
  page.once('dialog',d=>d.dismiss());
  await page.setInputFiles('#fAdd',[S+'enc_user.pdf']);await page.waitForTimeout(4000);
  b=await st();console.log('    状態:',await page.textContent('#status'));ok('パスワードなしでは追加されない(2つのまま)',b.length===2);
  // 画像にした束を、機能から編集できる
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'全ページをばらす'}).click();await page.waitForTimeout(2500);
  b=await st();ok('画像にした束も「ばらす」ができる(全'+b.length+'個)',b.length===5);
  console.log('JSエラー:',errs.length,errs.slice(0,2));
  await browser.close();
})();
