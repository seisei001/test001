// ページ編集: 文字を変えていない訂正の部品は、保存しても、PDFが元のまま(白抜き・フォントの変更がない)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const {execSync}=require('child_process');const fs=require('fs');const crypto=require('crypto');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const ov=await fr.locator('#ov').boundingBox(),k=ov.width/420;
  await page.mouse.move(ov.x+5*k,ov.y+70*k);await page.mouse.down();await page.mouse.move(ov.x+415*k,ov.y+240*k,{steps:8});await page.mouse.up();await page.waitForTimeout(800);   // 表の文字を、まとめて囲む(訂正の部品がたくさんできる)
  const n=(await f.evaluate(()=>window.pdfEditorDebug.items())).length;
  await fr.locator('#embSave').click();await page.waitForFunction(()=>document.getElementById('formHost').classList.contains('hidden'),null,{timeout:60000});await page.waitForTimeout(1000);
  const bytes=await page.evaluate(()=>window.pdfStudioDebug.bytes(0));fs.writeFileSync(WORK+'/unchanged_out.pdf',Buffer.from(bytes));
  const render=p=>{execSync(`pdftoppm -png -r 100 -f 1 -l 1 ${p} ${p}.r`);return crypto.createHash('md5').update(fs.readFileSync(p+'.r-1.png')).digest('hex');};
  const a=render(WORK+'/samples/form.pdf'),b=render(WORK+'/unchanged_out.pdf');
  ok(`訂正の部品を${n}個作って、何も変えずに保存 → 見た目が元のPDFと同じ(白抜き・フォントの変化がない)`,a===b);
  const f1=execSync('pdffonts '+WORK+'/samples/form.pdf').toString().trim().split('\n').length,f2=execSync('pdffonts '+WORK+'/unchanged_out.pdf').toString().trim().split('\n').length;
  ok(`フォントが増えない(${f1-2}→${f2-2})`,f1===f2);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
