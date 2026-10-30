// 「文字だけ消す」が重いとき(大きな枠)に、処理のバー(画面の下の「下の画像を整えています」)が出て、画面が固まって見えない
//   node .claude/skills/pdf-app/scripts/test-studio-inkbar.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  execSync('python3 -W ignore '+path.join(__dirname,'make-photo-scan.py'));
  {const d=await PDFDocument.create(),im=await d.embedJpg(fs.readFileSync('/tmp/photoscan.jpg')),p=d.addPage([595.2,842.4]);p.drawImage(im,{x:0,y:0,width:595.2,height:842.4});fs.writeFileSync('/tmp/photoscan.pdf',await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',['/tmp/photoscan.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2,X=v=>ob.x+v*k,Y=v=>ob.y+v*k;
  // 紙の上の、大きな枠(110〜260 x 170〜420 pt)。大きな枠は、既定では「文字だけ消す」にならないので、設定で選ぶ
  await page.mouse.move(X(110),Y(170));await page.mouse.down();await page.mouse.move(X(260),Y(420),{steps:8});await page.mouse.up();await page.waitForTimeout(800);
  await page.keyboard.type('あ');await page.waitForTimeout(500);
  await page.evaluate(()=>{window.__hb=[performance.now()];setInterval(()=>window.__hb.push(performance.now()),50);window.__jobSeen=[];setInterval(()=>{const j=document.getElementById('job');},50);});
  await f.evaluate(()=>{window.__hb=[performance.now()];setInterval(()=>window.__hb.push(performance.now()),50);window.__seen=[];const j=document.getElementById('job');setInterval(()=>{if(!j.classList.contains('hidden'))window.__seen.push(document.getElementById('jobT').textContent);},50);});
  const m=await fr.locator('.hdl.mv').boundingBox();await page.mouse.dblclick(m.x+m.width/2,m.y+m.height/2);await fr.locator('#spOk').waitFor({timeout:8000});
  await fr.locator('#spBg').selectOption('ink');await fr.locator('#spOk').click();
  await page.waitForTimeout(6000);
  const r=await f.evaluate(()=>{const a=window.__hb;let g=0;for(let i=1;i<a.length;i++)g=Math.max(g,a[i]-a[i-1]);return{g,seen:window.__seen.slice(-3),n:window.__seen.length,hidden:document.getElementById('job').classList.contains('hidden'),st:window.pdfEditorDebug.inkState()};});
  console.log('   最大の止まり',Math.round(r.g),'ms  バーの表示',r.n,'回  最後の表示',JSON.stringify(r.seen),'  状態',JSON.stringify(r.st));
  ok('大きな枠で、処理のバーが出る(表示 '+r.n+' 回)',r.n>0&&/下の画像を整えています/.test(r.seen.join('')));
  ok('終わったら、バーは消える',r.hidden);
  ok('画面が止まるのは、1.5秒以内(最大の止まり '+Math.round(r.g)+'ms)',r.g<1500);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
