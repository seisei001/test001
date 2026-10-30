// ページ編集の画面の「印刷」: 編集中の1ページだけを、製本デスクの印刷に渡す
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.next').click();await page.waitForTimeout(300);
  await page.evaluate(()=>{window.__printCalls=[];window.__printHook=(b,n)=>window.__printCalls.push({n,len:b.length,head:String.fromCharCode(...b.slice(0,5))});});
  await page.locator('.card').first().dblclick();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame');
  chk('印刷ボタンがある',await fr.locator('#embPrint').isVisible());
  await fr.locator('#embPrint').click();await page.waitForTimeout(2500);
  const c=await page.evaluate(()=>window.__printCalls);
  chk('1ページのPDFが印刷に渡る: '+JSON.stringify(c),c.length===1&&c[0].head==='%PDF-'&&/_p2\.pdf$/.test(c[0].n));
  chk('編集画面は開いたまま',await page.evaluate(()=>!document.getElementById('formHost').classList.contains('hidden')));
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);
})();
