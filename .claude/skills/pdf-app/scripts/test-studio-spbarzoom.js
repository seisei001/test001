// ページ編集: 超拡大でも、行間・字間のバーが大きくなりすぎず、枠の上が画面の外でも見える
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(600);
const b0=await fr.locator('.spbar').boundingBox();
for(let i=0;i<9;i++)await fr.locator('#pzP').click();await page.waitForTimeout(900);
const b1=await fr.locator('.spbar').boundingBox();
chk(`バーの大きさ: 100% ${Math.round(b0.width)}px → 超拡大 ${Math.round(b1.width)}px(2倍以内)`,b1.width<b0.width*2.2);
// 枠の上を画面の外へ: 枠の中ほどが見える位置までスクロール
const eb=await fr.locator('.ibox.on').boundingBox();
await f.evaluate(()=>{const e=document.querySelector('.ibox.on').getBoundingClientRect();window.scrollBy(0,e.top+e.height*0.4-200);});await page.waitForTimeout(500);
const hd=await fr.locator('#embHead').boundingBox(),b2=await fr.locator('.spbar').boundingBox(),e2=await fr.locator('.ibox.on').boundingBox();
chk('枠の上が画面の外でも、バーは見える位置にある(バー上端 '+Math.round(b2.y)+' ≥ 見出し下 '+Math.round(hd.y+hd.height)+')',e2.y<hd.y+hd.height&&b2.y>=hd.y+hd.height-2);
const hv=await fr.locator('.hdl.mv').boundingBox();chk('✥(動かす印)も見える位置にある(上端 '+Math.round(hv.y)+')',hv.y>=hd.y+hd.height-2);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
