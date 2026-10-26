// ページ編集: 説明文(ヘルプ)は、ふだんは出さず、「❓」を押したときだけ出す。見出しのボタンが縦に潰れない
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const ok=(l,c)=>console.log((c?'OK  ':'NG  ')+l);
  await page.waitForTimeout(2300);
  await page.setInputFiles('#fAdd',[WORK+'/samples/form.pdf']);await page.waitForTimeout(1500);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const f=page.frames().find(x=>x!==page.mainFrame());
  const vis=await f.evaluate(()=>[...document.querySelectorAll('.helptext')].map(e=>getComputedStyle(e).display));
  ok(`説明文(${vis.length}か所)は、ふだんは出ていない`,vis.length>=6&&vis.every(d=>d==='none'));
  const hb=await f.evaluate(()=>{const b=document.getElementById('embSave').getBoundingClientRect(),h=document.getElementById('embHelp').getBoundingClientRect();return{saveH:b.height,saveW:b.width,helpW:h.width};});
  ok(`見出しの「保存して束に戻す」が、横に1行で出る(高さ ${hb.saveH.toFixed(0)}・幅 ${hb.saveW.toFixed(0)})`,hb.saveH<60&&hb.saveW>110);
  const hd=await f.evaluate(()=>{const h=document.getElementById('embHead').getBoundingClientRect(),u=document.getElementById('bUndo').getBoundingClientRect(),st=document.getElementById('status').getBoundingClientRect(),fp=getComputedStyle(document.getElementById('filePanel')).display;return{hb:h.bottom,ub:u.bottom,ut:u.top,sb:st.bottom,fp,h:h.height,inHead:document.getElementById('embHead').contains(document.getElementById('bUndo'))&&document.getElementById('embHead').contains(document.getElementById('status'))};});
  ok(`「① ファイル」は消え、元に戻す・状況の表示が、見出しの中に入る(見出しの高さ ${hd.h.toFixed(0)})`,hd.fp==='none'&&hd.inHead&&hd.sb<=hd.hb+1&&hd.ub<=hd.hb+1);
  await f.evaluate(()=>document.getElementById('embHelp').click());await page.waitForTimeout(300);
  const t=await f.evaluate(()=>{const o=document.getElementById('helpBox');return o?o.innerText:null;});
  ok('ヘルプを押すと、ヘルプが出る(モードの説明・そのほかの説明)',t&&/いまのモード/.test(t)&&/ほかのモード/.test(t)&&/文字として/.test(t)&&/初回だけ/.test(t));
  await f.evaluate(()=>document.getElementById('helpClose').click());await page.waitForTimeout(200);
  ok('「閉じる」で、ヘルプが閉じる',await f.evaluate(()=>!document.getElementById('helpBox')));
  console.log('JSエラー:',errs.length,errs);await browser.close();
})();
