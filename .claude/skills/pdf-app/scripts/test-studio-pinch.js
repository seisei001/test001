// 画面の中だけの拡大・縮小: 束の一覧(大きさ)とページ編集(ページ)で、Ctrl+ホイールと2本指のピンチ
//   node .claude/skills/pdf-app/scripts/test-studio-pinch.js
process.env.PDFAPP_TARGET='pdf-studio';
const path=require('path');
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[S+'studio_A4.pdf']);await page.waitForTimeout(1800);
  ok('名前: '+await page.textContent('#fnDesk'),(await page.textContent('#fnDesk'))==='製本デスク');
  const tw=()=>page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--tw').trim());
  const pinch=(sel,from,to)=>page.evaluate(([sel,from,to])=>{
    const el=document.querySelector(sel),r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    const mk=(d)=>[0,1].map(i=>new Touch({identifier:i,target:el,clientX:cx+(i?d:-d)/2,clientY:cy}));
    const fire=(t,d)=>el.dispatchEvent(new TouchEvent(t,{touches:t==='touchend'?[]:mk(d),targetTouches:mk(d),changedTouches:mk(d),bubbles:true,cancelable:true}));
    fire('touchstart',from);for(let k=1;k<=5;k++)fire('touchmove',from+(to-from)*k/5);fire('touchend',to);},[sel,from,to]);
  // 一覧
  const t0=await tw();
  await pinch('#deskWrap',100,200);await page.waitForTimeout(300);const t1=await tw();
  ok('ピンチで束が大きくなる '+t0+' → '+t1,parseFloat(t1)>parseFloat(t0)*1.5);
  await pinch('#deskWrap',200,100);await page.waitForTimeout(300);const t2=await tw();
  ok('ピンチで小さくなる → '+t2,parseFloat(t2)<parseFloat(t1)*0.7);
  const bw=await page.locator('#deskWrap').boundingBox();await page.mouse.move(bw.x+bw.width/2,bw.y+bw.height/2);
  await page.keyboard.down('Control');await page.mouse.wheel(0,-300);await page.keyboard.up('Control');await page.waitForTimeout(300);const t3=await tw();
  ok('Ctrl+ホイールで大きくなる → '+t3,parseFloat(t3)>parseFloat(t2));
  ok('ブラウザの拡大にはならない(visualViewport.scale=1)',await page.evaluate(()=>(visualViewport.scale||1)===1));
  // ページ編集
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const f=page.frames().find(x=>x!==page.mainFrame());
  const fp=(sel,from,to)=>f.evaluate(([sel,from,to])=>{
    const el=document.querySelector(sel),r=el.getBoundingClientRect(),cx=r.left+Math.min(r.width,300)/2,cy=r.top+60;
    const mk=(d)=>[0,1].map(i=>new Touch({identifier:i,target:el,clientX:cx+(i?d:-d)/2,clientY:cy}));
    const fire=(t,d)=>el.dispatchEvent(new TouchEvent(t,{touches:t==='touchend'?[]:mk(d),targetTouches:mk(d),changedTouches:mk(d),bubbles:true,cancelable:true}));
    fire('touchstart',from);for(let k=1;k<=5;k++)fire('touchmove',from+(to-from)*k/5);fire('touchend',to);},[sel,from,to]);
  const pct=()=>f.evaluate(()=>document.getElementById('pzR').textContent);
  ok('はじめは 100%: '+await pct(),(await pct())==='100%');
  await fp('.stage',80,160);await page.waitForTimeout(300);const p1=await pct();
  ok('ピンチでページが大きくなる: '+p1,parseInt(p1)>=180);
  await fp('.stage',160,80);await page.waitForTimeout(300);const p2=await pct();
  ok('ピンチで小さくなる: '+p2,parseInt(p2)<parseInt(p1));
  const ob=await page.locator('#formFrame').boundingBox();await page.mouse.move(ob.x+ob.width/2,ob.y+ob.height/2);
  await page.keyboard.down('Control');await page.mouse.wheel(0,-400);await page.keyboard.up('Control');await page.waitForTimeout(300);
  const p3=await pct();ok('Ctrl+ホイールで大きくなる: '+p3,parseInt(p3)>parseInt(p2));
  ok('ブラウザの拡大にはならない',await page.evaluate(()=>(visualViewport.scale||1)===1));
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
