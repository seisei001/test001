// 束デスク: 束ぜんぶの回転 / いま表示しているページだけの回転
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const rots=()=>page.evaluate(async()=>{const b=await PDFLib.PDFDocument.load(new Uint8Array(window.pdfStudioDebug.bytes(0)));return b.getPages().map(p=>p.getRotation().angle);});
  const menu=async t=>{await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:t}).click();await page.waitForTimeout(1200);};
  const r0=await rots();console.log('最初',r0);
  await page.locator('.card').first().locator('.next').click();await page.waitForTimeout(400);   // 2ページ目を表示
  await menu('このページだけ回転');
  const r1=await rots();console.log('このページだけ',r1);
  chk('表示中の2ページ目だけ、右に90度',r1[1]===(r0[1]+90)%360&&r1.filter((a,i)=>i!==1).every((a,i)=>a===r0.filter((x,j)=>j!==1)[i]));
  await menu('束ぜんぶを回転');
  const r2=await rots();console.log('束ぜんぶ',r2);
  chk('全ページが、さらに右に90度',r2.every((a,i)=>a===(r1[i]+90)%360));
  chk('ページ数そのまま',r2.length===r0.length);
  await page.locator('#bUndo').click();await page.waitForTimeout(500);
  chk('「元に戻す」で戻る',JSON.stringify(await rots())===JSON.stringify(r1));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
