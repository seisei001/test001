// ページ編集: 枠の中の文字をドラッグで選べる(最初・最後の文字も)/ 何も入力しなかった新しい枠は、選択を外すと消える
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
  await page.mouse.click(ov.x+60*k,ov.y+60*k);await page.waitForTimeout(500);
  const t=await fr.locator('.ibox.on .t').boundingBox();
  const sel=()=>f.evaluate(()=>String(getSelection()));
  const pos=()=>f.evaluate(()=>window.pdfEditorDebug.items().map(i=>[i.txt,Math.round(i.vx)]));
  const p0=await pos();
  await page.mouse.move(t.x+2,t.y+t.height/2);await page.mouse.down();await page.mouse.move(t.x+t.width-2,t.y+t.height/2,{steps:8});await page.mouse.up();await page.waitForTimeout(300);
  ok('枠の左端から右端までドラッグすると、全部の文字が選べる: 「'+await sel()+'」',(await sel())==='利用種別');
  ok('そのとき、枠は動かない',JSON.stringify(await pos())===JSON.stringify(p0));
  // 空の新しい枠は、選択を外すと消える
  await fr.locator('[data-m=text]').click();
  const ovT=await fr.locator('#ov').boundingBox();   // 方式を変えると、上の設定欄の高さが変わり、ページの位置がずれる
  await page.mouse.click(ovT.x+250*k,ovT.y+200*k);await page.waitForTimeout(400);
  const n1=(await pos()).length;
  await fr.locator('[data-m=sel]').click();const ovS=await fr.locator('#ov').boundingBox();await page.mouse.click(ovS.x+250*k,ovS.y+285*k);await page.waitForTimeout(400);
  const n2=(await pos()).length;
  ok(`空の枠を作ってから、別の所をタップすると消える(${n1}→${n2})`,n1===2&&n2===1);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
