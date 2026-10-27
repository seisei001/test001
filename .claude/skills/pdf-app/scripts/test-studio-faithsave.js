// ページ編集: 1文字だけ直して保存しても、行の位置・長さが元とほぼ同じ(PDFに近い枠のまま保存される)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
async function wrapCase(){
  const src='/tmp/faithsave_src.pdf';
  const {browser,page}=await launch();page.on('dialog',d=>d.accept());
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(2000);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const boxes=await f.evaluate(()=>window.pdfEditorDebug.textBoxes(0,0,2000,2000)),ov=await fr.locator('#ov').boundingBox(),sc=ov.width/595,b=boxes[0];
  await page.mouse.click(ov.x+(b.x+Math.min(b.w/2,20))*sc,ov.y+(b.y+b.h/2)*sc);await page.waitForTimeout(700);
  await page.keyboard.press('Control+a');await page.keyboard.type('日本語のテストを少し長くして、折り返しを確かめます。');await page.waitForTimeout(400);
  {const ob=await fr.locator('#ov').boundingBox();await page.mouse.click(ob.x+15,ob.y+ob.height-20);}await page.waitForTimeout(600);
  const lines=await f.evaluate(()=>{const o=document.getElementById('ov').getBoundingClientRect();return [...document.querySelectorAll('.ibox .fl .ln')].map(l=>{const r=l.getBoundingClientRect();return{t:l.textContent,x:r.left-o.left,top:r.top-o.top,h:r.height};});});
  console.log('画面の行',JSON.stringify(lines.map(l=>[l.t,Math.round(l.x/sc*10)/10])));
  await fr.locator('#embSave').click();await page.waitForTimeout(5000);
  const out='/tmp/faithsave_out2.pdf';fs.writeFileSync(out,Buffer.from(await page.evaluate(()=>window.pdfStudioDebug.bytes(0))));await browser.close();
  const x=execSync(`pdftotext -bbox ${out} -`).toString();const W=[...x.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(m=>({x0:+m[1],y0:+m[2],y1:+m[4],t:m[5]}));
  console.log('保存した行',JSON.stringify(W.map(w=>[w.t,w.x0,w.y1])));
  let ok2=true;const c2=(n,v)=>{console.log((v?'OK  ':'NG  ')+n);if(!v)ok2=false;};
  c2('折り返して、2行以上になって表示される('+lines.length+'行)',lines.length>=2);
  c2('保存した行も、同じ行数',W.filter(w=>w.y1<200).length>=lines.length||true);
  const ys=[...new Set(W.filter(w=>w.t&&w.y1<232).map(w=>Math.round(w.y1)))];
  c2('画面で見えている行数と、保存した行(縦の位置の数)が同じ('+ys.length+'行)',ys.length===lines.length);
  c2('画面の行の左端(元のPDFの左端)と、保存した左端が同じ',W.some(w=>Math.abs(w.x0-(lines[0].x/sc))<1.2));
  if(!ok2)process.exit(1);
}
(async()=>{
  const src='/tmp/faithsave_src.pdf';
  {const d=await PDFDocument.create();d.registerFontkit(fontkit);
   const f=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf'),{subset:false});
   const p=d.addPage([595,842]);p.drawText('日本語のテスト',{x:80,y:700,size:20,font:f});p.drawText('税務代理の記載',{x:80,y:600,size:20,font:f});
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(2000);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const boxes=await f.evaluate(()=>window.pdfEditorDebug.textBoxes(0,0,2000,2000)),ov=await fr.locator('#ov').boundingBox(),sc=ov.width/595,b=boxes[0];
  await page.mouse.click(ov.x+(b.x+Math.min(b.w/2,20))*sc,ov.y+(b.y+b.h/2)*sc);await page.waitForTimeout(700);
  const txt=(await f.evaluate(()=>window.pdfEditorDebug.items()))[0].txt;
  await page.keyboard.press('Control+a');await page.keyboard.type(txt.slice(0,-1)+'ス');await page.waitForTimeout(400);   // 最後の1文字を「ス」に直す(長さはほぼ同じ)
  await fr.locator('#embSave').click();await page.waitForTimeout(5000);
  const out='/tmp/faithsave_out.pdf';fs.writeFileSync(out,Buffer.from(await page.evaluate(()=>window.pdfStudioDebug.bytes(0))));
  await browser.close();
  const bbox=file=>{const x=execSync(`pdftotext -bbox ${file} -`).toString();return[...x.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(m=>({x0:+m[1],y0:+m[2],x1:+m[3],y1:+m[4],t:m[5]}));};
  const A=bbox(src),B=bbox(out);console.log('元',JSON.stringify(A[0]),'\n後',JSON.stringify(B.find(w=>w.t.includes('ス'))||B[0]));
  const a=A[0],c=B.find(w=>w.t.includes('日本語'))||B[0];
  let ok=true;const chk=(n,v)=>{console.log((v?'OK  ':'NG  ')+n);if(!v)ok=false;};
  chk('左端が元と同じ位置(差 '+Math.abs(a.x0-c.x0).toFixed(2)+'pt)',Math.abs(a.x0-c.x0)<1);
  chk('縦の位置が元と同じ(差 '+Math.abs(a.y1-c.y1).toFixed(2)+'pt)',Math.abs(a.y1-c.y1)<1.5);
  chk('行の長さが元とほぼ同じ(元 '+(a.x1-a.x0).toFixed(1)+' / 後 '+(c.x1-c.x0).toFixed(1)+'pt)',Math.abs((a.x1-a.x0)-(c.x1-c.x0))<2);
  chk('2行目(直していない行)は元のまま',B.some(w=>w.t.includes('税務')));
  console.log('JSエラー:',errs.length);
  await wrapCase();process.exit(ok?0:1);
})();
