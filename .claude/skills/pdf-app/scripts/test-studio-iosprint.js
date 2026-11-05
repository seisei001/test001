// 印刷(iPhone・iPad): 案内の画面が出て、「共有して印刷する」でPDFが共有メニューに渡る(ページ編集の中からの印刷も)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);
await page.evaluate(()=>{window.__forceIOS=true;window.__shared=[];navigator.canShare=()=>true;navigator.share=async d=>{window.__shared.push({n:d.files[0].name,type:d.files[0].type,size:d.files[0].size});};});
await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
// 1) 束の印刷
await page.evaluate(()=>document.getElementById('bPrint').click());await page.waitForTimeout(1500);
chk('束の印刷: 案内の画面が出る',await page.locator('#iosPrint').count()===1&&/プリント/.test(await page.locator('#iosPrint').innerText()));
await page.locator('#iosPrint button',{hasText:'共有して印刷する'}).click();await page.waitForTimeout(500);
let sh=await page.evaluate(()=>window.__shared);chk('共有メニューに、PDFが渡る: '+JSON.stringify(sh),sh.length===1&&sh[0].type==='application/pdf'&&sh[0].size>500);
await page.locator('#iosPrint button',{hasText:'閉じる'}).click();
// 2) ページ編集の中からの印刷
await page.locator('.card').first().locator('input[type=checkbox]').check().catch(()=>{});
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
await page.frameLocator('#formFrame').locator('#embPrint').click();await page.waitForTimeout(2500);
chk('ページ編集の「印刷」からも、案内の画面が出る',await page.locator('#iosPrint').count()===1);
await page.locator('#iosPrint button',{hasText:'共有して印刷する'}).click();await page.waitForTimeout(500);
sh=await page.evaluate(()=>window.__shared);chk('ページ編集からも、PDFが共有メニューに渡る('+sh.length+'件)',sh.length===2&&/_p1\.pdf$/.test(sh[1].n));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
