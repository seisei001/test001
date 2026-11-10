// ページ編集: 行間・字間のバーの大きさ・長さを設定で変えられる / 入力枠を確定するボタンがヘッダーに出る
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
  const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(700);
  chk('枠を選ぶと、行間・字間のバーが出る',await fr.locator('.spbar').count()===1);
  const sc=()=>fr.locator('.spbar').evaluate(e=>{const m=/scale\(([\d.]+)\)/.exec(e.style.transform);return m?+m[1]:0;});
  const wd=()=>fr.locator('.spbar input').first().evaluate(e=>e.getBoundingClientRect().width/ (e.closest('.spbar').getBoundingClientRect().width/e.closest('.spbar').offsetWidth||1));
  const s0=await sc(),w0=await wd();console.log('   標準 scale',s0,'長さ',Math.round(w0));
  // 設定で、大きさ×2・長さ150
  await fr.locator('#embSet').click();await page.waitForTimeout(400);
  chk('設定に、バーの大きさ・長さがある',await fr.locator('#spbSize').count()===1&&await fr.locator('#spbLen').count()===1);
  await fr.locator('#spbSize').evaluate(e=>{e.value=2;e.dispatchEvent(new Event('input',{bubbles:true}));});await fr.locator('#spbLen').evaluate(e=>{e.value=150;e.dispatchEvent(new Event('input',{bubbles:true}));});await page.waitForTimeout(400);
  const s1=await sc(),w1=await wd();console.log('   変更後 scale',s1,'長さ',Math.round(w1));
  chk('表示が2倍になる(出ているバーにも、すぐ反映)',Math.abs(s1/s0-2)<0.05);
  chk('バーの長さが変わる(60→150)',Math.abs(w1-150)<3&&Math.abs(w0-60)<3);
  await fr.locator('#setClose').click();await page.waitForTimeout(300);
  // 標準に戻す
  await fr.locator('#embSet').click();await page.waitForTimeout(300);await fr.locator('#spbReset').click();await page.waitForTimeout(300);
  chk('標準に戻せる',Math.abs(await sc()-s0)<0.01);await fr.locator('#setClose').click();
  // 確定ボタン
  const b=fr.locator('#embHead #sClose');chk('枠を選ぶと、ヘッダーに「確定」が出る',await b.isVisible()&&/確定/.test(await b.textContent()));
  await b.click();await page.waitForTimeout(600);
  chk('確定すると、選択が外れる',await f.evaluate(()=>window.pdfEditorDebug.selId())===null);
  chk('選択が無いときは、確定は出ない',!(await b.isVisible()));
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);
})();
