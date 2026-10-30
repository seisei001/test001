// ページ編集: PDFに近い枠を選んだ直後の、最初の入力が、入る(英数字・日本語入力(IME)の最初のキー・貼り付け)
//   ※ IME は、最初のキーが key="Process"(keyCode 229)で来る。以前は、これを入力の始まりと見ず、入力用の枠にならないので、最初の日本語入力が消えた
//   node .claude/skills/pdf-app/scripts/test-studio-ime.js
process.env.PDFAPP_TARGET='pdf-studio';
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);
  const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
    const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(800);return f;};
  const txt=async f=>(await f.evaluate(()=>window.pdfEditorDebug.items())).pop().txt;
  let f=await open();await page.keyboard.type('abc');await page.waitForTimeout(400);
  ok('選んだ直後に英数字を打つと入る: '+JSON.stringify((await txt(f)).slice(-6)),(await txt(f)).endsWith('abc'));
  f=await open();const cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchKeyEvent',{type:'rawKeyDown',key:'Process',code:'KeyA',windowsVirtualKeyCode:229});
  await cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',windowsVirtualKeyCode:65});
  await cdp.send('Input.imeSetComposition',{text:'あ',selectionStart:1,selectionEnd:1});await page.waitForTimeout(200);
  await cdp.send('Input.insertText',{text:'あい'});await page.waitForTimeout(400);
  ok('選んだ直後の、日本語入力(IME)の最初のキーでも入る: '+JSON.stringify((await txt(f)).slice(-6)),(await txt(f)).includes('あい'));
  f=await open();
  await f.evaluate(()=>{const dt=new DataTransfer();dt.setData('text/plain','貼付');document.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));});await page.waitForTimeout(500);
  ok('選んだ直後の、右クリックなどの貼り付け(キーなし)でも入る: '+JSON.stringify((await txt(f)).slice(-6)),(await txt(f)).includes('貼付'));
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
