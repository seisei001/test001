// 製本デスク: 変更のある束を閉じるとき、「保存」を選ぶと、保存したあと閉じる。保存できなかったときは、理由を出して閉じない
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
const run=async(mock,btn)=>{await page.reload();await page.waitForTimeout(2300);
  await page.evaluate(m=>{window.__saved=[];window.showSaveFilePicker=async o=>{if(m==='security'){const e=new Error('must be handling a user gesture');e.name='SecurityError';throw e;}
    return{name:o.suggestedName,kind:'file',createWritable:async()=>({write:async()=>{if(m==='writefail')throw new Error('disk full');},close:async()=>{window.__saved.push(o.suggestedName);}})};};},mock);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('input[type=checkbox]').check();await page.evaluate(()=>document.getElementById('bRotCur').click());await page.waitForTimeout(1500);
  await page.evaluate(()=>document.getElementById('bClose').click());await page.waitForTimeout(600);
  await page.locator('button',{hasText:btn}).first().click();await page.waitForTimeout(2500);
  return page.evaluate(()=>({n:window.pdfStudioDebug.bundles().length,saved:window.__saved,st:document.getElementById('status').textContent}));};
let r=await run('ok','名前を付けて保存');chk('保存して閉じる: '+JSON.stringify(r),r.n===0&&r.saved.length===1);
r=await run('security','名前を付けて保存');chk('保存先の画面を開く許可が切れても、ダウンロードで保存して閉じる: '+r.st,r.n===0);
r=await run('writefail','名前を付けて保存');chk('書き込みに失敗したときは、理由を出して閉じない: '+r.st,r.n===1&&/保存できませんでした/.test(r.st));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
