// バージョン表示(右上)の確認。公開のたびに 0.01 ずつ上げる(1.00 → 1.01 → …)
//   node .claude/skills/pdf-app/scripts/test-version.js [期待するバージョン]
const {launch}=require('./harness');
(async()=>{
  const {browser,page}=await launch();
  await page.setViewportSize({width:390,height:800});
  const r=await page.evaluate(()=>{const e=document.getElementById('ver'),b=e.getBoundingClientRect();return{text:e.textContent.trim(),right:Math.round(window.innerWidth-b.right),top:Math.round(b.top),vis:getComputedStyle(e).visibility!=='hidden'&&b.width>0};});
  console.log('表示されているバージョン:',r.text,'| 右端からの距離',r.right,'px・上端から',r.top,'px | 見える:',r.vis);
  const want=process.argv[2];if(want)console.log('期待',want,'→',r.text===want?'OK':'違う');
  if(!/^\d+\.\d{2}$/.test(r.text))console.log('形式が違う(例: 1.00)');
  await browser.close();
})();
