// 整形: 切り抜きの範囲を、四隅が自由な形(斜め・台形)に。まっすぐに直す/形のまま/外を白/自動で探す
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const {PDFDocument,rgb,degrees}=require(path.join(WORK,'lib/node_modules')+'/pdf-lib');
(async()=>{
  const src='/tmp/cropquad_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([595,842]);p.drawRectangle({x:200,y:500,width:200,height:100,rotate:degrees(30),color:rgb(1,0,0)});fs.writeFileSync(src,await d.save());}
  // 回した長方形の四隅(ページ座標=上が0)
  const c=Math.cos(Math.PI/6),s=Math.sin(Math.PI/6),P=(x,y)=>[200+x*c-y*s,842-(500+x*s+y*c)];
  const Q=[P(0,100),P(200,100),P(200,0),P(0,0)];   // 左上,右上,右下,左下(画面で見た順)
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());await fr.locator('#shapeSeg [data-t=crop]').click();await page.waitForTimeout(500);return {fr,f};};
  const out=async(fr)=>{await fr.locator('#embSave').click();await page.waitForTimeout(3000);fs.writeFileSync('/tmp/cropquad_out.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
    execSync('pdftoppm -r 72 -png -singlefile /tmp/cropquad_out.pdf /tmp/cropquad_out');
    return execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/cropquad_out.png').convert('RGB');W,H=a.size;px=a.load()
red=sum(1 for x in range(W) for y in range(H) if px[x,y][0]>200 and px[x,y][1]<80 and px[x,y][2]<80)
print(W,H,red)"`).toString().trim().split(' ').map(Number);};
  // 1) まっすぐに直す
  let {fr,f}=await open();
  const pad=await fr.locator('.stage').evaluate(e=>parseFloat(getComputedStyle(e).paddingLeft));
  ok('ページのまわりに余白がある('+pad+'px)',pad>=28);
  await fr.locator('#shCropFree').click();await page.waitForTimeout(300);
  ok('四隅の丸が4つ',await fr.locator('svg circle').count()>=4);
  await f.evaluate(q=>window.pdfEditorDebug.cropQuad(q),Q);await page.waitForTimeout(300);
  ok('「まっすぐに直して切り抜く」が出る',await fr.locator('#shCropStraight').isVisible());
  await fr.locator('#shCropStraight').click();await page.waitForTimeout(4000);
  let r=await out(fr);console.log(r);
  ok('長方形(約200×100)になり、中はほぼ全部赤',Math.abs(r[0]-200)<=3&&Math.abs(r[1]-100)<=3&&r[2]>r[0]*r[1]*0.93);
  // 2) 形のまま(外は白)
  ({fr,f}=await open());await fr.locator('#shCropFree').click();await f.evaluate(q=>window.pdfEditorDebug.cropQuad(q),Q);await page.waitForTimeout(300);
  await fr.locator('#shCropApply').click();await page.waitForTimeout(4000);r=await out(fr);console.log(r);
  ok('外枠の大きさのページで、赤は元の面積(約20000)',r[0]>200&&r[0]<300&&r[2]>18000&&r[2]<22000);
  // 3) 自動で四隅
  ({fr,f}=await open());await fr.locator('#shCropQuad').click();await page.waitForTimeout(3000);
  ok('自動で四隅の範囲になる(まっすぐに直す が出る)',await fr.locator('#shCropStraight').isVisible());
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
