// 歪み補正の確認: 歪んだ写真PDFを「補正の前後で、OCRが読めた行数」で比べる(補正が効いたかを数字で見る)
//   node .claude/skills/pdf-app/scripts/test-warp.js            (先に make-sample-pdfs.js の setup と make-warp-photo.js)
const fs=require('fs');
const {launch,drag,save,WORK}=require('./harness');
const EXPECT=JSON.parse(fs.readFileSync(WORK+'/samples/expect.json','utf8'));
const lcs=(a,b)=>{const m=a.length,n=b.length,d=Array.from({length:m+1},()=>new Array(n+1).fill(0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=a[i-1]===b[j-1]?d[i-1][j-1]+1:Math.max(d[i-1][j],d[i][j-1]);return d[m][n];};
async function ocrScore(page,label){
  await page.click('[data-m=ocr]');await page.click('#bOcrPage');
  await page.waitForFunction(()=>/個のまとまり|認識できません|読み込めません/.test(document.querySelector('#status').textContent),null,{timeout:180000});
  const txt=(await page.locator('.ibox .t').allInnerTexts()).join('').replace(/\s+/g,'');
  let read=0;const miss=[];EXPECT.forEach(e=>{if(lcs(e,txt)/e.length>=0.75)read++;else miss.push(e);});if(miss.length)console.log('    読めない行:',miss.join(' / '));
  console.log('    認識:',txt);console.log(`  ${label}: 読めた行 ${read}/${EXPECT.length}`);return read;
}
async function waitStatus(page,re){await page.waitForFunction(r=>new RegExp(r).test(document.querySelector('#status').textContent),re.source,{timeout:60000});}
(async()=>{
  const {browser,page}=await launch();
  const open=async f=>{await page.reload();await page.waitForTimeout(800);await page.setInputFiles('#fOpen',WORK+'/samples/'+f);await page.waitForTimeout(2200);};

  console.log('【一括: 斜めから撮った写真】');
  await open('photo_persp.pdf');const b1=await ocrScore(page,'補正前');
  await open('photo_persp.pdf');
  await page.click('[data-m=warp]');await page.waitForTimeout(600);
  await page.click('#wAuto');await waitStatus(page,/提案しました|見つけられません/);await page.waitForTimeout(800);
  console.log('  状態:',await page.textContent('#status'));
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_warp_page_edit.png'});
  await page.locator('#wPrev').screenshot({path:WORK+'/shot_warp_page_prev.png'});
  await page.click('#wApply');await waitStatus(page,/補正しました/);await page.waitForTimeout(800);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_warp_page_after.png'});
  const a1=await ocrScore(page,'補正後');

  console.log('【部分: 曲がった紙(範囲を指定して格子点の曲線で伸ばす)】');
  await open('photo_curve.pdf');const b2=await ocrScore(page,'補正前');
  await open('photo_curve.pdf');
  await page.click('[data-m=warp]');await page.click('#wkPart');await page.waitForTimeout(300);
  // 写真の座標(pt): 紙の枠の内側。曲がり方は make-warp-photo.js の A=50px(→ 21pt)の正弦
  const VW=420,VH=588,K0=0.42,AMP=50*K0,xl=40*K0,xr=960*K0,yt=70*K0,yb=1330*K0;
  let ov=await page.locator('#ov').boundingBox(),k=ov.width/VW,scr=(x,y)=>[ov.x+x*k,ov.y+y*k];
  const remeasure=async()=>{ov=await page.locator('#ov').boundingBox();k=ov.width/VW;};   // 状態の文が2行になると画面全体が数px動くので、動かす直前に測り直す
  const dy=x=>AMP*Math.sin(Math.PI*x/VW);
  {const [ax,ay]=scr(xl,yt),[bx,by]=scr(xr,yb);await page.mouse.move(ax,ay);await page.mouse.down();await page.mouse.move(bx,by,{steps:6});await page.mouse.up();await page.waitForTimeout(800);}
  const moveH=async(id,x,y)=>{await remeasure();const bb=await page.locator(`svg.warp circle[data-h="${id}"]`).boundingBox();const [tx,ty]=scr(x,y);await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await page.mouse.down();await page.mouse.move(tx,ty,{steps:5});await page.mouse.up();await page.waitForTimeout(150);};
  // 5×5の格子点を、写真で紙の枠・罫線が通っている場所(縦にずれた分 dy を足した位置)へ動かす。中ほどの点も動かす=中だけの歪みも直せる
  for(let r=0;r<5;r++)for(let c=0;c<5;c++){const x=xl+(xr-xl)*c/4,y=yt+(yb-yt)*r/4+dy(x);await moveH(r+'_'+c,x,y);}
  await page.waitForTimeout(600);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_warp_part_edit.png'});
  await page.locator('#wPrev').screenshot({path:WORK+'/shot_warp_part_prev.png'});
  await page.click('#wApply');await waitStatus(page,/補正しました/);await page.waitForTimeout(800);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_warp_part_after.png'});
  if(process.env.DBG_SEG){const r=await page.evaluate(async()=>{const D=window.pdfEditorDebug,{VW,VH}=D.page(),S=3,cv=await D.ocr.renderRegion(0,0,VW,VH,S);const f=D.ocr.flatten(cv);const sg=D.ocr.segment(cv,S);const w=await D.ocr.lang('jpn');const o=[];for(const i of [2,6]){const c=sg.chunks[i];o.push((await D.ocr.lines(w,c,0,0,S,false)).map(q=>q.words.map(x=>x.str+'@'+Math.round(x.conf)).join('|')));}return{o,f,chunks:sg.chunks.map(c=>[c.x0,c.y0,c.x1,c.y1,c.lines.map(l=>[l.x0,l.y0,l.x1,l.y1,l.n])])};});console.log(JSON.stringify(r));}
  const a2=await ocrScore(page,'補正後');

  console.log(`\n結果: 一括 ${b1}→${a1} / 部分 ${b2}→${a2}(読めた行/${EXPECT.length})`);
  console.log('画像:',WORK+'/shot_warp_*.png');
  await browser.close();
})();
