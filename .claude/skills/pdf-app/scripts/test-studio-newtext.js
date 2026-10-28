// ページ編集: 新しく入力した文字は、選択を外すとPDFの文字になり、大きな枠は残らない(文字に合わせた枠が作り直される)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[],dlg=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>{dlg.push(d.message().slice(0,30));d.accept();});
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await fr.locator('[data-m=text]').click();
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/420;
  await page.mouse.move(ob.x+40*k,ob.y+200*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+260*k,{steps:6});await page.mouse.up();await page.waitForTimeout(500);   // 大きめの枠を作る
  await page.keyboard.type('HELLO');await page.waitForTimeout(300);
  chk('枠ができている',(await f.evaluate(()=>window.pdfEditorDebug.pending()))===1);
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);await page.mouse.click(ob.x+15,ob.y+ob.height-15);await page.waitForTimeout(3500);   // 何もない所を押して、選択を外す
  chk('置き換えの確認は出ない(新しい文字は、置き換えるものがない)',!dlg.some(m=>/置き換えます/.test(m)));
  chk('PDFに反映された(保留0)',(await f.evaluate(()=>window.pdfEditorDebug.pending()))===0);
  const t=await f.evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/newtext_out.pdf',Buffer.from(t));
  chk('PDFの文字として入っている',execSync('pdftotext /tmp/newtext_out.pdf -').toString().replace(/\s/g,'').includes('HELLO'));
  const blocks=await f.evaluate(()=>window.pdfEditorDebug.blocks());chk('PDFの文字から、文字に合わせた枠が作り直されている',blocks.some(b=>b.join('').includes('HELLO')));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
