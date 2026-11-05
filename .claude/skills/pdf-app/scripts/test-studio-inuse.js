// 製本デスクの保存: ファイルがほかのアプリで開かれていて書き込めないとき、理由を出し、ダウンロードとして残す
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);
await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('input[type=checkbox]').check();await page.evaluate(()=>document.getElementById('bRotCur').click());await page.waitForTimeout(1200);
await page.evaluate(()=>{window.showSaveFilePicker=async o=>({name:o.suggestedName,kind:'file',createWritable:async()=>({write:async()=>{},close:async()=>{const e=new Error('The requested file could not be modified');e.name='NoModificationAllowedError';throw e;}})});});
const dl=page.waitForEvent('download',{timeout:5000}).catch(()=>null);
await page.evaluate(()=>document.getElementById('bSaveAs').click());const d=await dl;await page.waitForTimeout(800);
const st=await page.evaluate(()=>document.getElementById('status').textContent);
chk('書き込めなかったと分かる理由が出る: '+st,/ほかのアプリ/.test(st)&&!/として保存しました。$/.test(st));
chk('代わりに、ダウンロードとして残る',!!d);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
