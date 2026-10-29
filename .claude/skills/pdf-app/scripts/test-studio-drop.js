// 製本デスク: PDFのドラッグ&ドロップ(画面のどこに落としても開く)。本物のドラッグ(CDP)で確かめる
//   ※ 手作りのイベントでは、「落としたあとで中身が空になる」ブラウザの動きを再現できず、見落とした(2.16)
//   node .claude/skills/pdf-app/scripts/test-studio-drop.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs');
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  fs.writeFileSync('/tmp/drop_note.txt','hello');fs.copyFileSync(S+'studio_A4.pdf','/tmp/drop_UP.PDF');
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  const cdp=await page.context().newCDPSession(page);
  const nb=async()=>(await page.evaluate(()=>window.pdfStudioDebug.bundles())).length;
  const drag=async(x,y,files)=>{const data={items:[],files,dragOperationsMask:1};
    await cdp.send('Input.dispatchDragEvent',{type:'dragEnter',x,y,data});await cdp.send('Input.dispatchDragEvent',{type:'dragOver',x,y,data});
    const shown=await page.evaluate(()=>!document.getElementById('dropHint').classList.contains('hidden'));
    await cdp.send('Input.dispatchDragEvent',{type:'drop',x,y,data});await page.waitForTimeout(2200);
    return{shown,hidden:await page.evaluate(()=>document.getElementById('dropHint').classList.contains('hidden'))};};
  let r=await drag(400,20,[S+'studio_A4.pdf']);
  ok('見出しに落としても開く(束 '+await nb()+'個)・ドラッグ中は表示が出る・落としたら消える',await nb()===1&&r.shown&&r.hidden);
  r=await drag(300,300,[S+'studio_A4.pdf']);ok('一覧に落としても開く(束 '+await nb()+'個)',await nb()===2);
  r=await drag(300,300,['/tmp/drop_note.txt']);
  ok('PDF以外は開かない(束 '+await nb()+'個)・案内が出る: '+await page.textContent('#status'),await nb()===2&&/PDFファイル/.test(await page.textContent('#status')));
  r=await drag(300,300,['/tmp/drop_UP.PDF']);ok('拡張子が大文字の .PDF も開く(束 '+await nb()+'個)',await nb()===3);
  r=await drag(300,300,[S+'studio_A4.pdf','/tmp/drop_note.txt',S+'photo_persp.pdf']);ok('複数まとめて(PDF2つ+文字1つ)落とすと、PDFだけ開く(束 '+await nb()+'個)',await nb()===5);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
