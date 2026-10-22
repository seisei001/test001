// ページ編集: すでに訂正した文字の上に、別の枠をドラッグで作っても、同じ文字を二重に取り込まない
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
  const items=()=>f.evaluate(()=>window.pdfEditorDebug.items().map(i=>[i.type,i.txt]));
  const drag=async(x,y,w,h)=>{const o=await fr.locator('#ov').boundingBox();await page.mouse.move(o.x+x*k,o.y+y*k);await page.mouse.down();await page.mouse.move(o.x+(x+w)*k,o.y+(y+h)*k,{steps:6});await page.mouse.up();await page.waitForTimeout(600);};
  await drag(30,75,150,30);   // 「利用種別」を囲む→訂正の部品
  let it=await items();ok('文字を囲むと、訂正の部品ができる: '+JSON.stringify(it),it.length===1&&it[0][0]==='fix'&&it[0][1]==='利用種別');
  await f.evaluate(()=>{});
  await fr.locator('#sClose').click();await page.waitForTimeout(300);
  await drag(20,70,200,45);   // 同じ文字の上に、別の枠(空白から始めて、同じ文字を囲む)
  it=await items();
  ok('同じ文字を、もう一度囲んでも、二重の訂正の部品にならない(文字のない枠扱い): '+JSON.stringify(it),it.filter(i=>i[0]==='fix'&&i[1]==='利用種別').length===1);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
