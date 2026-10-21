// ページ編集2.06: 枠の操作(カーソルの形・見本の「あ」と矢印・自動で枠に合わせる・指のタップ/長押し)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  const items=()=>f.evaluate(()=>window.pdfEditorDebug.items());
  const ov=await fr.locator('#ov').boundingBox(),k=ov.width/420;
  const drag=async(x,y,w,h)=>{await page.mouse.move(ov.x+x*k,ov.y+y*k);await page.mouse.down();await page.mouse.move(ov.x+(x+w)*k,ov.y+(y+h)*k,{steps:6});await page.mouse.up();await page.waitForTimeout(500);};
  // --- マウス ---
  await fr.locator('[data-m=text]').click();
  await drag(40,200,200,34);
  ok('空の枠に、見本の「あ」と大きさの矢印が出る',await f.evaluate(()=>!!document.querySelector('.ibox.on .sample')&&!!document.querySelector('.ibox.on .grip')));
  const cur=await f.evaluate(()=>({mv:getComputedStyle(document.querySelector('.hdl.mv')).cursor,rs:getComputedStyle(document.querySelector('.hdl.rs')).cursor,t:getComputedStyle(document.querySelector('.ibox.on .t')).cursor,ol:getComputedStyle(document.querySelector('.ibox.on')).outline}));
  ok(`カーソルの形: 左上=${cur.mv} 右下=${cur.rs} 枠内=${cur.t}`,cur.mv==='move'&&cur.rs==='nwse-resize'&&cur.t==='text');
  ok('枠は、うすい点線: '+cur.ol,/dashed/.test(cur.ol));
  await page.keyboard.type('TEST');await page.waitForTimeout(500);
  const it1=(await items()).pop();
  ok(`1文字入れると、見本と矢印が消え、枠に合わせた大きさになる(${it1.size}pt)`,await f.evaluate(()=>!document.querySelector('.ibox.on .sample')&&!document.querySelector('.ibox.on .grip'))&&it1.size>=18);
  // 移動・大きさ(角のカーソル範囲をドラッグ)
  const b=await fr.locator('.ibox.on').boundingBox();
  const x0=it1.vx;await page.mouse.move(b.x-2,b.y-2);await page.mouse.down();await page.mouse.move(b.x-2+40,b.y-2+10,{steps:5});await page.mouse.up();await page.waitForTimeout(300);
  ok('左上の角をドラッグすると、枠が動く',(await items()).pop().vx>x0+10);
  const b2=await fr.locator('.ibox.on').boundingBox(),w0=(await items()).pop().vw;
  await page.mouse.move(b2.x+b2.width+2,b2.y+b2.height+2);await page.mouse.down();await page.mouse.move(b2.x+b2.width+2+60,b2.y+b2.height+2+10,{steps:5});await page.mouse.up();await page.waitForTimeout(300);
  ok('右下の角をドラッグすると、枠の大きさが変わる',(await items()).pop().vw>w0+20);
  // 矢印で、文字の大きさを決めてから入力
  await fr.locator('[data-m=text]').click();await drag(40,100,200,60);
  const g=await fr.locator('.ibox.on .grip').boundingBox(),s0=(await items()).pop().size;
  await page.mouse.move(g.x+g.width/2,g.y+g.height/2);await page.mouse.down();await page.mouse.move(g.x+g.width/2+40,g.y+g.height/2+40,{steps:6});await page.mouse.up();await page.waitForTimeout(300);
  const s1=(await items()).pop().size;ok(`矢印を引くと、1文字の大きさが変わる(${s0}→${s1}pt)`,s1>s0+3);
  await page.keyboard.type('Ab');await page.waitForTimeout(400);
  ok('大きさを決めたあとは、自動で枠に合わせない('+(await items()).pop().size+'pt)',(await items()).pop().size===s1);
  // A− A＋
  await fr.locator('#sPlus').click();await page.waitForTimeout(200);ok('A＋で0.5pt大きくなる',(await items()).pop().size===s1+0.5);
  // --- 指 ---
  const cdp=await page.context().newCDPSession(page);
  const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  await fr.locator('[data-m=sel]').click();
  const tap=async(x,y)=>{await T('touchStart',x,y);await page.waitForTimeout(60);await T('touchEnd');await page.waitForTimeout(500);};
  await tap(ov.x+60*k,ov.y+60*k);   // PDFの文字をタップ→訂正の部品
  const st=()=>f.evaluate(()=>({touch:document.body.classList.contains('pt-touch'),hdl:document.querySelectorAll('.hdl').length,edit:document.querySelector('.ibox.on .t')?.contentEditable,btn:!!document.querySelector('.editbtn'),active:document.activeElement?.className}));
  const s=await st();ok('指でタップ: 選ぶだけで、入力の状態にならない(キーボードなし)・印と「✎入力」が出る: '+JSON.stringify(s),s.touch&&s.hdl===2&&s.edit!=='true'&&s.btn);
  const tb=await fr.locator('.ibox.on .t').boundingBox();
  await T('touchStart',tb.x+tb.width/2,tb.y+tb.height/2);await page.waitForTimeout(700);await T('touchEnd');await page.waitForTimeout(400);
  const s2=await st();ok('枠の中を長押しすると、入力できる(カーソルが入る): '+JSON.stringify(s2),s2.edit==='true'&&s2.active==='t');
  await page.screenshot({path:WORK+'/shot_edit_ui.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
