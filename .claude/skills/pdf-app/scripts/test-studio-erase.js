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
  ok('拾い上げた時点で、元の文字を隠す四角が出て、赤い点線は出ない: '+JSON.stringify(v0),v0.cover>=1&&v0.cvo===0);
  // 変えていない部品は、PDFに何も書かない(フォントが増えない)
  // 文字を変える(1文字足す)と、元の文字を隠す範囲が出る
  const t0=await fr.locator('.ibox.on .t').boundingBox();
  await page.mouse.click(t0.x+t0.width-6,t0.y+t0.height/2);await page.waitForTimeout(200);await page.keyboard.press('End');await page.keyboard.type('X');await page.waitForTimeout(400);
  const v1=await vis();
  ok('文字を変えても、元の文字を隠す四角のまま・赤い点線は出ない: '+JSON.stringify(v1),v1.cover>=1&&v1.cvo===0);
  await page.screenshot({path:WORK+'/shot_erase_on.png'});
  // 背景の三つの選び方(✥の設定): 完全透明・余白透明・白抜き
  const covs=()=>f.evaluate(()=>{const o=window.pdfEditorDebug.items();return[...document.querySelectorAll('.cover')].map(e=>[e.dataset.for,Math.round(parseFloat(e.style.width)),Math.round(parseFloat(e.style.height))]);});
  const setBg=async v=>{const m=await fr.locator('.hdl.mv').boundingBox();await page.mouse.dblclick(m.x+m.width/2,m.y+m.height/2);await page.waitForTimeout(300);await fr.locator('#spBg').selectOption(v);await fr.locator('#spOk').click();await page.waitForTimeout(500);};
  const id=await f.evaluate(()=>String(window.pdfEditorDebug.items().findIndex(i=>true)));
  const cOn=(await f.evaluate(()=>document.querySelectorAll('.cvo').length));
const bgc=()=>f.evaluate(()=>getComputedStyle(document.querySelector('.ibox.on')).backgroundColor);
  await setBg('none');
  const bNone=await bgc();
  ok('完全透明: 隠す四角も赤い点線も出ず、枠の中も透明: '+bNone,await f.evaluate(()=>document.querySelectorAll(`.cover[data-for="${window.pdfEditorDebug.selId()}"]`).length===0&&document.querySelectorAll('.cvo').length===0&&window.pdfEditorDebug.items().some(i=>i.erase===false))&&/rgba\(0, 0, 0, 0\)|transparent/.test(bNone));
  await setBg('all');
  const bAll=await bgc();
  const boxAll=await f.evaluate(()=>{const o=document.querySelector('.ibox.on'),r=o.getBoundingClientRect();const cv=[...document.querySelectorAll(`.cover[data-for="${window.pdfEditorDebug.selId()}"]`)].map(e=>e.getBoundingClientRect());return{n:cv.length,w:Math.round(cv[0]?.width),h:Math.round(cv[0]?.height),ow:Math.round(r.width),oh:Math.round(r.height)};});
  ok('白抜き: 枠の全体を白抜きする(四角1つ・枠と同じ大きさ): '+JSON.stringify(boxAll),boxAll.n===1&&Math.abs(boxAll.w-boxAll.ow)<=2&&Math.abs(boxAll.h-boxAll.oh)<=2);
  await setBg('text');
  const bText=await bgc();
  const nText=await f.evaluate(()=>document.querySelectorAll(`.cover[data-for="${window.pdfEditorDebug.selId()}"]`).length);
  ok('余白透明: 文字のあるところだけ(文字の行ごと)白抜きし、枠の中は透明(四角'+nText+'個・'+bText+')',nText>=1&&/rgba\(0, 0, 0, 0\)|transparent/.test(bText));
  await page.screenshot({path:WORK+'/shot_erase_off.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
