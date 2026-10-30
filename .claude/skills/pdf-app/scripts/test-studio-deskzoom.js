// 製本デスク: サムネイルの大きさを 40〜800px まで。大きくしたら細かく描き直す
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
const set=async v=>{await page.fill('#rSize',String(v));await page.dispatchEvent('#rSize','input');await page.waitForTimeout(1200);};
const info=()=>page.evaluate(()=>{const c=document.querySelector('.card canvas'),r=c.getBoundingClientRect();return{w:Math.round(r.width),cw:c.width};});
await set(40);let a=await info();chk('最小 40px: 表示幅 '+a.w,a.w>=34&&a.w<=44);
await set(800);a=await info();chk('最大 800px: 表示幅 '+a.w+' / 絵の幅 '+a.cw,a.w>=780&&a.cw>=a.w);
await page.evaluate(()=>{document.getElementById('rSize').max='9999';});await set(5000);a=await info();chk('範囲外の値は 800px までに止まる: '+a.w,a.w<=810);
console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
