// PDFスタジオ: データを残さない(次に開くと空)・変更フラグ・閉じるときの保存確認
//   PDFAPP_TARGET=pdf-studio node .claude/skills/pdf-app/scripts/test-studio-save.js   (先に make-studio-pdfs.js)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK,APP}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[S+'studio_A4.pdf',S+'studio_B1.pdf']);await page.waitForTimeout(2000);
  ok('読み込んだ直後は、変更フラグなし',await page.evaluate(()=>bundles.length===2&&bundles.every(b=>!b.dirty)));
  // 変更なし → 確認なしで閉じる
  await page.evaluate(()=>removeBundle(bundles[1]));await page.waitForTimeout(300);
  ok('変更なしの束は、確認なしで閉じる',await page.evaluate(()=>bundles.length===1&&!document.body.innerText.includes('保存しますか')));
  // 分割 → 変更フラグ
  await page.evaluate(()=>{bundles[0].cur=1;return splitAt(bundles[0]);});await page.waitForTimeout(800);
  ok('分割した束は、変更フラグが立つ(●表示)',await page.evaluate(()=>bundles.length===2&&bundles.every(b=>b.dirty)&&document.querySelector('.nm').textContent.startsWith('●')));
  // 閉じる → 確認 → やめる
  await page.evaluate(()=>{window._p=removeBundle(bundles[0]);});await page.waitForTimeout(300);
  const btns=await page.evaluate(()=>[...document.querySelectorAll('body > div[style*="fixed"] button')].map(b=>b.textContent));
  ok('保存確認が出る(元のファイルが無いので上書きは出ない): '+btns.join(' / '),btns.includes('名前を付けて保存')&&btns.includes('保存しない')&&!btns.some(t=>/上書き/.test(t)));
  await page.getByRole('button',{name:'やめる(閉じない)'}).click();await page.waitForTimeout(200);
  ok('やめると、束は残る',await page.evaluate(()=>bundles.length===2));
  // 上書き保存(元のファイルの代わりの偽ハンドル)
  const w=await page.evaluate(async()=>{let got=0;bundles[0].handle={name:'orig.pdf',createWritable:async()=>({write:async b=>{got=b.size;},close:async()=>{}})};
    window._p=removeBundle(bundles[0]);await new Promise(r=>setTimeout(r,200));const t=[...document.querySelectorAll('body > div[style*="fixed"] button')].map(b=>b.textContent);
    [...document.querySelectorAll('body > div[style*="fixed"] button')].find(b=>/上書き/.test(b.textContent)).click();await window._p;return{t,got,n:bundles.length};});
  ok('元のファイルがあれば「上書き保存」が出て、書き込んで閉じる: '+w.t.join(' / ')+' '+w.got+'byte',w.t.some(t=>/上書き/.test(t))&&w.got>500&&w.n===1);
  // 保存しない
  await page.evaluate(()=>{window._p=removeBundle(bundles[0]);});await page.waitForTimeout(200);await page.getByRole('button',{name:'保存しない',exact:true}).click();await page.waitForTimeout(300);
  ok('「保存しない」で閉じる',await page.evaluate(()=>bundles.length===0));
  // 次に開くと空
  await page.setInputFiles('#fAdd',[S+'studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.evaluate(()=>new Promise(r=>setTimeout(r,500)));
  await page.goto(APP);await page.waitForTimeout(3000);
  ok('開き直すと、前のデータは無い(空の状態)',await page.evaluate(()=>bundles.length===0));
  ok('ブラウザに保存されたデータも無い',await page.evaluate(async()=>{const dbs=await (indexedDB.databases?indexedDB.databases():[]);return !dbs.some(d=>d.name==='pdf-studio');}));
  console.log('JSエラー:',errs.length,errs.slice(0,2));await browser.close();
})();
