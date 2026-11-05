// 枠を消去したあとに、下の画像の処理(文字だけ消す)が終わっても、枠のあった所に白い四角・パッチが残らない
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
await page.mouse.move(ob.x+100*k,ob.y+140*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+240*k,{steps:6});await page.mouse.up();await page.waitForTimeout(500);
await page.keyboard.type('NEW');   // この直後に、下の画像の処理が始まる
await fr.locator('#sDel').click();   // 処理が終わる前に、消去する
for(let i=0;i<14;i++)await page.waitForTimeout(400);
const left=await f.evaluate(()=>({items:window.pdfEditorDebug.items().length,covers:document.querySelectorAll('#ov .cover').length,boxes:document.querySelectorAll('#ov .ibox').length}));
chk('消去したあとに、枠も白い四角・パッチも残らない '+JSON.stringify(left),left.items===0&&left.covers===0&&left.boxes===0);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
