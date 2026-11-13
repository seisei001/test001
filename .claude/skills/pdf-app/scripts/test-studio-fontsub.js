// 日本語フォントを、使う文字だけに切り出して入れても、見た目が、まるごと入れたときと同じ(fontkitの切り出しの不具合を直した)。大きさは、数KB
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
const f=page.frames().find(x=>x!==page.mainFrame());
const STR='静岡県ABC あいう 令和8年10月20日 株式会社東京都千代田区 ユニチカ、。()ー 日本語のテスト NEW';
const diff=(a,b)=>+execSync(`python3 -W ignore -c "
from PIL import Image,ImageChops
a=Image.open('${a}').convert('L');b=Image.open('${b}').convert('L')
d=ImageChops.difference(a,b);print(sum(1 for p in d.getdata() if p>64))"`).toString().trim();
for(const key of ['gothic','mincho','maru']){
  const full=await f.evaluate(([k,s])=>window.pdfEditorDebug.fontTest(k,s,true),[key,STR]),sub=await f.evaluate(([k,s])=>window.pdfEditorDebug.fontTest(k,s,false),[key,STR]);
  fs.writeFileSync(`/tmp/fs_${key}_full.pdf`,Buffer.from(full));fs.writeFileSync(`/tmp/fs_${key}_sub.pdf`,Buffer.from(sub));
  for(const t of ['full','sub'])execSync(`pdftoppm -r 100 -png -singlefile /tmp/fs_${key}_${t}.pdf /tmp/fs_${key}_${t}`);
  const d=diff(`/tmp/fs_${key}_full.png`,`/tmp/fs_${key}_sub.png`);console.log(`   ${key}: まるごと ${full.length} バイト / 切り出し ${sub.length} バイト / 見た目の違い ${d} 画素`);
  chk(`${key}: 切り出しても、見た目が、まるごと入れたときと同じ(違い ${d} 画素)`,d===0);
  chk(`${key}: 切り出すと、数十KB以内に収まる(${sub.length} バイト)`,sub.length<60000&&full.length>500000);
  chk(`${key}: 文字として読み取れる`,execSync(`pdftotext /tmp/fs_${key}_sub.pdf -`).toString().replace(/\s/g,'')===STR.replace(/\s/g,''));
}
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
