// 罫線編集(その6): 楕円は、保存するまで部品として動かせる・大きさ・種類を変えられる
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  await page.evaluate(()=>document.getElementById('bNew').click());await page.waitForTimeout(1200);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const OV=()=>f.evaluate(()=>window.pdfEditorDebug.ovals());
  let o=await fr.locator('#ov').boundingBox();const W=595.28,k=o.width/W;
  await fr.locator('#rW').fill('2');await fr.locator('#rOval').click();
  await page.mouse.move(o.x+100*k,o.y+100*k);await page.mouse.down();await page.mouse.move(o.x+250*k,o.y+180*k,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
  let v=await OV();ok('楕円は、まだPDFに書き込まれず、部品として残る: '+v.length+'個',v.length===1);
  ok('描いた直後は選ばれていて、四隅の丸が出る',await fr.locator('svg circle').count()===4);
  const b0=v[0];
  // 動かす: 楕円の右端(線の上)をつかんで、右下へ 100,60
  o=await fr.locator('#ov').boundingBox();
  const px=o.x+(b0.x+b0.w)*k,py=o.y+(b0.y+b0.h/2)*k;
  await page.mouse.move(px,py);await page.mouse.down();await page.mouse.move(px+100*k,py+60*k,{steps:6});await page.mouse.up();await page.waitForTimeout(500);
  v=await OV();ok('ドラッグで動く(x '+Math.round(b0.x)+'→'+Math.round(v[0].x)+', y '+Math.round(b0.y)+'→'+Math.round(v[0].y)+')',Math.abs(v[0].x-b0.x-100)<3&&Math.abs(v[0].y-b0.y-60)<3&&Math.abs(v[0].w-b0.w)<1);
  // 大きさ: 右下の丸を、右へ 40pt
  const hs=await fr.locator('svg circle').all();let br=null;for(const h of hs){const bb=await h.boundingBox();const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;if(Math.abs(cx-(o.x+(v[0].x+v[0].w)*k))<4&&Math.abs(cy-(o.y+(v[0].y+v[0].h)*k))<4)br=bb;}
  await page.mouse.move(br.x+br.width/2,br.y+br.height/2);await page.mouse.down();await page.mouse.move(br.x+br.width/2+40*k,br.y+br.height/2,{steps:6});await page.mouse.up();await page.waitForTimeout(500);
  const v2=await OV();ok('四隅の丸で大きさを変えられる(幅 '+Math.round(v[0].w)+'→'+Math.round(v2[0].w)+')',Math.abs(v2[0].w-v[0].w-40)<3&&Math.abs(v2[0].x-v[0].x)<1);
  // 種類を破線に
  await fr.locator('#rStyle').selectOption('dash');await fr.locator('#rStSet').click();await page.waitForTimeout(300);
  ok('種類を変えられる',(await OV())[0].style==='dash');
  // 保存
  await fr.locator('#embSave').click();await page.waitForTimeout(3500);
  fs.writeFileSync('/tmp/r6.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
  execSync('pdftoppm -r 72 -png -singlefile /tmp/r6.pdf /tmp/r6');
  const bb=execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/r6.png').convert('L');W,H=a.size;px=a.load()
l=[(x,y) for x in range(W) for y in range(H) if px[x,y]<140]
print(len(l),min(p[0] for p in l),max(p[0] for p in l),min(p[1] for p in l),max(p[1] for p in l))"`).toString().trim().split(' ').map(Number);
  console.log('保存後の楕円',bb,'期待',[Math.round(v2[0].x),Math.round(v2[0].x+v2[0].w),Math.round(v2[0].y),Math.round(v2[0].y+v2[0].h)]);
  ok('保存すると、動かした位置・変えた大きさで、PDFに書き込まれる',Math.abs(bb[1]-v2[0].x)<4&&Math.abs(bb[2]-(v2[0].x+v2[0].w))<4&&Math.abs(bb[3]-v2[0].y)<4&&Math.abs(bb[4]-(v2[0].y+v2[0].h))<4);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(allOk&&!errs.length?0:1);
})();
