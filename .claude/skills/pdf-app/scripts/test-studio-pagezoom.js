// ページ編集: 「全体」でページ全体が見える・縮小は20%まで・拡大は1000%まで・拡大すると絵を細かく描き直す
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const vh=await page.evaluate(()=>innerHeight);
  const rect=()=>fr.locator('#pagewrap').boundingBox();
  for(let i=0;i<3;i++)await fr.locator('#pzP').click();await page.waitForTimeout(500);
  await fr.locator('#pzF').click();await page.waitForTimeout(700);
  const r=await rect(),pct=await fr.locator('#pzR').textContent();
  chk('「全体」でページ全体が画面に収まる('+pct+')',r.y>=-2&&r.y+r.height<=vh+2&&r.x>=-2);
  for(let i=0;i<12;i++)await fr.locator('#pzM').click();
  chk('縮小は20%まで: '+await fr.locator('#pzR').textContent(),(await fr.locator('#pzR').textContent())==='20%');
  await fr.locator('#pzR').click();await page.waitForTimeout(300);
  const w0=await f.evaluate(()=>document.getElementById('stage').width);
  for(let i=0;i<12;i++)await fr.locator('#pzP').click();await page.waitForTimeout(1500);
  const pc=await fr.locator('#pzR').textContent(),w1=await f.evaluate(()=>document.getElementById('stage').width);
  chk('拡大は1000%まで: '+pc,pc==='1000%');
  chk('拡大すると絵を細かく描き直す('+w0+'→'+w1+')',w1>w0*1.8);
  await fr.locator('#pzR').click();await page.waitForTimeout(1500);
  chk('100%に戻すと標準の細かさに戻る('+await f.evaluate(()=>document.getElementById('stage').width)+')',await f.evaluate(()=>document.getElementById('stage').width)<=w0*1.2);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);
})();
