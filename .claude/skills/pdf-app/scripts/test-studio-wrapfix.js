// PDFの文字の枠(確定したあとに選び直した文字を含む)でも、「折り返す」で、枠の幅で折り返せる
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const fr=page.frameLocator('#formFrame');let f=page.frames().find(x=>x!==page.mainFrame());
await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(700);
const st=()=>f.evaluate(()=>{const i=window.pdfEditorDebug.items().find(x=>x.type==='fix');const e=document.querySelector('.ibox.on .t');return{vw:Math.round(i.vw),ol:!!i.hasOl,h:e?Math.round(e.scrollHeight):0,lh:e?Math.round(parseFloat(getComputedStyle(e).fontSize)*1.3):0};});
const a=await st();
chk('「折り返す」のボタンが出る',await fr.locator('#sWrap').isVisible());
// 折り返さない(元の行): 長く打つと、枠が横に広がる
await page.keyboard.press('Control+a');await page.keyboard.type('ABCDEFGHIJ ABCDEFGHIJ ABCDEFGHIJ ABCDEFGHIJ');await page.waitForTimeout(500);
const b=await st();chk('折り返さないときは、枠が横に広がる(幅 '+a.vw+'→'+b.vw+')',b.vw>a.vw+20);
// 折り返す: 別の枠で、先に「折り返す」を押してから長く打つ(幅は広がらない)
await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);f=page.frames().find(x=>x!==page.mainFrame());
await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
const rb2=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb2.x+rb2.width/2,rb2.y+rb2.height/2);await page.waitForTimeout(700);
const a2=await st();await fr.locator('#sWrap').click();await page.waitForTimeout(500);
await page.keyboard.press('Control+a');await page.keyboard.type('ABCDEFGHIJ ABCDEFGHIJ ABCDEFGHIJ ABCDEFGHIJ');await page.waitForTimeout(700);
const c=await st();console.log(a2,c);
chk('折り返すとき、幅は広がらず、行が増える(幅 '+a2.vw+'→'+c.vw+'、高さ '+c.h+')',c.vw<=a2.vw+1&&c.h>c.lh*1.5);
await fr.locator('#sWrap').click();await page.waitForTimeout(400);
chk('もう一度押すと、元の行に戻る(ボタンの印が消える)',!(await fr.locator('#sWrap').evaluate(e=>e.classList.contains('on'))));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
