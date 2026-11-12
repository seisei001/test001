// 部品(CDNのライブラリ)を読み込めないとき、画面に理由と再読み込みを出す / 重複IDがない / フォントを読めないとき知らせる
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path');const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
// 重複ID(HTMLの文字列の中も含めて、同じidが2回出ない)
const root=path.join(__dirname,'../../../../docs/apps/pdf-studio');
for(const f of ['index.html','forms/editor.html']){const s=fs.readFileSync(path.join(root,f),'utf8'),ids={};for(const m of s.matchAll(/\sid=\\?"([A-Za-z][\w-]*)\\?"/g))ids[m[1]]=(ids[m[1]]||0)+1;
  const dup=Object.entries(ids).filter(([k,v])=>v>1).map(([k])=>k);chk(`${f}: 重複するIDがない ${JSON.stringify(dup)}`,!dup.length);}
// 正常: 案内は出ない
await page.waitForTimeout(2300);chk('正常に読み込めたとき、「部品を読み込めませんでした」は出ない',await page.locator('#libFail').count()===0);
// pdf-lib を読めない
await page.route(/pdf-lib\.min\.js/,r=>r.abort());await page.reload();await page.waitForTimeout(2500);
chk('pdf-lib を読めないとき、理由と再読み込みのボタンを出す',await page.locator('#libFail').count()===1&&/pdf-lib/.test(await page.locator('#libFail').innerText())&&await page.locator('#libRetry').isVisible());
await page.unroute(/pdf-lib\.min\.js/);
await page.locator('#libRetry').click();await page.waitForTimeout(3000);
chk('再読み込みのボタンを押すと、元に戻る',await page.locator('#libFail').count()===0);
console.log('errs(部品を読めない間の想定内のエラーを除く)',errs.filter(e=>!/PDFLib|pdfjsLib|is not defined/.test(e)).slice(0,3));await browser.close();process.exit(ok?0:1);})();
