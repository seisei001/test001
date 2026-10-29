// 製本デスク: 印刷(選んだ束 / 表示しているページ / 複数の束をつなげる)。印刷の画面そのものは開けないので、渡すPDFの中身を確かめる
//   node .claude/skills/pdf-app/scripts/test-studio-print.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  await page.evaluate(()=>{window.__printCalls=[];window.__printHook=(b,n)=>window.__printCalls.push({n,len:b.length,b:Array.from(b)});});
  ok('選んでいないときは印刷が押せない',await page.evaluate(()=>document.getElementById('bPrint').disabled&&document.getElementById('bPrintPg').disabled));
  await page.setInputFiles('#fAdd',[S+'studio_A4.pdf']);await page.waitForTimeout(1800);
  await page.click('.mtop[data-d=mdFile]');ok('ファイルに「印刷」が出る・押せる',await page.evaluate(()=>!document.getElementById('bPrint').disabled));
  await page.click('#bPrint');await page.waitForTimeout(1500);
  let c=await page.evaluate(()=>window.__printCalls);
  ok('束まるごと印刷: 4ページ '+(c[0]&&c[0].n),c.length===1&&/Pages: +4/.test((fs.writeFileSync('/tmp/print1.pdf',Buffer.from(c[0].b)),execSync('pdfinfo /tmp/print1.pdf').toString())));
  // 2ページ目を表示して「このページを印刷」
  await page.locator('.card').nth(0).locator('.next').click();await page.waitForTimeout(500);
  await page.click('.mtop[data-d=mdEdit]');await page.click('#bPrintPg');await page.waitForTimeout(1500);
  c=await page.evaluate(()=>window.__printCalls);
  fs.writeFileSync('/tmp/print2.pdf',Buffer.from(c[1].b));
  ok('このページだけ: 1ページ('+c[1].n+')',/Pages: +1/.test(execSync('pdfinfo /tmp/print2.pdf').toString()));
  const t1=execSync('pdftotext /tmp/print2.pdf -').toString();
  fs.writeFileSync('/tmp/print_all.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
  const t2=execSync('pdftotext -f 2 -l 2 /tmp/print_all.pdf -').toString();
  ok('表示していた2ページ目の中身',t1.trim()===t2.trim()&&t1.trim().length>0);
  // 2つの束を選んでつなげる
  await page.setInputFiles('#fAdd',[S+'photo_persp.pdf']);await page.waitForTimeout(1500);
  await page.click('.mtop[data-d=mdBind]');await page.click('#bAll');await page.click('.mtop[data-d=mdFile]');await page.click('#bPrint');await page.waitForTimeout(1800);
  c=await page.evaluate(()=>window.__printCalls);fs.writeFileSync('/tmp/print3.pdf',Buffer.from(c[2].b));
  ok('2つの束をつなげて印刷: 5ページ',/Pages: +5/.test(execSync('pdfinfo /tmp/print3.pdf').toString()));
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
