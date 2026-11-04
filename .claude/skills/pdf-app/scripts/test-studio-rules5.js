// 罫線編集(その5): 斜めの線を引く・選ぶ、始点・終点を動かす、好きな向きに動かす
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const {PDFDocument,rgb}=require(path.join(WORK,'lib/node_modules')+'/pdf-lib');
(async()=>{
  const src='/tmp/rules5_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([400,300]);
   p.drawLine({start:{x:50,y:250},end:{x:350,y:250},thickness:2,color:rgb(0,0,0)});
   p.drawLine({start:{x:50,y:200},end:{x:350,y:120},thickness:2,color:rgb(0,0,0)});   // 斜めの線
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'罫線編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const R=async()=>(await f.evaluate(()=>window.pdfEditorDebug.rules())).map(r=>({...r,diag:!!r.diag}));
  let rs=await R();ok('斜めの線も、罫線として数えられる: '+rs.length+'本(斜め '+rs.filter(r=>r.diag).length+')',rs.length===2&&rs.filter(r=>r.diag).length===1);
  const ob=()=>fr.locator('#ov').boundingBox();
  let o=await ob(),k=o.width/400;const P=(x,y)=>[o.x+x*k,o.y+(300-y)*k];
  // 斜めの線の真ん中をクリックして選ぶ
  let [cx,cy]=P(200,160);await page.mouse.click(cx,cy);await page.waitForTimeout(400);
  ok('斜めの線を選べる: '+await fr.locator('.rl.on').count(),await fr.locator('.rl.on').count()===1);
  ok('1本選ぶと、始点・終点の丸が2つ出る',await fr.locator('.rhd').count()===2);
  // 終点の丸を、(350,120)→(300,80)へ
  const h1=await fr.locator('.rhd').nth(1).boundingBox(),[ex,ey]=P(300,80);
  await page.mouse.move(h1.x+h1.width/2,h1.y+h1.height/2);await page.mouse.down();await page.mouse.move(ex,ey,{steps:8});await page.mouse.up();await page.waitForTimeout(2500);
  rs=await R();const dg=rs.find(r=>r.diag);
  console.log('after ends',JSON.stringify(dg));
  const ends=dg&&[[dg.x0,dg.y0],[dg.x1,dg.y1]].sort((a,b)=>a[0]-b[0]);
  ok('終点が動いた(約 300,80)・始点は(約 50,200)のまま',dg&&Math.abs(ends[1][0]-300)<4&&Math.abs(ends[1][1]-80)<4&&Math.abs(ends[0][0]-50)<2&&Math.abs(ends[0][1]-200)<2);
  // 水平線を、斜め方向へ動かす(自由な向き)
  o=await ob();k=o.width/400;[cx,cy]=P(120,250);await page.mouse.click(cx,cy);await page.waitForTimeout(400);
  const [mx,my]=P(160,215);await page.mouse.move(cx,cy);await page.mouse.down();await page.mouse.move(mx,my,{steps:8});await page.mouse.up();await page.waitForTimeout(2500);
  rs=await R();const hz=rs.filter(r=>!r.diag)[0];
  ok('水平線が、横にも動けた(y '+(hz&&Math.round(hz.y0))+' ← 250、x '+(hz&&Math.round(Math.min(hz.x0,hz.x1)))+' ← 50)',hz&&Math.abs(hz.y0-215)<5&&Math.abs(Math.min(hz.x0,hz.x1)-90)<6);
  // 斜めに線を引く
  await fr.locator('#rDraw').click();o=await ob();k=o.width/400;
  const [sx,sy]=P(60,60),[tx,ty]=P(160,20);
  await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(tx,ty,{steps:8});await page.mouse.up();await page.waitForTimeout(2500);
  rs=await R();ok('斜めの線を引けた(斜め '+rs.filter(r=>r.diag).length+'本)',rs.filter(r=>r.diag).length===2&&rs.length===3);
  // ほぼ水平なら、水平に合わせる
  const [ux,uy]=P(60,40),[vx,vy]=P(200,38);
  await page.mouse.move(ux,uy);await page.mouse.down();await page.mouse.move(vx,vy,{steps:8});await page.mouse.up();await page.waitForTimeout(2500);
  rs=await R();ok('ほぼ水平のドラッグは、水平な線になる('+rs.length+'本・斜め '+rs.filter(r=>r.diag).length+')',rs.length===4&&rs.filter(r=>r.diag).length===2);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(allOk&&!errs.length?0:1);
})();
