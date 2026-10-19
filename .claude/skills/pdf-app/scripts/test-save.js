// 「名前を付けて保存」(showSaveFilePicker)と「上書き保存」の確認。ダイアログは自動化できないので、ブラウザの関数を差し替えて、書き込まれた内容を調べる
//   node .claude/skills/pdf-app/scripts/test-save.js   (先に make-sample-pdfs.js)
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.setInputFiles('#fOpen',WORK+'/samples/form.pdf');await page.waitForTimeout(2000);
  await page.evaluate(()=>{
    window.__saved=[];window.__asked=[];
    window.showSaveFilePicker=async o=>{window.__asked.push(o);
      let chosen=o.suggestedName.replace('_edited','_myname');
      return{name:chosen,createWritable:async()=>({chunks:[],async write(b){this.chunks.push(b);},async close(){window.__saved.push({name:chosen,blob:this.chunks[0]});}})};};
  });
  await page.click('#bSave');await page.waitForFunction(()=>window.__saved.length===1,null,{timeout:20000});
  const r=await page.evaluate(async()=>{const s=window.__saved[0];const b=new Uint8Array(await s.blob.arrayBuffer());return{name:s.name,size:b.length,head:String.fromCharCode(...b.slice(0,5)),asked:window.__asked[0]};});
  console.log('保存先の選択が開いた(提案名):',r.asked.suggestedName,'| 種類:',JSON.stringify(r.asked.types));
  console.log('書き込まれたファイル:',r.name,r.size+'バイト','先頭:',r.head,'(%PDF-が正解)');
  console.log('状態:',await page.textContent('#status'));
  const ov=await page.evaluate(()=>({hidden:document.getElementById('bOverwrite').classList.contains('hidden'),dis:document.getElementById('bOverwrite').disabled}));
  console.log('保存後に「上書き保存」が出る:',!ov.hidden&&!ov.dis);
  await page.click('#bOverwrite');await page.waitForFunction(()=>window.__saved.length===2,null,{timeout:20000});
  console.log('上書き保存で、選び直さず同じ名前に書けた:',await page.evaluate(()=>window.__saved[1].name===window.__saved[0].name&&window.__asked.length===1));
  // キャンセル
  await page.evaluate(()=>{window.showSaveFilePicker=async()=>{const e=new Error('x');e.name='AbortError';throw e;};});
  await page.click('#bSave');await page.waitForTimeout(800);
  console.log('キャンセル時の表示:',await page.textContent('#status'));
  // 非対応ブラウザ → ダウンロード
  await page.evaluate(()=>{window.showSaveFilePicker=undefined;});
  const [d]=await Promise.all([page.waitForEvent('download'),page.click('#bSave')]);
  console.log('非対応のときはダウンロード:',d.suggestedFilename());
  console.log('JSエラー:',errs.length);
  await browser.close();
})();
