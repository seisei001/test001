// ページ編集: 画像の文字の上に枠を作ると、読み取った文字が入力枠に入る。直さなければ何も変えない。直して確定すると、元の文字は消去されると表示し、「いいえ」なら画像に触らない。入力した文字は、いつも文字(フォント)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const dark=p=>+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${p}').convert('L');px=a.load()
print(sum(1 for y in range(250,330) for x in range(240,630) if px[x,y]<120))"`).toString().trim();
  const setup=async()=>{
    await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await f.evaluate(()=>{window.__noAutoOcr=false;window.__noEraseAsk=false;window.__noEraseOcr=true;});
    await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
    const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;return{fr,f,ob,k};};
  const waitItems=async f=>{for(let i=0;i<40;i++){await page.waitForTimeout(2000);if((await f.evaluate(()=>window.pdfEditorDebug.items())).length)break;}await page.waitForTimeout(1500);};
  const dump=async(n,fr)=>{fs.writeFileSync(`/tmp/ao_${n}.pdf`,Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/ao_${n}.pdf /tmp/ao_${n}`);};
  // --- 1. ドラッグ: 読み取った文字が入る。直さずに確定 → 何も変えない
  let {fr,f,ob,k}=await setup();
  await page.mouse.move(ob.x+120*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+150*k,{steps:6});await page.mouse.up();await waitItems(f);
  let its=await f.evaluate(()=>window.pdfEditorDebug.items());console.log('   枠',JSON.stringify(its.map(i=>({t:i.type,txt:i.txt}))));
  chk('ドラッグ: 読み取った文字が入った枠ができる(空の枠ではない)',its.length>=1&&its.some(i=>(i.txt||'').trim().length>=1)&&!its.some(i=>i.type==='text'&&!(i.txt||'').trim()));
  await fr.locator('#embHead #sClose').click({timeout:3000}).catch(()=>{});await page.waitForTimeout(1500);
  const asked1=await fr.locator('#eraseAsk').count();
  await fr.locator('#embSave').click();await page.waitForTimeout(4000);
  const asked2=await fr.locator('#eraseAsk').count();
  await dump('same',fr);
  chk('直さずに確定しても、確認は出ず、画像には何もしない',asked1===0&&asked2===0&&execSync('pdfimages -list /tmp/ao_same.pdf').toString().split('\n').filter(l=>/image/.test(l)).length===1);
  // --- 2. タップ: その行の文字が入る
  ({fr,f,ob,k}=await setup());
  await page.mouse.click(ob.x+200*k,ob.y+138*k);await waitItems(f);
  its=await f.evaluate(()=>window.pdfEditorDebug.items());console.log('   タップの枠',JSON.stringify(its.map(i=>({t:i.type,txt:i.txt}))));
  chk('タップ: その行の読み取った文字が入った枠ができる',its.length===1&&(its[0].txt||'').trim().length>=1&&its[0].type==='fix');
  // --- 3. 直して確定 → 確認 → いいえ: 画像に触らない/入力した文字は文字
  ({fr,f,ob,k}=await setup());
  await page.mouse.move(ob.x+120*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+150*k,{steps:6});await page.mouse.up();await waitItems(f);
  await page.keyboard.press('End');await page.keyboard.type('NEW',{delay:30});await page.waitForTimeout(500);
  await fr.locator('#embSave').click();
  const dlg=await fr.locator('#eraseAsk').waitFor({timeout:30000}).then(()=>true).catch(()=>false);
  const info=dlg?await fr.locator('#eraseAsk').innerText():'';
  chk('直して確定すると、元の文字は消去されると表示し、画像に触らない選択がある',dlg&&/元の文字は、消去されます/.test(info)&&/触らず/.test(info));
  if(dlg)await fr.locator('#eraseAsk button',{hasText:'いいえ'}).click();await page.waitForTimeout(4000);
  await dump('no',fr);
  const txt=execSync('pdftotext -f 1 -l 1 /tmp/ao_no.pdf -').toString();
  chk('入力した文字は、文字(フォント)として入っている',/NEW/.test(txt));
  chk('「いいえ」: 元の画像は触らない(画像は1つだけ=パッチなし)',execSync('pdfimages -list /tmp/ao_no.pdf').toString().split('\n').filter(l=>/image/.test(l)).length===1);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
