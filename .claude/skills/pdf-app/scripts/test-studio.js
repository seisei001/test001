// PDFスタジオ(束デスク)の確認: 起動画面・束の表示・めくり・選択と結合・ばらす・分割・元に戻す・並び替え・機能メニュー
//   PDFAPP_TARGET=pdf-studio node .claude/skills/pdf-app/scripts/test-studio.js   (先に make-studio-pdfs.js)
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const st=async()=>page.evaluate(()=>window.pdfStudioDebug.bundles());
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  // 起動画面
  ok('起動画面が出ている',await page.evaluate(()=>!!document.getElementById('splash')&&!document.getElementById('splash').classList.contains('out')));
  await page.waitForTimeout(2300);
  ok('約1.5秒で消える',await page.evaluate(()=>!document.getElementById('splash')));
  ok('画面の名前とバージョン(束デスク 2.06)',await page.evaluate(()=>document.getElementById('fnDesk').textContent==='束デスク'&&document.getElementById('verDesk').textContent==='2.06'));
  // 読み込み
  await page.setInputFiles('#fAdd',[S+'studio_A4.pdf',S+'studio_B1.pdf',S+'studio_C7.pdf',S+'studio_D2.pdf']);await page.waitForTimeout(2500);
  let b=await st();ok('4つの束が並ぶ: '+b.map(x=>x.name+'('+x.n+')').join(' '),b.length===4);
  // 重なり(左の段=残りページ数、最大5)
  const lay=async i=>page.evaluate(i=>{const c=document.querySelectorAll('.card')[i];return{layers:c.querySelectorAll('.layer').length,nav:!c.querySelector('.nav').classList.contains('hidden'),pg:c.querySelector('.pg').textContent};},i);
  let l=await lay(0);ok(`A(4ページ)1ページ目: 重なり${l.layers}枚(=3)・めくり表示 ${l.pg}`,l.layers===3&&l.nav);
  l=await lay(1);ok(`B(1ページ)は普通の表示: 重なり${l.layers}枚・めくりなし`,l.layers===0&&!l.nav);
  l=await lay(2);ok(`C(7ページ)1ページ目: 重なり${l.layers}枚(上限5)`,l.layers===5);
  // 並び順(左から右、右端で次の段)
  const pos=await page.evaluate(()=>[...document.querySelectorAll('.card')].map(c=>{const r=c.getBoundingClientRect();return[Math.round(r.left),Math.round(r.top)];}));
  console.log('    束の位置(left,top):',JSON.stringify(pos));
  ok('左から右に並ぶ',pos[0][0]<pos[1][0]&&pos[1][0]<pos[2][0]);
  // めくり
  await page.locator('.card').nth(0).locator('.next').click();await page.locator('.card').nth(0).locator('.next').click();await page.waitForTimeout(500);
  l=await lay(0);ok(`Aを2回めくる→3ページ目 ${l.pg}: 左の段${l.layers}(左1+右2=3)`,l.pg==='3 / 4'&&l.layers===3);
  await page.locator('.card').nth(0).locator('.prev').click();await page.waitForTimeout(300);
  ok('前ページで戻る(2/4)',(await lay(0)).pg==='2 / 4');
  // サムネイルの中身(ページ番号が見える)
  await page.locator('#desk').screenshot({path:WORK+'/shot_studio_desk.png'});
  // 選択と結合(並び順: A,C を選ぶ → A(4)+C(7)=11ページ)
  await page.locator('.card').nth(2).locator('input[type=checkbox]').check();await page.locator('.card').nth(0).locator('input[type=checkbox]').check();
  ok('選択数の表示と結合ボタン',await page.evaluate(()=>/選択 2/.test(document.getElementById('cnt').textContent)&&!document.getElementById('bMerge').disabled));
  await page.click('#bMerge');await page.waitForTimeout(1500);
  b=await st();ok('結合: '+b.map(x=>x.name.slice(0,8)+'('+x.n+')').join(' '),b.length===3&&b[0].n===11&&/^結合_/.test(b[0].name));
  // 元に戻す
  await page.click('#bUndo');await page.waitForTimeout(800);b=await st();ok('元に戻す→4つ',b.length===4);
  // 全選択・解除
  await page.click('#bAll');ok('全選択',(await st()).every(x=>x.sel));await page.click('#bNone');ok('全選択解除',(await st()).every(x=>!x.sel));
  // ダブルクリック→機能メニュー(ちょうど1つ選んでいる束でだけ)
  await page.locator('.card').nth(2).locator('canvas').dblclick();await page.waitForTimeout(300);
  ok('何も選んでいないとき、ダブルクリックでメニューは開かない',await page.evaluate(()=>document.getElementById('menu').classList.contains('hidden')));
  await page.locator('.card').nth(2).locator('input[type=checkbox]').check();
  await page.locator('.card').nth(2).locator('canvas').dblclick();await page.waitForTimeout(300);
  const items=await page.evaluate(()=>[...document.querySelectorAll('#menuBtns button')].map(x=>x.textContent.replace(/\s+/g,' ').trim().slice(0,14)));
  console.log('    メニュー:',items.join(' / '));
  ok('機能メニューが開く(名前と版つき)',items.length>=6&&await page.evaluate(()=>!document.getElementById('menu').classList.contains('hidden')&&document.getElementById('verMenu').textContent==='2.01'));
  // 戻る(上の「← 戻る」と、下の「← 戻る」と、Esc)
  await page.click('#menuBack');ok('上の「戻る」でメニューが閉じ、束デスクに戻る',await page.evaluate(()=>document.getElementById('menu').classList.contains('hidden')));
  await page.locator('.card').nth(2).locator('canvas').dblclick();await page.click('#menuClose');ok('下の「戻る」でもメニューが閉じる',await page.evaluate(()=>document.getElementById('menu').classList.contains('hidden')));
  await page.locator('.card').nth(2).locator('canvas').dblclick();
  // 分割(Cを3ページ目まで進めて分割)
  await page.keyboard.press('Escape');
  for(let i=0;i<2;i++)await page.locator('.card').nth(2).locator('.next').click();await page.waitForTimeout(400);
  await page.locator('.card').nth(2).locator('canvas').dblclick();await page.locator('#menuBtns button',{hasText:'ここで分割'}).click();await page.waitForTimeout(1500);
  b=await st();ok('分割: '+b.map(x=>x.name.slice(0,10)+'('+x.n+')').join(' ')+' (C7→前2+後5)',b.length===5&&b[2].n===2&&b[3].n===5);
  // ばらす
  await page.click('#bNone');await page.locator('.card').nth(0).locator('input[type=checkbox]').check();
  await page.locator('.card').nth(0).locator('canvas').dblclick();await page.locator('#menuBtns button',{hasText:'全ページをばらす'}).click();await page.waitForTimeout(2000);
  b=await st();ok('ばらす: A(4)→1ページ×4 (全'+b.length+'個)',b.length===8&&b.slice(0,4).every(x=>x.n===1));
  // 並び替え(マウスのドラッグ: 先頭の束を、最後の束の右へ)
  const names0=(await st()).map(x=>x.name.slice(0,9));
  const c0=await page.locator('.card').nth(0).locator('canvas').boundingBox(),cl=await page.locator('.card').nth(7).boundingBox();
  await page.mouse.move(c0.x+30,c0.y+30);await page.mouse.down();await page.mouse.move(c0.x+60,c0.y+50,{steps:4});await page.mouse.move(cl.x+cl.width-10,cl.y+cl.height/2,{steps:10});
  await page.screenshot({path:WORK+'/shot_studio_drag.png'});await page.mouse.up();await page.waitForTimeout(500);
  const names1=(await st()).map(x=>x.name.slice(0,9));
  ok('ドラッグで並び替え(先頭が最後へ): '+names0[0]+'→'+names1[7],names1[7]===names0[0]&&names1[0]===names0[1]);
  // サムネイルの大きさ
  const w1=await page.evaluate(()=>document.querySelector('.stack').getBoundingClientRect().width);
  await page.fill('#rSize','300');await page.dispatchEvent('#rSize','input');await page.waitForTimeout(500);
  const w2=await page.evaluate(()=>document.querySelector('.stack').getBoundingClientRect().width);ok(`サムネイルの大きさ変更 ${Math.round(w1)}→${Math.round(w2)}px`,w2>w1+50);
  // 縦スクロール(右にバー)
  const sc=await page.evaluate(()=>{const w=document.getElementById('deskWrap');return{sh:w.scrollHeight,ch:w.clientHeight,ov:getComputedStyle(w).overflowY,ox:getComputedStyle(w).overflowX};});
  ok(`縦スクロールのみ(overflow-y:${sc.ov} / x:${sc.ox})`,sc.ov==='scroll'&&sc.ox==='hidden');
  console.log('JSエラー:',errs.length,errs.slice(0,2));
  await browser.close();
})();
