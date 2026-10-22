// ページ編集: 同じ文字が、ほぼ同じ場所に2回書かれているPDF(太字風・二重の文字)を囲んでも、文字が二つにならない(先に make-dup-pdf.js)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/dup.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const ov=await fr.locator('#ov').boundingBox(),k=ov.width/420;
  await page.mouse.move(ov.x+5*k,ov.y+50*k);await page.mouse.down();await page.mouse.move(ov.x+415*k,ov.y+140*k,{steps:8});await page.mouse.up();await page.waitForTimeout(800);
  const txt=(await f.evaluate(()=>window.pdfEditorDebug.items().map(i=>i.txt))).join('|');
  console.log('    文字:',txt.replace(/ +/g,' '));
  ok('同じ位置に2回書かれた文字が、二つにならない(Alpha Name・Gamma が1回ずつ)',(txt.match(/Alpha Name/g)||[]).length===1&&(txt.match(/Gamma/g)||[]).length===1);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
