const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const T='/tmp/claude-0/hf/bake',J=JSON.parse(fs.readFileSync(T+'/jobs.json'));
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/apps/sekai-hex/design/bake_med1.html');await p.waitForFunction('window.__ready',null,{timeout:60000});
for(const j of J.jobs){const d=await p.evaluate(([h,v,x,o])=>window.shot(h,v,x,o),[j.house,j.view,j.pxm,j.only]);fs.writeFileSync(`${T}/${j.house}_${j.key}.png`,Buffer.from(d.split(',')[1],'base64'))}
console.log('rendered',J.jobs.length,errs.slice(0,3));await b.close()})()
