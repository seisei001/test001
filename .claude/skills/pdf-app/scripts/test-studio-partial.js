// ページ編集: 重ねて書いた文字の下にある文字のうち、画像になるのは「一部だけ隠れる文字」だけ。隠れない文字は、文字のまま残る
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
(async()=>{
  const src='/tmp/partial_src.pdf';
  {const d=await PDFDocument.create();d.registerFontkit(fontkit);
   const f=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf'),{subset:false});
   const p=d.addPage([595,842]);p.drawText('日本語のテストの文字列です',{x:60,y:700,size:14,font:f});
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(2000);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await fr.locator('[data-m=text]').click();
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595;
  // 8文字目あたり(x=60+14*7=158 〜 )に、小さな文字を重ねる
  await page.mouse.move(ob.x+158*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+200*k,ob.y+148*k,{steps:5});await page.mouse.up();await page.waitForTimeout(400);
  await page.keyboard.type('ZZ');await page.waitForTimeout(300);
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(300);await page.mouse.click(ob.x+15,ob.y+ob.height-12);await page.waitForTimeout(4000);
  const out='/tmp/partial_out.pdf';fs.writeFileSync(out,Buffer.from(await f.evaluate(()=>window.pdfEditorDebug.bytes())));
  const txt=execSync(`pdftotext ${out} -`).toString().replace(/\s/g,'');console.log(JSON.stringify(txt));
  chk('新しい文字が入っている',txt.includes('ZZ'));
  chk('左の隠れない文字は、文字のまま残る(日本語のテ)',txt.includes('日本語のテ'));
  chk('右の隠れない文字は、文字のまま残る(列です)',txt.includes('列です'));
  chk('重ねた文字の位置に、新しい文字が入り、その前後の文字は並び順のまま(日本語のテスト…ZZ…文字列です)',/日本語のテスト.*ZZ.*文字列です/.test(txt));
  chk('隠れた文字(中ほど)は、文字としては残らない',!txt.includes('テストの文字列です')&&!txt.includes('日本語のテストの文字'));
  execSync(`pdftoppm -r 144 -f 1 -l 1 -png ${out} /tmp/partial_out`);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
