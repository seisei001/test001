// 自由編集: 枠内のPDF文字を1文字ずつの部品にし、1文字だけ直す/消す。他の文字は動かない
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let chkAsk=-1,ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
await f.evaluate(()=>{window.__noUnderAsk=false;window.__noFreeAsk=false;});
await fr.locator('[data-m=sel]').click();await page.waitForTimeout(600);
const rb=await fr.locator('#ov .run').first().boundingBox();await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
await page.mouse.move(rb.x-6,rb.y-6);await page.mouse.down();await page.mouse.move(rb.x+rb.width+6,rb.y+rb.height+6,{steps:6});await page.mouse.up();await page.waitForTimeout(1200);
const before=execSync('pdftotext -f 1 -l 1 '+WORK+'/samples/studio_A4.pdf -').toString();
chkAsk=await fr.locator('#underAsk').count();await fr.locator('#sFree').click();await page.waitForTimeout(500);
chk('枠を作っても、案内の枠は出ない(確定のときに聞く)',chkAsk===0);chk('確認画面が出る',await fr.locator('#freeAsk').count()===1);
await fr.locator('#freeAsk button').first().click();await page.waitForTimeout(800);
const n=await fr.locator('.fc').count();chk('1文字ずつの部品ができる: '+n,n>=2);
const pos0=await fr.locator('.fc').evaluateAll(a=>a.map(e=>[e.textContent,Math.round(e.getBoundingClientRect().left),Math.round(e.getBoundingClientRect().top)]));
await fr.locator('.fc').nth(1).click();await page.waitForTimeout(400);
chk('選ぶと横に1文字フォームが出る',await fr.locator('#freeForm').isVisible());
// 文字を変更
await fr.locator('#ffChar').fill('Q');await fr.locator('#ffChar').dispatchEvent('change');await page.waitForTimeout(300);
chk('1文字の変更が画面に出る',(await fr.locator('.fc').nth(1).textContent())==='Q');
// 3文字目を消す(他は動かない)
await fr.locator('.fc').nth(2).click();await page.waitForTimeout(300);
await fr.locator('#ffDel').click();await page.waitForTimeout(400);
const pos1=await fr.locator('.fc').evaluateAll(a=>a.map(e=>[e.textContent,Math.round(e.getBoundingClientRect().left),Math.round(e.getBoundingClientRect().top)]));
chk('消すと1文字だけ減る',pos1.length===pos0.length-1);
chk('ほかの文字は動かない',pos1.every(p=>pos0.some(q=>q[1]===p[1]&&q[2]===p[2])));
await fr.locator('#ffOk').click();await page.waitForTimeout(3000);await fr.locator('#embSave').click();await page.waitForTimeout(3500);
fs.writeFileSync('/tmp/fr.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
const txt=execSync('pdftotext -f 1 -l 1 /tmp/fr.pdf -').toString();
console.log(JSON.stringify(before.slice(0,40)),'=>',JSON.stringify(txt.slice(0,40)));
chk('保存後: Qが入り、元の文字列とは変わっている',/Q/.test(txt)&&txt!==before);
chk('ページの他の文字は残る',txt.length>before.length*0.5);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
