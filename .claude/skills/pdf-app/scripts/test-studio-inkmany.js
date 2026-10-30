// 枠が多いページ(文字が多いスキャン)で、「文字だけ消す」が、アプリを固めない(1つずつ処理して、間で画面に制御を返す。直していない枠は、確定まで作らない)
//   node .claude/skills/pdf-app/scripts/test-studio-inkmany.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  execSync('python3 -W ignore '+path.join(__dirname,'make-ink-scan.py'));
  {const d=await PDFDocument.create(),im=await d.embedJpg(fs.readFileSync('/tmp/inkscan_scan.jpg')),p=d.addPage([595.2,842.4]);p.drawImage(im,{x:0,y:0,width:595.2,height:842.4});fs.writeFileSync('/tmp/inkscan.pdf',await d.save());}
  const boxes=JSON.parse(fs.readFileSync('/tmp/inkscan_boxes.json','utf8')),SC=150/72;
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',['/tmp/inkscan.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const f=page.frames().find(x=>x!==page.mainFrame());
  await page.evaluate(()=>{window.__hb=[performance.now()];setInterval(()=>window.__hb.push(performance.now()),50);});   // 画面の止まりは、親の画面(同じスレッド)で数える
  const gap=()=>page.evaluate(()=>{const a=window.__hb;let m=0;for(let i=1;i<a.length;i++)m=Math.max(m,a[i]-a[i-1]);window.__hb=[performance.now()];return m;});
  // 枠を 160 個作る(文字認識で、文字の多いページにできる枠の数)
  const t0=Date.now();
  for(let r=0;r<20;r++)for(const b of boxes)await f.evaluate(([b,sc,r])=>window.pdfEditorDebug.addFix({s:b.s,x:b.x0/sc-1,y:(b.y0/sc-1)+(r%2?0:0),w:(b.x1-b.x0)/sc+2,h:(b.y1-b.y0)/sc+2,size:b.size/sc,txt:'.'}),[b,SC,r]);
  const g1=await gap();console.log('   枠 '+(await f.evaluate(()=>window.pdfEditorDebug.inkState().length))+' 個を作る: 最大の止まり '+Math.round(g1)+'ms');
  ok('枠が多くても、作るときに固まらない(最大の止まり '+Math.round(g1)+'ms)',g1<1500);
  const st=await f.evaluate(()=>window.pdfEditorDebug.inkState());
  ok('直していない枠は、確定まで、パッチを作らない(作った枠 '+st.filter(s=>s.ink).length+')',st.filter(s=>s.ink).length===0);
  const t1=Date.now();await page.frameLocator('#formFrame').locator('#embSave').click();
  await page.waitForFunction(()=>document.getElementById('formHost').classList.contains('hidden'),null,{timeout:180000});
  const g2=await gap();console.log('   保存(全部のパッチを作る): '+(Date.now()-t1)+'ms 最大の止まり '+Math.round(g2)+'ms');
  ok('保存の間も、画面が固まらない(最大の止まり '+Math.round(g2)+'ms)',g2<1500);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
