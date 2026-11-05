// 製本デスクの保存: 書き込んだ大きさを確かめる / iPhone・iPadは共有メニューへ案内する
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
const prep=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('input[type=checkbox]').check();};
// 1) 書き込んだファイルが小さい(保存されていない)ときは、保存できたと言わない
await prep();
await page.evaluate(()=>{window.showSaveFilePicker=async o=>({name:o.suggestedName,kind:'file',createWritable:async()=>({write:async()=>{},close:async()=>{}}),getFile:async()=>({size:0})});});
await page.evaluate(()=>document.getElementById('bSave').click());await page.waitForTimeout(1500);
let st=await page.evaluate(()=>document.getElementById('status').textContent);
chk('書き込んだ大きさが合わないとき、保存できたと言わない: '+st,/保存できませんでした/.test(st)&&!/^「[^」]*」として保存しました/.test(st));
// 2) 大きさが合えば、保存できたと言う
await prep();
await page.evaluate(()=>{window.showSaveFilePicker=async o=>{let n=0;return{name:o.suggestedName,kind:'file',createWritable:async()=>({write:async b=>{n=b.size;},close:async()=>{}}),getFile:async()=>({size:n})};};});
await page.evaluate(()=>document.getElementById('bSave').click());await page.waitForTimeout(1500);
st=await page.evaluate(()=>document.getElementById('status').textContent);chk('大きさが合えば、保存した: '+st,/として保存しました/.test(st));
// 3) iPhone
await prep();
await page.evaluate(()=>{window.__forceIOS=true;window.showSaveFilePicker=undefined;window.__sh=[];navigator.canShare=()=>true;navigator.share=async d=>{window.__sh.push(d.files[0].name+':'+d.files[0].size);};});
await page.evaluate(()=>document.getElementById('bSave').click());await page.waitForTimeout(800);
chk('iPhone: 保存の案内が出る',await page.locator('#iosSave').count()===1);
await page.locator('#iosSave button',{hasText:'共有して保存する'}).click();await page.waitForTimeout(800);
const sh=await page.evaluate(()=>window.__sh);chk('共有メニューにPDFが渡る: '+JSON.stringify(sh),sh.length===1&&/studio_A4\.pdf:\d+/.test(sh[0]));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
