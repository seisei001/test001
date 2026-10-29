// 罫線編集(表): 行を足す・消す・高さを変える / 列を足す / セルを結合。文字・下の内容も一緒に動く
//   node .claude/skills/pdf-app/scripts/test-studio-table.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb,StandardFonts}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/table_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([400,400]),f=await d.embedFont(StandardFonts.Helvetica);
   // 3行×3列の表(左上 x=50,y=350、列幅100、行高40)
   const X=[50,150,250,350],Y=[350,310,270,230];
   Y.forEach(y=>p.drawLine({start:{x:X[0],y},end:{x:X[3],y},thickness:1,color:rgb(0,0,0)}));
   X.forEach(x=>p.drawLine({start:{x,y:Y[0]},end:{x,y:Y[3]},thickness:1,color:rgb(0,0,0)}));
   for(let r=0;r<3;r++)for(let c=0;c<3;c++)p.drawText('R'+(r+1)+'C'+(c+1),{x:X[c]+10,y:Y[r]-25,size:12,font:f});
   p.drawText('BELOW',{x:60,y:180,size:14,font:f});   // 表の下の文字
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),F=()=>page.frames().find(x=>x!==page.mainFrame());
  const TB=()=>F().evaluate(()=>window.pdfEditorDebug.tables());
  const words=async()=>{const u=await F().evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/table_cur.pdf',Buffer.from(u));
    const x=execSync('pdftotext -bbox /tmp/table_cur.pdf -').toString();const o={};for(const m of x.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g))o[m[5]]={x:+m[1],y:+m[4]};return o;};
  let t=await TB();ok('表が1つ見つかる(3行×3列): '+JSON.stringify(t.map(x=>[x.rows,x.cols])),t.length===1&&t[0].rows===3&&t[0].cols===3);
  const w0=await words();
  await fr.locator('#tMode').click();await page.waitForTimeout(500);
  ok('セルが 9 個出る',await fr.locator('#ov .tc').count()===9);
  const cell=(r,c)=>fr.locator(`#ov .tc[data-r="${r}"][data-c="${c}"]`);
  // 2行目を選んで、その下に行を足す
  await cell(1,1).dispatchEvent('pointerdown',{button:0,bubbles:true});await page.waitForTimeout(200);
  ok('セルが選ばれる',await fr.locator('#ov .tc.on').count()===1);
  await fr.locator('#tRowAdd').click();await page.waitForTimeout(2200);
  t=await TB();ok('行を足して 4 行: '+t[0].rows,t.length===1&&t[0].rows===4);
  let w=await words();
  ok('R3(元の3行目)の文字が 40pt 下へ動いた: '+(w.R3C1.y-w0.R3C1.y).toFixed(1),Math.abs((w.R3C1.y-w0.R3C1.y)-40)<1.5);
  ok('表の下の文字(BELOW)も 40pt 下へ: '+(w.BELOW.y-w0.BELOW.y).toFixed(1),Math.abs((w.BELOW.y-w0.BELOW.y)-40)<1.5);
  ok('R1・R2の文字は動かない',Math.abs(w.R1C1.y-w0.R1C1.y)<0.5&&Math.abs(w.R2C2.y-w0.R2C2.y)<0.5);
  // 行を消す(いま 4 行。3行目=新しい行 を消す)
  await fr.locator('#tMode').click();await fr.locator('#tMode').click();await page.waitForTimeout(500);   // 選び直し
  await cell(2,0).dispatchEvent('pointerdown',{button:0,bubbles:true});await page.waitForTimeout(200);
  await fr.locator('#tRowDel').click();await page.waitForTimeout(2200);
  t=await TB();ok('行を消して 3 行に戻る: '+t[0].rows,t[0].rows===3);
  w=await words();ok('BELOW が元の位置に戻る(差 '+(w.BELOW.y-w0.BELOW.y).toFixed(1)+')',Math.abs(w.BELOW.y-w0.BELOW.y)<1.5);
  // 行の高さを 60 にする(1行目)
  await fr.locator('#tMode').click();await fr.locator('#tMode').click();await page.waitForTimeout(500);
  await cell(0,0).dispatchEvent('pointerdown',{button:0,bubbles:true});await page.waitForTimeout(200);
  await fr.locator('#tH').fill('60');await fr.locator('#tRowH').click();await page.waitForTimeout(2200);
  t=await TB();ok('1行目の高さが 60: '+(t[0].ys[0]-t[0].ys[1]).toFixed(1),Math.abs((t[0].ys[0]-t[0].ys[1])-60)<0.6);
  w=await words();ok('BELOW が 20pt 下へ: '+(w.BELOW.y-w0.BELOW.y).toFixed(1),Math.abs((w.BELOW.y-w0.BELOW.y)-20)<1.5);
  // 列を足す
  await fr.locator('#tMode').click();await fr.locator('#tMode').click();await page.waitForTimeout(500);
  await cell(1,1).dispatchEvent('pointerdown',{button:0,bubbles:true});await page.waitForTimeout(200);
  await fr.locator('#tColAdd').click();await page.waitForTimeout(2200);
  t=await TB();ok('列を足して 4 列: '+t[0].cols,t[0].cols===4);
  w=await words();ok('C3 の文字が 100pt 右へ: '+(w.R1C3.x-w0.R1C3.x).toFixed(1),Math.abs((w.R1C3.x-w0.R1C3.x)-100)<1.5);
  ok('C1・C2 は動かない',Math.abs(w.R1C1.x-w0.R1C1.x)<0.5&&Math.abs(w.R1C2.x-w0.R1C2.x)<0.5);
  // セルを結合(左上の 2×2)
  await fr.locator('#tMode').click();await fr.locator('#tMode').click();await page.waitForTimeout(500);
  const before=(await F().evaluate(()=>window.pdfEditorDebug.rules())).length;
  const b1=await cell(0,0).boundingBox(),b2=await cell(1,1).boundingBox();
  await page.mouse.move(b1.x+b1.width/2,b1.y+b1.height/2);await page.mouse.down();await page.mouse.move(b2.x+b2.width/2,b2.y+b2.height/2,{steps:6});await page.mouse.up();await page.waitForTimeout(300);
  ok('2×2 が選ばれる',await fr.locator('#ov .tc.on').count()===4);
  await fr.locator('#tMerge').click();await page.waitForTimeout(2200);
  const u=await F().evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/table_m.pdf',Buffer.from(u));execSync('pdftoppm -r 72 -png -singlefile /tmp/table_m.pdf /tmp/table_m');
  ok('文字は全部残っている',/R1C1[\s\S]*R3C3/.test(execSync('pdftotext /tmp/table_m.pdf -').toString())&&execSync('pdftotext /tmp/table_m.pdf -').toString().includes('BELOW'));
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
