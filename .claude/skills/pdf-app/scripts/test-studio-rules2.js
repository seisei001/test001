// 罫線編集(その2): 動かす・太さと色を変える・線を引く。と、製本デスクの白紙の新規作成
//   node .claude/skills/pdf-app/scripts/test-studio-rules2.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/rules2_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([400,300]);
   p.drawLine({start:{x:50,y:250},end:{x:350,y:250},thickness:1,color:rgb(0,0,0)});
   p.drawLine({start:{x:50,y:200},end:{x:350,y:200},thickness:1,color:rgb(0,0,0)});
   p.drawLine({start:{x:50,y:250},end:{x:50,y:200},thickness:1,color:rgb(0,0,0)});
   p.drawRectangle({x:220,y:80,width:120,height:0.75,color:rgb(0,0,0)});
   p.drawText('ABC',{x:70,y:150,size:14});fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  // 白紙の新規作成
  await page.click('.mtop[data-d=mdFile]');await page.click('#bNew');await page.waitForTimeout(1200);
  let b=await page.evaluate(()=>window.pdfStudioDebug.bundles());
  ok('新規作成: 1束・1ページ・名前=新規作成ファイル: '+JSON.stringify(b),b.length===1&&b[0].n===1&&/^新規作成ファイル/.test(b[0].name));
  await page.click('.mtop[data-d=mdFile]');await page.click('#bNew');await page.waitForTimeout(800);
  b=await page.evaluate(()=>window.pdfStudioDebug.bundles());ok('2つ目は(2)が付く: '+b.map(x=>x.name).join(','),b.length===2&&/\(2\)/.test(b[1].name));
  const u=await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)));
  fs.writeFileSync('/tmp/rules2_blank.pdf',Buffer.from(u));
  ok('中身は何も無い(文字なし・1ページ)',execSync('pdftotext /tmp/rules2_blank.pdf -').toString().trim()===''&&/Pages: +1/.test(execSync('pdfinfo /tmp/rules2_blank.pdf').toString()));
  // 白紙に線を引く
  await page.locator('.card').nth(1).locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const R=()=>f.evaluate(()=>window.pdfEditorDebug.rules());
  ok('白紙には罫線が0本',(await R()).length===0);
  await fr.locator('#rDraw').click();
  const ob=await fr.locator('#ov').boundingBox();
  await page.mouse.move(ob.x+ob.width*0.2,ob.y+ob.height*0.3);await page.mouse.down();await page.mouse.move(ob.x+ob.width*0.8,ob.y+ob.height*0.32,{steps:6});await page.mouse.up();await page.waitForTimeout(1800);
  let r=await R();ok('横線が1本引かれた: '+r.length+' '+(r[0]&&r[0].kind),r.length===1);
  ok('ほぼ水平(y が同じ)',r.length===1&&Math.abs(r[0].v[1]-r[0].v[3])<0.5);
  await fr.locator('#rDraw').click();   // 引くのをやめる
  await fr.locator('#embCancel').click();await page.waitForTimeout(800);
  // 動かす・太さ・色(合成PDF)
  await page.reload();await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
  const fr2=page.frameLocator('#formFrame'),f2=page.frames().find(x=>x!==page.mainFrame());
  const R2=()=>f2.evaluate(()=>window.pdfEditorDebug.rules());
  r=await R2();ok('罫線 4 本: '+r.length,r.length===4);
  const render=(u8,n)=>{const p='/tmp/rules2_'+n;fs.writeFileSync(p+'.pdf',Buffer.from(u8));execSync(`pdftoppm -r 72 -png -singlefile ${p}.pdf ${p}`);return p+'.png';};
  const hz=r.filter(x=>Math.abs(x.v[1]-x.v[3])<1&&x.kind==='seg').sort((a,b)=>a.v[1]-b.v[1]);   // 上の横線
  // 横線を選んで下へ動かす(ドラッグ)
  await fr2.locator(`#ov .rl[data-i="${hz[1].i}"]`).dispatchEvent('click');await page.waitForTimeout(200);
  const bx=await fr2.locator(`#ov .rl[data-i="${hz[1].i}"]`).boundingBox();
  const cx=bx.x+bx.width/2,cy=bx.y+bx.height/2;
  await page.mouse.move(cx,cy);await page.mouse.down();await page.mouse.move(cx,cy+30,{steps:6});await page.mouse.up();await page.waitForTimeout(2000);
  const r1=await R2();ok('動かしたあとも罫線は 4 本: '+r1.length,r1.length===4);
  const moved=r1.filter(x=>Math.abs(x.v[1]-x.v[3])<1&&x.kind==='seg').map(x=>x.v[1]).sort((a,b)=>a-b);
  console.log('    横線のy(表示の座標):',hz.map(x=>x.v[1].toFixed(1)),'→',moved.map(y=>y.toFixed(1)));
  ok('下の横線が下へ動いた(元より 20pt 以上)',moved.length===2&&moved[1]-hz[1].v[1]>20);
  {fs.writeFileSync('/tmp/rules2_m.pdf',Buffer.from(await f2.evaluate(()=>window.pdfEditorDebug.bytes())));ok('文字は残っている',/ABC/.test(execSync('pdftotext /tmp/rules2_m.pdf -').toString()));}
  // 選び直して太さと色
  await fr2.locator('#rAll').click();
  await fr2.locator('#rW').fill('3');await fr2.locator('#rWSet').click();await page.waitForTimeout(1800);
  const r2=await R2();ok('太さを変えても罫線は 4 本',r2.length===4);
  ok('太さが 3pt に: '+r2.map(x=>x.t.toFixed(2)),r2.every(x=>Math.abs(x.t-3)<0.01));
  await fr2.locator('#rAll').click();await fr2.locator('#rC').fill('#ff0000');await fr2.locator('#rCSet').click();await page.waitForTimeout(1800);
  const bytes=await f2.evaluate(()=>window.pdfEditorDebug.bytes());const png=render(bytes,'c');
  const red=execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${png}').convert('RGB');print(sum(1 for p in a.getdata() if p[0]>200 and p[1]<60 and p[2]<60))"`).toString().trim();
  ok('赤い線が描かれている(赤い画素 '+red+')',+red>300);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
