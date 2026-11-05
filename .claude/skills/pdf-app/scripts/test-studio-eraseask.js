// 枠の下の画像の文字を消す前に、確認(はい/いいえ)を出す
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  const run=async(answer)=>{
    await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/form_scan.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await f.evaluate(()=>{window.__noEraseAsk=false;window.__noEraseOcr=true;});   // 確認を出す。読み取りは、速く終わらせる(画像だけ見せる)
    await fr.locator('[data-m=text]').click();await page.waitForTimeout(300);
    const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595.2;
    // 氏名らしい文字のある行(form_scan の上のほう): 画像の文字の上に、小さな枠を作る
    await page.mouse.move(ob.x+120*k,ob.y+128*k);await page.mouse.down();await page.mouse.move(ob.x+300*k,ob.y+150*k,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
    await page.keyboard.type('NEW');await page.waitForTimeout(1500);
    await fr.locator('#embSave').click();
    await page.locator('#formFrame').waitFor();
    const dlg=await fr.locator('#eraseAsk').waitFor({timeout:20000}).then(()=>true).catch(()=>false);
    let info=null;if(dlg){info=await fr.locator('#eraseAsk').innerText();await fr.locator('#eraseAsk button',{hasText:answer?'はい':'いいえ'}).click();}
    await page.waitForTimeout(4000);
    const u=await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)));fs.writeFileSync('/tmp/ea_'+answer+'.pdf',Buffer.from(u));
    execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/ea_${answer}.pdf /tmp/ea_${answer}`);
    return{dlg,info};};
  const yes=await run(true),no=await run(false);
  chk('消す前に、確認の画面が出る',yes.dlg&&/消してもいいですか/.test(yes.info)&&/はい/.test(yes.info)&&/いいえ/.test(yes.info));
  chk('消す範囲の画像と、読み取った文字の欄が出る',/読み取った文字/.test(yes.info)&&/消す範囲/.test(yes.info));
  // 画像の文字の暗い画素: はい→減る / いいえ→元のまま
  const dark=p=>+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${p}').convert('L');px=a.load()
print(sum(1 for y in range(250,330) for x in range(240,630) if px[x,y]<120))"`).toString().trim();
  const dy=dark('/tmp/ea_true.png'),dn=dark('/tmp/ea_false.png');
  console.log('暗い画素(枠の下の範囲): はい',dy,' いいえ',dn);
  chk('「いいえ」: 下の画像の文字は消えない(はいより多く残る)',dn>dy);
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);})();
