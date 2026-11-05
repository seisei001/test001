// 文字認識: エンジンが正しく動かず、どの行も同じような数字(10.00)になったときは、次のエンジンでやり直す
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
await f.evaluate(()=>{document.getElementById('ocrEngine').value='paddle';window.__ocrJunkEngine='paddle';});   // 「高精度」のあいだは、どの行も「10.00」になる(壊れたエンジンの再現)
await fr.locator('[data-m=ocr]').click();await fr.locator('#bOcrPage').click();
await f.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:600000});
const r=await f.evaluate(()=>({st:document.querySelector('#status').textContent,eng:document.getElementById('ocrEngine').value,txt:window.pdfEditorDebug.items().filter(x=>x.type==='fix').map(x=>x.txt)}));
chk('「やり直しました」と出る: '+r.st.slice(-120),/やり直しました/.test(r.st)&&/高精度/.test(r.st));
chk('次のエンジン(標準)に切り替わる: '+r.eng,r.eng==='tess');
chk('「10.00」の枠は作らない(枠 '+r.txt.length+'個)',r.txt.length>3&&r.txt.every(t=>!/^[$¥]?\d{0,3}[.,]\d{2}$/.test(t.trim())));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
