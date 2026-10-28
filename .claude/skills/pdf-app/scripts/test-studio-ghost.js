// ページ編集: PDFの文字から作った枠は、選んだ時点で元の文字が隠れる(「元の画像と重ねて確認」がオンでも、二重に見えない)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'PDFを編集'.replace('PDFを編集','ページ編集')}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(600);
  chk('「元の画像と重ねて確認」は、オン(文字認識用)',await f.evaluate(()=>document.getElementById('ov').classList.contains('ghost')));
  const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(700);
  const st=await f.evaluate(()=>{const c=document.querySelector('.cover');const e=document.querySelector('.ibox.on .fl .ln, .ibox.on .t');return {cov:c?getComputedStyle(c).opacity:null,col:e?getComputedStyle(e).color:null};});
  console.log(JSON.stringify(st));
  chk('元の文字を隠す白い面が、見えている(透明ではない)',st.cov==='1');
  chk('枠の文字が、赤い重ね表示ではなく、ふつうの色',st.col&&!/220, 38, 38/.test(st.col));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
