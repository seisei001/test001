// 整形: 切り抜いて動かす の回転つまみ(緑の枠を45度回す)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const {PDFDocument,rgb}=require(path.join(WORK,'lib/node_modules')+'/pdf-lib');
(async()=>{
  const src='/tmp/croprot_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([595,842]);p.drawRectangle({x:100,y:842-150,width:50,height:50,color:rgb(1,0,0)});fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('#shapeSeg [data-t=crop]').click();await page.waitForTimeout(500);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595,X=v=>ob.x+v*k,Y=v=>ob.y+v*k;
  await page.mouse.move(X(90),Y(90));await page.mouse.down();await page.mouse.move(X(160),Y(160),{steps:8});await page.mouse.up();await page.waitForTimeout(800);
  await fr.locator('#shCropMove').click();await page.waitForTimeout(1200);
  ok('回転のつまみが出る',await fr.locator('svg.warp circle[data-h=rot]').count()===1);
  const hb=await fr.locator('svg.warp circle[data-h=rot]').boundingBox(),hx=hb.x+hb.width/2,hy=hb.y+hb.height/2,cx=X(125),cy=Y(125);
  const r=Math.hypot(hx-cx,hy-cy),a=Math.atan2(hy-cy,hx-cx)+Math.PI/4;
  await page.mouse.move(hx,hy);await page.mouse.down();await page.mouse.move(cx+r*Math.cos(a),cy+r*Math.sin(a),{steps:8});await page.mouse.up();await page.waitForTimeout(800);
  const d=await f.evaluate(()=>window.pdfEditorDebug.warpDst());
  const e01=Math.atan2(d[1][1]-d[0][1],d[1][0]-d[0][0])*180/Math.PI;
  ok('緑の枠が45度回った('+e01.toFixed(1)+'度)・形は崩れない',Math.abs(e01-45)<3&&Math.abs(Math.hypot(d[1][0]-d[0][0],d[1][1]-d[0][1])-70)<2);
  await fr.locator('#wApply').click();await page.waitForTimeout(6000);await fr.locator('#embSave').click();await page.waitForTimeout(3000);
  fs.writeFileSync('/tmp/croprot_out.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
  execSync('pdftoppm -r 72 -png -singlefile /tmp/croprot_out.pdf /tmp/croprot_out');
  const bb=execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/croprot_out.png').convert('RGB');W,H=a.size;px=a.load()
l=[(x,y) for x in range(W) for y in range(H) if px[x,y][0]>200 and px[x,y][1]<60 and px[x,y][2]<60]
print(len(l),min(p[0] for p in l),min(p[1] for p in l),max(p[0] for p in l),max(p[1] for p in l))"`).toString().trim().split(' ').map(Number);
  console.log(bb);
  ok('回って貼られた(赤い図形の外枠が広がり、面積はほぼ同じ)',bb[3]-bb[1]>60&&Math.abs(bb[0]-2500)<250);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
