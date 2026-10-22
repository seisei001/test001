// ページ編集: フォント(明朝・丸ゴシック)・サイズ・文字色を選んで保存すると、PDFにそのフォントで入る
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const {execSync}=require('child_process');const fs=require('fs');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame');
  const ov0=await fr.locator('#ov').boundingBox(),k=ov0.width/420;
  const make=async(x,y,txt,font,color,pre)=>{
    if(pre){await fr.locator('[data-m=sel]').click();{const o=await fr.locator('#ov').boundingBox();await page.mouse.click(o.x+405*k,o.y+8*k);}await page.waitForTimeout(300);}   // 選択を外す
    await fr.locator('[data-m=text]').click();
    const ov=await fr.locator('#ov').boundingBox();   // ページがずれていても、いまの位置で測る
    await page.mouse.move(ov.x+x*k,ov.y+y*k);await page.mouse.down();await page.mouse.move(ov.x+(x+170)*k,ov.y+(y+30)*k,{steps:5});await page.mouse.up();await page.waitForTimeout(400);
    await page.keyboard.type(txt);await page.waitForTimeout(300);
    const m=await fr.locator('.hdl.mv').boundingBox();await page.mouse.dblclick(m.x+m.width/2,m.y+m.height/2);await page.waitForTimeout(300);
    await fr.locator('#spFont').selectOption(font);await fr.locator('#spIn').fill('16');await fr.locator('#spColor').fill(color);await fr.locator('#spOk').click();await page.waitForTimeout(3500);
  };
  await make(20,200,'明朝のテスト','mincho','#ff0000');
  await make(225,255,'丸ゴシックのテスト','maru','#0000ff',true);
  await fr.locator('#embSave').click();await page.waitForFunction(()=>document.getElementById('formHost').classList.contains('hidden'),null,{timeout:90000});await page.waitForTimeout(1500);
  const bytes=await page.evaluate(()=>window.pdfStudioDebug.bytes(0));
  fs.writeFileSync(WORK+'/font_out.pdf',Buffer.from(bytes));
  const fonts=execSync('pdffonts '+WORK+'/font_out.pdf').toString(),txt=execSync('pdftotext -f 1 -l 1 '+WORK+'/font_out.pdf -').toString();
  console.log(fonts.split('\n').slice(0,8).join('\n'));
  ok('明朝(SawarabiMincho)が入る',/Sawarabi\s*Mincho|SawarabiMincho/i.test(fonts));
  ok('丸ゴシック(MPLUSRounded1c)が入る',/RoundedMplus1c|MPLUSRounded1c/i.test(fonts));
  ok('文字は、文字として入っている(検索・コピーできる)',/明朝のテスト/.test(txt)&&/丸ゴシックのテスト/.test(txt));
  console.log('サイズ:',(fs.statSync(WORK+'/font_out.pdf').size/1024|0)+'KB');
  execSync(`pdftoppm -png -r 110 -f 1 -l 1 ${WORK}/font_out.pdf ${WORK}/shot_font`);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
