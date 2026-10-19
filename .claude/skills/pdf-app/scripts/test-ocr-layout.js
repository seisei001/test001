// OCRの「文字サイズ・行間・文字揃い・本文」の精度を、正解と比べて表にする。
//   node .claude/skills/pdf-app/scripts/test-ocr-layout.js        (先に make-scan-layout.js)
const fs=require('fs');
const {launch,WORK}=require('./harness');
const truth=JSON.parse(fs.readFileSync(WORK+'/samples/'+(process.env.LAYOUT_TAG||'layout')+'_truth.json','utf8'));
const lcs=(a,b)=>{const m=a.length,n=b.length,d=Array.from({length:m+1},()=>new Array(n+1).fill(0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=a[i-1]===b[j-1]?d[i-1][j-1]+1:Math.max(d[i-1][j],d[i][j-1]);return d[m][n];};
(async()=>{
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',WORK+'/samples/'+(process.env.LAYOUT_TAG||'layout')+'_scan.pdf');await page.waitForTimeout(2500);
  await page.click('[data-m=ocr]');await page.click('#bOcrPage');
  await page.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:300000});
  console.log('状態:',await page.textContent('#status'));
  const items=await page.evaluate(()=>window.pdfEditorDebug.items());
  let sizeErr=[],alignOk=0,lhErr=[],txtOk=[];
  console.log('\n正解ブロック   | 正解pt→推定pt (誤差) | 行間 正解→推定 | 揃え 正解→推定 | 文字の一致率 | 位置のずれ(pt:左端/中心/右端) | 部品数');
  truth.forEach(t=>{
    const cx=(t.x0+t.x1)/2,cy=(t.top+t.bottom)/2;
    const hit=items.filter(it=>cx>=it.vx-8&&cx<=it.vx+it.vw+8&&cy>=it.vy-8&&cy<=it.vy+it.vh+8);
    const ex0=t.lines.join('').replace(/\s+/g,'');
    const it=[...hit].sort((p,q)=>lcs(q.txt.replace(/\s+/g,''),ex0)/Math.max(1,q.txt.replace(/\s+/g,'').length)-lcs(p.txt.replace(/\s+/g,''),ex0)/Math.max(1,p.txt.replace(/\s+/g,'').length))[0];   // 近くに複数の部品があるときは、正解の文字にいちばん近いもの
    if(!it){console.log(t.name.padEnd(12),'| 見つからない');return;}
    const err=(it.size-t.size)/t.size*100;sizeErr.push(Math.abs(err));
    const al=it.align||'left';if(al===t.align)alignOk++;
    lhErr.push(Math.abs(it.lh-t.lh)/t.lh*100);
    const tx=it.txt.replace(/\s+/g,''),ex=t.lines.join('').replace(/\s+/g,''),r=lcs(tx,ex)/Math.max(tx.length,ex.length);txtOk.push(r);
    const dx=(t.align==='center'?Math.abs((it.vx+it.vw/2)-(t.x0+t.x1)/2):t.align==='right'?Math.abs((it.vx+it.vw)-t.x1):Math.abs(it.vx-t.x0)).toFixed(1);   // 左=左端、中央=中心、右=右端で比べる
    console.log(t.name.padEnd(12),'|',`${t.size}→${it.size} (${err>=0?'+':''}${err.toFixed(0)}%)`.padEnd(20),'|',`${t.lh}→${(+it.lh).toFixed(2)}`.padEnd(14),'|',`${t.align}→${al}`.padEnd(14),'|',(r*100).toFixed(0)+'%'.padEnd(10),'|',dx.padEnd(13),'|',hit.length);
  });
  const med=a=>{a=[...a].sort((x,y)=>x-y);return a[a.length>>1];};
  console.log(`\n要約: 文字サイズの誤差(中央値) ${med(sizeErr).toFixed(0)}% / 最大 ${Math.max(...sizeErr).toFixed(0)}% | 行間の誤差(中央値) ${med(lhErr).toFixed(0)}% | 揃いの一致 ${alignOk}/${truth.length} | 文字の一致率(平均) ${(txtOk.reduce((a,b)=>a+b,0)/txtOk.length*100).toFixed(0)}% | 部品の総数 ${items.length}(正解${truth.length})`);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_layout.png'});
  await browser.close();
})();
