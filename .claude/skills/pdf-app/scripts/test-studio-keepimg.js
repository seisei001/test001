// ページ編集: 文字を残して置いた文字を、もう一度選んで動かしても、下の図(画像の文字)は消えない/触らない。画面でも、白い四角で隠さない
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
const dark=(p,x0,y0,x1,y1)=>+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${p}').convert('L');px=a.load()
print(sum(1 for y in range(${y0},${y1}) for x in range(${x0},${x1}) if px[x,y]<120))"`).toString().trim();
const dump=async n=>{fs.writeFileSync(`/tmp/ki_${n}.pdf`,Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/ki_${n}.pdf /tmp/ki_${n}`);};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
const openEd=async()=>{await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);return{fr:page.frameLocator('#formFrame'),f:page.frames().find(x=>x!==page.mainFrame())};};
let {fr,f}=await openEd();await f.evaluate(()=>{window.__noEraseAsk=false;window.__noEraseOcr=true;});
await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
let ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
await page.mouse.move(ob.x+255*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+330*k,ob.y+150*k,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
await page.keyboard.type('あ');await page.waitForTimeout(800);await fr.locator('#embSave').click();
await fr.locator('#eraseAsk').waitFor({timeout:20000});await fr.locator('#eraseAsk button',{hasText:'いいえ'}).click();await page.waitForTimeout(4000);
await dump('a');const imgDarkA=dark('/tmp/ki_a.png',520,250,1100,330);
// もう一度開く → 文字を選ぶ(訂正の枠) → 動かす
({fr,f}=await openEd());await f.evaluate(()=>{window.__noEraseAsk=false;window.__noEraseOcr=true;});
await fr.locator('[data-m=sel]').click();await page.waitForTimeout(800);
const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(2500);
ob=await fr.locator('#ov').boundingBox();k=ob.width/595.2;
// 画面: 元の文字の位置を、白い四角で隠さない(下の画像が見える)
const cov=await fr.locator('#ov .cover').evaluateAll(a=>a.map(e=>({tag:e.tagName,bg:getComputedStyle(e).backgroundColor})));
chk('画面: 元の文字の位置は、白い四角ではなく、文字を取り除いたあとの見た目(画像が見える)',cov.length>=1&&cov.every(c=>c.tag==='CANVAS'));
const mv=fr.locator('.ibox.on .hdl.mv');const mb=await mv.boundingBox();
await page.mouse.move(mb.x+mb.width/2,mb.y+mb.height/2);await page.mouse.down();await page.mouse.move(mb.x+mb.width/2+60*k,mb.y+mb.height/2+40*k,{steps:8});await page.mouse.up();await page.waitForTimeout(800);
const cov2=await fr.locator('#ov .cover').evaluateAll(a=>a.map(e=>e.tagName));
chk('動かしたあとも、新しい位置を白い四角で隠さない',cov2.every(t=>t==='CANVAS'));
await fr.locator('#embHead #sClose').click({timeout:3000}).catch(()=>{});await page.waitForTimeout(1500);
await fr.locator('#embSave').click().catch(()=>{});await page.waitForTimeout(500);
if(await fr.locator('#eraseAsk').count())await fr.locator('#eraseAsk button',{hasText:'いいえ'}).click().catch(()=>{});await page.waitForTimeout(4000);
await dump('b');const imgDarkB=dark('/tmp/ki_b.png',520,250,1100,330);
console.log('   下の画像の文字(暗い画素): 動かす前',imgDarkA,' 動かした後',imgDarkB);
// あの文字が元にあった位置(255〜272pt, 約530〜560px)の下の画像は、残っている(白抜きされていない)
chk('下の画像の文字は、消えない・触られない(「あ」が動いたぶんだけ減る程度)',imgDarkB>=imgDarkA-400&&imgDarkB>600);
chk('画像は増えない(パッチ・白抜きの画像を足さない)',execSync('pdfimages -list /tmp/ki_b.pdf').toString().split('\n').filter(l=>/image/.test(l)).length===1);
chk('文字「あ」は、文字として残っている',/あ/.test(execSync('pdftotext /tmp/ki_b.pdf -').toString()));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
