// 製本デスク: 保存の前に「変更を保存しますか?」と、保存先(どこに保存されるか)を見せる
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.evaluate(()=>{window.__noSaveAsk=false;});
const b64=fs.readFileSync(WORK+'/samples/studio_A4.pdf').toString('base64');
await page.evaluate(async b64=>{window.__w=[];window.__picker=0;window.showSaveFilePicker=async o=>{window.__picker++;return{name:'new_'+o.suggestedName,kind:'file',createWritable:async()=>({write:async()=>{},close:async()=>{window.__w.push('picker');}}),getFile:async()=>({size:0})};};
  const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)),f=new File([bytes],'orig.pdf',{type:'application/pdf'});let n=0;
  const h={name:'orig.pdf',kind:'file',queryPermission:async()=>'granted',createWritable:async()=>({write:async b=>{n=b.size;},close:async()=>{window.__w.push('orig:'+n);}}),getFile:async()=>({size:n})};
  await addFiles([{f,h}]);},b64);
await page.waitForTimeout(1500);
await page.locator('.card').first().locator('input[type=checkbox]').check();await page.evaluate(()=>document.getElementById('bRotCur').click());await page.waitForTimeout(1500);
// 保存(元のファイルがある): 確認が出て、保存先(元のファイルに上書き)が見える。やめる → 書き込まない
await page.evaluate(()=>document.getElementById('bSave').click());await page.waitForTimeout(600);
let t=await page.locator('#saveAsk').innerText().catch(()=>'');console.log('   ',JSON.stringify(t.slice(0,160)));
chk('「変更を保存しますか?」が出る',/変更を保存しますか/.test(t)&&/変更あり/.test(t));
chk('保存先が見える(元のファイルに上書き・書き換わる注意)',/保存先/.test(t)&&/orig\.pdf/.test(t)&&/上書き/.test(t)&&/元に戻せません/.test(t));
await page.locator('#saveAsk button',{hasText:'やめる'}).click();await page.waitForTimeout(500);
let r=await page.evaluate(()=>({w:window.__w,st:document.getElementById('status').textContent}));
chk('やめる: 何も書き込まない',r.w.length===0&&/保存をやめました/.test(r.st));
// 上書き保存する
await page.evaluate(()=>document.getElementById('bSave').click());await page.waitForTimeout(500);
await page.locator('#saveAsk button',{hasText:'上書き保存する'}).click();await page.waitForTimeout(1200);
r=await page.evaluate(()=>({w:window.__w}));chk('「上書き保存する」: 元のファイルに書き込む',r.w.length===1&&/^orig:/.test(r.w[0]));
// 名前を付けて保存: 保存先を選ぶ画面で選ぶと説明
await page.evaluate(()=>document.getElementById('bRotCur').click());await page.waitForTimeout(1200);
await page.evaluate(()=>document.getElementById('bSaveAs').click());await page.waitForTimeout(600);
t=await page.locator('#saveAsk').innerText().catch(()=>'');chk('名前を付けて保存: 保存先を選ぶ画面で決めると説明する',/保存先のフォルダとファイル名を選びます/.test(t));
await page.locator('#saveAsk button',{hasText:'保存する'}).click();await page.waitForTimeout(1200);
r=await page.evaluate(()=>({w:window.__w,picker:window.__picker}));chk('「保存する」: 保存先を選ぶ画面が出て、保存される',r.picker===1&&r.w.length===2);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
