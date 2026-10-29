// 歪み補正(部分): 四隅・周りの点・中の点の動き方が、ページ全体(一括)と同じ
//   node .claude/skills/pdf-app/scripts/test-studio-warppart.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/warppart_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([595,842]);p.drawRectangle({x:100,y:600,width:200,height:100,color:rgb(0.9,0.9,0.9)});fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'歪み補正'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),F=()=>page.frames().find(x=>x!==page.mainFrame());
  const G=()=>F().evaluate(()=>window.pdfEditorDebug.warpG());
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595,X=v=>ob.x+v*k,Y=v=>ob.y+v*k;
  const dragCircle=async(sel,dx,dy)=>{const b=await fr.locator(sel).boundingBox();const cx=b.x+b.width/2,cy=b.y+b.height/2;await page.mouse.move(cx,cy);await page.mouse.down();await page.mouse.move(cx+dx,cy+dy,{steps:6});await page.mouse.up();await page.waitForTimeout(400);};
  const run=async(kind)=>{
    if(kind==='part'){await fr.locator('#wkPart').click();await page.waitForTimeout(300);
      await page.mouse.move(X(80),Y(150));await page.mouse.down();await page.mouse.move(X(380),Y(300),{steps:8});await page.mouse.up();await page.waitForTimeout(1000);}
    else{await fr.locator('#wkPage').click();await page.waitForTimeout(800);}
    let g=await G();const mid0=g[2][2].slice();
    await dragCircle('circle[data-h="4_4"]',-40,-30);   // 右下の角を動かす
    g=await G();
    const moved=Math.hypot(g[2][2][0]-mid0[0],g[2][2][1]-mid0[1]);
    return{kind,moved,g};
  };
  const a=await run('page');
  ok('一括: 角を動かすと、中の点もついてくる (中央の点 '+a.moved.toFixed(1)+'pt 動いた)',a.moved>3);
  // 一括の周りの点(右辺の中ほど)を動かす → 辺の上の点がついてきて、曲線になる
  await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'歪み補正'}).click();await page.waitForTimeout(3500);
  const b=await run('part');
  ok('部分: 角を動かすと、中の点もついてくる (中央の点 '+b.moved.toFixed(1)+'pt 動いた)',b.moved>3);
  const cornerPt=50/k;ok('部分も、一括と同じ割合で中央の点が動く(角の動き '+cornerPt.toFixed(1)+'pt の 10〜40%): '+b.moved.toFixed(1),b.moved>0.1*cornerPt&&b.moved<0.4*cornerPt);
  ok('一括も同じ割合: '+a.moved.toFixed(1),a.moved>0.1*cornerPt&&a.moved<0.4*cornerPt);
  // 周りの点(右辺の真ん中 2_4)を動かすと、同じ辺の他の点もついてくる
  const before=(await G());
  await dragCircle('circle[data-h="2_4"]',30,0);
  const after=await G();
  const d4=after[2][4][0]-before[2][4][0],d3=after[2][3][0]-before[2][3][0];
  ok('周りの点(2_4)を動かすと、同じ行の内側の点(2_3)も、距離に応じて小さくついてくる: '+d4.toFixed(1)+' → '+d3.toFixed(1),d4>10&&d3>1&&d3<d4);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
