// 歪み補正: 外周の点を動かすと、同じ縦/横ラインの中の点が自動でついてくる。中の点を動かしても他は動かない。四隅は今まで通り
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();
  await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const G=()=>f.evaluate(()=>window.pdfEditorDebug.warpG());
  const drag=async(r,c,dx,dy)=>{const bb=await fr.locator(`svg.warp circle[data-h="${r}_${c}"]`).boundingBox();const x=bb.x+bb.width/2,y=bb.y+bb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:6});await page.mouse.up();await page.waitForTimeout(400);};
  const moved=(a,b,r,c)=>Math.hypot(a[r][c][0]-b[r][c][0],a[r][c][1]-b[r][c][1])>0.5;
  let g0=await G();
  await drag(0,2,0,-30);let g1=await G();   // 上の辺の真ん中の点を上へ
  chk('上の点が動く',moved(g0,g1,0,2));
  chk('同じ縦ラインの中の点(1〜3段目)が、ついてくる',[1,2,3].every(r=>moved(g0,g1,r,2)));
  chk('ついてくる量は、上に近いほど大きい',(g0[1][2][1]-g1[1][2][1])>(g0[2][2][1]-g1[2][2][1])&&(g0[2][2][1]-g1[2][2][1])>(g0[3][2][1]-g1[3][2][1]));
  chk('下の点・ほかの列は動かない',!moved(g0,g1,4,2)&&[0,1,3,4].every(c=>[0,1,2,3,4].every(r=>!moved(g0,g1,r,c))));
  g0=await G();await drag(2,0,40,0);g1=await G();   // 左の辺の真ん中の点を右へ
  chk('左の点が動き、同じ横ラインの中の点(1〜3列目)がついてくる',moved(g0,g1,2,0)&&[1,2,3].every(c=>moved(g0,g1,2,c)));
  chk('右の点は動かない',!moved(g0,g1,2,4));
  g0=await G();await drag(2,2,20,20);g1=await G();   // 中の点
  chk('中の点を動かしたときは、その点だけ動く',moved(g0,g1,2,2)&&g0.every((row,r)=>row.every((p,c)=>(r===2&&c===2)||!moved(g0,g1,r,c))));
  g0=await G();await drag(0,0,15,15);g1=await G();   // 四隅(これまで通り)
  chk('四隅を動かす操作は、今まで通り(角が動く)',moved(g0,g1,0,0));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
