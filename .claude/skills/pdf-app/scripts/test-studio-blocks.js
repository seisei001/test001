// ページ編集: 文字の大きさ・字間・行間・フォントが違うところは、別の枠(まとまり)に分かれる
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,setCharacterSpacing,StandardFonts}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
(async()=>{
  const src='/tmp/blocks_src.pdf';
  {const d=await PDFDocument.create();d.registerFontkit(fontkit);
   const f=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf'),{subset:false});
   const b=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/700Bold/MPLUS1p_700Bold.ttf'),{subset:false});
   const p=d.addPage([595,842]);
   const T=(s,x,y,size,font,cs)=>{if(cs)p.pushOperators(setCharacterSpacing(cs));p.drawText(s,{x,y,size,font:font||f});if(cs)p.pushOperators(setCharacterSpacing(0));};
   // A: 同じ大きさ・字間・行間の3行(1つの枠になる)
   ['これは一つ目の段落の一行目です','これは一つ目の段落の二行目です','これは一つ目の段落の三行目です'].forEach((t,i)=>T(t,60,780-i*16,12));
   // B: 同じ大きさ・字間で、行間だけ広い(別の枠)
   ['行間が広い段落の一行目です','行間が広い段落の二行目です'].forEach((t,i)=>T(t,60,700-i*30,12));
   // C: 文字の大きさが違う(別の枠)
   T('大きな文字の行です',60,620,20);
   // D: 字間が広い(別の枠)・すぐ下の行は字間なし
   T('字間が広い行です',60,570,12,f,4);T('字間が普通の行です',60,554,12);
   // E: フォント(太字)が違う(別の枠)
   T('太字の行です',60,500,12,b);T('細字の行です',60,484,12);
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(2000);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(800);
  const blocks=await f.evaluate(()=>window.pdfEditorDebug.blocks());console.log(JSON.stringify(blocks));
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const g=s=>blocks.find(b=>b.some(x=>x.includes(s)));
  chk('同じ条件の3行は、1つの枠',g('一行目です')&&g('一行目です').length>=3&&g('一行目です')===g('三行目です')&&g('一つ目の段落の一行目')===g('一つ目の段落の三行目'));
  chk('行間が違う段落は、別の枠',g('行間が広い段落の一行目')!==g('一つ目の段落の三行目'));
  chk('文字の大きさが違う行は、別の枠',g('大きな文字')!==g('行間が広い段落の二行目'));
  chk('字間が広い行は、すぐ下の字間が普通の行と別の枠',g('字間が広い')!==g('字間が普通'));
  chk('太字と細字は、別の枠',g('太字の行')!==g('細字の行'));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
