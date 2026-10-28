// ページ編集: 字下げのある段落を1文字直しても、各行の行頭の位置が元のまま・元の文字が残らない(重複しない)・空白が詰まらない
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,setCharacterSpacing}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
(async()=>{
  const src='/tmp/lines_src.pdf';
  {const d=await PDFDocument.create();d.registerFontkit(fontkit);
   const f=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf'),{subset:false});
   const p=d.addPage([595,842]);
   // 段落: 1行目は字下げ(x=100)、2行目以降はx=80。1行目の途中に、空白(大きなすき間)がある
   p.drawText('日本語の段落一行目',{x:100,y:700,size:12,font:f});p.drawText('二行目のテスト文字です',{x:80,y:686,size:12,font:f});p.drawText('三行目のテスト文字です',{x:80,y:672,size:12,font:f});
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(2000);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(800);
  const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(600);
  const it=(await f.evaluate(()=>window.pdfEditorDebug.items())).pop();console.log('枠の文字',JSON.stringify(it.txt));
  await page.keyboard.press('Control+Home');await page.keyboard.type('X');await page.waitForTimeout(300);   // 先頭に1文字足す
  {const ob=await fr.locator('#ov').boundingBox();await page.mouse.click(ob.x+15,ob.y+ob.height-12);}await page.waitForTimeout(4000);
  const out='/tmp/lines_out.pdf';fs.writeFileSync(out,Buffer.from(await f.evaluate(()=>window.pdfEditorDebug.bytes())));
  const x=execSync(`pdftotext -bbox ${out} -`).toString();const W=[...x.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(m=>({x0:+m[1],y1:+m[4],t:m[5]}));
  const rows={};W.forEach(w=>{const k=Math.round(w.y1/4);(rows[k]=rows[k]||[]).push(w);});const keys=Object.keys(rows).sort((a,b)=>a-b);
  console.log(keys.map(k=>[Math.min(...rows[k].map(w=>w.x0)).toFixed(1),rows[k].map(w=>w.t).join('').slice(0,12)].join(' ')));
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  chk('行が3行のまま(重複した行が無い)',keys.length===3);
  chk('1行目の行頭は元の字下げ(100pt)のまま',Math.abs(Math.min(...rows[keys[0]].map(w=>w.x0))-100)<1.5);
  chk('2行目・3行目の行頭は、元の位置(80pt)のまま',keys.slice(1).every(k=>Math.abs(Math.min(...rows[k].map(w=>w.x0))-80)<1.5));
  chk('先頭に足した文字が入っている',W.some(w=>w.t.startsWith('X')));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
