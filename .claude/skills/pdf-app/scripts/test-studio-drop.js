// 製本デスク: PDFのドラッグ&ドロップ(画面のどこに落としても開く)
//   node .claude/skills/pdf-app/scripts/test-studio-drop.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs');
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  const b64=fs.readFileSync(S+'studio_A4.pdf').toString('base64');
  const drop=(sel,name,type,withHover)=>page.evaluate(async([sel,b64,name,type,hover])=>{
    const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    const dt=new DataTransfer();dt.items.add(new File([u],name,{type}));
    const el=document.querySelector(sel),mk=t=>new DragEvent(t,{dataTransfer:dt,bubbles:true,cancelable:true});
    el.dispatchEvent(mk('dragenter'));el.dispatchEvent(mk('dragover'));
    const shown=!document.getElementById('dropHint').classList.contains('hidden');
    const ov=mk('dragover');el.dispatchEvent(ov);
    const dropEv=mk('drop');el.dispatchEvent(dropEv);
    await new Promise(r=>setTimeout(r,1500));
    return{shown,prevented:dropEv.defaultPrevented,hiddenAfter:document.getElementById('dropHint').classList.contains('hidden')};
  },[sel,b64,name,type,withHover]);
  // 見出し(束の一覧の外)に落とす
  let r=await drop('#menubar','a.pdf','application/pdf');
  let n=(await page.evaluate(()=>window.pdfStudioDebug.bundles())).length;
  ok('見出しに落としても開く(束 '+n+'個)・ドラッグ中は表示が出る・落としたら消える',n===1&&r.shown&&r.prevented&&r.hiddenAfter);
  // 束の一覧の上に落とす
  r=await drop('#deskWrap','b.pdf','application/pdf');
  n=(await page.evaluate(()=>window.pdfStudioDebug.bundles())).length;ok('一覧に落としても開く(束 '+n+'個)',n===2);
  // PDF以外
  r=await drop('#deskWrap','c.txt','text/plain');
  n=(await page.evaluate(()=>window.pdfStudioDebug.bundles())).length;
  ok('PDF以外は開かない(束 '+n+'個)・案内が出る: '+await page.textContent('#status'),n===2&&/PDFファイル/.test(await page.textContent('#status')));
  // 拡張子だけが .pdf で type が空(ブラウザによってはよくある)
  r=await drop('#deskWrap','d.PDF','');
  n=(await page.evaluate(()=>window.pdfStudioDebug.bundles())).length;ok('typeが空でも .PDF なら開く(束 '+n+'個)',n===3);
  // 編集の画面を開いている間は、ブラウザでPDFが開かない・束も増えない
  await page.evaluate(()=>{document.querySelectorAll('.chk').forEach((c,i)=>{if(i>0&&c.checked)c.click();});});
  await page.locator('.card').first().locator('.mnb').click().catch(()=>{});await page.locator('#menuBtns button',{hasText:'ページ編集'}).click().catch(()=>{});await page.waitForTimeout(2500);
  const open=await page.evaluate(()=>!document.getElementById('formHost').classList.contains('hidden'));
  if(open){r=await drop('#formHost','e.pdf','application/pdf');n=(await page.evaluate(()=>window.pdfStudioDebug.bundles())).length;
    ok('編集の画面を開いている間は、束が増えない(束 '+n+'個)・ブラウザでPDFが開かない',n===3&&r.prevented);}
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk&&!errs.length?0:1);
})();
