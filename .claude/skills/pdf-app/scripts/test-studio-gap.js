// ページ編集: 同じ行の遠く離れた文字(空白が広い)を、標準では1つの枠にまとめる。設定の倍数を小さくすれば分ける(先に make-gap-pdf.js)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const run=async(gap)=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/gap.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  if(gap){await f.evaluate(g=>{const n=document.getElementById('fxGap');n.value=g;n.dispatchEvent(new Event('change',{bubbles:true}));},String(gap));await page.waitForTimeout(500);}
  const ov=await fr.locator('#ov').boundingBox(),k=ov.width/420;
  await page.mouse.move(ov.x+5*k,ov.y+40*k);await page.mouse.down();await page.mouse.move(ov.x+415*k,ov.y+75*k,{steps:8});await page.mouse.up();await page.waitForTimeout(800);
  const r=await f.evaluate(()=>window.pdfEditorDebug.items().map(i=>i.txt));await browser.close();return {r,errs};
};
(async()=>{
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  const a=await run(0);
  ok('標準(1.5倍)では、離れた文字は別々の枠になる: '+JSON.stringify(a.r),a.r.length===2);
  const b=await run(200);
  ok('設定の倍数を200にすると、離れた文字も1つの枠にまとまる: '+JSON.stringify(b.r.map(t=>t.replace(/ +/g,' '))),b.r.length===1&&/Left/.test(b.r[0])&&/Right/.test(b.r[0]));
  console.log('JSエラー:',a.errs.length+b.errs.length);
})();
