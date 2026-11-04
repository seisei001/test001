// 罫線編集(その4): 線の種類(破線・点線・二重線など)、楕円、範囲で選んだあとの個別の選択
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const {PDFDocument,rgb}=require(path.join(WORK,'lib/node_modules')+'/pdf-lib');
(async()=>{
  const src='/tmp/rules4_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([400,300]);
   p.drawLine({start:{x:50,y:250},end:{x:350,y:250},thickness:2,color:rgb(0,0,0)});
   p.drawLine({start:{x:50,y:200},end:{x:350,y:200},thickness:2,color:rgb(0,0,0)});
   p.drawRectangle({x:50,y:120,width:300,height:2,color:rgb(0,0,0)});fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
    return {fr:page.frameLocator('#formFrame'),f:page.frames().find(x=>x!==page.mainFrame())};};
  const render=async(label)=>{await page.frameLocator('#formFrame').locator('#embSave').click();await page.waitForTimeout(3000);
    fs.writeFileSync(`/tmp/r4_${label}.pdf`,Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
    execSync(`pdftoppm -r 72 -png -singlefile /tmp/r4_${label}.pdf /tmp/r4_${label}`);};
  // 同じ行(y)で、黒い画素が途切れる回数(破線・点線)
  const gaps=(label,y)=>+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/r4_${label}.png').convert('L');px=a.load()
row=[min(px[x,${y}+d]for d in(-1,0,1))<140 for x in range(60,340)]
print(sum(1 for i in range(1,len(row)) if row[i-1] and not row[i]))"`).toString().trim();
  // 1) 既存の罫線の種類を変える(破線)
  let {fr,f}=await open();
  const R=()=>f.evaluate(()=>window.pdfEditorDebug.rules());
  const rs=await R();ok('罫線が3本(線2本+薄い四角1本): '+rs.length,rs.length===3);
  await fr.locator('#rAll').click();await page.waitForTimeout(300);
  await fr.locator('#rStyle').selectOption('dash');await fr.locator('#rStSet').click();await page.waitForTimeout(2500);
  await render('dash');
  ok('破線にした: 3本とも途切れる(上 '+gaps('dash',50)+' / 中 '+gaps('dash',100)+' / 下 '+gaps('dash',180)+')',gaps('dash',50)>5&&gaps('dash',100)>5&&gaps('dash',180)>5);
  // 2) 点線で線を引く
  ({fr,f}=await open());
  await fr.locator('#rW').fill('2');await fr.locator('#rStyle').selectOption('dot');await fr.locator('#rDraw').click();
  const ob=await fr.locator('#ov').boundingBox();
  await page.mouse.move(ob.x+ob.width*0.15,ob.y+ob.height*0.7);await page.mouse.down();await page.mouse.move(ob.x+ob.width*0.85,ob.y+ob.height*0.71,{steps:6});await page.mouse.up();await page.waitForTimeout(2000);
  await render('dot');
  const dg=+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/r4_dot.png').convert('L');px=a.load();W,H=a.size
ys=[y for y in range(int(H*.6),int(H*.8)) if sum(1 for x in range(0,W) if px[x,y]<140)>5]
y=ys[len(ys)//2] if ys else 0
row=[px[x,y]<140 for x in range(0,W)]
print(sum(1 for i in range(1,len(row)) if row[i-1] and not row[i]))"`).toString().trim();
  ok('点線で引けた(点の数 '+dg+')',+dg>15);
  // 3) 楕円
  ({fr,f}=await open());
  await fr.locator('#rOval').click();
  const o2=await fr.locator('#ov').boundingBox();
  await page.mouse.move(o2.x+o2.width*0.3,o2.y+o2.height*0.6);await page.mouse.down();await page.mouse.move(o2.x+o2.width*0.7,o2.y+o2.height*0.9,{steps:6});await page.mouse.up();await page.waitForTimeout(2000);
  await render('oval');
  const ov=execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/r4_oval.png').convert('L');px=a.load();W,H=a.size
l=[(x,y) for x in range(W) for y in range(190,H) if px[x,y]<140]
print(len(l),min(p[0] for p in l),max(p[0] for p in l),min(p[1] for p in l),max(p[1] for p in l))"`).toString().trim().split(' ').map(Number);
  console.log('楕円',ov);
  ok('楕円が描かれた(外枠が約 160×90pt)',ov[0]>200&&Math.abs((ov[2]-ov[1])-160)<8);
  // 4) 範囲で選んだあと、個別に選び直せる
  ({fr,f}=await open());
  await fr.locator('#rBand').click();
  const o3=await fr.locator('#ov').boundingBox(),k=o3.width/400;
  await page.mouse.move(o3.x+20*k,o3.y+(300-262)*k);await page.mouse.down();await page.mouse.move(o3.x+380*k,o3.y+(300-190)*k,{steps:6});await page.mouse.up();await page.waitForTimeout(500);
  const sel=()=>f.evaluate(()=>document.querySelectorAll('.rl.on').length);
  ok('範囲で2本選ばれる: '+await sel(),await sel()===2);
  // 範囲に入らなかった3本目(薄い四角)を、そのまま1本タップして足す
  await page.mouse.click(o3.x+200*k,o3.y+(300-121)*k);await page.waitForTimeout(400);
  ok('範囲で選んだあとも、選んでいない罫線を1本タップして足せる: '+await sel(),await sel()===3);
  await page.mouse.click(o3.x+100*k,o3.y+(300-250)*k);await page.waitForTimeout(400);
  ok('選んだ1本をタップして外せる: '+await sel(),await sel()===2);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(allOk&&!errs.length?0:1);
})();
