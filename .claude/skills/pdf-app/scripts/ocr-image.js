// 任意の画像をPDFにして、アプリのOCR(ページ全体)の結果の文字を、1行ずつ出力する(OCRエンジンの比較用)
//   OCR_ENGINE=paddle|tess node .claude/skills/pdf-app/scripts/ocr-image.js 画像.jpg [出力.txt ...]   (複数の画像可)
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  const files=process.argv.slice(2);const {browser,page}=await launch();
  for(const f of files){
    const d=await PDFDocument.create();const bytes=fs.readFileSync(f);
    const im=/\.png$/i.test(f)?await d.embedPng(bytes):await d.embedJpg(bytes);
    const pg=d.addPage([420,420*im.height/im.width]);pg.drawImage(im,{x:0,y:0,width:420,height:420*im.height/im.width});
    fs.writeFileSync(WORK+'/tmp_img.pdf',await d.save());
    await page.reload();await page.waitForTimeout(600);
    await page.setInputFiles('#fOpen',WORK+'/tmp_img.pdf');await page.waitForTimeout(1800);
    await page.click('[data-m=ocr]');await page.click('#bOcrPage');
    await page.waitForFunction(()=>/done|fail/.test(document.querySelector('#job').className),null,{timeout:600000});
    const items=await page.evaluate(()=>window.pdfEditorDebug.items());
    items.sort((a,b)=>a.vy-b.vy||a.vx-b.vx);
    const out=path.join(WORK,'ocr_'+path.basename(f).replace(/\.\w+$/,'')+'_'+(process.env.OCR_ENGINE||'paddle')+'.txt');
    fs.writeFileSync(out,items.map(i=>i.txt).join('\n'));console.log(path.basename(f),items.length,'部品 →',out);
  }
  await browser.close();
})();
