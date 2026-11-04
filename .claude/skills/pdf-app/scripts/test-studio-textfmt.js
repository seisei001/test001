// ページ編集: 文字の太字・下線・二重線(選んだ範囲だけ/全部)。保存したPDFに反映され、文字は文字のまま読める
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let ok=true;const chk=(n,c)=>{console.log((c?'OK  ':'NG  ')+n);if(!c)ok=false;};
  await page.waitForTimeout(2300);
  const run=async(btn,label)=>{
    await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[WORK+'/samples/studio_A4.pdf']);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await fr.locator('[data-m=sel]').click();await page.waitForTimeout(500);
    const rb=await fr.locator('#ov .run').first().boundingBox();await page.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2);await page.waitForTimeout(600);
    await page.keyboard.press('Control+a');await page.keyboard.type('Hello World');await page.waitForTimeout(500);
    await page.keyboard.press('Control+a');await page.waitForTimeout(200);
    if(btn)await fr.locator('#'+btn).click();await page.waitForTimeout(500);
    const fm=await f.evaluate(()=>window.pdfEditorDebug.fmOf());
    await fr.locator('#embSave').click();await page.waitForTimeout(3500);
    fs.writeFileSync('/tmp/fmt_'+label+'.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
    execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/fmt_${label}.pdf /tmp/fmt_${label}`);
    const dark=+execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/fmt_${label}.png').convert('L');print(sum(1 for p in a.getdata() if p<120))"`).toString().trim();
    return {fm,dark,txt:execSync(`pdftotext -f 1 -l 1 /tmp/fmt_${label}.pdf -`).toString()};
  };
  const plain=await run(null,'plain'),bold=await run('sBold','bold'),ul=await run('sUl','ul'),stk=await run('sStk','stk');
  console.log(plain.dark,bold.dark,ul.dark,stk.dark,JSON.stringify([bold.fm&&bold.fm.slice(0,3),ul.fm&&ul.fm.slice(0,3),stk.fm&&stk.fm.slice(0,3)]));
  chk('書式の印が、文字ごとに付く(太字=1・下線=2・二重線=4)',bold.fm&&bold.fm[0]===1&&ul.fm&&ul.fm[0]===2&&stk.fm&&stk.fm[0]===4);
  chk('太字: 黒い面積が増える',bold.dark>plain.dark*1.05);
  chk('下線: 黒い面積が増える',ul.dark>plain.dark+150);
  chk('二重線: 黒い面積が増える(下線より線が多い)',stk.dark>ul.dark);
  chk('文字は文字のまま読める(Hello World)',[plain,bold,ul,stk].every(r=>/Hello\s+World/.test(r.txt)));
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(ok&&!errs.length?0:1);
})();
