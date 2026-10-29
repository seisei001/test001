// ページ編集: 拡大したページを、縦と横を同時に(斜めに)スクロールできる(縦横が別々のスクロールになっていない)
//   node .claude/skills/pdf-app/scripts/test-studio-diag.js
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[S+'studio_A4.pdf']);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const f=page.frames().find(x=>x!==page.mainFrame()),fr=page.frameLocator('#formFrame');
  for(let i=0;i<4;i++)await fr.locator('#pzP').click();await page.waitForTimeout(500);   // 大きく拡大
  const info=()=>f.evaluate(()=>({sx:scrollX,sy:scrollY,mx:document.documentElement.scrollWidth-innerWidth,my:document.documentElement.scrollHeight-innerHeight,stageX:document.querySelector('.stage').scrollLeft,stageY:document.querySelector('.stage').scrollTop,stageOv:getComputedStyle(document.querySelector('.stage')).overflowX}));
  const a=await info();console.log('   ',JSON.stringify(a));
  ok('縦にも横にも動かせる大きさ(画面全体): '+a.mx+' × '+a.my,a.mx>50&&a.my>50);
  ok('枠の中に別のスクロールを持たない(overflow='+a.stageOv+')',a.stageOv==='visible');
  await f.evaluate(()=>scrollTo(0,0));
  await f.evaluate(()=>scrollBy(120,90));const b=await info();
  ok('斜めに(横120・縦90)動く: '+b.sx+','+b.sy,b.sx>=100&&b.sy>=70);
  const hb=await fr.locator('#embHead').boundingBox();ok('横に動いても見出しは左端のまま: x='+hb.x,Math.abs(hb.x)<2);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
