// ページ編集2.43: 文字を直すとき、元のフォント(PDFに入っているフォント)で書く。フォントのデータが増えないこと、元に無い文字を入れると確認が出て別のフォントを足すこと
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
let hasFonts=true;try{execSync('pdffonts -v 2>&1');}catch{hasFonts=false;}
const fontCount=f=>execSync(`pdffonts ${f}`).toString().trim().split('\n').slice(2).filter(Boolean).length;
(async()=>{
  const src='/tmp/origfont_src.pdf';
  {const d=await PDFDocument.create();d.registerFontkit(fontkit);
   const f=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf'),{subset:false});
   const p=d.addPage([595,842]);p.drawText('日本語のテスト',{x:80,y:700,size:20,font:f});p.drawText('税務代理の記載',{x:80,y:600,size:20,font:f});
   fs.writeFileSync(src,await d.save());}
  const PW=595;
  async function run(newTxtOf,label){
    const {browser,page}=await launch();const errs=[],dlg=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>{dlg.push(d.message());d.accept();});
    await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(2000);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    const boxes=await f.evaluate(()=>window.pdfEditorDebug.textBoxes(0,0,2000,2000)),ov=await fr.locator('#ov').boundingBox(),sc=ov.width/PW,b=boxes[0];
    await page.mouse.click(ov.x+(b.x+Math.min(b.w/2,20))*sc,ov.y+(b.y+b.h/2)*sc);await page.waitForTimeout(700);
    const txt=(await f.evaluate(()=>window.pdfEditorDebug.items()))[0].txt;
    await page.keyboard.press('Control+a');const nt=newTxtOf(txt);await page.keyboard.type(nt);await page.waitForTimeout(400);
    await fr.locator('#embSave').click();await page.waitForTimeout(5000);
    const bytes=await page.evaluate(()=>window.pdfStudioDebug.bytes(0));const out=`/tmp/origfont_${label}.pdf`;fs.writeFileSync(out,Buffer.from(bytes));
    await browser.close();return{out,dlg,errs,nt};
  }
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  const a=await run(t=>[...t].reverse().join(''),'a');
  ok('元にある文字だけで直すと、確認は出ない',a.dlg.length===0&&!a.errs.length);
  if(hasFonts){ok(`フォントの数が増えない(${fontCount(src)}→${fontCount(a.out)})`,fontCount(a.out)===fontCount(src));
    ok('直した文字が、PDFの文字として入っている',execSync(`pdftotext ${a.out} -`).toString().includes(a.nt.replace(/\s/g,'')));}
  ok('ファイルが、数MB大きくならない(元'+fs.statSync(src).size+'→'+fs.statSync(a.out).size+')',fs.statSync(a.out).size<fs.statSync(src).size+300000);
  const r=await run(t=>t+'😀','r');
  ok('元に無い文字を入れると、フォントを足す確認が出る',r.dlg.some(m=>/書けない文字/.test(m)));
  if(hasFonts)ok(`確認に答えると、別のフォントが足される(${fontCount(src)}→${fontCount(r.out)})`,fontCount(r.out)===fontCount(src)+1);
})();
