// 文字認識: 文字のデータがあるページは、画像のある所だけを認識する(表の罫線・枠を、文字に読み間違えない)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path');const {launch,WORK}=require('./harness');
const {PDFDocument,StandardFonts,rgb}=require(path.join(WORK,'lib/node_modules')+'/pdf-lib');
(async()=>{
  const mk=async(withImg,out)=>{const d=await PDFDocument.create(),p=d.addPage([595,842]),f=await d.embedFont(StandardFonts.Helvetica);
    for(let i=0;i<14;i++)p.drawText('LINE '+i+' vector text sample',{x:40,y:800-i*14,size:9,font:f});
    for(let r=0;r<8;r++)for(let c=0;c<10;c++)p.drawRectangle({x:300+c*24,y:400+r*18,width:24,height:18,borderColor:rgb(0,0,0),borderWidth:0.6});   // 表の罫線(図形)
    for(let x=300;x<540;x+=4)p.drawLine({start:{x,y:380},end:{x:x+2,y:380},thickness:0.6,color:rgb(0,0,0)});   // 点線
    if(withImg){const im=await d.embedPng(fs.readFileSync('/tmp/scanpart.png'));p.drawImage(im,{x:40,y:200,width:450,height:100});}
    fs.writeFileSync(out,await d.save());};
  await mk(false,'/tmp/oi_vec.pdf');await mk(true,'/tmp/oi_hyb.pdf');
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const run=async file=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[file]);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await f.evaluate(()=>{document.getElementById('ocrEngine').value='paddle';});
    await fr.locator('[data-m=ocr]').click();await fr.locator('#bOcrPage').click();
    await f.waitForFunction(()=>/個のまとまり|認識できません|読み込めません|OCRは要りません/.test(document.querySelector('#status').textContent),null,{timeout:400000});
    return f.evaluate(()=>({st:document.querySelector('#status').textContent,items:window.pdfEditorDebug.items().filter(x=>x.type==='fix').map(x=>[x.txt,Math.round(x.vx),Math.round(x.vy)])}));};
  let r=await run('/tmp/oi_vec.pdf');chk('図形だけのページ(文字のデータあり): OCRは要りません、と出て、枠を作らない: '+r.st.slice(0,60),/OCRは要りません/.test(r.st)&&r.items.length===0);
  r=await run('/tmp/oi_hyb.pdf');console.log(r.st.slice(0,200));console.log(JSON.stringify(r.items));
  chk('画像のある所は読む(「請求」「スキャン」のどちらかが読めた)',r.items.some(a=>/請求|スキャン|12,?800/.test(a[0])));
  chk('表・点線(画像でない所)からは、枠を作らない',r.items.every(a=>!(a[1]>290&&a[2]>400&&a[2]<560&&/^[\s$¥0-9.,:\-\[\]［］]*$/.test(a[0]))));
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
