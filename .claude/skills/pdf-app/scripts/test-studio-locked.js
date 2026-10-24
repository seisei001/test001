// 鍵の掛かったPDF(暗号化)でも、文字データを「見えない文字」として残し、ページ編集で文字の部品として扱えることの確認(pypdf が必要: pip install pypdf cryptography)
process.env.PDFAPP_TARGET='pdf-studio';
const {execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const src=WORK+'/samples/form.pdf',lock='/tmp/locked_form.pdf';
try{execSync(`python3 -c "from pypdf import PdfReader,PdfWriter;r=PdfReader('${src}');w=PdfWriter();[w.add_page(p) for p in r.pages];w.encrypt(user_password='',owner_password='x',algorithm='AES-128');w.write('${lock}')"`);}
catch(e){console.log('SKIP pypdf が無いので、鍵つきPDFを作れません');process.exit(0);}
async function boxes(file,use){const {browser,page}=await launch();await page.waitForTimeout(2300);
  if(use!==undefined)page.on('console',()=>{});await page.setInputFiles('#fAdd',[file]);if(use!==undefined){await page.waitForSelector('#lkChk',{timeout:30000});if(use)await page.check('#lkChk');await page.getByRole('button',{name:'取り込む'}).click();}await page.waitForTimeout(6000);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const f=page.frames().find(x=>x!==page.mainFrame());
  const b=await f.evaluate(()=>window.pdfEditorDebug.textBoxes(0,0,2000,2000));await browser.close();return b;}
(async()=>{
  const a=await boxes(src),b=await boxes(lock,true),c=await boxes(lock,false);
  const same=a.filter(o=>b.some(r=>Math.abs(r.x-o.x)<2&&Math.abs(r.y-o.y)<2&&Math.abs(r.h-o.h)<1&&Math.abs(r.w-o.w)<3)).length;
  console.log((c.length===0?'OK  ':'NG  ')+`チェックなし(画像として取り込む)では、文字データは入らない(${c.length}個)`);
  console.log((a.length&&same===a.length&&b.length===a.length?'OK  ':'NG  ')+`鍵つきPDFの文字データが、位置・大きさ・幅とも元と同じ(${same}/${a.length}、鍵つき側 ${b.length}個)`);
})();
