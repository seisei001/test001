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
  // 3. 文字の設定の窓は、いつでも、見えている範囲に全部入る(✥が真ん中あたりでも。キーボードで見える範囲が狭くても。拡大していても)
  await stub(1,0,0,900,1400);await page.waitForTimeout(300);
  const fr=page.frameLocator('#formFrame');await fr.locator('[data-m=text]').click();
  const ovb=await fr.locator('#ov').boundingBox();await page.mouse.click(ovb.x+ovb.width*0.4,ovb.y+ovb.height*0.75);await page.waitForTimeout(500);await page.keyboard.type('A');await page.waitForTimeout(300);
  const cases=[['等倍・見出しも含む範囲(iPhoneの実際)',1,0,-fb.t,900,1400],['等倍・広い',1,0,0,900,1400],['等倍・キーボードで狭い',1,0,0,900,430],['2倍・中ほど',2,120,300,450,700],['3倍・狭い',3,100,200,300,466],['3倍・キーボードで狭い',3,100,200,300,200]];
  for(const [nm,sc,l,t,w,h] of cases){
    await stub(sc,fb.l+l,fb.t+t,w,h);await page.waitForTimeout(400);
    const r=await f.evaluate(async()=>{const hd=document.querySelector('.hdl.mv');if(!hd)return null;hd.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));await new Promise(x=>setTimeout(x,300));const d=document.getElementById('sizePop');if(!d)return null;const b=d.getBoundingClientRect();return{x:b.left,y:b.top,r:b.right,b:b.bottom,ih:innerHeight,iw:innerWidth};});
    ok(`文字の設定の窓が、見えている範囲に全部入る(${nm}) ${r?JSON.stringify(r):'窓なし'} / 範囲 x${l}-${l+w} y${t}-${t+h}`,r&&r.x>=l-1&&r.r<=l+w+1&&r.y>=t-1&&r.b<=t+h+1&&r.y>=-1&&r.b<=r.ih+1&&r.x>=-1&&r.r<=r.iw+1);   // 見えている範囲の中、かつ、フォーム(iframe)の中(外は切れて見えない)
    await f.evaluate(()=>{const x=document.getElementById('spX');x&&x.click();});
  }
  console.log('JSエラー:',errs.length,errs);await browser.close();
})();
