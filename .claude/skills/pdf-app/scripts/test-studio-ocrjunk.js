// 文字認識: 点線・小さな欄を、数字(10.00・0.00)に読み間違えた行は、照合できないとき、文字にしない
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const f=page.frames().find(x=>x!==page.mainFrame());
const J=(s,size,ref,jp,med)=>f.evaluate(a=>window.pdfEditorDebug.junkNum(...a),[s,size,ref,jp,med]);
chk('日本語ページで、照合できない「10.00」は捨てる',await J('10.00',9,null,true,6)===true);
chk('周りよりずっと大きい数字(照合できない)は捨てる',await J('1,234',14,null,false,6)===true);
chk('照合できて重なった数字は残す',await J('10.00',14,0.7,true,6)===false);
chk('小さめで、小数でない数字(照合できない)は残す',await J('2024',6,null,true,6)===false);
chk('文字を含む行は対象外',await J('A-1',14,null,true,6)===false);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
