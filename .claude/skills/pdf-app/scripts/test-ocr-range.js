// 「画像の文字を認識」を、範囲指定で行う+変換中/完了の表示の確認
//   node .claude/skills/pdf-app/scripts/test-ocr-range.js   (先に make-scan-layout.js)
const fs=require('fs');
const {launch,WORK}=require('./harness');
const truth=JSON.parse(fs.readFileSync(WORK+'/samples/layout_truth.json','utf8'));
(async()=>{
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',WORK+'/samples/layout_scan.pdf');await page.waitForTimeout(2500);
  await page.click('[data-m=ocr]');
  const {VW,VH}=await page.evaluate(()=>window.pdfEditorDebug.page());
  const t=truth.find(b=>b.name==='head'),b2=truth.find(b=>b.name==='body');
  const x0=t.x0-10,y0=t.top-8,x1=b2.x1+10,y1=b2.bottom+8;       // 見出し+本文だけを囲む
  const ov=await page.locator('#ov').boundingBox(),k=ov.width/VW;
  await page.mouse.move(ov.x+x0*k,ov.y+y0*k);await page.mouse.down();await page.mouse.move(ov.x+x1*k,ov.y+y1*k,{steps:6});await page.mouse.up();
  // 変換中の表示
  await page.waitForFunction(()=>!document.querySelector('#job').classList.contains('hidden'),null,{timeout:5000});
  const mid=await page.evaluate(()=>({cls:document.querySelector('#job').className,t:document.querySelector('#jobT').textContent,btn:document.querySelector('#bOcrPage').disabled,rng:!!document.querySelector('.ocrrng')}));
  console.log('変換中の表示:',JSON.stringify(mid));
  await page.waitForFunction(()=>/done|fail/.test(document.querySelector('#job').className),null,{timeout:300000});
  const end=await page.evaluate(()=>({cls:document.querySelector('#job').className,t:document.querySelector('#jobT').textContent,btn:document.querySelector('#bOcrPage').disabled}));
  console.log('終了時の表示:',JSON.stringify(end));
  const items=await page.evaluate(()=>window.pdfEditorDebug.items());
  console.log('部品:',items.map(i=>`${i.size}pt y${Math.round(i.vy)} ${i.txt.replace(/\n/g,'/').slice(0,24)}`));
  const out=items.filter(i=>i.vy+i.vh/2<y0||i.vy+i.vh/2>y1);
  console.log('範囲の外に作られた部品:',out.length,'(0が正解)');
  // 枠が範囲の左右・上下をはみ出さないこと/行の途中に空白が入らないこと
  const over=items.filter(i=>i.vx<x0-0.6||i.vx+i.vw>x1+0.6||i.vy<y0-0.6||i.vy+i.vh>y1+0.6);
  console.log('範囲をはみ出した枠:',over.length,'(0が正解)',over.map(i=>[i.vx,i.vx+i.vw,i.vy,i.vy+i.vh].map(Math.round)));
  console.log('文字の間の余計な空白:',items.filter(i=>/ {2,}|[^\x00-\x7F] | [^\x00-\x7F]/.test(i.txt)).length,'(0が正解)');
  // 全体を認識した後でも、部品の上から範囲をドラッグして、その範囲だけ変換できること(部品が邪魔をしない)
  await page.click('[data-m=ocr]');await page.waitForTimeout(300);
  await page.click('#bOcrPage');
  await page.waitForFunction(()=>/done|fail/.test(document.querySelector('#job').className)&&/個のまとまり/.test(document.querySelector('#status').textContent),null,{timeout:300000});
  await page.waitForTimeout(500);
  await page.click('[data-m=ocr]');await page.waitForTimeout(300);   // 変換後は選択モードになるので、もう一度OCRモードへ
  const n1=(await page.evaluate(()=>window.pdfEditorDebug.items())).length;
  await page.evaluate(()=>{document.querySelector('#job').className='hidden';document.querySelector('#status').textContent='準備';});   // 先に表示を整える(後から変えると、ページの位置が動く)
  await page.waitForTimeout(300);
  const nt=truth.find(b=>b.name==='note'),ov2=await page.locator('#ov').boundingBox();
  const bx0=nt.x0-6,by0=nt.top-6,bx1=nt.x1+6,by1=nt.bottom+6;
  await page.mouse.move(ov2.x+bx0*k,ov2.y+by0*k);await page.mouse.down();await page.mouse.move(ov2.x+bx1*k,ov2.y+by1*k,{steps:6});await page.mouse.up();
  const started=await page.waitForFunction(()=>!document.querySelector('#job').classList.contains('hidden')||/個のまとまり/.test(document.querySelector('#status').textContent),null,{timeout:8000}).then(()=>true).catch(()=>false);
  console.log('全体認識の後、部品の上からの範囲指定で変換が始まる:',started);
  if(started)await page.waitForFunction(()=>/done|fail/.test(document.querySelector('#job').className),null,{timeout:300000});
  console.log('状態:',await page.textContent('#status'),'/',await page.textContent('#jobT'));
  console.log((await page.evaluate(()=>window.pdfEditorDebug.items())).filter(i=>i.vy>235&&i.vy<290).map(i=>[i.id,Math.round(i.vy),i.txt]));
  console.log('部品数:',n1,'→',(await page.evaluate(()=>window.pdfEditorDebug.items())).length);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_range.png'});
  await browser.close();
})();
