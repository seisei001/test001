// ページ編集の方針: ①枠を作るだけ(読み取り・消去しない) ②中身は手入力か「下の文字を読み取る」 ③下地の扱いはヘッダーで1つ選ぶ(そのまま重ねる/文字だけ消す/白く塗る)・画面がすぐその見た目 ④確定の確認は1回(確定/戻る) ⑤確定後は見えているもの=結果
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  {const d=await PDFDocument.create(),img=await d.embedPng(fs.readFileSync(path.join(__dirname,'fixtures/unitika.png'))),W=595,H=W*262/468,p=d.addPage([W,H]);p.drawImage(img,{x:0,y:0,width:W,height:H});fs.writeFileSync(WORK+'/samples/unitika.pdf',await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const imgs=p=>execSync(`pdfimages -list ${p}`).toString().split('\n').filter(l=>/ image /.test(l)).length;
  const dark=p=>+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${p}').convert('L');px=a.load();W,H=a.size
print(sum(1 for y in range(int(H*0.76),int(H*0.87)) for x in range(int(W*0.07),int(W*0.21)) if px[x,y]<110))"`).toString().trim();
  let fr,f;
  const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/unitika.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    fr=page.frameLocator('#formFrame');f=page.frames().find(x=>x!==page.mainFrame());await f.evaluate(()=>{window.__noConfirmAsk=false;});
    await fr.locator('[data-m=text]').click();await page.waitForTimeout(500);
    const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595,s=595/468;
    await page.mouse.move(ob.x+34*s*k,ob.y+203*s*k);await page.mouse.down();await page.mouse.move(ob.x+100*s*k,ob.y+226*s*k,{steps:6});await page.mouse.up();await page.waitForTimeout(1500);};
  const items=()=>f.evaluate(()=>window.pdfEditorDebug.items().map(i=>({t:i.type,txt:i.txt})));
  const onU=()=>fr.locator('#sUnderSeg button.on').innerText();
  const read=async()=>{await fr.locator('#sRead').click();for(let i=0;i<40;i++){await page.waitForTimeout(2000);const it=await items();if(it.length&&it[0].txt)break;}await page.waitForTimeout(1200);};
  const confirm=async(choice)=>{await fr.locator('#embHead #sClose').click();await fr.locator('#applyAsk').waitFor({timeout:15000});const t=await fr.locator('#applyAsk').innerText();await fr.locator('#applyAsk button',{hasText:choice}).click();await page.waitForTimeout(3500);return t;};
  const save=async n=>{await fr.locator('#embSave').click();await page.waitForTimeout(3500);fs.writeFileSync(`/tmp/pol_${n}.pdf`,Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/pol_${n}.pdf /tmp/pol_${n}`);};
  // ① 枠を作るだけ
  await open();
  let it=await items();chk('① 枠を作るだけ: 空の枠(読み取らない・確認も出ない)',it.length===1&&it[0].t==='text'&&!it[0].txt&&await fr.locator('#applyAsk,#eraseAsk,#keepAsk').count()===0);
  chk('③ 下地の扱いの初めは「そのまま重ねる」',/そのまま重ねる/.test(await onU()));
  // ② 下の文字を読み取る
  await read();it=await items();console.log('   読み取り',JSON.stringify(it));
  chk('② 「下の文字を読み取る」で、写真の「ユニチカ」が枠に入る',it.length===1&&/ユニチカ/.test(it[0].txt));
  chk('② 読み取ったあとも、下地は「そのまま重ねる」のまま',/そのまま重ねる/.test(await onU()));
  // ③ 下地: 文字だけ消す → 画面に、消した見た目(パッチ)が出る / そのまま → 消える
  await fr.locator('#sUnderSeg button',{hasText:'文字だけ消す'}).click();await page.waitForTimeout(3000);
  chk('③ 「文字だけ消す」を選ぶと、すぐ画面が消した見た目になる',(await fr.locator('#ov canvas.cover.inkp').count())>=1);
  await fr.locator('#sUnderSeg button',{hasText:'そのまま重ねる'}).click();await page.waitForTimeout(800);
  chk('③ 「そのまま重ねる」に戻すと、下地の見た目も元に戻る',(await fr.locator('#ov .cover').count())===0);
  // ④ 確定の確認は1回・戻る
  let t=await confirm('戻る');chk('④ 確定の確認は「この見た目で確定します」(確定/戻る)',/この見た目で確定します/.test(t));
  chk('④ 戻る: 何も変えず、編集に戻る',(await items()).length===1);
  await fr.locator('#ov .ibox').first().click().catch(()=>{});await page.waitForTimeout(500);
  await confirm('確定する');await save('keep');
  chk('⑤ そのまま重ねる: 図には何もしない(画像は1つのまま)・文字はフォント',imgs('/tmp/pol_keep.pdf')===1&&/ユニチカ/.test(execSync('pdftotext /tmp/pol_keep.pdf -').toString()));
  // 文字だけ消す で確定 → 下の文字が消える(パッチ)
  await open();await read();await fr.locator('#sUnderSeg button',{hasText:'文字だけ消す'}).click();await page.waitForTimeout(3000);
  await confirm('確定する');await save('erase');
  const dk=dark('/tmp/pol_keep.png'),de=dark('/tmp/pol_erase.png');console.log('   暗い画素 そのまま',dk,'文字だけ消す',de);
  chk('文字だけ消す: 下の画像の文字が消える(パッチ)・文字はフォント',imgs('/tmp/pol_erase.pdf')>1&&/ユニチカ/.test(execSync('pdftotext /tmp/pol_erase.pdf -').toString()));
  // 白く塗る
  await open();await page.keyboard.type('ABC');await fr.locator('#sUnderSeg button',{hasText:'白く塗る'}).click();await page.waitForTimeout(800);
  chk('白く塗る: 画面がすぐ白い四角になる',(await fr.locator('#ov div.cover').count())>=1);
  await confirm('確定する');await save('white');
  chk('白く塗る: 枠の中が白くなる(図は増えない)',imgs('/tmp/pol_white.pdf')===1&&dark('/tmp/pol_white.png')<dk);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);
})();
