// 整形(整理後): ① 範囲 → ② 補正 → ③ 置き場所 → ④ まわり
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const {PDFDocument,rgb,degrees}=require(path.join(WORK,'lib/node_modules')+'/pdf-lib');
(async()=>{
  const src='/tmp/shape2_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([595,842]);p.drawRectangle({x:200,y:500,width:200,height:100,rotate:degrees(30),color:rgb(1,0,0)});
   p.drawRectangle({x:20,y:20,width:60,height:40,color:rgb(0,0,1)});fs.writeFileSync(src,await d.save());}   // 回した赤い長方形と、隅の青い四角(まわりの目印)
  const c=Math.cos(Math.PI/6),s=Math.sin(Math.PI/6),P=(x,y)=>[200+x*c-y*s,842-(500+x*s+y*c)];
  const Q=[P(0,100),P(200,100),P(200,0),P(0,0)];
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await fr.locator('#wkPart').click();await page.waitForTimeout(300);
    const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595;
    await page.mouse.move(ob.x+150*k,ob.y+150*k);await page.mouse.down();await page.mouse.move(ob.x+450*k,ob.y+300*k,{steps:6});await page.mouse.up();await page.waitForTimeout(700);
    await f.evaluate(q=>window.pdfEditorDebug.warpSetCorners(q),Q);await page.waitForTimeout(300);
    return {fr,f};};
  const out=async(fr)=>{await fr.locator('#embSave').click();await page.waitForTimeout(3000);fs.writeFileSync('/tmp/shape2_out.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
    execSync('pdftoppm -r 72 -png -singlefile /tmp/shape2_out.pdf /tmp/shape2_out');
    return execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/shape2_out.png').convert('RGB');W,H=a.size;px=a.load()
red=sum(1 for x in range(W) for y in range(H) if px[x,y][0]>200 and px[x,y][1]<80 and px[x,y][2]<80)
blue=sum(1 for x in range(W) for y in range(H) if px[x,y][2]>200 and px[x,y][0]<80 and px[x,y][1]<80)
print(W,H,red,blue)"`).toString().trim().split(' ').map(Number);};
  // A: まっすぐに直す + 切り抜く
  let {fr,f}=await open();
  const ids=['wkPage','wkPart','wAuto','wAutoMargin','wfStraight','wfAsis','wDstReset','waKeep','waWhite','waCrop','wApply'];
  ok('手順の部品が揃っている',(await Promise.all(ids.map(i=>fr.locator('#'+i).count()))).every(n=>n===1)&&await fr.locator('#shapeSeg button').count()===3);
  await fr.locator('#shDet').evaluate(e=>{e.open=true},null,{timeout:400}).catch(()=>{});await fr.locator('#waCrop').click();await fr.locator('#wApply').click();await page.waitForTimeout(5000);
  let r=await out(fr);console.log('A',r);
  ok('A 直す+切り抜く: 200×100の長方形で、ほぼ全部赤',Math.abs(r[0]-200)<=3&&Math.abs(r[1]-100)<=3&&r[2]>r[0]*r[1]*0.9);
  // B: 直さない + 切り抜く(外枠のページ、形の外は白)
  ({fr,f}=await open());await fr.locator('#shDet').evaluate(e=>{e.open=true},null,{timeout:400}).catch(()=>{});await fr.locator('#wfAsis').click();await fr.locator('#shDet').evaluate(e=>{e.open=true},null,{timeout:400}).catch(()=>{});await fr.locator('#waCrop').click();await fr.locator('#wApply').click();await page.waitForTimeout(5000);
  r=await out(fr);console.log('B',r);
  ok('B 直さない+切り抜く: 外枠(約224×187)で、赤は元の面積(約20000)',r[0]>215&&r[0]<235&&r[1]>180&&r[1]<195&&r[2]>18000&&r[2]<22000);
  // C: 直す + 白くする(ページの大きさそのまま。まわりの青い四角が消える)
  ({fr,f}=await open());await fr.locator('#shDet').evaluate(e=>{e.open=true},null,{timeout:400}).catch(()=>{});await fr.locator('#waWhite').click();await fr.locator('#wApply').click();await page.waitForTimeout(5000);
  r=await out(fr);console.log('C',r);
  ok('C 白くする: ページの大きさそのまま(595×842)・赤は残り・まわりの青は消える',r[0]===595&&r[1]===842&&r[2]>5000&&r[3]===0);
  // D: 直す + そのまま(元の場所は消す): ページの大きさそのまま・青は残る
  ({fr,f}=await open());await fr.locator('#shDet').evaluate(e=>{e.open=true},null,{timeout:400}).catch(()=>{});await fr.locator('#waKeep').click();await fr.locator('#wApply').click();await page.waitForTimeout(5000);
  r=await out(fr);console.log('D',r);
  ok('D そのまま: 595×842・青も赤も残る',r[0]===595&&r[1]===842&&r[2]>5000&&r[3]>2000);
  // E: 回転つまみ(45度)
  ({fr,f}=await open());await fr.locator('#shDet').evaluate(e=>{e.open=true},null,{timeout:400}).catch(()=>{});await fr.locator('#waKeep').click();
  const ob2=await fr.locator('#ov').boundingBox(),k2=ob2.width/595,hb=await fr.locator('svg.warp circle[data-h=rot]').boundingBox(),hx=hb.x+hb.width/2,hy=hb.y+hb.height/2;
  const d0=await f.evaluate(()=>window.pdfEditorDebug.warpState().dst),cx=ob2.x+(d0[0][0]+d0[2][0])/2*k2,cy=ob2.y+(d0[0][1]+d0[2][1])/2*k2,rr=Math.hypot(hx-cx,hy-cy),a=Math.atan2(hy-cy,hx-cx)+Math.PI/4;
  await page.mouse.move(hx,hy);await page.mouse.down();await page.mouse.move(cx+rr*Math.cos(a),cy+rr*Math.sin(a),{steps:8});await page.mouse.up();await page.waitForTimeout(600);
  const d1=await f.evaluate(()=>window.pdfEditorDebug.warpState().dst),ang=Math.atan2(d1[1][1]-d1[0][1],d1[1][0]-d1[0][0])*180/Math.PI;
  ok('E 回転つまみで緑の枠が45度回る('+ang.toFixed(1)+'度)',Math.abs(ang-45)<3);
  // F: 四隅の自動検出(紙のあるページで)
  ({fr,f}=await open());await fr.locator('#shDet').evaluate(e=>{e.open=true},null,{timeout:400}).catch(()=>{});await fr.locator('#wAuto').click();await page.waitForTimeout(2500);
  ok('F 四隅を自動で探す: エラーなく動く',(await f.evaluate(()=>!!window.pdfEditorDebug.warpState())));
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
