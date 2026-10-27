// ページ編集: Ctrl+ホイール/ヘッダーの「－ ＋」は、ページだけ拡大縮小(ヘッダーは大きくならない)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();
  await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const m=()=>f.evaluate(()=>({ov:document.getElementById('ov').getBoundingClientRect().width,btn:document.getElementById('embSave').getBoundingClientRect().width,hd:document.getElementById('embHead').getBoundingClientRect().height,pz:window.pdfEditorDebug.pz(),lbl:document.getElementById('pzR').textContent}));
  const a=await m();
  const bb=await fr.locator('#ov').boundingBox();await page.mouse.move(bb.x+bb.width/2,bb.y+200);
  await page.keyboard.down('Control');await page.mouse.wheel(0,-400);await page.keyboard.up('Control');await page.waitForTimeout(600);
  const b=await m();console.log(JSON.stringify(a),JSON.stringify(b));
  chk('Ctrl+ホイールで、ページが大きくなる',b.ov>a.ov*1.3&&b.pz>1.3);
  chk('ヘッダーのボタン・高さは変わらない',Math.abs(b.btn-a.btn)<1&&Math.abs(b.hd-a.hd)<1);
  chk('ページの画像と重ねた枠の大きさが同じ',await f.evaluate(()=>Math.abs(document.getElementById('stage').getBoundingClientRect().width-document.getElementById('ov').getBoundingClientRect().width)<1));
  chk('倍率の表示が変わる('+b.lbl+')',b.lbl!=='100%');
  await fr.locator('#pzR').click();await page.waitForTimeout(400);
  const c=await m();chk('「100%」を押すと標準に戻る',c.pz===1&&Math.abs(c.ov-a.ov)<2);
  await fr.locator('#pzM').click();await page.waitForTimeout(400);
  const d=await m();chk('「－」でページが小さくなる',d.ov<a.ov*0.9);
  chk('ブラウザの拡大は変わらない',await f.evaluate(()=>window.devicePixelRatio)===await page.evaluate(()=>window.devicePixelRatio));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
