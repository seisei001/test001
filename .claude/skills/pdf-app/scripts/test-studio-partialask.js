// ページ編集: 入力した文字が、隣のPDFの文字の一部に重なるとき、勝手に画像にしない(聞く)。「文字のまま残す」なら、隣の文字は文字のまま
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument,StandardFonts}=require(LIB+'pdf-lib');
(async()=>{
  {const d=await PDFDocument.create(),p=d.addPage([595,842]),f=await d.embedFont(StandardFonts.Helvetica);
   p.drawText('Hello World',{x:100,y:700,size:20,font:f});p.drawText('NEIGHBOR TEXT',{x:260,y:700,size:20,font:f});p.drawText('line two below',{x:100,y:650,size:20,font:f});
   fs.writeFileSync(WORK+'/samples/pic_neighbor.pdf',await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const run=async(choice)=>{
    await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/pic_neighbor.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());await f.evaluate(()=>{window.__partialAns=undefined;});
    await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
    const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(700);
    await page.keyboard.press('End');await page.keyboard.type('ABCDEFGH',{delay:30});await page.waitForTimeout(300);
    await fr.locator('#embHead #sClose').click();await page.waitForTimeout(1500);
    const asked=await fr.locator('#partialAsk').count()===1;
    if(asked)await fr.locator('#partialAsk button',{hasText:choice==='keep'?'文字のまま':'画像にして'}).click();await page.waitForTimeout(2500);
    await fr.locator('#embSave').click();await page.waitForTimeout(3000);
    fs.writeFileSync('/tmp/pa.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
    return{asked,txt:execSync('pdftotext -f 1 -l 1 /tmp/pa.pdf -').toString(),imgs:execSync('pdfimages -list /tmp/pa.pdf').toString().split('\n').filter(l=>/image/.test(l)).length};};
  let r=await run('keep');console.log('  keep',JSON.stringify(r.txt.slice(0,60)),r.imgs);
  chk('重なるとき、どうするかを聞く',r.asked);
  chk('「文字のまま残す」: 隣の文字が、文字のまま残る(画像にならない)',/NEIGHBOR TEXT/.test(r.txt)&&r.imgs===0);
  chk('入力した文字は、文字として入っている',/ABCDEFGH/.test(r.txt.replace(/\s/g,'')));
  r=await run('img');console.log('  img',JSON.stringify(r.txt.slice(0,60)),r.imgs);
  chk('「画像にして残す」: 重なる部分を隠して、見えている部分が画像になる',r.asked&&r.imgs>=1);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);
})();
