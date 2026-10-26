// 画面を拡大(ピンチ)したとき、確認の窓・メニュー・処理の表示(緑の枠)が、巨大にならず、見えている範囲に、ふだんの大きさで出ること
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form.pdf']);await page.waitForTimeout(1500);
  const stub=(sc,l,t,w,h)=>page.evaluate(([sc,l,t,w,h])=>{const v=window.visualViewport,d=(k,x)=>Object.defineProperty(v,k,{configurable:true,get:()=>x});d('scale',sc);d('offsetLeft',l);d('offsetTop',t);d('width',w);d('height',h);sendZoom();},[sc,l,t,w,h]);
  // 1. 確認の窓(鍵つきPDF・保存の確認と同じ作り)
  const box=()=>page.evaluate(()=>{const o=[...document.body.children].filter(e=>e.style&&e.style.zIndex==='3000').pop();if(!o)return null;const b=o.firstElementChild.getBoundingClientRect();return{x:b.left,y:b.top,w:b.width,h:b.height};});
  await page.evaluate(()=>{askLocked('x.pdf');});await page.waitForTimeout(300);
  const n=await box();
  await stub(2,100,200,450,700);await page.waitForTimeout(300);
  const z=await box();
  ok(`確認の窓の見た目の大きさが同じ(幅 ${n&&n.w.toFixed(0)} → ${z&&(z.w*2).toFixed(0)})`,n&&z&&Math.abs(n.w-z.w*2)<6);
  ok(`確認の窓が、見えている範囲の中心に出る(中心 ${z&&(z.x+z.w/2).toFixed(0)},${z&&(z.y+z.h/2).toFixed(0)} / 範囲の中心 325,550)`,z&&Math.abs(z.x+z.w/2-325)<12&&Math.abs(z.y+z.h/2-550)<12);
  await page.evaluate(()=>{document.querySelectorAll('body > div').forEach(e=>{if(e.style.zIndex==='3000')e.remove();});});
  await stub(1,0,0,900,1400);await page.waitForTimeout(200);
  // 0. 領域の管理: アプリ(APP)・フォーム(FORM)・見えている範囲(SCREEN)・フォームの中で見えている所(SHOWN)が、名前を分けて、正しく求まる
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fG=page.frames().find(x=>x!==page.mainFrame());
  const fbG=await page.evaluate(()=>{const r=document.getElementById('formFrame').getBoundingClientRect();return{l:r.left,t:r.top,w:r.width,h:r.height};});
  await stub(2,fbG.l+60,fbG.t+150,450,700);await page.waitForTimeout(400);
  const g1=await fG.evaluate(()=>window.pdfEditorDebug.geo());
  ok(`SCREEN は、フォームの座標で、見えている範囲(60,150,450×700)になる: ${JSON.stringify(g1.screen)}`,Math.abs(g1.screen.x-60)<1&&Math.abs(g1.screen.y-150)<1&&g1.screen.w===450&&g1.screen.h===700&&g1.scale===2);
  ok(`SHOWN は SCREEN と同じ(フォームの中に収まっているとき)・縮小率は 1/拡大率(${g1.inv})`,Math.abs(g1.shown.x-60)<1&&g1.shown.w===450&&Math.abs(g1.inv-0.5)<0.001);
  await stub(1,0,0,900,1400);await page.waitForTimeout(400);
  const g2=await fG.evaluate(()=>window.pdfEditorDebug.geo());
  ok(`SCREEN は、フォームの外(束デスクの見出し)にはみ出す(y=${g2.screen.y.toFixed(0)})が、SHOWN は、フォームの中に収まる(y=${g2.shown.y}, 高さ ${g2.shown.h.toFixed(0)} ≦ フォーム ${g2.form.h})`,g2.screen.y<0&&g2.shown.y>=0&&g2.shown.y+g2.shown.h<=g2.form.h+1&&g2.shown.x>=0);
  ok(`FORM はフォーム(iframe)自身の大きさ(${g2.form.w}×${g2.form.h})`,Math.abs(g2.form.w-fbG.w)<2&&Math.abs(g2.form.h-fbG.h)<2);
  await page.evaluate(()=>{document.getElementById('formClose').click();});await page.waitForTimeout(500);
  // 2. ページ編集の処理の表示(緑の枠)
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const f=page.frames().find(x=>x!==page.mainFrame());
  await f.evaluate(()=>window.pdfEditorDebug.jobShow('変換が終わりました。'));await page.waitForTimeout(200);
  const rj=()=>f.evaluate(()=>{const r=document.getElementById('job').getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height,b:r.bottom,ih:innerHeight};});
  const j1=await rj();
  const fb=await page.evaluate(()=>{const r=document.getElementById('formFrame').getBoundingClientRect();return{l:r.left,t:r.top};});
  await stub(2,fb.l+60,fb.t+150,450,700);await page.waitForTimeout(500);
  const j2=await rj();
  ok(`処理の表示の見た目の大きさが同じ(幅 ${j1.w.toFixed(0)} → ${(j2.w*2).toFixed(0)})`,Math.abs(j1.w-j2.w*2)<6);
  ok(`処理の表示が、見えている範囲の下に出る(下端 ${j2.b.toFixed(0)} / 範囲の下端 ${150+700})`,j2.b<=150+700+2&&j2.b>=150+700-40&&j2.x>=60-2&&j2.x+j2.w<=60+450+2);
  // 3. 文字の設定の窓: 出したときの大きさ・位置のまま、ページの上に置く(追いかけない=チラつかない)。拡大しても見た目の大きさが同じ。窓の外のドラッグ・ピンチでは閉じない。軽いタップで閉じる
  await stub(1,fb.l,fb.t,900,1339);await page.waitForTimeout(300);
  const fr=page.frameLocator('#formFrame');await fr.locator('[data-m=text]').click();
  const ovb=await fr.locator('#ov').boundingBox();await page.mouse.click(ovb.x+ovb.width*0.4,ovb.y+ovb.height*0.3);await page.waitForTimeout(500);await page.keyboard.type('A');await page.waitForTimeout(300);
  const openPop=()=>f.evaluate(async()=>{const o=document.getElementById('sizePop');if(o)o.remove();const hd=document.querySelector('.hdl.mv');hd.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));await new Promise(x=>setTimeout(x,300));const d=document.getElementById('sizePop');if(!d)return null;const b=d.getBoundingClientRect();return{x:b.left,y:b.top,w:b.width,h:b.height,r:b.right};});
  const base=await openPop();
  for(const [nm,sc,l,t,w,h] of [['2倍',2,120,300,450,700],['3倍',3,100,200,300,466],['キーボードで狭い',1,0,0,900,430]]){
    await stub(sc,fb.l+l,fb.t+t,w,h);await page.waitForTimeout(400);
    const r=await openPop();
    ok(`窓の見た目の大きさが同じ(${nm}: 幅 ${base.w.toFixed(0)} → ${r&&(r.w*sc).toFixed(0)})`,r&&Math.abs(base.w-r.w*sc)<6);
    ok(`窓の横は、見えている範囲に入る(${nm}: ${r&&r.x.toFixed(0)}〜${r&&r.r.toFixed(0)} / 範囲 ${l}〜${l+w})`,r&&r.x>=l-1&&r.r<=l+w+1);
  }
  await stub(1,fb.l,fb.t,900,1339);await page.waitForTimeout(300);
  const q0=await openPop();const pos=[q0.y];
  for(const [dl,dt,dh] of [[0,3,0],[0,-4,0],[0,8,-6],[2,-9,10],[0,12,-12],[0,0,20],[0,-15,0]]){await stub(1,fb.l+dl,fb.t+dt,900,1339+dh);await page.waitForTimeout(200);pos.push((await f.evaluate(()=>{const d=document.getElementById('sizePop');return d?d.getBoundingClientRect().top:-1;})));}
  ok(`見えている範囲が少し揺れても、窓の位置は変わらない(${pos.map(v=>v.toFixed(0)).join(',')})`,pos.every(v=>Math.abs(v-pos[0])<0.5));
  // 拡大を変えたら、動いている間は隠し、止まって0.3秒後に、1回だけ表示する(窓の大きさが、新しい拡大に合う)
  await stub(1,fb.l,fb.t,900,1339);await page.waitForTimeout(500);
  const w1=(await openPop()).w;
  await stub(2,fb.l,fb.t,450,670);await page.waitForTimeout(100);
  const vis1=await f.evaluate(()=>document.getElementById('sizePop').style.visibility);
  await stub(2,fb.l+3,fb.t+2,450,670);await page.waitForTimeout(150);   // 動きが続く間は、まだ隠れたまま
  const vis2=await f.evaluate(()=>document.getElementById('sizePop').style.visibility);
  await page.waitForTimeout(500);
  const rr=await f.evaluate(()=>{const d=document.getElementById('sizePop');const b=d.getBoundingClientRect();return{v:d.style.visibility,w:b.width};});
  ok(`拡大を変えている間は窓が隠れ(${vis1},${vis2})、止まって0.3秒後に表示される(${rr.v||'表示'}・見た目の幅 ${w1.toFixed(0)} → ${(rr.w*2).toFixed(0)})`,vis1==='hidden'&&vis2==='hidden'&&rr.v===''&&Math.abs(w1-rr.w*2)<6);
  // 手を離したら、0.3秒を待たずに表示する(指を置いたまま止まったときは、0.3秒で表示)
  {const cdp0=await page.context().newCDPSession(page);const T0=(type,x,y)=>cdp0.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
   await stub(1,fb.l,fb.t,900,1339);await page.waitForTimeout(500);await openPop();
   await T0('touchStart',fb.l+300,fb.t+40);await T0('touchMove',fb.l+300,fb.t+70);await stub(2,fb.l,fb.t,450,670);await page.waitForTimeout(120);
   const h1=await f.evaluate(()=>document.getElementById('sizePop').style.visibility);
   await page.waitForTimeout(450);   // 指を置いたまま、止まって0.3秒たった
   const h2=await f.evaluate(()=>document.getElementById('sizePop').style.visibility);
   ok(`指を置いたままでも、止まって0.3秒で表示される(${h1}→${h2||'表示'})`,h1==='hidden'&&h2==='');
   await T0('touchEnd');await page.waitForTimeout(150);
   await stub(1,fb.l,fb.t,900,1339);await page.waitForTimeout(60);   // 拡大を戻す(まだ指は離れていない扱いではなく、離したあと)
   await openPop();await T0('touchStart',fb.l+300,fb.t+40);await T0('touchMove',fb.l+300,fb.t+70);await stub(2,fb.l,fb.t,450,670);await page.waitForTimeout(60);
   const h3=await f.evaluate(()=>document.getElementById('sizePop')?.style.visibility);
   await T0('touchEnd');await page.waitForTimeout(220);
   const h4=await f.evaluate(()=>document.getElementById('sizePop')?.style.visibility);
   ok(`手を離すと、0.3秒を待たずに表示される(${h3}→離して0.22秒後 ${h4===''?'表示':h4})`,h3==='hidden'&&h4==='');
   await stub(1,fb.l,fb.t,900,1339);await page.waitForTimeout(600);}
  // 親の窓(確認・メニュー)も、同じ
  await stub(1,0,0,900,1400);await page.waitForTimeout(500);
  await page.evaluate(()=>{askLocked('x.pdf');});await page.waitForTimeout(300);
  await stub(2,100,200,450,700);await page.waitForTimeout(100);
  const hv1=await page.evaluate(()=>{const o=[...document.body.children].filter(e=>e.style&&e.style.zIndex==='3000').pop();return o.style.visibility;});
  await page.waitForTimeout(600);
  const hv2=await page.evaluate(()=>{const o=[...document.body.children].filter(e=>e.style&&e.style.zIndex==='3000').pop();return o.style.visibility;});
  ok(`親の窓も、動いている間は隠れ(${hv1})、止まったら表示される(${hv2||'表示'})`,hv1==='hidden'&&hv2==='');
  await page.evaluate(()=>{document.querySelectorAll('body > div').forEach(e=>{if(e.style.zIndex==='3000')e.remove();});});
  await stub(1,fb.l,fb.t,900,1339);await page.waitForTimeout(500);
  const cdp=await page.context().newCDPSession(page);const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  const out={x:fb.l+20,y:fb.t+40};
  await T('touchStart',out.x,out.y);for(let i=1;i<=5;i++){await T('touchMove',out.x,out.y+i*25);await page.waitForTimeout(30);}await T('touchEnd');await page.waitForTimeout(300);
  ok('窓の外をドラッグしても、窓は閉じない(ドラッグ・拡大縮小ができる)',await f.evaluate(()=>!!document.getElementById('sizePop')));
  await T('touchStart',out.x,out.y);await page.waitForTimeout(60);await T('touchEnd');await page.waitForTimeout(300);
  ok('窓の外を軽くタップすると、窓が閉じる',await f.evaluate(()=>!document.getElementById('sizePop')));
  console.log('JSエラー:',errs.length,errs);await browser.close();
})();
