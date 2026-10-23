// 手持ちPDF(make-drive-eval.js で作った画像だけのPDF)を、PDFスタジオのページOCRで読み、正解テキストと比べる。
//   DRIVE_DIR=/tmp/drivepdf OCR_ENGINE=paddle|tess LABEL=base node test-studio-ocr-drive.js   → $DRIVE_DIR/results_$LABEL.json
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs');
const {launch}=require('./harness');
const DIR=process.env.DRIVE_DIR||'/tmp/drivepdf',E=DIR+'/eval',LABEL=process.env.LABEL||'run',ENG=process.env.OCR_ENGINE||'paddle';
const norm=s=>s.normalize('NFKC').replace(/\s+/g,'');
const lev=(a,b)=>{const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=Array.from({length:n+1},(_,i)=>i);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];};
const bag=s=>{const m=new Map();for(const c of Array.from(s))m.set(c,(m.get(c)||0)+1);return m;};
const f1=(h,t)=>{const bh=bag(h),bt=bag(t);let ov=0;for(const [c,n] of bh)ov+=Math.min(n,bt.get(c)||0);const p=ov/Math.max(1,Array.from(h).length),r=ov/Math.max(1,Array.from(t).length);return{p,r,f:p+r?2*p*r/(p+r):0};};
(async()=>{
  const names=(process.env.DRIVE_ONLY?process.env.DRIVE_ONLY.split(','):fs.readdirSync(E).filter(f=>f.endsWith('_scan.pdf')).map(f=>f.replace('_scan.pdf',''))).sort();
  const results={};
  for(const nm of names){
    const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
    try{
      await page.waitForTimeout(2300);
      await page.setInputFiles('#fAdd',[`${E}/${nm}_scan.pdf`]);await page.waitForTimeout(1500);
      await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
      const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
      await f.evaluate(e=>{document.getElementById('ocrEngine').value=e;},ENG);
      await fr.locator('[data-m=ocr]').click();await fr.locator('#bOcrPage').click();
      await f.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:900000});
      const items=(await f.evaluate(()=>window.pdfEditorDebug.items())).sort((a,b)=>(Math.abs(a.vy-b.vy)<6?a.vx-b.vx:a.vy-b.vy));
      const hyp=norm(items.map(i=>i.txt).join('')),truth=norm(fs.readFileSync(`${E}/${nm}_truth.txt`,'utf8'));
      const cer=lev(hyp,truth)/Math.max(1,truth.length),F=f1(hyp,truth);
      const status=await f.evaluate(()=>document.getElementById('status').textContent);
      results[nm]={cer,p:F.p,r:F.r,f:F.f,items:items.length,hypLen:hyp.length,truthLen:truth.length,status,txt:items.map(i=>({t:i.txt,s:i.size,x:Math.round(i.vx),y:Math.round(i.vy),w:Math.round(i.vw),h:Math.round(i.vh)}))};
      console.log(nm.padEnd(18),`部品${String(items.length).padStart(3)} 文字数 ${hyp.length}/${truth.length} 一致率F ${(F.f*100).toFixed(1)}% (適合${(F.p*100).toFixed(0)}% 再現${(F.r*100).toFixed(0)}%) CER ${(cer*100).toFixed(1)}%`,errs.length?'JSエラー'+errs.length:'');
    }catch(e){console.log(nm,'失敗',e.message.slice(0,120));results[nm]={error:e.message};}
    await browser.close();
  }
  const ok=Object.values(results).filter(r=>!r.error);
  const avg=k=>ok.reduce((a,r)=>a+r[k],0)/Math.max(1,ok.length);
  console.log(`\n平均: 一致率F ${(avg('f')*100).toFixed(1)}%  CER ${(avg('cer')*100).toFixed(1)}%  (${ok.length}枚・エンジン ${ENG})`);
  fs.writeFileSync(`${DIR}/results_${LABEL}.json`,JSON.stringify(results));
})();
