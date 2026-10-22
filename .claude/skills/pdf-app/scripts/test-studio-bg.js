// ページ編集: 背景の三つの選び方で保存したPDFの見た目(完全透明・余白透明・白抜き)を、罫線の画素で確かめる
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const {execSync}=require('child_process');const fs=require('fs');
const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
async function run(mode){
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame');
  await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
  const ov=await fr.locator('#ov').boundingBox(),k=ov.width/420;   // 枠を作る直前に測る(ページがずれていても合うように)
  await page.mouse.move(ov.x+20*k,ov.y+60*k);await page.mouse.down();await page.mouse.move(ov.x+200*k,ov.y+125*k,{steps:6});await page.mouse.up();await page.waitForTimeout(400);
  await page.keyboard.type('A');await page.waitForTimeout(300);
  const m=await fr.locator('.hdl.mv').boundingBox();await page.mouse.dblclick(m.x+m.width/2,m.y+m.height/2);await page.waitForTimeout(300);
  await fr.locator('#spBg').selectOption(mode);await fr.locator('#spOk').click();await page.waitForTimeout(800);
  await fr.locator('#embSave').click();await page.waitForFunction(()=>document.getElementById('formHost').classList.contains('hidden'),null,{timeout:60000});await page.waitForTimeout(1000);
  const bytes=await page.evaluate(()=>window.pdfStudioDebug.bytes(0));const out=`${WORK}/bg_${mode}.pdf`;fs.writeFileSync(out,Buffer.from(bytes));
  execSync(`pdftoppm -png -r 72 -f 1 -l 1 ${out} ${WORK}/bg_${mode}`);await browser.close();return errs;
}
(async()=>{
  const res={};
  for(const mode of ['none','text','all']){await run(mode);}
  const px=(mode,x,y)=>execSync(`python3 -I -c "from PIL import Image;im=Image.open('${WORK}/bg_${mode}-1.png').convert('L');print(im.getpixel((${x},${y})))"`).toString().trim();
  // form.pdf(420x300pt)。罫線は y=74 と y=105(pt)あたり。文字「A」(17pt)は、枠の左上(x=20..30, y=60..80)。x=150 は文字より右
  const find=(mode,x)=>{let best=255;for(let y=100;y<=110;y++)best=Math.min(best,+px(mode,x,y));return best;};
  const lineAt=m=>find(m,150);
  console.log('    罫線(y≈105,x=150)の暗さ: 完全透明',lineAt('none'),' 余白透明',lineAt('text'),' 白抜き',lineAt('all'));
  ok('完全透明: 枠の下の罫線が残る',lineAt('none')<120);
  ok('余白透明: 文字のないところの罫線は残る',lineAt('text')<120);
  ok('白抜き: 枠の全体を白抜きするので、罫線が消える',lineAt('all')>200);
})();
