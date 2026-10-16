// ページの下端で長い文字を入力しても、枠がページ内に収まる(はみ出して扱えなくならない)ことの確認
//   node .claude/skills/pdf-app/scripts/test-bottom.js
const {launch,drag,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();
  await page.setViewportSize({width:900,height:2400});await page.click('#bNew');await page.waitForTimeout(1200);
  await page.click('[data-m=text]');
  await drag(page,0.1,0.93,0.6,0.99);                       // ページの一番下に小さな枠
  await page.keyboard.type('これはページの下端に置いた枠です。文字をたくさん入力して、枠が下にはみ出さないか、はみ出したら位置や大きさが調整されるかを確認します。'.repeat(3));
  await page.waitForTimeout(700);
  const inside=await page.evaluate(()=>{const o=document.querySelector('#ov').getBoundingClientRect(),b=document.querySelector('.ibox.on').getBoundingClientRect();
    return{box:[b.left-o.left,b.top-o.top,b.right-o.left,b.bottom-o.top].map(Math.round),page:[Math.round(o.width),Math.round(o.height)],size:document.querySelector('#sSize').value};});
  console.log('枠(左,上,右,下)=',inside.box,' ページ=',inside.page,' 文字サイズ=',inside.size);
  console.log('ページ内に収まっている:',inside.box[0]>=-1&&inside.box[1]>=-1&&inside.box[2]<=inside.page[0]+1&&inside.box[3]<=inside.page[1]+1);
  // つまみで下へ移動しようとしても、はみ出さない
  const mv=await page.locator('.hdl.mv').boundingBox();
  await page.mouse.move(mv.x+13,mv.y+13);await page.mouse.down();await page.mouse.move(mv.x+13,mv.y+400,{steps:6});await page.mouse.up();await page.waitForTimeout(300);
  const after=await page.evaluate(()=>{const o=document.querySelector('#ov').getBoundingClientRect(),b=document.querySelector('.ibox.on').getBoundingClientRect();return b.bottom<=o.bottom+1;});
  console.log('下へ大きく動かしても、ページ内:',after);
  await browser.close();
})();
