// 製本デスクの保存を、普通のアプリと同じに: 束を選ばなくても保存できる/保存=確認なしで上書き(変更がなければ何もしない)/名前を付けて保存=保存先を選ぶ/Ctrl+S・Ctrl+Shift+S/ツールバーの保存ボタン(変更があると青い)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);
const b64=fs.readFileSync(WORK+'/samples/studio_A4.pdf').toString('base64');
await page.evaluate(async b64=>{window.__w=[];window.__picker=0;window.showSaveFilePicker=async o=>{window.__picker++;return{name:'new_'+o.suggestedName,kind:'file',createWritable:async()=>({write:async()=>{},close:async()=>{window.__w.push('picker');}}),getFile:async()=>({size:0})};};
  const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)),f=new File([bytes],'orig.pdf',{type:'application/pdf'});let n=0;
  const h={name:'orig.pdf',kind:'file',queryPermission:async()=>'granted',createWritable:async()=>({write:async b=>{n=b.size;},close:async()=>{window.__w.push('orig:'+n);}}),getFile:async()=>({size:n})};
  await addFiles([{f,h}]);},b64);
await page.waitForTimeout(1500);
const st=()=>page.evaluate(()=>({w:window.__w.slice(),picker:window.__picker,status:document.getElementById('status').textContent,dis:document.getElementById('bSave').disabled,hot:document.getElementById('bSaveTop').classList.contains('hot'),title:document.title}));
let r=await st();
chk('束を選ばなくても、保存のボタンが使える(束が1つ)',!r.dis&&await page.locator('#bSaveTop').isVisible());
chk('変更がないうちは、ツールバーの保存は青くない',!r.hot);
// 変更(回転は、選んで行う)→ 青くなる・タイトルに●
await page.locator('.card').first().locator('input[type=checkbox]').check();await page.evaluate(()=>document.getElementById('bRotCur').click());await page.waitForTimeout(1200);
await page.locator('.card').first().locator('input[type=checkbox]').uncheck();await page.waitForTimeout(300);
r=await st();chk('変更すると、ツールバーの保存が青くなり、タイトルに●が付く',r.hot&&/^● /.test(r.title));
// 何も選んでいない状態で Ctrl+S → 確認なしで、元のファイルに上書き
await page.keyboard.press('Control+s');await page.waitForTimeout(1200);
r=await st();chk('Ctrl+S: 束を選ばずに、確認なしで元のファイルに上書き: '+JSON.stringify(r.w),r.w.length===1&&/^orig:/.test(r.w[0])&&r.picker===0&&await page.locator('#saveAsk').count()===0);
chk('保存したあと、青い表示が消える・「保存しました」と出る',!r.hot&&/上書き保存しました/.test(r.status)&&!/^● /.test(r.title));
// 変更がなければ、もう一度保存しても何もしない
await page.locator('#bSaveTop').click();await page.waitForTimeout(800);r=await st();
chk('変更がないときの保存は、書き込まず「保存済み」と知らせる',r.w.length===1&&/保存済み/.test(r.status));
// 名前を付けて保存: 保存先を選ぶ
await page.keyboard.press('Control+Shift+S');await page.waitForTimeout(1200);r=await st();
chk('Ctrl+Shift+S: 保存先を選ぶ画面が出て、保存される',r.picker===1&&r.w.length===2&&/^picker/.test(r.w[1]));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
