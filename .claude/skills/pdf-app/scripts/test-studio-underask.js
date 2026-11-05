// 文字の上に枠を作ったとき: 既定は「元の文字を拾って訂正」。「消して、新しく書く」「そのまま(透明)」を、枠のそばから選べる
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await f.evaluate(()=>{window.__noUnderAsk=false;});
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(600);
  const rb=await fr.locator('#ov .run').first().boundingBox();await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
  await page.mouse.move(rb.x-6,rb.y-6);await page.mouse.down();await page.mouse.move(rb.x+rb.width+6,rb.y+rb.height+6,{steps:6});await page.mouse.up();await page.waitForTimeout(1200);
  return{fr,f};};
const types=f=>f.evaluate(()=>window.pdfEditorDebug.items().map(x=>x.type+':'+(x.type==='text'?window.pdfEditorDebug.bgModes()[0]:'')));
let {fr,f}=await open();
chk('枠のそばに、4つの選択(自由編集を含む)が出る',await fr.locator('#underAsk').count()===1&&(await fr.locator('#underAsk button').allInnerTexts()).length===4);
let t=await types(f);chk('既定: 元の文字を拾った訂正の枠(fix): '+t,t.length>=1&&t.every(x=>x.startsWith('fix')));
await fr.locator('#underAsk button',{hasText:'消して、新しく書く'}).click();await page.waitForTimeout(500);
t=await types(f);chk('「消して、新しく書く」: 新しい文字の枠(text)になる: '+t,t.length===1&&t[0].startsWith('text'));
({fr,f}=await open());
await fr.locator('#underAsk button',{hasText:'そのまま'}).click();await page.waitForTimeout(500);
t=await types(f);chk('「そのまま」: 透明な新しい枠(背景 none): '+t,t.length===1&&t[0]==='text:none');
// 透明な枠に文字を打って保存 → 下のPDFの文字は残る
await page.keyboard.type('ZZ');await page.waitForTimeout(500);await fr.locator('#embSave').click();await page.waitForTimeout(3500);
fs.writeFileSync('/tmp/ua.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
const txt=execSync('pdftotext -f 1 -l 1 /tmp/ua.pdf -').toString();
chk('「そのまま」で保存すると、下の文字(A-1)も、入力した文字(ZZ)も、PDFに残る',/A-1/.test(txt)&&/ZZ/.test(txt));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
