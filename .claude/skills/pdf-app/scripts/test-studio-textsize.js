// ページ編集: 文字の枠を作ったとき、枠の大きさから文字サイズ(pt)が決まるか
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();
  await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=text]').click();
  const ov=await fr.locator('#ov').boundingBox(),k=ov.width/420;
  const cases=[['細長い1行(幅200×高さ20pt)',200,20],['フォームの欄(幅110×高さ24pt)',110,24],['大きめ(幅300×高さ60pt)',300,60],['小さい(幅100×高さ12pt)',100,12],['幅が狭い(幅40×高さ100pt)',40,100],['タップだけ',0,0]];
  let y=20;
  for(const [n,w,h] of cases){
    if(w===0){await page.mouse.click(ov.x+30*k,ov.y+y*k);}
    else{await page.mouse.move(ov.x+20*k,ov.y+y*k);await page.mouse.down();await page.mouse.move(ov.x+(20+w)*k,ov.y+(y+h)*k,{steps:6});await page.mouse.up();}
    await page.waitForTimeout(500);
    const items=await f.evaluate(()=>window.pdfEditorDebug.items());const it=items[items.length-1];
    console.log(`${n}: サイズ ${it.size}pt (欄: ${await f.evaluate(()=>document.getElementById('nSize').value)})`);
    await fr.locator('[data-m=text]').click();y+=h+24;
  }
  await page.screenshot({path:WORK+'/shot_textsize.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
