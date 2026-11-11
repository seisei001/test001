// ページ編集: 写真の文字(ユニチカ)の上に、入力枠を作ると、読み取った文字が枠に入る(文字モード・＋文字モードのどちらでも。ドラッグ・タップのどちらでも)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path');const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  {const d=await PDFDocument.create(),img=await d.embedPng(fs.readFileSync(path.join(__dirname,'fixtures/unitika.png'))),W=595,H=W*262/468,p=d.addPage([W,H]);p.drawImage(img,{x:0,y:0,width:W,height:H});fs.writeFileSync(WORK+'/samples/unitika.pdf',await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const run=async(mode,how)=>{
    await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/unitika.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());await f.evaluate(()=>{window.__noAutoOcr=false;});
    await fr.locator(mode==='sel'?'[data-m=sel]':'[data-m=text]').click();await page.waitForTimeout(600);
    const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595,s=595/468;
    if(how==='drag'){await page.mouse.move(ob.x+34*s*k,ob.y+203*s*k);await page.mouse.down();await page.mouse.move(ob.x+100*s*k,ob.y+226*s*k,{steps:6});await page.mouse.up();}
    else await page.mouse.click(ob.x+60*s*k,ob.y+214*s*k);
    for(let i=0;i<45;i++){await page.waitForTimeout(2000);if((await f.evaluate(()=>window.pdfEditorDebug.items())).length)break;}await page.waitForTimeout(1500);
    return f.evaluate(()=>window.pdfEditorDebug.items().map(i=>({t:i.type,txt:i.txt})));};
  for(const [mode,how] of [['sel','drag'],['text','drag'],['text','tap']]){
    const its=await run(mode,how);console.log('  ',mode,how,JSON.stringify(its));
    chk(`${mode==='sel'?'文字モード':'＋文字モード'}・${how==='drag'?'ドラッグ':'タップ'}: 写真の「ユニチカ」が、入力枠に入る(空の枠ではない)`,its.length===1&&/ユニチカ/.test(its[0].txt));}
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
