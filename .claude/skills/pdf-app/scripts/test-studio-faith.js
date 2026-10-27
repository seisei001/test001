// ページ編集: PDFに近い枠(元の行の位置・大きさのとおり)→ 入力で入力用の枠 → 選択を外すと、PDFに近い枠に戻る/保存した位置
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();
  await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
  const rb=await fr.locator('#ov .run').first().boundingBox();
  await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(700);
  const st=()=>f.evaluate(()=>{const e=document.querySelector('.ibox.on');if(!e)return null;const ln=[...e.querySelectorAll('.fl .ln')].map(l=>{const r=l.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height,t:l.textContent};});const it=window.pdfEditorDebug.items().filter(i=>i.type==='fix').pop();return{faith:e.classList.contains('faith'),ce:e.querySelector('.t').contentEditable,ln,txt:it.txt,box:e.getBoundingClientRect().toJSON()};});
  let a=await st();console.log(JSON.stringify(a.ln.map(l=>[l.t,Math.round(l.x),Math.round(l.w)])),'元の文字の枠',Math.round(rb.x),Math.round(rb.width));
  chk('クリックしたら、PDFに近い枠で表示(.faith・入力はまだ不可)',a.faith&&a.ce!=='true'&&a.ln.length>=1);
  chk('文字は元の文字と同じ内容('+a.txt+')',a.ln.map(l=>l.t).join('\n')===a.txt);
  chk('左端と幅が、元の文字とほぼ同じ(差 '+Math.abs(a.ln[0].x-rb.x).toFixed(1)+' / '+Math.abs(a.ln[0].w-rb.width).toFixed(1)+'px)',Math.abs(a.ln[0].x-rb.x)<4&&Math.abs(a.ln[0].w-rb.width)<24);   // 幅は、最後の文字の後ろの字間ぶん(負のとき)ずれて見える
  const mid=a.ln[0];await page.mouse.click(mid.x+mid.w/2,mid.y+mid.h/2);await page.waitForTimeout(500);
  let b=await st();chk('もう一度クリックすると、入力用の枠(.faithが外れ、入力できる)',!b.faith&&b.ce==='true');
  await page.keyboard.press('End');await page.keyboard.type('XY');await page.waitForTimeout(300);
  b=await st();chk('入力できる('+b.txt+')',b.txt.endsWith('XY'));
  {const ob=await fr.locator('#ov').boundingBox();await page.mouse.click(ob.x+15,ob.y+ob.height-20);}await page.waitForTimeout(500);   // 何もない所で、選択を外す
  const it2=await f.evaluate(()=>window.pdfEditorDebug.items().filter(i=>i.type==='fix').pop());
  await f.evaluate(()=>{});
  const el=await f.evaluate(()=>{const e=document.querySelector('.ibox');return e?{faith:e.classList.contains('faith'),n:e.querySelectorAll('.fl .ln').length}:null;});
  chk('選択を外すと、PDFに近い枠に戻る',el&&el.faith&&el.n>=1);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await page.screenshot({path:WORK+'/shot_faith.png'});await browser.close();process.exit(ok?0:1);
})();
