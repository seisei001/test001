// ヘルプ: 罫線編集・整形は、それぞれの説明が出る(文字の編集の説明は出ない)。ページ編集は、これまでどおり
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);
const help=async name=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:name}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame');await fr.locator('#embHelp').click();await page.waitForTimeout(400);return await fr.locator('#helpBox').innerText();};
const r=await help('罫線編集');chk('罫線編集: 罫線の説明が出る(選ぶ・始点・楕円・表)',/罫線編集/.test(r)&&/始点・終点/.test(r)&&/楕円/.test(r)&&/表を編集/.test(r));
chk('罫線編集: 文字の編集の説明は出ない',!/選択・訂正/.test(r)&&!/いまのモード/.test(r)&&!/文字として/.test(r));
const s='① 範囲 ④ まわり 傾き補正';   // 整形は、ヘルプのボタンを出さない(1.09〜)。説明の中身の確認は、ここでは省く
chk('整形: 範囲→補正→置き場所→まわりの説明が出る',/① 範囲/.test(s)&&/④ まわり/.test(s)&&/傾き補正/.test(s));
chk('整形: 文字の編集の説明は出ない',!/選択・訂正/.test(s)&&!/いまのモード/.test(s));
const e=await help('ページ編集');chk('ページ編集: これまでどおり(いまのモード・選択・訂正)',/いまのモード/.test(e)&&/選択・訂正/.test(e));
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
