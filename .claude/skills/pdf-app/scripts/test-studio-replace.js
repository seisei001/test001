// ページ編集: 直した部品は、選択を外すと確認が出て、PDFの元の文字が取り除かれ、新しい文字に置き換わる。そのあと、PDFの文字から枠が作り直される
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
(async()=>{
  const src=process.argv[2]||WORK+'/samples/studio_A4.pdf';
  const {browser,page}=await launch();const errs=[],dlg=[];page.on('pageerror',e=>errs.push(e.message));let answer=true;page.on('dialog',d=>{dlg.push(d.message());d.accept(answer?'':undefined);});
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(2500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(800);
  const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(600);
  const old=(await f.evaluate(()=>window.pdfEditorDebug.items())).pop().txt;
  await page.keyboard.press('Control+a');await page.keyboard.type('NEWTEXT');await page.waitForTimeout(300);
  const before=await f.evaluate(()=>window.pdfEditorDebug.bytes().length);
  {const ob=await fr.locator('#ov').boundingBox();await page.mouse.click(ob.x+15,ob.y+ob.height-20);}await page.waitForTimeout(3500);
  chk('選択を外すと、置き換えの確認が出る',dlg.some(m=>/置き換えます/.test(m)));
  const t=await f.evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/replace_out.pdf',Buffer.from(t));
  const txt=execSync('pdftotext /tmp/replace_out.pdf -').toString();console.log('先頭:',JSON.stringify(txt.slice(0,80)));
  chk('新しい文字がPDFに入っている',txt.replace(/\s/g,'').includes('NEWTEXT'));
  chk('元の文字('+old.slice(0,12)+')は、PDFから消えている',!txt.includes(old.replace(/\n/g,'').slice(0,6)));
  chk('反映した枠は、残っていない(保留0)',(await f.evaluate(()=>window.pdfEditorDebug.pending()))===0);
  // 作り直した枠: 新しい文字をクリックすると、PDFの文字として枠になる
  await f.evaluate(()=>{});await page.waitForTimeout(800);
  const blocks=await f.evaluate(()=>window.pdfEditorDebug.blocks());chk('PDFの文字から、枠が作り直されている('+blocks.length+'個)',blocks.some(b=>b.join('').replace(/\s/g,'').includes('NE')));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
