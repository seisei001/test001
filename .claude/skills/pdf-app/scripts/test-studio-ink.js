// ページ編集(画像の文字認識): 「文字だけ消す」(ink)は、罫線・図形(QR)・背景を残す。「文字のところを白抜き」(text)と比べる
//   node .claude/skills/pdf-app/scripts/test-studio-ink.js   (先に make-dense-scan.js で dense_scan.pdf)
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
(async()=>{
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const orig=WORK+'/samples/dense_scan.pdf';
  execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile ${orig} /tmp/ink_orig`);
  const py=(code)=>execSync(`python3 -W ignore -c "${code.replace(/"/g,'\\"')}"`).toString().trim();
  const measure=(png)=>py(`
from PIL import Image
a=Image.open('/tmp/ink_orig.png').convert('L');b=Image.open('${png}').convert('L');W,H=a.size;pa=a.load();pb=b.load()
# 元の画像の罫線(水平・垂直に40画素以上続く暗い線)が、どれだけ残ったか
rule=set()
for y in range(H):
  x=0
  while x<W:
    if pa[x,y]<140:
      s=x
      while x<W and pa[x,y]<140:x+=1
      if x-s>=40:
        for k in range(s,x):rule.add((k,y))
    else:x+=1
for x in range(W):
  y=0
  while y<H:
    if pa[x,y]<140:
      s=y
      while y<H and pa[x,y]<140:y+=1
      if y-s>=40:
        for k in range(s,y):rule.add((x,k))
    else:y+=1
kept=sum(1 for (x,y) in rule if pb[x,y]<170)
# QR(右上 x 995-1130, y 40-170)の暗い画素が、どれだけ残ったか
qa=sum(1 for x in range(995,1130) for y in range(40,170) if pa[x,y]<140);qb=sum(1 for x in range(995,1130) for y in range(40,170) if pb[x,y]<140)
print(len(rule),kept,qa,qb)`).split(' ').map(Number);
  const run=async(mode)=>{
    await page.reload();await page.waitForTimeout(2300);
    await page.setInputFiles('#fAdd',[orig]);await page.waitForTimeout(1500);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await f.evaluate(()=>{document.getElementById('ocrEngine').value='paddle';});
    await fr.locator('[data-m=ocr]').click();await fr.locator('#bOcrPage').click();
    await f.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:400000});
    if(mode!=='ink')await f.evaluate(m=>window.pdfEditorDebug.setBg(m),mode);
    if(mode==='ink')await f.evaluate(()=>window.pdfEditorDebug.inkAll());else await page.waitForTimeout(1500);
    const st=await f.evaluate(()=>window.pdfEditorDebug.inkState());
    await fr.locator('#embSave').click();await page.waitForTimeout(mode==='ink'?12000:5000);
    fs.writeFileSync('/tmp/ink_'+mode+'.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
    execSync(`pdftoppm -r 150 -png -f 1 -l 1 -singlefile /tmp/ink_${mode}.pdf /tmp/ink_${mode}`);
    return{st,m:measure(`/tmp/ink_${mode}.png`)};
  };
  const A=await run('ink'),B=await run('text');
  const fail=A.st.filter(s=>s.ink&&s.ink.failed).length,done=A.st.filter(s=>s.ink&&!s.ink.failed&&!s.ink.busy&&s.ink.n>0).length;
  console.log('   ink: 枠',A.st.length,'パッチできた',done,'四角に戻した',fail);
  ok('「文字だけ消す」で、ほとんどの枠にパッチができた('+done+'/'+A.st.length+')',done>=A.st.length*0.7);
  const [n,kA,qa,qA]=A.m,[,kB,,qB]=B.m;
  console.log('   罫線の画素',n,' 残った: ink',kA,'/ text',kB,'  QRの暗い画素 元',qa,'ink',qA,'text',qB);
  ok('罫線が残る(ink): '+(kA/n*100).toFixed(1)+'%',kA/n>=0.97);
  ok('図形(QR)が変わらない(ink): '+(qA/qa*100).toFixed(1)+'%',Math.abs(qA-qa)/qa<0.02);
  ok('「文字のところを白抜き」(text)より、罫線の残りが悪くない',kA>=kB-3);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
