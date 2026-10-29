// 整形: 傾き補正・切り抜き・回転/反転(歪み補正は別のテスト)
//   node .claude/skills/pdf-app/scripts/test-studio-shape.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb,StandardFonts,degrees}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/shape_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([400,300]),f=await d.embedFont(StandardFonts.Helvetica);
   p.drawRectangle({x:100,y:150,width:200,height:100,color:rgb(1,0,0)});p.drawRectangle({x:100,y:150,width:60,height:30,color:rgb(0,0,1)});   // 赤い四角(左下に青)
   for(let i=0;i<8;i++)p.drawText('LINE '+i+' sample text for skew',{x:30,y:120-i*12,size:9,font:f});
   fs.writeFileSync(src,await d.save());
   // 5度傾いた文字の行のページ(自動の傾き検出用)
   const d2=await PDFDocument.create(),p2=d2.addPage([400,300]),f2=await d2.embedFont(StandardFonts.Helvetica);
   for(let i=0;i<12;i++)p2.drawText('Skewed line number '+i+' with some more words here',{x:30,y:260-i*18,size:11,font:f2,rotate:degrees(5)});
   fs.writeFileSync('/tmp/shape_skew.pdf',await d2.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  const open=async(file)=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[file]);await page.waitForTimeout(1800);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3500);};
  const F=()=>page.frames().find(x=>x!==page.mainFrame()),fr=page.frameLocator('#formFrame');
  const cur=async()=>{const u=await F().evaluate(()=>window.pdfEditorDebug.bytes());fs.writeFileSync('/tmp/shape_cur.pdf',Buffer.from(u));return execSync('pdfinfo /tmp/shape_cur.pdf').toString();};
  const redbox=()=>{execSync('pdftoppm -r 72 -png -singlefile /tmp/shape_cur.pdf /tmp/shape_cur');return execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/shape_cur.png').convert('RGB');W,H=a.size;px=a.load()
def bb(f):
  l=[(x,y) for x in range(W) for y in range(H) if f(px[x,y])]
  return (min(p[0] for p in l),min(p[1] for p in l),max(p[0] for p in l),max(p[1] for p in l)) if l else (0,0,0,0)
print(W,H,*bb(lambda c:c[0]>200 and c[1]<60 and c[2]<60),*bb(lambda c:c[2]>200 and c[0]<60 and c[1]<60))"`).toString().trim().split(' ').map(Number);};
  await open(src);
  ok('整形の名前と、道具の切り替えが出る: '+await page.textContent('#formName'),/整形/.test(await page.textContent('#formName'))&&await fr.locator('#shapeSeg button').count()===4);
  ok('はじめは歪み補正の道具',await fr.locator('#optWarp').isVisible()&&await fr.locator('#shapeSeg button.on').getAttribute('data-t')==='warp');
  // 回転: 右に90度(ページの向きだけ変わる。文字は残る)
  await fr.locator('#shapeSeg [data-t=rot]').click();await page.waitForTimeout(300);
  await fr.locator('#shRotR').click();await page.waitForTimeout(2500);
  let info=await cur();ok('右に90度: ページが縦長に(Page rot 90 / サイズ 400x300): '+info.match(/Page rot:.*/)[0]+' '+info.match(/Page size:.*/)[0],/Page rot: +90/.test(info));
  ok('文字は残っている',/LINE 0/.test(execSync('pdftotext /tmp/shape_cur.pdf -').toString()));
  await fr.locator('#shRotL').click();await page.waitForTimeout(2000);info=await cur();ok('左に90度で元に戻る(rot 0)',/Page rot: +0/.test(info));
  // 左右反転: 赤い四角の青い部分が、左下→右下へ
  let b0=(await (async()=>{await cur();return redbox();})());
  await fr.locator('#shFlipH').click();await page.waitForTimeout(4500);await cur();let b1=redbox();
  ok('左右反転: 青い部分が左から右へ動く(青の左端 '+b0[6]+' → '+b1[6]+')',b0[6]<b0[2]+5&&b1[8]>b1[4]-5&&b1[6]>b0[6]+100);
  ok('画像のページになった(文字は無い)',execSync('pdftotext /tmp/shape_cur.pdf -').toString().trim()==='');
  await fr.locator('#bUndo').click();await page.waitForTimeout(2000);await cur();
  ok('元に戻すと、文字のあるページに戻る',/LINE 0/.test(execSync('pdftotext /tmp/shape_cur.pdf -').toString()));
  // 切り抜き: 赤い四角のまわりだけ
  await fr.locator('#shapeSeg [data-t=crop]').click();await page.waitForTimeout(500);
  ok('切り抜きの道具が出る',await fr.locator('#optCrop').isVisible()&&await fr.locator('#ov svg').count()>=1);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/400;
  await page.mouse.move(ob.x+95*k,ob.y+(300-255)*k);await page.mouse.down();await page.mouse.move(ob.x+305*k,ob.y+(300-145)*k,{steps:8});await page.mouse.up();await page.waitForTimeout(500);
  await fr.locator('#shCropApply').click();await page.waitForTimeout(4500);
  info=await cur();const sz=info.match(/Page size: +([\d.]+) x ([\d.]+)/);
  ok('切り抜き: ページが約 210×110 に: '+(sz&&sz[1]+'x'+sz[2]),sz&&Math.abs(+sz[1]-210)<12&&Math.abs(+sz[2]-110)<12);
  const bb2=redbox();ok('切り抜いた中に赤い四角がほぼいっぱい: '+bb2.slice(2,6).join(','),bb2[2]<12&&bb2[3]<12);
  // 傾き補正(自動)
  await open('/tmp/shape_skew.pdf');
  await fr.locator('#shapeSeg [data-t=tilt]').click();await page.waitForTimeout(500);
  ok('傾き補正の道具が出る',await fr.locator('#optTilt').isVisible());
  await fr.locator('#shAuto').click();await page.waitForTimeout(3000);
  const ang=+await fr.locator('#shAng').inputValue();
  ok('自動で見つけた角度が、約 -5度(文字の傾き +5度 の逆)か +5度付近: '+ang,Math.abs(Math.abs(ang)-5)<=1.0);
  await fr.locator('#shTiltApply').click();await page.waitForTimeout(5000);
  await cur();ok('傾きを直すと、画像のページになる',execSync('pdftotext /tmp/shape_cur.pdf -').toString().trim()==='');
  await fr.locator('#shAuto').click();await page.waitForTimeout(3000);
  const ang2=+await fr.locator('#shAng').inputValue();ok('直したあとの傾きは、ほぼ 0 度: '+ang2,Math.abs(ang2)<=0.6);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
