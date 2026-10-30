// PDFスタジオの「ページ編集」「歪み補正」フォームの確認(先に make-studio-pdfs.js と make-warp-photo.js)
//   node .claude/skills/pdf-app/scripts/test-studio-forms.js
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);page.on('dialog',d=>d.accept());   // フォントを足すときの確認
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[S+'studio_A4.pdf']);await page.waitForTimeout(1500);
  const sig=()=>page.evaluate(()=>document.querySelector('.card canvas').toDataURL().length+':'+document.querySelector('.card canvas').toDataURL().slice(-60));
  const before=await sig();
  // ページ編集
  await page.locator('.card').nth(0).locator('.next').click();await page.waitForTimeout(400);
  await page.locator('.card').nth(0).locator('canvas').dblclick();
  await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(2500);
  ok('フォームの名前と版: '+await page.textContent('#formName')+' '+await page.textContent('#formVer'),/ページ編集/.test(await page.textContent('#formName'))&&(await page.textContent('#formVer')).includes('2.90'));
  const fr=page.frameLocator('#formFrame');
  await fr.locator('#embSave').waitFor({timeout:20000});
  await page.waitForTimeout(1500);
  const f=page.frames().find(x=>x!==page.mainFrame());
  console.log('    pages in frame:',await f.evaluate(()=>document.querySelector('#status').textContent));
  await page.screenshot({path:WORK+'/shot_form_edit.png'});
  // テキストを追加
  await fr.locator('[data-m=text]').click();
  const ov=await fr.locator('#ov').boundingBox();
  await page.mouse.click(ov.x+ov.width*0.3,ov.y+ov.height*0.5);await page.waitForTimeout(500);
  await page.keyboard.type('TEST-STUDIO');await page.waitForTimeout(300);
  console.log('    items:',await f.evaluate(()=>window.pdfEditorDebug.items().map(i=>i.txt)));
  await fr.locator('#embSave').click();await page.waitForTimeout(3000);
  ok('保存でフォームが閉じる',await page.evaluate(()=>document.getElementById('formHost').classList.contains('hidden')));
  const after=await sig();ok('サムネイルが変わった',before!==after);
  const b=await page.evaluate(()=>window.pdfStudioDebug.bundles());ok('ページ数そのまま(4)・2ページ目のまま: '+JSON.stringify(b[0]),b[0].n===4&&b[0].cur===1);
  await page.locator('.card').nth(0).locator('canvas').screenshot({path:WORK+'/shot_form_after.png'});
  // 歪み補正
  await page.setInputFiles('#fAdd',[S+'photo_persp.pdf']);await page.waitForTimeout(1500);
  const w0=await page.evaluate(()=>document.querySelectorAll('.card')[1].querySelector('canvas').toDataURL().length);
  await page.locator('.card').nth(1).locator('.chk').click();await page.locator('.card').nth(0).locator('.chk').click();await page.waitForTimeout(300);await page.locator('.card').nth(1).locator('canvas').dblclick();
  await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(2500);
  ok('整形の名前: '+await page.textContent('#formName'),/整形/.test(await page.textContent('#formName')));
  const vis=async s=>fr.locator(s).isVisible();
  ok('一括/部分・自動・補正するが見える',await vis('#wkPage')&&await vis('#wkPart')&&await vis('#wAuto')&&await vis('#wApply'));
  await page.screenshot({path:WORK+'/shot_form_warp.png'});
  await fr.locator('#wAuto').click();await page.waitForTimeout(4000);
  await fr.locator('#wApply').click();await page.waitForTimeout(4000);
  ok('補正してもフォームは開いたまま(続けて整えられる)',!(await page.evaluate(()=>document.getElementById('formHost').classList.contains('hidden'))));
  await fr.locator('#embSave').click();await page.waitForTimeout(3000);
  ok('保存でフォームが閉じ束に戻る',await page.evaluate(()=>document.getElementById('formHost').classList.contains('hidden')));
  const w1=await page.evaluate(()=>document.querySelectorAll('.card')[1].querySelector('canvas').toDataURL().length);
  ok(`サムネイル更新 ${w0}→${w1}`,w0!==w1);
  // キャンセル
  await page.locator('.card').nth(0).locator('.chk').click();await page.locator('.card').nth(1).locator('.chk').click();await page.waitForTimeout(300);await page.locator('.card').nth(0).locator('canvas').dblclick();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(2500);
  await page.evaluate(()=>document.getElementById('formClose').click());await page.waitForTimeout(500);
  ok('閉じる(保存しない)で戻る',await page.evaluate(()=>document.getElementById('formHost').classList.contains('hidden')));
  console.log('JSエラー:',errs.length,errs.slice(0,2));
  await browser.close();
})();
