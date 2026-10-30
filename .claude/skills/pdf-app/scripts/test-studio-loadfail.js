// 製本デスク: 開けなかったファイルは、理由つきの画面で知らせる(鍵の質問は出さない)。開けたファイルは普通に開く
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf','/tmp/broken.pdf']);await page.waitForTimeout(3500);
  const txt=await page.evaluate(()=>document.body.innerText);
  chk('開けなかったことを知らせる画面が出る',/1個のファイルを開けませんでした/.test(txt)&&/broken\.pdf/.test(txt));
  chk('理由と対処が書いてある',/PDFとして読めません|読み込みに失敗/.test(txt)&&/対処/.test(txt));
  chk('鍵の質問は出ない',!/鍵|パスワード/.test(txt.replace(/対処[^]*$/,'')));
  chk('開けたほうは束になっている',(await page.evaluate(()=>window.pdfStudioDebug.bundles())).length===1);
  await page.locator('button',{hasText:'閉じる'}).last().click();
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);
})();
