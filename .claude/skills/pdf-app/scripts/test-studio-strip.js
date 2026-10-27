// ページ編集: 元の文字を、PDFの命令から取り除く(白い四角で隠すのではなく、置き換える)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,StandardFonts,PDFName,PDFRawStream}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/strip_src.pdf';
  {const d=await PDFDocument.create();const f=await d.embedFont(StandardFonts.Helvetica);const p=d.addPage([595,842]);
   p.drawText('ALPHA line',{x:60,y:700,size:12,font:f});p.drawText('BRAVO line',{x:60,y:680,size:12,font:f});p.drawText('CHARLIE line',{x:60,y:660,size:12,font:f});p.drawText('DELTA right',{x:300,y:680,size:12,font:f});
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const f=page.frames().find(x=>x!==page.mainFrame());
  const bytes=Array.from(fs.readFileSync(src));
  // 2行目(BRAVO)だけの範囲(画面の座標: 上が0)
  const r=await f.evaluate(([b,rc])=>window.pdfEditorDebug.strip(new Uint8Array(b),0,rc),[bytes,[{x:58,y:842-680-12*0.95,w:90,h:12*1.25}]]);
  fs.writeFileSync('/tmp/strip_out.pdf',Buffer.from(r.bytes));
  const txt=execSync('pdftotext /tmp/strip_out.pdf -').toString();console.log(JSON.stringify(txt));
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  chk('範囲の中の文字(BRAVO)が、PDFから無くなる(個数 '+r.per[0]+')',!txt.includes('BRAVO')&&r.per[0]>=1);
  chk('上の行・下の行は、そのまま残る',txt.includes('ALPHA')&&txt.includes('CHARLIE'));
  chk('同じ高さの、離れた文字(DELTA)は、そのまま残る',txt.includes('DELTA'));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
