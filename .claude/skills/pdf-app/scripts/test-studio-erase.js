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
  ok('選択すると、赤い点線の枠と「元の文字を隠す」チェックが出る',await f.evaluate(()=>document.querySelectorAll('.cvo').length>0&&!document.getElementById('sEraseOnWrap').classList.contains('hidden')));
  await page.screenshot({path:WORK+'/shot_erase_on.png'});
  const c0=await f.evaluate(()=>document.querySelectorAll('.cover').length),sel0=(await f.evaluate(()=>window.pdfEditorDebug.items())).findIndex(i=>i.erase);
  await fr.locator('#sEraseOn').uncheck();await page.waitForTimeout(300);
  const c1=await f.evaluate(()=>document.querySelectorAll('.cover').length);
  ok(`チェックを外すと、選択中の部品の隠す範囲(赤い点線・背景)が消える(背景の四角 ${c0}→${c1})`,c1<c0&&await f.evaluate(()=>document.querySelectorAll('.cvo').length===0&&window.pdfEditorDebug.items().some(i=>i.erase===false)));
  await page.screenshot({path:WORK+'/shot_erase_off.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
