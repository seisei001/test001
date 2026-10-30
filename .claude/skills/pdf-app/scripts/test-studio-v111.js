// 製本デスク: 全選択/全解除が常に見える・多数ファイルでも軽い / 整形: 範囲だけ残して外を白に
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  chk('全選択/全解除が、メニューを開かずに見える',await page.locator('#bAll').isVisible()&&await page.locator('#bNone').isVisible());
  const f1=WORK+'/samples/studio_A4.pdf';
  const t0=Date.now();
  await page.setInputFiles('#fAdd',Array(60).fill(f1));
  await page.waitForFunction(()=>window.pdfStudioDebug.bundles().length===60,null,{timeout:60000});
  const dt=Date.now()-t0;chk('60ファイルを開く時間 '+dt+'ms',dt<15000);
  await page.waitForTimeout(1500);
  const drawn=await page.evaluate(()=>[...document.querySelectorAll('.card canvas')].filter(c=>c.width>20).length);
  chk('描いたサムネイルは画面の近くの分だけ('+drawn+'/60)',drawn>0&&drawn<60);
  await page.click('#bAll');chk('全選択',(await page.evaluate(()=>window.pdfStudioDebug.bundles())).every(b=>b.sel));
  await page.click('#bNone');chk('全解除',(await page.evaluate(()=>window.pdfStudioDebug.bundles())).every(b=>!b.sel));
  await page.evaluate(()=>[...document.querySelectorAll('.card')].pop().scrollIntoView());await page.waitForTimeout(2500);
  const last=await page.evaluate(()=>{const c=[...document.querySelectorAll('.card canvas')].pop();return c.width>20;});
  chk('スクロールすると、あとのカードも描かれる',last);
  // 整形: 範囲だけ残す
  
  await page.click('#bAll');await page.click('#bNone');
  await page.locator('.card').first().locator('input[type=checkbox]').check();await page.locator('.card').first().locator('.mnb').click();
  await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-s=crop],#shSeg [data-t=crop],button:has-text("切り抜き")').first().click().catch(()=>{});await page.waitForTimeout(800);
  chk('「この範囲だけ残す」ボタンがある',await fr.locator('#shCropKeep').count()===1);
  const ob=await fr.locator('#ov').boundingBox();
  const pw0=await f.evaluate(()=>[window.pdfEditorDebug.pageSize?window.pdfEditorDebug.pageSize():null]).catch(()=>[null]);
  await page.mouse.move(ob.x+ob.width*.3,ob.y+ob.height*.05);await page.mouse.down();await page.mouse.move(ob.x+ob.width*.7,ob.y+ob.height*.3,{steps:6});await page.mouse.up();await page.waitForTimeout(400);
  const sz0=await f.evaluate(()=>{const c=document.querySelector('#stage canvas')||document.querySelector('canvas');return [c.width,c.height];});
  await fr.locator('#shCropKeep').click();await page.waitForTimeout(4500);
  const px=await f.evaluate(()=>{const c=[...document.querySelectorAll('canvas')].sort((a,b)=>b.width*b.height-a.width*a.height)[0],g=c.getContext('2d'),W=c.width,H=c.height;
    const dark=(x0,y0,x1,y1)=>{const d=g.getImageData(x0,y0,x1-x0,y1-y0).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]<250)n++;return n;};
    return {W,H,inside:dark(Math.round(W*.3),Math.round(H*.05),Math.round(W*.7),Math.round(H*.3)),outsideBelow:dark(0,Math.round(H*.4),W,H),outsideLeft:dark(0,0,Math.round(W*.28),H)};});
  console.log(JSON.stringify(px),sz0);await page.screenshot({path:'/tmp/v111.png'});
  chk('範囲の中は残っている',px.inside>50);
  chk('範囲の外は白(下側・左側に黒い所がない)',px.outsideBelow===0&&px.outsideLeft===0);
  chk('ページの大きさは変わらない',Math.abs(px.W/px.H-sz0[0]/sz0[1])<0.02);
  console.log('errs',errs.slice(0,3));
  await browser.close();process.exit(ok&&!errs.length?0:1);
})();
