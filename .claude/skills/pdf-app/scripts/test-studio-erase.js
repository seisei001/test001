// ページ編集: 元の文字を隠す範囲が、文字のある所だけか/ 隠すかどうかを選べるか
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const ov=await fr.locator('#ov').boundingBox(),k=ov.width/420;
  // 2行のかたまり(ドラッグで範囲を囲む)
  await page.mouse.move(ov.x+5*k,ov.y+95*k);await page.mouse.down();await page.mouse.move(ov.x+415*k,ov.y+180*k,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
  const items=await f.evaluate(()=>window.pdfEditorDebug.items());
  console.log('    部品:',items.map(i=>`${i.type}「${i.txt.replace(/\n/g,'/')}」 隠す範囲${i.covers.length}個`).join(' | '));
  const it=items.find(i=>i.covers.length>1)||items[0];
  const total=it.covers.reduce((a,c)=>a+c[2]*c[3],0);
  const xs=it.covers.map(c=>c[0]),ys=it.covers.map(c=>c[1]),x1=Math.max(...it.covers.map(c=>c[0]+c[2])),y1=Math.max(...it.covers.map(c=>c[1]+c[3]));
  const union=(x1-Math.min(...xs))*(y1-Math.min(...ys));
  ok(`隠す範囲は、全体を囲む四角(${union})より狭い(${total})`,items.length>=1&&total<union*0.95);
  const vis=()=>f.evaluate(()=>({cover:[...document.querySelectorAll('.cover')].filter(e=>e.style.display!=='none').length,cvo:[...document.querySelectorAll('.cvo')].filter(e=>e.style.display!=='none').length,same:document.querySelectorAll('.ibox.same').length}));
  const v0=await vis();
  ok('文字を変えていない訂正の部品は、背景を白抜きしない(隠す四角・赤い点線が出ない)・元の文字のまま: '+JSON.stringify(v0),v0.cover===0&&v0.cvo===0&&v0.same>=1);
  // 変えていない部品は、PDFに何も書かない(フォントが増えない)
  // 文字を変える(1文字足す)と、元の文字を隠す範囲が出る
  const t0=await fr.locator('.ibox.on .t').boundingBox();
  await page.mouse.click(t0.x+t0.width-6,t0.y+t0.height/2);await page.waitForTimeout(200);await page.keyboard.press('End');await page.keyboard.type('X');await page.waitForTimeout(400);
  const v1=await vis();
  ok('文字を変えると、元の文字を隠す範囲(赤い点線・背景)が出る: '+JSON.stringify(v1),v1.cover>=1&&v1.cvo>=1);
  await page.screenshot({path:WORK+'/shot_erase_on.png'});
  await fr.locator('#sEraseOn').uncheck();await page.waitForTimeout(300);
  const c1=await f.evaluate(()=>document.querySelectorAll('.cover').length);
  ok('チェックを外すと、選択中の部品の背景の四角と点線が消える',await f.evaluate(()=>document.querySelectorAll('.cvo').length===0&&window.pdfEditorDebug.items().some(i=>i.erase===false)));
  await page.screenshot({path:WORK+'/shot_erase_off.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
