// 「文字だけ消す」: 下に消す文字が無い(罫線だけ)ときは、四角で塗らず、罫線を残す
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
const {PDFDocument}=require(path.join(WORK,'lib/node_modules')+'/pdf-lib');
(async()=>{
 execSync(`python3 -W ignore -c "
from PIL import Image,ImageDraw
im=Image.new('RGB',(1240,1755),'white');d=ImageDraw.Draw(im)
for y in (400,480):d.line([(100,y),(1140,y)],fill=(40,40,40),width=3)
im.save('/tmp/rulesonly.jpg',quality=92)"`);
 {const d=await PDFDocument.create(),im=await d.embedJpg(fs.readFileSync('/tmp/rulesonly.jpg')),p=d.addPage([595.2,842.4]);p.drawImage(im,{x:0,y:0,width:595.2,height:842.4});fs.writeFileSync('/tmp/rulesonly.pdf',await d.save());}
 const {browser,page}=await launch();const errs=[];page.on('dialog',d=>d.accept());page.on('pageerror',e=>errs.push(e.message));
 let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
 await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',['/tmp/rulesonly.pdf']);await page.waitForTimeout(1500);
 await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
 const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
 await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
 const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2,X=v=>ob.x+v*k,Y=v=>ob.y+v*k;
 await page.mouse.move(X(200),Y(185));await page.mouse.down();await page.mouse.move(X(260),Y(240),{steps:8});await page.mouse.up();await page.waitForTimeout(800);
 await page.keyboard.type('あ');await page.waitForTimeout(800);
 const m=await fr.locator('.hdl.mv').boundingBox();await page.mouse.dblclick(m.x+m.width/2,m.y+m.height/2);await fr.locator('#spOk').waitFor({timeout:8000});await fr.locator('#spBg').selectOption('ink');await fr.locator('#spOk').click();await page.waitForTimeout(3000);
 ok('画面に、四角のおおい(cover)が出ない',await f.evaluate(()=>document.querySelectorAll('.cover').length===0));
 await fr.locator('#embSave').click();await page.waitForTimeout(3500);
 fs.writeFileSync('/tmp/inkempty_out.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
 execSync('pdftoppm -r 72 -png -singlefile /tmp/inkempty_out.pdf /tmp/inkempty_out');
 const r=execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/inkempty_out.png').convert('L');W,H=a.size;px=a.load()
def dark(x0,x1,y):return sum(1 for x in range(x0,x1) if px[x,y]<150)
rows=[y for y in range(H) if dark(60,W-60,y)>100]
print(len(rows),dark(200,260,rows[0]) if rows else -1,dark(200,260,rows[-1]) if rows else -1)"`).toString().trim().split(' ').map(Number);
 console.log(r);
 ok('2本の罫線が、途切れず残っている(枠の下も)',r[1]>=55&&r[2]>=55);
 ok('エラーなし '+errs.join('|'),!errs.length);
 await browser.close();process.exit(allOk?0:1);
})();
