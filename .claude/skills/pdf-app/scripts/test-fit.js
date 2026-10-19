// 幅の合わせ込み(実フォントでの幅=元の行の幅)・重ね合わせ表示・微調整の確認
//   node .claude/skills/pdf-app/scripts/test-fit.js   (先に make-scan-layout.js)
const fs=require('fs');
const {launch,WORK}=require('./harness');
const TAG=process.env.LAYOUT_TAG||'layout';
const truth=JSON.parse(fs.readFileSync(WORK+'/samples/'+TAG+'_truth.json','utf8'));   // LAYOUT_TAG=layout2 で、別のフォントの見本(make-scan-layout.js 参照)
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.setInputFiles('#fOpen',WORK+'/samples/'+TAG+'_scan.pdf');await page.waitForTimeout(2500);
  await page.click('[data-m=ocr]');
  const t0=Date.now();await page.click('#bOcrPage');
  await page.waitForFunction(()=>/done|fail/.test(document.querySelector('#job').className),null,{timeout:300000});
  console.log('変換時間(秒):',((Date.now()-t0)/1000).toFixed(1));
  await page.waitForTimeout(500);
  // 部品の幅(実測)と、正解の行の幅の比較: 部品内でいちばん長い行の描画幅 vs 正解の行の幅
  const res=await page.evaluate(()=>{
    const D=window.pdfEditorDebug;return D.items().map(i=>({size:i.size,vx:i.vx,vy:i.vy,txt:i.txt,align:i.align}));});
  const meas=await page.evaluate(async(truth)=>{
    const cx=document.createElement('canvas').getContext('2d');const out=[];
    const items=window.pdfEditorDebug.items();
    for(const t of truth){const cxm=(t.x0+t.x1)/2,cym=(t.top+t.bottom)/2;
      const it=items.find(i=>cxm>=i.vx-8&&cxm<=i.vx+i.vw+8&&cym>=i.vy-8&&cym<=i.vy+i.vh+8);if(!it){out.push({name:t.name,miss:true});continue;}
      cx.font=it.size+'px "PdfJP",sans-serif';
      const lines=it.txt.split('\n');const w=Math.max(...lines.map(l=>{const m=cx.measureText(l);return m.actualBoundingBoxLeft+m.actualBoundingBoxRight+(it.ls||0)*(Array.from(l).length-1);}));   // 見えている文字の幅(字間つき)
      out.push({name:t.name,truthSize:t.size,size:it.size,ls:it.ls||0,truthLs:t.ls||0,renderW:w,truthW:t.inkx1-t.inkx0});}
    return out;},truth);
  console.log('ブロック | 正解サイズ→推定 | 描画幅 / 元の行の幅(pt) | 差');
  let errs2=[];meas.forEach(m=>{if(m.miss){console.log(m.name,'見つからない');return;}const d=(m.renderW-m.truthW)/m.truthW*100;errs2.push(Math.abs(d));console.log(m.name.padEnd(8),'|',`${m.truthSize}→${m.size}`.padEnd(10),'|',`字間 ${m.truthLs}→${m.ls}`.padEnd(14),'|',`${m.renderW.toFixed(1)} / ${m.truthW.toFixed(1)}`.padEnd(18),'|',(d>=0?'+':'')+d.toFixed(1)+'%');});
  console.log('幅の差(絶対値)の平均:',(errs2.reduce((a,b)=>a+b,0)/errs2.length).toFixed(1)+'%','最大:',Math.max(...errs2).toFixed(1)+'%');
  // 縦の位置(1行目の基準線)の確認: 部品の中の1行目の基準線の位置を、DOMで測って、正解の基準線(truth.base)と比べる
  await page.click('[data-m=sel]');await page.waitForTimeout(500);
  const vy=await page.evaluate(truth=>{
    const ovr=document.getElementById('ov').getBoundingClientRect(),k=ovr.width/window.pdfEditorDebug.page().VW,out=[];
    const items=window.pdfEditorDebug.items(),els=[...document.querySelectorAll('.ibox .t')];
    for(const t of truth){const cx=(t.x0+t.x1)/2,cy=(t.top+t.bottom)/2;
      const idx=items.findIndex(i=>cx>=i.vx-8&&cx<=i.vx+i.vw+8&&cy>=i.vy-8&&cy<=i.vy+i.vh+8);if(idx<0){out.push({name:t.name,miss:1});continue;}
      const el=els[idx];const sp=document.createElement('span');sp.style.cssText='display:inline-block;width:0;height:0';el.insertBefore(sp,el.firstChild);
      const base=(sp.getBoundingClientRect().bottom-ovr.top)/k;sp.remove();out.push({name:t.name,base,truth:t.base});}
    return out;},truth);
  console.log('ブロック | 1行目の基準線 部品→正解(pt) | 差(pt)');
  vy.forEach(v=>{if(v.miss){console.log(v.name,'見つからない');return;}console.log(v.name.padEnd(8),'|',`${v.base.toFixed(1)}→${v.truth}`.padEnd(20),'|',(v.base-v.truth>=0?'+':'')+(v.base-v.truth).toFixed(1));});
  // 重ね合わせ表示
  await page.click('[data-m=sel]');await page.waitForTimeout(500);
  await page.check('#ovGhost');await page.waitForTimeout(300);
  console.log('重ね表示: カバーが透明になる:',await page.evaluate(()=>{const c=document.querySelector('.cover');return !c||getComputedStyle(c).opacity==='0';}),'/ 文字が赤:',await page.evaluate(()=>{const t=document.querySelector('.ibox .t');return t?getComputedStyle(t).color:'';}));
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_ghost.png'});
  // 微調整
  const bb=await page.locator('.ibox').first().boundingBox();await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await page.waitForTimeout(400);
  const before=await page.evaluate(()=>window.pdfEditorDebug.items()[0].vx);
  await page.click('#nR');await page.click('#nR');await page.waitForTimeout(200);
  await page.keyboard.press('Alt+ArrowLeft');await page.waitForTimeout(200);
  const after=await page.evaluate(()=>window.pdfEditorDebug.items()[0].vx);
  console.log('微調整(右へ0.5pt×2、Alt+左で0.5pt)→ 動いた量(pt):',(after-before).toFixed(2),'(0.50が正解)');
  // 字間(letter-spacing)を手で変えられる/確定してPDFに書き込める(1文字ずつ置かれる)
  const ls0=await page.evaluate(()=>+document.getElementById('sLs').value);
  await page.fill('#sLs','2');await page.press('#sLs','Enter');await page.waitForTimeout(300);
  const lsNow=await page.evaluate(()=>window.pdfEditorDebug.items()[0].ls);
  console.log('字間の入力欄: ',ls0,'→',lsNow,'(2が正解)');
  console.log('JSエラー:',errs.length);
  await browser.close();
})();
