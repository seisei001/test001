// 束デスク: 束の中のページを前後に動かす / 外に出す / 見出しの「PDFを保存」
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const sizes=()=>page.evaluate(async()=>{const o=[];for(let i=0;i<window.pdfStudioDebug.bundles().length;i++){const d=await PDFLib.PDFDocument.load(new Uint8Array(window.pdfStudioDebug.bytes(i)));o.push(d.getPages().map(p=>Math.round(p.getWidth())));}return o;});
  const bs=()=>page.evaluate(()=>window.pdfStudioDebug.bundles());
  chk('見出しに「PDFを保存」「ページを前へ」「ページを後ろへ」「ページを外に出す」が出る',(await Promise.all(['#bSave','#bPgPrev','#bPgNext','#bPgOut'].map(s=>page.locator(s).isVisible()))).every(Boolean));
  chk('機能メニューには、保存が無い',await (async()=>{await page.locator('.card').first().locator('.mnb').click();const t=await page.locator('#menuBtns').innerText();await page.locator('#menuBack').click();return !/名前を付けて保存/.test(t);})());
  // ページの目印: 各ページに、元のページ番号をタイトル代わりに持たせるのは難しいので、ページの並びは「回転」で区別する
  await page.locator('.card').first().locator('.next').click();await page.waitForTimeout(300);   // 2ページ目
  await page.locator('#bRotCur').click();await page.waitForTimeout(800);   // 2ページ目に目印(回転90度)
  const rots=()=>page.evaluate(async()=>{const d=await PDFLib.PDFDocument.load(new Uint8Array(window.pdfStudioDebug.bytes(0)));return d.getPages().map(p=>p.getRotation().angle);});
  console.log('最初',await rots());
  await page.locator('#bPgNext').click();await page.waitForTimeout(800);
  let r=await rots();let b=(await bs())[0];console.log('後ろへ',r,b.cur);
  chk('2ページ目が、3ページ目の位置に動き、表示も3ページ目',r[2]===90&&r[1]===0&&b.cur===2);
  await page.locator('#bPgPrev').click();await page.locator('#bPgPrev').click();await page.waitForTimeout(800);
  r=await rots();b=(await bs())[0];chk('前へ2回で、先頭に動く',r[0]===90&&b.cur===0);
  await page.locator('#bPgPrev').click();await page.waitForTimeout(500);
  chk('先頭からは、それ以上前に動かない',(await rots())[0]===90);
  await page.locator('#bPgOut').click();await page.waitForTimeout(1200);
  const all=await bs();console.log('外に出す後',JSON.stringify(all.map(x=>[x.name,x.n])));
  chk('束が2つになり、元の束は3ページ・外に出た束は1ページ',all.length===2&&all[0].n===3&&all[1].n===1);
  const r2=await page.evaluate(async()=>{const d=await PDFLib.PDFDocument.load(new Uint8Array(window.pdfStudioDebug.bytes(1)));return d.getPages().map(p=>p.getRotation().angle);});
  chk('外に出たのは、表示していたページ(回転90度の目印)',r2.length===1&&r2[0]===90);
  await page.locator('#bUndo').click();await page.waitForTimeout(800);
  chk('「元に戻す」で、1つの束(4ページ)に戻る',(await bs()).length===1&&(await bs())[0].n===4);
  const cards=await page.evaluate(()=>document.querySelectorAll('#desk .card').length);
  chk('元に戻したあと、カードが二重にならない(束1つ=カード'+cards+'枚)',cards===1);
  await page.locator('#bRotAll').click();await page.waitForTimeout(800);await page.locator('#bUndo').click();await page.waitForTimeout(800);
  chk('回転→元に戻すでも、カードは1枚・サムネイルに絵がある',await page.evaluate(()=>{const c=document.querySelectorAll('#desk .card canvas');if(c.length!==1)return false;const x=c[0].getContext('2d').getImageData(0,0,c[0].width,c[0].height).data;let n=0;for(let i=0;i<x.length;i+=4)if(x[i]<200)n++;return n>200;}));
  chk('機能メニューには、閉じるが無い・見出しに「閉じる」がある',await (async()=>{await page.locator('.card').first().locator('.mnb').click();const t=await page.locator('#menuBtns').innerText();await page.locator('#menuBack').click();return !/✕ 閉じる/.test(t)&&await page.locator('#bClose').isVisible();})());
  await page.evaluate(()=>{bundles.forEach(b=>{b.dirty=false;});});await page.locator('#bClose').click();await page.waitForTimeout(600);
  chk('「閉じる」で、選んでいる束が閉じる',(await bs()).length===0);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
