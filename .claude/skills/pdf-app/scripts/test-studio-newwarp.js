// 整形の新しい考え方: 何を(元の形)→どこへ(行き先)→補正する。自由な形を、形ごと動かす / 移し先の点を動かして曲げる
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/newwarp_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([595,842]);
   p.drawRectangle({x:100,y:842-200,width:100,height:100,color:rgb(1,0,0)});   // 赤い四角(100〜200,100〜200)
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const red=png=>execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${png}').convert('RGB');W,H=a.size;px=a.load()
l=[(x,y) for x in range(0,W,1) for y in range(0,H,1) if px[x,y][0]>200 and px[x,y][1]<60 and px[x,y][2]<60]
print(len(l),min(p[0] for p in l) if l else 0,min(p[1] for p in l) if l else 0,max(p[0] for p in l) if l else 0,max(p[1] for p in l) if l else 0)"`).toString().trim().split(' ').map(Number);
  const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3500);await page.frameLocator('#formFrame').locator('#shapeSeg button[data-t=warp]').click({timeout:1500}).catch(()=>{});await page.waitForTimeout(1500);
    return{fr:page.frameLocator('#formFrame'),f:page.frames().find(x=>x!==page.mainFrame())};};
  // --- 自由な形: なぞって囲む → 緑の形をドラッグで動かす → 補正する
  let {fr,f}=await open();
  ok('「何を」に 自由な形 がある',await fr.locator('#wkFree').isVisible());
  await fr.locator('#wkFree').click();await page.waitForTimeout(300);
  const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595,X=v=>ob.x+v*k,Y=v=>ob.y+v*k;
  // 赤い四角を囲む三角形(なぞる)
  const tri=[[90,90],[260,90],[90,260],[90,92]];
  await page.mouse.move(X(tri[0][0]),Y(tri[0][1]));await page.mouse.down();
  for(const t of tri.slice(1))await page.mouse.move(X(t[0]),Y(t[1]),{steps:8});
  await page.mouse.up();await page.waitForTimeout(600);
  let st=await f.evaluate(()=>window.pdfEditorDebug.warpState());
  ok('なぞった形ができる(kind=free)',st&&st.kind==='free');
  // 緑の形の中をつかんで、右へ200pt・下へ100pt動かす(緑の形の中=三角形の内側。赤い四角の中心近く)
  await page.mouse.move(X(130),Y(130));await page.mouse.down();await page.mouse.move(X(330),Y(230),{steps:8});await page.mouse.up();await page.waitForTimeout(500);
  await fr.locator('#wApply').click();await page.waitForTimeout(6000);await fr.locator('#embSave').click();await page.waitForTimeout(3000);
  fs.writeFileSync('/tmp/newwarp_out.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));
  execSync('pdftoppm -r 72 -png -singlefile /tmp/newwarp_out.pdf /tmp/newwarp_out');
  let r=red('/tmp/newwarp_out.png');
  console.log('   赤の範囲',r);
  ok('赤い四角の三角形の部分が、右下へ動いた',r[0]>8000&&r[3]>=390&&r[4]>=290);
  const px=execSync(`python3 -W ignore -c "from PIL import Image;a=Image.open('/tmp/newwarp_out.png').convert('RGB');print(a.getpixel((110,110))[1])"`).toString().trim();ok('元の場所(三角形の中)の赤は消えている: G='+px,+px>240);
  // --- 範囲をドラッグ(四角)→頂点の増減→対角線の交点が基準点
  ({fr,f}=await open());await fr.locator('#wkFree').click();await page.waitForTimeout(300);
  {const ob2=await fr.locator('#ov').boundingBox(),k2=ob2.width/595,X2=v=>ob2.x+v*k2,Y2=v=>ob2.y+v*k2;
   await page.mouse.move(X2(100),Y2(100));await page.mouse.down();await page.mouse.move(X2(300),Y2(200),{steps:8});await page.mouse.up();await page.waitForTimeout(500);
   let fs0=await f.evaluate(()=>window.pdfEditorDebug.freeState());
   ok('まっすぐドラッグすると、四角(頂点4つ)になる',fs0&&fs0.n===4);
   ok('基準点は、対角線の交点(四角の真ん中): '+fs0.ctr,Math.abs(fs0.ctr[0]-200)<1.5&&Math.abs(fs0.ctr[1]-150)<1.5);
   // 辺の○を引いて、頂点を増やす
   const add=fr.locator('circle[data-add="0"]');const ab=await add.boundingBox();
   await page.mouse.move(ab.x+ab.width/2,ab.y+ab.height/2);await page.mouse.down();await page.mouse.move(ab.x+ab.width/2,ab.y+ab.height/2-30,{steps:5});await page.mouse.up();await page.waitForTimeout(400);
   fs0=await f.evaluate(()=>window.pdfEditorDebug.freeState());ok('辺の○を引くと、頂点が増える(5つ)',fs0.n===5);
   // 頂点をダブルタップで減らす
   await fr.locator('circle[data-h="f1"]').dblclick();await page.waitForTimeout(400);
   fs0=await f.evaluate(()=>window.pdfEditorDebug.freeState());ok('頂点をダブルタップすると、減る(4つ)',fs0.n===4);
   // 動かし方: 3つの選び方が出る
   ok('どこへ: 全体をそのまま / 頂点を別々に / 中の点を',await fr.locator('#wmAll').isVisible()&&await fr.locator('#wmVert').isVisible()&&await fr.locator('#wmMid').isVisible());
   // 頂点を別々に動かす(緑の点を1つ引く)→ 他の頂点は動かない
   await fr.locator('#wmVert').click();await page.waitForTimeout(400);
   const gv=fr.locator('circle[data-g="v2"]');const gb=await gv.boundingBox();
   await page.mouse.move(gb.x+gb.width/2,gb.y+gb.height/2);await page.mouse.down();await page.mouse.move(gb.x+gb.width/2+40,gb.y+gb.height/2+40,{steps:6});await page.mouse.up();await page.waitForTimeout(400);
   fs0=await f.evaluate(()=>window.pdfEditorDebug.freeState());ok('頂点を別々に動かすと、動かした記録になる',fs0.off===true&&fs0.fmode==='vert');
   await fr.locator('#wApply').click();await page.waitForTimeout(7000);await fr.locator('#embSave').click();await page.waitForTimeout(3000);
   fs.writeFileSync('/tmp/newwarp_o3.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync('pdftoppm -r 72 -png -singlefile /tmp/newwarp_o3.pdf /tmp/newwarp_o3');
   const r3=red('/tmp/newwarp_o3.png');console.log('   頂点別の仕上がり',r3);ok('頂点を別々に動かして補正できる(赤が残り、形が伸びた)',r3[0]>5000&&r3[0]!==0);}
  // --- 中の点を動かす
  ({fr,f}=await open());await fr.locator('#wkFree').click();await page.waitForTimeout(300);
  {const ob2=await fr.locator('#ov').boundingBox(),k2=ob2.width/595,X2=v=>ob2.x+v*k2,Y2=v=>ob2.y+v*k2;
   await page.mouse.move(X2(80),Y2(80));await page.mouse.down();await page.mouse.move(X2(220),Y2(220),{steps:8});await page.mouse.up();await page.waitForTimeout(500);
   await fr.locator('#wmMid').click();await page.waitForTimeout(400);
   const gi=fr.locator('circle[data-g="i0"]');ok('中の点(基準点)が出る',await gi.count()===1);
   const gb=await gi.boundingBox();await page.mouse.move(gb.x+gb.width/2,gb.y+gb.height/2);await page.mouse.down();await page.mouse.move(gb.x+gb.width/2+30,gb.y+gb.height/2+30,{steps:6});await page.mouse.up();await page.waitForTimeout(400);
   ok('中の点を動かすと、頂点は動かない',(await f.evaluate(()=>window.pdfEditorDebug.freeState())).off===true);
   await fr.locator('#wApply').click();await page.waitForTimeout(7000);
   ok('中の点を動かして補正できる(エラーなし)',errs.length===0);}
  // --- 多すぎる頂点は、30個くらいに自動でまとめる
  ({fr,f}=await open());await fr.locator('#wkFree').click();await page.waitForTimeout(300);
  {const ob2=await fr.locator('#ov').boundingBox(),k2=ob2.width/595,X2=v=>ob2.x+v*k2,Y2=v=>ob2.y+v*k2;
   await page.mouse.move(X2(300),Y2(150));await page.mouse.down();
   for(let i=1;i<=120;i++){const a=i/120*Math.PI*2,r=60+25*Math.sin(a*9);await page.mouse.move(X2(300+r*Math.cos(a)),Y2(250+r*Math.sin(a)));}
   await page.mouse.up();await page.waitForTimeout(500);
   const n=(await f.evaluate(()=>window.pdfEditorDebug.freeState())||{}).n;ok('ぐるっと囲んだ複雑な形は、30個以下の頂点になる: '+n,n>=5&&n<=30);}
  // --- 最初は機能の選択だけ → 選ぶと、その機能と「戻る」
  await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3500);
  {const fr2=page.frameLocator('#formFrame');
   ok('最初は機能の選択だけ(操作は出ない)',await fr2.locator('#shapeSeg').isVisible()&&!(await fr2.locator('#optWarp').isVisible())&&!(await fr2.locator('#shBack').isVisible()));
   await fr2.locator('#shapeSeg [data-t=rot]').click();await page.waitForTimeout(500);
   ok('選ぶと、その機能の操作と「戻る」が出て、選択は隠れる',await fr2.locator('#optRot').isVisible()&&await fr2.locator('#shBack').isVisible()&&!(await fr2.locator('#shapeSeg').isVisible()));
   await fr2.locator('#shBack').click();await page.waitForTimeout(400);
   ok('戻るで、機能の選択に戻る',await fr2.locator('#shapeSeg').isVisible()&&!(await fr2.locator('#optRot').isVisible()));}
  // --- 移し先の点を動かす: 元の点は動かさず、行き先だけ変える
  ({fr,f}=await open());
  await f.evaluate(()=>window.pdfEditorDebug.warpSetDg(2,2,0.5,0.7));await page.waitForTimeout(500);
  ok('移し先の点を動かすと、行き先だけ変わる(元の青い点は動かない)',await f.evaluate(()=>window.pdfEditorDebug.warpDgOn())&&await f.evaluate(()=>{const G=window.pdfEditorDebug.warpG();return Math.abs(G[2][2][0]-G[0][0][0]-(G[0][4][0]-G[0][0][0])/2)<1;}));
  const dot=await fr.locator('circle[data-d="2_2"]').count();ok('緑の点が見える',dot===1);
  const run=async(dg)=>{({fr,f}=await open());if(dg)await f.evaluate(()=>{window.pdfEditorDebug.warpSetDg(1,1,0.25,0.5);window.pdfEditorDebug.warpSetDg(1,2,0.5,0.5);window.pdfEditorDebug.warpSetDg(1,3,0.75,0.5);});
    await page.waitForTimeout(500);await fr.locator('#wApply').click();await page.waitForTimeout(7000);await fr.locator('#embSave').click();await page.waitForTimeout(3000);
    fs.writeFileSync('/tmp/newwarp_o2.pdf',Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync('pdftoppm -r 72 -png -singlefile /tmp/newwarp_o2.pdf /tmp/newwarp_o2');return red('/tmp/newwarp_o2.png');};
  const r0=await run(false),r1=await run(true);console.log('   標準',r0,'移し先の点を動かした',r1);
  ok('移し先の点を動かして補正すると、仕上がりが変わる',r1[0]>1000&&(Math.abs(r1[2]-r0[2])>8||Math.abs(r1[4]-r0[4])>8));
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(allOk&&!errs.length?0:1);
})();
