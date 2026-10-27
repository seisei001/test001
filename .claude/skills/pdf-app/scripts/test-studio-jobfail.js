// ページ編集: 「文字を認識できませんでした」の表示は、勝手に消える/タップで消える/小さい
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();
  await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await f.evaluate(()=>window.pdfEditorDebug.jobFail('文字を認識できませんでした(文字のまとまりが見つかりません。画質を確認するか、範囲を変えてみてください)。'));
  const vis=()=>f.evaluate(()=>{const j=document.getElementById('job');return !j.classList.contains('hidden');});
  const w=await f.evaluate(()=>document.getElementById('job').getBoundingClientRect().width);
  chk('表示される',await vis());chk('幅は420px以内('+w.toFixed(0)+')',w<=421);
  await page.waitForTimeout(7600);chk('7秒ほどで、自動で消える',!(await vis()));
  await f.evaluate(()=>window.pdfEditorDebug.jobFail('テスト'));await page.waitForTimeout(300);
  await f.locator('#job').click();chk('タップで消える',!(await vis()));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
