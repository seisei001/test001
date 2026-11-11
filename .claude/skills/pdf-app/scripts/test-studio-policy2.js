// ページ編集の方針(PDFの文字): PDFの文字をタップすると拾って訂正の枠(下地は「文字だけ消す」)。「そのまま重ねる」なら元の文字は残る。確定後に選び直して動かしても、下の図には触らない
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
let fr,f;
const open=async file=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/'+file]);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  fr=page.frameLocator('#formFrame');f=page.frames().find(x=>x!==page.mainFrame());await f.evaluate(()=>{window.__noConfirmAsk=false;});};
const reopen=async()=>{await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);fr=page.frameLocator('#formFrame');f=page.frames().find(x=>x!==page.mainFrame());await f.evaluate(()=>{window.__noConfirmAsk=false;});};
const confirm=async()=>{await fr.locator('#embHead #sClose').click();await fr.locator('#applyAsk').waitFor({timeout:15000});await fr.locator('#applyAsk button',{hasText:'確定する'}).click();await page.waitForTimeout(3500);};
const save=async n=>{await fr.locator('#embSave').click();await page.waitForTimeout(3500);fs.writeFileSync(`/tmp/p2_${n}.pdf`,Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/p2_${n}.pdf /tmp/p2_${n}`);return execSync(`pdftotext -f 1 -l 1 /tmp/p2_${n}.pdf -`).toString();};
const pick=async()=>{await fr.locator('[data-m=sel]').click();await page.waitForTimeout(600);const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(800);};
// PDFの文字をタップ → 訂正の枠・下地は「文字だけ消す」
await open('studio_A4.pdf');await pick();
chk('PDFの文字をタップすると、拾って訂正の枠(下地は「文字だけ消す」)',(await f.evaluate(()=>window.pdfEditorDebug.items()[0].type))==='fix'&&/文字だけ消す/.test(await fr.locator('#sUnderSeg button.on').innerText()));
await page.keyboard.press('End');await page.keyboard.type('ZZ',{delay:30});await confirm();let t=await save('erase');
chk('文字だけ消す: 元の文字は、直した文字に置き換わる',/A-1ZZ|A-\s*1ZZ/.test(t.replace(/\n/g,''))&&(t.match(/A-1/g)||[]).length<=1);
await open('studio_A4.pdf');await pick();await fr.locator('#sUnderSeg button',{hasText:'そのまま重ねる'}).click();await page.waitForTimeout(500);
await page.keyboard.press('End');await page.keyboard.type('ZZ',{delay:30});await confirm();t=await save('keep');
chk('そのまま重ねる: 元の文字(A-1)は残り、直した文字も置かれる',/A-1\s/.test(t)&&/ZZ/.test(t));
// 確定後: 選び直して動かしても、下の図に触らない
await open('form_scan.pdf');await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
let ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
await page.mouse.move(ob.x+255*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+330*k,ob.y+150*k,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
await page.keyboard.type('あ');await page.waitForTimeout(500);await confirm();await save('a');
const dark=p=>+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${p}').convert('L');px=a.load()
print(sum(1 for y in range(250,330) for x in range(520,1100) if px[x,y]<120))"`).toString().trim();
const da=dark('/tmp/p2_a.png');
await reopen();await pick();await page.waitForTimeout(2500);ob=await fr.locator('#ov').boundingBox();k=ob.width/595.2;
chk('確定後に選び直すと、画面は白い四角で下の図を隠さない',(await fr.locator('#ov .cover').evaluateAll(a=>a.every(e=>e.tagName==='CANVAS'))));
const mb=await fr.locator('.ibox.on .hdl.mv').boundingBox();await page.mouse.move(mb.x+mb.width/2,mb.y+mb.height/2);await page.mouse.down();await page.mouse.move(mb.x+mb.width/2+60*k,mb.y+mb.height/2+40*k,{steps:8});await page.mouse.up();await page.waitForTimeout(800);
await confirm();await save('b');const db=dark('/tmp/p2_b.png');console.log('   下の画像の文字: 動かす前',da,'後',db);
chk('動かしても、下の図には触らない(画像は1つのまま・暗い画素はほぼ同じ)',execSync('pdfimages -list /tmp/p2_b.pdf').toString().split('\n').filter(l=>/ image /.test(l)).length===1&&db>=da-400);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
