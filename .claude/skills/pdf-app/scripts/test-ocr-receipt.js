// 実例の写真(レシートなど)でOCRを試す。写真は $PDFAPP_WORK/samples/receipt_photo.jpg に置く(リポジトリには入れない:取引先の情報を含むため)。
//   node .claude/skills/pdf-app/scripts/test-ocr-receipt.js
// 正解の行は、写真から読み取った内容(下の EXPECT)。点線の区切り(* . . . *)は、文字にしない(ごみを出さない)のが正解。
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument}=require(LIB+'pdf-lib');
const EXPECT=['領収書','(株)カスタマーリレーション','テレマーケティング','(神戸地方法務局印紙販売所)','戸市中央区波止場町1番1号TEL078-392-0465','お買上票','毎度ありがとうございます','T0000000000000','12:15','2026-10-02','担当01','4292','シュウニュウインシ','3x¥600','¥1,800非','小計','¥1,800','非課税','合計','お預り','¥2,000','お釣り','¥200'];
const lcs=(a,b)=>{const m=a.length,n=b.length,d=Array.from({length:m+1},()=>new Array(n+1).fill(0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=a[i-1]===b[j-1]?d[i-1][j-1]+1:Math.max(d[i-1][j],d[i][j-1]);return d[m][n];};
(async()=>{
  const img=WORK+'/samples/receipt_photo.jpg';
  if(!fs.existsSync(img)){console.log('写真がありません:',img);return;}
  const d=await PDFDocument.create();const jpg=await d.embedJpg(fs.readFileSync(img));
  const W=300,H=Math.round(W*jpg.height/jpg.width);d.addPage([W,H]).drawImage(jpg,{x:0,y:0,width:W,height:H});
  fs.writeFileSync(WORK+'/samples/receipt.pdf',await d.save());
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',WORK+'/samples/receipt.pdf');await page.waitForTimeout(2500);
  await page.click('[data-m=ocr]');await page.click('#bOcrPage');
  await page.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:400000});
  console.log('状態:',await page.textContent('#status'));
  const items=await page.evaluate(()=>window.pdfEditorDebug.items());
  const all=items.map(i=>i.txt).join('').replace(/\s+/g,'');
  console.log('\n部品(上から):');items.forEach(i=>console.log(`  ${String(i.size).padStart(5)}pt 行間${(+i.lh).toFixed(2)} ${i.align.padEnd(6)} x${Math.round(i.vx)} y${Math.round(i.vy)} 幅${Math.round(i.vw)} | ${i.txt.replace(/\n/g,' / ').replace(/ +/g,' ')}`));
  let ok=0;const miss=[];EXPECT.forEach(e=>{const r=lcs(e,all)/e.length;if(r>=0.8)ok++;else miss.push(`${e}(${Math.round(r*100)}%)`);});
  // ごみ: 正解のどの行にも似ていない部品(点線の区切りなどから出た意味のない文字)
  const junk=items.filter(i=>{const t=i.txt.replace(/\s+/g,'');return t.length>=2&&!EXPECT.some(e=>lcs(t,e)/t.length>=0.6);}).map(i=>i.txt.replace(/\s+/g,' '));
  const sz=items.map(i=>i.size);
  console.log(`\n要約: 読めた行 ${ok}/${EXPECT.length} | ごみの部品 ${junk.length}個 ${JSON.stringify(junk)} | 文字サイズの範囲 ${Math.min(...sz)}〜${Math.max(...sz)}pt(ページ幅${W}pt) | 部品数 ${items.length}`);
  if(miss.length)console.log('読めなかった行:',miss.join(' '));
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_receipt.png'});
  await browser.close();
})();
