// PDFスタジオのページ編集で、細かい表のスキャンをページ全体OCRして、文字サイズ・ごみを正解と比べる(先に make-dense-scan.js)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs');
const {launch,WORK}=require('./harness');
const truth=JSON.parse(fs.readFileSync(WORK+'/samples/'+(process.env.OCR_TAG||'dense')+'_truth.json','utf8'));
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/'+(process.env.OCR_TAG||'dense')+'_scan.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await f.evaluate(ENG=>{document.getElementById('ocrEngine').value=ENG;},process.env.OCR_ENGINE||'paddle');
  await fr.locator('[data-m=ocr]').click();await fr.locator('#bOcrPage').click();
  await f.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:400000});
  console.log('状態:',await f.evaluate(()=>document.getElementById('status').textContent));
  const items=await f.evaluate(()=>window.pdfEditorDebug.items());
  const mis=[],used=new Set();let ok=0;
  truth.forEach(t=>{
    const cx=(t.x0+t.x1)/2,cy=(t.top+t.bottom)/2;
    const hit=items.filter(it=>cx>=it.vx-6&&cx<=it.vx+it.vw+6&&cy>=it.vy-6&&cy<=it.vy+it.vh+6);
    if(!hit.length){mis.push(t.name+' 見つからない');return;}
    const it=hit.sort((a,b)=>a.vw*a.vh-b.vw*b.vh)[0];used.add(it);
    const err=(it.size-t.size)/t.size*100;
    console.log(t.name.padEnd(7),String(t.size).padStart(5),'→',String(it.size).padStart(5),`(${err>=0?'+':''}${err.toFixed(0)}%)`.padEnd(8),'枠',it.vw.toFixed(0)+'x'+it.vh.toFixed(0),'「'+it.txt.replace(/\s+/g,' ').slice(0,28)+'」');
    if(Math.abs(err)<=15)ok++;
  });
  console.log('照合の点数(Dice):',JSON.stringify((await f.evaluate(()=>window.pdfEditorDebug.ocrRuns())).map(r=>[r.s.slice(0,6),r.sc&&+r.sc.toFixed(2),r.size,r.gh&&+r.gh.toFixed(1),r.ref?1:0])));
  const junk=items.filter(it=>!used.has(it));
  console.log(`\nサイズ±15%以内 ${ok}/${truth.length}・見つからない ${mis.length}・正解に当たらない部品(ごみ候補) ${junk.length}`);
  junk.slice(0,25).forEach(it=>console.log('  ごみ?','「'+it.txt.replace(/\s+/g,' ').slice(0,20)+'」',it.size+'pt','位置',Math.round(it.vx)+','+Math.round(it.vy),'枠',Math.round(it.vw)+'x'+Math.round(it.vh)));
  await fr.locator('#pagewrap').screenshot({path:WORK+'/shot_dense.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
