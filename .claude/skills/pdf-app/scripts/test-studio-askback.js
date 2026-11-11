// ページ編集: 確定のときの確認(元の文字を消去するか)に「戻る」がある。押すと、何も変えずに編集に戻り、もう一度確定すれば、また聞く
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
const open=async file=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/'+file]);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  return{fr:page.frameLocator('#formFrame'),f:page.frames().find(x=>x!==page.mainFrame())};};
const hostLen=()=>page.evaluate(()=>window.pdfStudioDebug.bytes(0).length);
// --- PDFの文字を直したとき(元の文字を消去します)
let {fr,f}=await open('studio_A4.pdf');await f.evaluate(()=>{window.__keepAns=undefined;});
await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(700);
await page.keyboard.press('End');await page.keyboard.type('ZZ',{delay:30});await page.waitForTimeout(300);
const len0=await hostLen();
await fr.locator('#embSave').click();await fr.locator('#keepAsk').waitFor({timeout:10000});
chk('確認に「戻る」がある',(await fr.locator('#keepAsk button').allInnerTexts()).some(t=>/戻る/.test(t)));
await fr.locator('#keepAsk button',{hasText:'戻る'}).click();await page.waitForTimeout(1500);
chk('戻る: 編集の画面のまま(束に戻らない)・何も変わらない',await fr.locator('#embSave').isVisible()&&(await hostLen())===len0);
chk('戻る: 枠と、入力した文字が、そのまま残っている',(await f.evaluate(()=>window.pdfEditorDebug.items().map(i=>i.txt))).join().includes('ZZ'));
await fr.locator('#embSave').click();await fr.locator('#keepAsk').waitFor({timeout:10000});
chk('もう一度確定すると、また聞く',await fr.locator('#keepAsk').count()===1);
await fr.locator('#keepAsk button',{hasText:'はい'}).click();await page.waitForTimeout(3500);
chk('はい: 反映されて、保存される',(await hostLen())!==len0);
// --- 画像の文字(消去の確認)
({fr,f}=await open('form_scan.pdf'));await f.evaluate(()=>{window.__noEraseAsk=false;window.__noEraseOcr=true;window.__noAutoOcr=true;});
await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
await page.mouse.move(ob.x+120*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+150*k,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
await page.keyboard.type('NEW');await page.waitForTimeout(800);const len1=await hostLen();
await fr.locator('#embSave').click();await fr.locator('#eraseAsk').waitFor({timeout:20000});
chk('画像の文字の確認にも「戻る」がある',(await fr.locator('#eraseAsk button').allInnerTexts()).some(t=>/戻る/.test(t)));
await fr.locator('#eraseAsk button',{hasText:'戻る'}).click();await page.waitForTimeout(1500);
chk('戻る: 編集の画面のまま・何も変わらない',await fr.locator('#embSave').isVisible()&&(await hostLen())===len1);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
