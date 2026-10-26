// ページ編集: ピンクの鉛筆で大きくして→戻す/小さくしたとき、枠が勝手に大きいまま残らない
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();
  await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
  const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(600);
  const geo=()=>f.evaluate(()=>{const i=window.pdfEditorDebug.items().filter(x=>x.type==='fix').pop();return i&&{vw:i.vw,vh:i.vh,size:i.size};});
  const g0=await geo();console.log('最初',JSON.stringify(g0));
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const gr=fr.locator('.grip');const b=await gr.boundingBox();
  const cx=b.x+b.width/2,cy=b.y+b.height/2;
  await page.mouse.move(cx,cy);await page.mouse.down();
  for(const dy of [20,40,20,0,-20,-45]){await page.mouse.move(cx,cy+dy,{steps:2});console.log('  dy',dy,JSON.stringify(await geo()));}
  const g1=await geo();console.log('枠(画面)',JSON.stringify(await fr.locator('.ibox.on').boundingBox()));console.log('小さく',JSON.stringify(g1));
  await page.mouse.up();await page.waitForTimeout(300);
  const g2=await geo();console.log('離した後',JSON.stringify(g2));
  chk('文字が小さくなった',g2.size<g0.size);
  chk('枠の幅は変わらない',Math.abs(g2.vw-g0.vw)<0.01);
  chk('大きくして戻した後、さらに小さくしても、枠は元の大きさのまま',Math.abs(g2.vh-g0.vh)<0.01);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
