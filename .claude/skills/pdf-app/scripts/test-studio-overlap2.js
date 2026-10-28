// ページ編集: 上に重ねて書いた文字。下の文字が、完全に隠れるときは取り除かれ、一部だけ隠れるときは見えている部分が画像で残る(見た目がそのまま)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,StandardFonts}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/overlap2_src.pdf';
  {const d=await PDFDocument.create();const f=await d.embedFont(StandardFonts.Helvetica);const p=d.addPage([595,842]);
   p.drawText('ABCDEFGHIJKLMNOPQRST',{x:60,y:700,size:14,font:f});   // 一部だけ隠れる
   p.drawText('FULLCOVER',{x:60,y:600,size:14,font:f});               // 完全に隠れる
   p.drawText('KEEPME below',{x:60,y:500,size:14,font:f});            // 重ならない
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[],dlg=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>{dlg.push(d.message().slice(0,30));d.accept();});
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3000);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await fr.locator('[data-m=text]').click();
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595;
  const mk=async(x,y,w,h,txt)=>{await page.mouse.move(ob.x+x*k,ob.y+y*k);await page.mouse.down();await page.mouse.move(ob.x+(x+w)*k,ob.y+(y+h)*k,{steps:5});await page.mouse.up();await page.waitForTimeout(400);await page.keyboard.type(txt);await page.waitForTimeout(300);};
  // 1行目(y=842-700=142付近、文字の上端 ~129)の右半分に重ねる
  await mk(130,126,200,22,'ZZZZZ');
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(300);await page.mouse.click(ob.x+15,ob.y+ob.height-12);await page.waitForTimeout(3500);
  // 2行目(FULLCOVER)全体を覆う、大きな文字
  await fr.locator('[data-m=text]').click();await mk(50,228,260,30,'QQQQQQQQQQQQQQ');
  await fr.locator('[data-m=sel]').click();await page.waitForTimeout(300);await page.mouse.click(ob.x+15,ob.y+ob.height-12);await page.waitForTimeout(3500);
  const out='/tmp/overlap2_out.pdf';fs.writeFileSync(out,Buffer.from(await f.evaluate(()=>window.pdfEditorDebug.bytes())));
  const txt=execSync(`pdftotext ${out} -`).toString();console.log(JSON.stringify(txt));
  chk('新しい文字が入っている',txt.includes('ZZZZZ')&&txt.includes('QQQQQ'));
  chk('完全に隠れた下の文字(FULLCOVER)は、PDFから消えている',!txt.includes('FULLCOVER'));
  chk('重ならない文字(KEEPME)は、そのまま',txt.includes('KEEPME'));
  chk('一部だけ隠れた下の文字は、文字としては残らない(画像になる)',!txt.includes('ABCDEFGHIJ'));
  // 見た目: 1行目の左側(隠れない部分)に、画像で文字が残っている
  execSync(`pdftoppm -r 144 -f 1 -l 1 -png ${out} /tmp/overlap2_out`);
  const py=`
from PIL import Image
im=Image.open('/tmp/overlap2_out-1.png').convert('L');s=2
def ink(x0,y0,x1,y1):
    c=im.crop((int(x0*s),int(y0*s),int(x1*s),int(y1*s)));return sum(1 for p in c.getdata() if p<110)
print(ink(60,126,100,146),ink(60,226,160,246))`;
  const r=execSync(`python3 -c "${py.replace(/"/g,'\\"')}"`).toString().trim().split(' ').map(Number);console.log('インク',r);
  chk('一部だけ隠れた文字の、見えている左側が、画像で残っている(見た目が変わらない)',r[0]>150);
  console.log('置き換えの確認は出ない',dlg.length===0?'OK':dlg);
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();process.exit(ok?0:1);
})();
