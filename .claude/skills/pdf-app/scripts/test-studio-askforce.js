// ページ編集: 下の画像に文字らしいものがあれば、消せる文字のインクが見つからなくても、確定のとき必ず聞く(聞かずに重ねて終わりにしない)。そのまま=図に何もしない/消す=文字のある所だけ白抜き
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
const dark=p=>+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${p}').convert('L');px=a.load();W,H=a.size
print(sum(1 for y in range(int(H*0.74),int(H*0.9)) for x in range(int(W*0.06),int(W*0.22)) if px[x,y]<120))"`).toString().trim();
const run=async(ans)=>{
  await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/unitika.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());await f.evaluate(()=>{window.__noAutoOcr=true;window.__noEraseAsk=false;window.__noEraseOcr=true;window.__inkEmpty=true;});
  await fr.locator('[data-m=text]').click();await page.waitForTimeout(500);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595,s=595/468;
  await page.mouse.move(ob.x+34*s*k,ob.y+203*s*k);await page.mouse.down();await page.mouse.move(ob.x+100*s*k,ob.y+226*s*k,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
  await page.keyboard.type('あああ',{delay:30});await page.waitForTimeout(500);await fr.locator('#embSave').click();
  const dlg=await fr.locator('#eraseAsk').waitFor({timeout:20000}).then(()=>true).catch(()=>false);
  const info=dlg?await fr.locator('#eraseAsk').innerText():'';
  if(dlg)await fr.locator('#eraseAsk button',{hasText:ans?'はい':'いいえ'}).click();await page.waitForTimeout(4000);
  fs.writeFileSync('/tmp/af_'+ans+'.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/af_${ans}.pdf /tmp/af_${ans}`);
  return{dlg,info};};
const no=await run(false),yes=await run(true);
chk('消せる文字のインクが見つからなくても、確定のとき、聞く',no.dlg&&/元の文字は、消去されます/.test(no.info)&&/消す範囲/.test(no.info));
const dn=dark('/tmp/af_false.png'),dy=dark('/tmp/af_true.png');console.log('   暗い画素: いいえ',dn,' はい',dy);
chk('「いいえ」: 図には何もしない(元の文字が、そのまま見える)',dn>0&&execSync('pdfimages -list /tmp/af_false.pdf').toString().split('\n').filter(l=>/image/.test(l)).length===1);
chk('「いいえ」: 入力した文字は、フォントの文字',/あああ/.test(execSync('pdftotext /tmp/af_false.pdf -').toString()));
chk('「はい」: 文字のある所が消える(いいえより、暗い画素が減る)',dy<dn);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
