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
  let read=0;EXPECT.forEach(e=>{if(lcs(e,txt)/e.length>=0.75)read++;});
  console.log(`  ${label}: 読めた行 ${read}/${EXPECT.length}`);return read;
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

  console.log('【部分: 曲がった紙(範囲を指定してベジェ曲線で伸ばす)】');
  await open('photo_curve.pdf');const b2=await ocrScore(page,'補正前');
  await open('photo_curve.pdf');
  await page.click('[data-m=warp]');await page.click('#wkPart');await page.waitForTimeout(300);
  // 写真の座標(pt): 紙の枠の内側。曲がり方は make-warp-photo.js の A=50px(→ 21pt)の正弦
  const VW=420,VH=588,K0=0.42,AMP=50*K0,xl=40*K0,xr=960*K0,yt=70*K0,yb=1330*K0;
  let ov=await page.locator('#ov').boundingBox(),k=ov.width/VW,scr=(x,y)=>[ov.x+x*k,ov.y+y*k];
  const remeasure=async()=>{ov=await page.locator('#ov').boundingBox();k=ov.width/VW;};   // 状態の文が2行になると画面全体が数px動くので、動かす直前に測り直す
  const dy=x=>AMP*Math.sin(Math.PI*x/VW);
  {const [ax,ay]=scr(xl,yt),[bx,by]=scr(xr,yb);await page.mouse.move(ax,ay);await page.mouse.down();await page.mouse.move(bx,by,{steps:6});await page.mouse.up();await page.waitForTimeout(800);}
  const moveH=async(id,x,y)=>{await remeasure();const bb=await page.locator(`svg.warp circle[data-h=${id}]`).boundingBox();const [tx,ty]=scr(x,y);await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await page.mouse.down();await page.mouse.move(tx,ty,{steps:5});await page.mouse.up();await page.waitForTimeout(150);};
  // 四隅は、写真で枠の角がある場所へ(縦にずれている分)
  await moveH('tl',xl,yt+dy(xl));await moveH('tr',xr,yt+dy(xr));await moveH('bl',xl,yb+dy(xl));await moveH('br',xr,yb+dy(xr));
  // 上辺・下辺の曲線: 中央が AMP だけ下にふくらむ → 制御点は 端+(ふくらみ/0.75)
  const bulge=(y0,xa,xb)=>{const ya=y0+dy(xa),yb2=y0+dy(xb),ends=(ya+yb2)/2,peak=y0+AMP;return ends+(peak-ends)/0.75;};
  const cyT=bulge(yt,xl,xr),cyB=bulge(yb,xl,xr);
  await moveH('top0',xl+(xr-xl)/3,cyT);await moveH('top1',xl+2*(xr-xl)/3,cyT);
  await moveH('bot0',xl+(xr-xl)/3,cyB);await moveH('bot1',xl+2*(xr-xl)/3,cyB);
  await page.waitForTimeout(600);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_warp_part_edit.png'});
  await page.locator('#wPrev').screenshot({path:WORK+'/shot_warp_part_prev.png'});
  await page.click('#wApply');await waitStatus(page,/補正しました/);await page.waitForTimeout(800);
  await page.locator('#pagewrap').screenshot({path:WORK+'/shot_warp_part_after.png'});
  const a2=await ocrScore(page,'補正後');

  console.log(`\n結果: 一括 ${b1}→${a1} / 部分 ${b2}→${a2}(読めた行/${EXPECT.length})`);
  console.log('画像:',WORK+'/shot_warp_*.png');
  await browser.close();
})();
