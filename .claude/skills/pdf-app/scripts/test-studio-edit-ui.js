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
  ok('空の枠に、見本の「あ」と、ピンクの鉛筆が出る',await f.evaluate(()=>!!document.querySelector('.ibox.on .sample')&&!!document.querySelector('.ibox.on .grip')));
  const cur=await f.evaluate(()=>({mv:getComputedStyle(document.querySelector('.hdl.mv')).cursor,rs:getComputedStyle(document.querySelector('.hdl.rs')).cursor,t:getComputedStyle(document.querySelector('.ibox.on .t')).cursor,ol:getComputedStyle(document.querySelector('.ibox.on')).outline}));
  ok(`カーソルの形: 左上=${cur.mv} 右下=${cur.rs} 枠内=${cur.t}`,cur.mv==='move'&&cur.rs==='nwse-resize'&&cur.t==='text');
  ok('入力できる枠は、実線(入力モード): '+cur.ol,/solid/.test(cur.ol)&&await f.evaluate(()=>document.querySelector('.ibox.on').classList.contains('edit')));
  const s_init=(await items()).pop().size;
  await page.keyboard.type('TEST');await page.waitForTimeout(500);
  const it1=(await items()).pop();
  ok(`文字を入れると、見本は消え、矢印は文字の最後に付く。文字サイズは自動で変わらない(${it1.size}pt)`,await f.evaluate(()=>!document.querySelector('.ibox.on .sample')&&!!document.querySelector('.ibox.on .grip'))&&it1.size===s_init);
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
  await fr.locator('[data-m=text]').click();await drag(40,150,150,34);await page.keyboard.type('ABC');await page.waitForTimeout(300);
  const q0=(await items()).find(i=>i.txt==='ABC');
  let bb=await fr.locator('.ibox.on').boundingBox();
  await page.mouse.move(bb.x+bb.width+2,bb.y+bb.height+2);await page.mouse.down();await page.mouse.move(bb.x+bb.width+2+60,bb.y+bb.height+2,{steps:5});await page.mouse.up();await page.waitForTimeout(300);
  const q1=(await items()).find(i=>i.txt==='ABC');
  ok(`枠の幅を変えても、文字サイズは同じ(${q0.size}→${q1.size}pt)・幅は広がる`,q1.size===q0.size&&q1.vw>q0.vw+20);
  bb=await fr.locator('.ibox.on').boundingBox();
  await page.mouse.move(bb.x+bb.width+2,bb.y+bb.height+2);await page.mouse.down();await page.mouse.move(bb.x+bb.width+2,bb.y+bb.height+2+bb.height,{steps:5});await page.mouse.up();await page.waitForTimeout(300);
  const q2=(await items()).find(i=>i.txt==='ABC');
  ok(`縦を約2倍にしても、文字サイズは同じ(${q1.size}→${q2.size}pt)。枠は自由に大きくなる(高さ${Math.round(q1.vh)}→${Math.round(q2.vh)})`,q2.size===q1.size&&q2.vh>q1.vh*1.6);
  await fr.locator('[data-m=text]').click();await drag(190,5,70,26);   // 狭い枠に長い文字
  await page.keyboard.type('WWWWWWWWWWWWWWWWWWWWWWWW');await page.waitForTimeout(400);
  const w1=(await items()).find(i=>/^W+$/.test(i.txt)),h0=Math.max(26,w1.size*1.3);
  ok(`右の境界を超えたら折り返して、枠が下に伸びる(幅は${Math.round(w1.vw)}のまま・高さ${Math.round(w1.vh)}・文字サイズ${w1.size}pt)`,w1.vw<100&&w1.vh>h0*1.5);
  // 矢印は、文字の最後の右下に付く
  const gp=await f.evaluate(()=>{const g=document.querySelector('.ibox.on .grip').getBoundingClientRect(),t=document.querySelector('.ibox.on .t').getBoundingClientRect();return{gx:g.left+g.width/2,gy:g.top+g.height/2,tr:t.right,tb:t.bottom,tl:t.left,tt:t.top};});
  ok('矢印は、枠の下側(最後の行)の、文字のあたりに付く',gp.gy>gp.tt+(gp.tb-gp.tt)*0.5&&gp.gx<gp.tr+5);
  ok('枠の右上の「文字」「訂正」の表記が無い',await f.evaluate(()=>document.querySelectorAll('.ibox .tag').length===0));
  ok('文字サイズ欄は表示だけ(ピンクの鉛筆で変える)・A−/A＋・「入力」ボタンは無い',await f.evaluate(()=>document.getElementById('sSize').readOnly&&!document.getElementById('sPlus')&&!document.getElementById('sMinus')&&!document.querySelector('.editbtn')));
  const mvb=await fr.locator('.hdl.mv').boundingBox();
  await page.mouse.dblclick(mvb.x+mvb.width/2,mvb.y+mvb.height/2);await page.waitForTimeout(300);
  ok('✥のダブルクリックで、文字の設定(フォント・サイズ・文字色)が出る',await f.evaluate(()=>!!document.getElementById('sizePop')&&!!document.getElementById('spFont')&&!!document.getElementById('spIn')&&!!document.getElementById('spColor')&&document.querySelectorAll('#spFont option').length>=3));
  await fr.locator('#spFont').selectOption('mincho');await fr.locator('#spIn').fill('14');await fr.locator('#spColor').fill('#ff0000');await fr.locator('#spOk').click();await page.waitForTimeout(2500);
  const wq=(await items()).find(i=>/^W+$/.test(i.txt));
  const cs3=await f.evaluate(()=>{const t=document.querySelector('.ibox.on .t');const c=getComputedStyle(t);return{fam:c.fontFamily,color:c.color,size:parseFloat(t.style.fontSize)};});
  ok(`フォント(明朝)・サイズ(14pt)・文字色(赤)が変わる: ${cs3.fam} ${cs3.color} ${wq.size}pt`,wq.size===14&&/PdfMincho/.test(cs3.fam)&&cs3.color==='rgb(255, 0, 0)');
  ok('矢印は、ピンクの鉛筆(✎)',await f.evaluate(()=>{const g=document.querySelector('.ibox.on .grip');return !!g&&g.textContent==='✎';}));
  // --- 指 ---
  const cdp=await page.context().newCDPSession(page);
  const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  await fr.locator('[data-m=sel]').click();
  const tap=async(x,y)=>{await T('touchStart',x,y);await page.waitForTimeout(60);await T('touchEnd');await page.waitForTimeout(500);};
  const n0=(await items()).length;
  await tap(ov.x+60*k,ov.y+60*k);
  ok('指で軽くタップしても、何も作られない',(await items()).length===n0);
  await T('touchStart',ov.x+60*k,ov.y+60*k);await page.waitForTimeout(700);await T('touchEnd');await page.waitForTimeout(600);   // PDFの文字を長押し→訂正の部品(タップと同じ)
  ok('PDFの文字を長押し(動かさない)すると、その文字が訂正の部品になる',(await items()).some(i=>i.type==='fix'));
  const st=()=>f.evaluate(()=>({touch:document.body.classList.contains('pt-touch'),hdl:document.querySelectorAll('.hdl').length,edit:document.querySelector('.ibox.on .t')?.contentEditable,btn:!!document.querySelector('.editbtn'),active:document.activeElement?.className,mode:document.querySelector('.ibox.on')?.classList.contains('edit')}));
  const sA=await st();ok('PDFの文字を長押しすると、枠ができて、そのまま入力モード(入力できる・枠が入力モードの見た目): '+JSON.stringify(sA),sA.edit==='true'&&sA.active==='t'&&sA.mode===true);
  await tap(ov.x+395*k,ov.y+10*k);   // 何もない所をタップ→選択を外す
  const tb0=await fr.locator('.ibox').first().boundingBox();
  await tap(tb0.x+tb0.width/2,tb0.y+tb0.height/2);
  const s=await st();ok('指でタップ: 選ぶだけで、入力の状態にならない(キーボードなし)・印が出る: '+JSON.stringify(s),s.touch&&s.hdl===2&&s.edit!=='true'&&s.mode!==true);
  await page.evaluate(()=>{Object.defineProperty(window.visualViewport,'scale',{configurable:true,get:()=>2.5});sendZoom();});await page.waitForTimeout(300);
  const zs=await f.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zs')));
  ok(`親の画面の拡大率(2.5倍)が、フォームに伝わる(--zs=${zs})`,Math.abs(zs-0.4)<0.02);
  await page.evaluate(()=>{Object.defineProperty(window.visualViewport,'scale',{configurable:true,get:()=>1});sendZoom();});await page.waitForTimeout(200);
  const tb=await fr.locator('.ibox.on .t').boundingBox();
  await T('touchStart',tb.x+tb.width/2,tb.y+tb.height/2);await page.waitForTimeout(700);await T('touchEnd');await page.waitForTimeout(400);
  const s2=await st();ok('枠の中を長押しすると、入力モードになる: '+JSON.stringify(s2),s2.edit==='true'&&s2.active==='t'&&s2.mode===true);
  // 1本指のスクロール / 長押し→ドラッグの範囲指定 / 2本指ドラッグの範囲指定
  await fr.locator('[data-m=text]').click();
  const nA=(await items()).length,sy0=await f.evaluate(()=>scrollY);
  await T('touchStart',ov.x+300*k,ov.y+250*k);for(let i=1;i<=8;i++){await T('touchMove',ov.x+300*k,ov.y+250*k-i*25);await page.waitForTimeout(16);}await T('touchEnd');await page.waitForTimeout(500);
  ok('1本指のドラッグでは、何も作られない(範囲指定にならない)',(await items()).length===nA);
  const R=(async()=>{await T('touchStart',ov.x+30*k,ov.y+255*k);await page.waitForTimeout(700);for(let i=1;i<=8;i++){await T('touchMove',ov.x+30*k+i*14,ov.y+255*k+i*3);await page.waitForTimeout(16);}await T('touchEnd');await page.waitForTimeout(600);});
  await f.evaluate(()=>window.scrollTo(0,0));
  const ov2=await fr.locator('#ov').boundingBox();
  await R();
  ok('何もない所を長押し→ドラッグで、範囲(文字の枠)ができる',/枠の大きさから/.test(await f.evaluate(()=>document.getElementById('status').textContent))&&(await items()).pop().vw>30);
  // 2本指(拡大・縮小)では、範囲指定にならない
  await fr.locator('[data-m=text]').click();
  const T2=(type,a,b)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:a[0],y:a[1],id:0},{x:b[0],y:b[1],id:1}]});
  await f.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(200);const ov3=await fr.locator('#ov').boundingBox();
  const nB=(await items()).length;
  const a0=[ov3.x+250*k,ov3.y+255*k];await T2('touchStart',a0,[a0[0]+20,a0[1]+8]);for(let i=1;i<=8;i++){await T2('touchMove',a0,[a0[0]+20+i*18,a0[1]+8+i*5]);await page.waitForTimeout(16);}await T2('touchEnd');await page.waitForTimeout(700);
  ok('2本指のドラッグでは、範囲指定(枠の作成)にならない',(await items()).length===nB);
  // 画面を拡大したとき、印の見た目の大きさを一定にする(親から拡大率を受け取る)
  await T('touchStart',ov3.x+300*k,ov3.y+20*k);await page.waitForTimeout(700);for(let i=1;i<=6;i++){await T('touchMove',ov3.x+300*k+i*12,ov3.y+20*k+i*4);await page.waitForTimeout(16);}await T('touchEnd');await page.waitForTimeout(600);
  await f.evaluate(()=>window.postMessage({type:'zoom',scale:1},'*'));await page.waitForTimeout(300);
  const sc1=await f.evaluate(()=>new DOMMatrix(getComputedStyle(document.querySelector('.hdl.mv')).transform).a);
  await f.evaluate(()=>window.postMessage({type:'zoom',scale:3},'*'));await page.waitForTimeout(300);
  const sc3=await f.evaluate(()=>new DOMMatrix(getComputedStyle(document.querySelector('.hdl.mv')).transform).a);
  ok(`画面を3倍に拡大すると、印は約1/3に縮む(拡大なし ${sc1.toFixed(2)} → 3倍 ${sc3.toFixed(2)})`,sc1>0.95&&Math.abs(sc3-1/3)<0.05);
  await page.screenshot({path:WORK+'/shot_edit_ui.png'});
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
