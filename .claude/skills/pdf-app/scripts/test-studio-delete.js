// ページ編集: 「消去」で、選んでいる枠が確実に消える(PDFにある文字の枠は、文字そのものが消える)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
const txt=async()=>{fs.writeFileSync('/tmp/del_out.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));return execSync('pdftotext -f 1 -l 1 /tmp/del_out.pdf -').toString();};
await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
const t0=await txt();const rb=await fr.locator('#ov .run').first().boundingBox();
const word=await f.evaluate(()=>window.pdfEditorDebug.items().length);
await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(600);
const first=(await f.evaluate(()=>{const i=window.pdfEditorDebug.items().filter(x=>x.type==='fix')[0];return i&&i.txt;}));
const sb=await fr.locator('#sDel').boundingBox();await page.mouse.move(sb.x+sb.width/2,sb.y+sb.height/2);await page.mouse.down();await page.waitForTimeout(600);await page.mouse.up();await page.waitForTimeout(800);
await fr.locator('#embSave').click();await page.waitForTimeout(3500);
const t1=await txt();
chk('PDFの文字の枠を消去すると、その文字がPDFから消える(「'+String(first).slice(0,12)+'」)',first&&t0.includes(first.trim().slice(0,6))&&!t1.includes(first.trim().slice(0,6)));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
