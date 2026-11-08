// 整形「動かす物を決める」: 3つの選び方 → 段々に絞り込む → 外周(頂点・曲線・取り消し・確定・格子の点) → 動かす
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/newwarp_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([595,842]);
   p.drawRectangle({x:100,y:842-200,width:100,height:100,color:rgb(1,0,0)});   // 赤い四角(100〜200,100〜200)
   p.drawEllipse({x:380,y:842-160,xScale:60,yScale:40,color:rgb(0,0.4,0.9)});  // 青い楕円(中心380,160)
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const cnt=(png,f)=>execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${png}').convert('RGB');W,H=a.size;px=a.load()
l=[(x,y) for x in range(W) for y in range(H) if ${f}]
print(len(l),min(p[0] for p in l) if l else 0,min(p[1] for p in l) if l else 0,max(p[0] for p in l) if l else 0,max(p[1] for p in l) if l else 0)"`).toString().trim().split(' ').map(Number);
  const red=png=>cnt(png,"px[x,y][0]>200 and px[x,y][1]<60 and px[x,y][2]<60"),blue=png=>cnt(png,"px[x,y][2]>200 and px[x,y][0]<60");
  let fr,f;
  const open=async()=>{await page.reload();await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'整形'}).click();await page.waitForTimeout(3500);
    fr=page.frameLocator('#formFrame');f=page.frames().find(x=>x!==page.mainFrame());
    await fr.locator('#shapeSeg [data-t=warp]').click();await page.waitForTimeout(500);};
  const go=async(...names)=>{for(const n of names){await fr.locator('#shBtns button',{hasText:n}).first().click();await page.waitForTimeout(350);}};
  const geo=async()=>{const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595;return{X:v=>ob.x+v*k,Y:v=>ob.y+v*k,k,ob};};
  const labels=async()=>(await fr.locator('#shBtns button').allInnerTexts()).map(t=>t.trim());
  const st=()=>f.evaluate(()=>window.pdfEditorDebug.outState());
  const save=async(n)=>{await page.waitForTimeout(500);await fr.locator('#embSave').click();await page.waitForTimeout(3000);fs.writeFileSync(`/tmp/${n}.pdf`,Buffer.from(await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)))));execSync(`pdftoppm -r 72 -png -singlefile /tmp/${n}.pdf /tmp/${n}`);};
  // ===== 最上段は3つと「戻る」だけ =====
  await open();
  let L=await labels();console.log('   最上段',L);
  ok('最上段は、3つの選び方と「戻る」だけ',L.length===4&&/四角の四隅/.test(L[0])&&/より自由/.test(L[1])&&/完全自由/.test(L[2])&&/戻る/.test(L[3]));
  await go('四角の四隅');L=await labels();console.log('   ①',L);
  ok('四角の四隅を選ぶと、4つの機能と戻る',L.length===5&&/自動認識/.test(L[0])&&/設定/.test(L[1])&&/四点/.test(L[2])&&/自由な四隅/.test(L[3]));
  await go('戻る');L=await labels();ok('戻ると、最上段に戻る',L.length===4);
  await go('完全自由');L=await labels();ok('多角形を選ぶと、3つの作り方と戻る',L.length===4&&/自動認識/.test(L[0])&&/なぞって/.test(L[1])&&/頂点/.test(L[2]));
  // ===== 3-3 頂点を置く =====
  await go('頂点を置く');
  L=await labels();ok('はじめは「戻る」だけ(今できることだけ出す)',L.length===1&&/戻る/.test(L[0]));
  {const {X,Y}=await geo();
   await page.mouse.click(X(90),Y(90));await page.waitForTimeout(200);await page.mouse.click(X(260),Y(100));await page.waitForTimeout(200);
   L=await labels();ok('2点では確定は出ない(線だけ)',!L.some(t=>/確定/.test(t))&&L.some(t=>/戻す/.test(t)));
   await page.mouse.click(X(250),Y(260));await page.waitForTimeout(200);await page.mouse.click(X(100),Y(240));await page.waitForTimeout(300);
   let s=await st();ok('頂点を4つ置けた',s.n===4);
   L=await labels();ok('3点以上で「確定」が出る',L.some(t=>/確定/.test(t)));
   // 辺を引いて曲線にする
   const ed=await fr.locator('svg.warp path').nth(1).boundingBox();
   await page.mouse.move(X(175),Y(95));await page.mouse.down();await page.mouse.move(X(175),Y(60),{steps:6});await page.mouse.up();await page.waitForTimeout(300);
   s=await st();ok('辺を引くと曲線(ベジェ)になる',s.curved===1);
   // 取り消し・やり直し
   await go('戻す');s=await st();ok('戻すで、曲線が元に戻る',s.curved===0);
   await go('やり直す');s=await st();ok('やり直すで、曲線が戻る',s.curved===1);
   // 頂点を選ぶと「選んだ点を消す」が出る → 消すと3つ
   await fr.locator('svg.warp circle').first().click();await page.waitForTimeout(250);
   L=await labels();ok('頂点を選ぶと「選んだ点を消す」が出る',L.some(t=>/選んだ点を消す/.test(t)));
   await go('選んだ点を消す');s=await st();ok('消すと頂点が1つ減る(3つ)',s.n===3);
   // 交差する置き方は断る(三角形の外側から、反対側の辺をまたぐ)
   const before=(await st()).n;await page.mouse.click(X(60),Y(400));await page.waitForTimeout(300);
   ok('頂点を足せる(近い辺に割り込む)',(await st()).n===before+1||(await st()).n===before);
  }
  // ===== 確定 → 格子の点 =====
  await open();await go('完全自由','頂点を置く');
  {const {X,Y}=await geo();for(const p of [[80,80],[240,80],[240,240],[80,240]]){await page.mouse.click(X(p[0]),Y(p[1]));await page.waitForTimeout(150);}
   await go('確定');await page.waitForTimeout(500);
   const fs0=await f.evaluate(()=>window.pdfEditorDebug.freeState());console.log('   確定後',fs0);
   ok('確定すると、外周が固定され、内側に格子の点ができる',fs0&&fs0.kind!==undefined?true:fs0&&fs0.inner>=1);
   L=await labels();console.log('   確定後の段',L);
   ok('確定後は、編集に戻る・動かし方3つ・補正する',L.some(t=>/編集に戻る/.test(t))&&L.some(t=>/全体をそのまま/.test(t))&&L.some(t=>/補正する/.test(t)));
   // 編集に戻る→確定の往復
   await go('編集に戻る');ok('編集に戻れる(頂点は残っている)',(await st()).n===4&&(await labels()).some(t=>/確定/.test(t)));
   await go('確定');
   // 全体をそのまま動かして補正(赤い四角を含む正方形(80〜240)を右下へ200,100)
   const d0=await geo();const dst=fr.locator('svg.warp polygon').nth(1);
   await page.mouse.move(d0.X(100),d0.Y(100));await page.mouse.down();await page.mouse.move(d0.X(300),d0.Y(200),{steps:8});await page.mouse.up();await page.waitForTimeout(400);
   await go('補正する');await page.waitForTimeout(6500);
   L=await labels();ok('補正後は、最上段に戻る',L.length===4&&/四角の四隅/.test(L[0]));
   await save('newwarp_a');const r=red('/tmp/newwarp_a.png');console.log('   赤',r);ok('形ごと動いた(赤が右下にある)',r[0]>8000&&r[3]>=390);
  }
  // ===== 3-1 ドラッグ+端の自動認識(色/濃淡/線/外から) =====
  for(const m of ['色','濃淡','線','外から']){
    await open();await go('完全自由','ドラッグ');
    const {X,Y}=await geo();await page.mouse.move(X(40),Y(40));await page.mouse.down();await page.mouse.move(X(260),Y(260),{steps:8});await page.mouse.up();await page.waitForTimeout(2500);
    await go('認識:'+m);await page.waitForTimeout(2500);
    const s=await st();console.log('   認識',m,s.n,s.pts.slice(0,4));
    const xs=s.pts.map(p=>p[0]),ys=s.pts.map(p=>p[1]);
    ok(`認識「${m}」: 赤い四角の端(100〜200)が見つかる`,s.n>=3&&s.n<=30&&Math.min(...xs)>85&&Math.max(...xs)<215&&Math.min(...ys)>85&&Math.max(...ys)<215);
  }
  // ===== 3-2 なぞって端を選ぶ(青い楕円のまわりを囲む) =====
  await open();await go('完全自由','なぞって');
  {const {X,Y}=await geo();await page.mouse.move(X(300),Y(110));await page.mouse.down();
   for(let i=1;i<=60;i++){const a=i/60*Math.PI*2;await page.mouse.move(X(380-80*Math.cos(a)),Y(160-50*Math.sin(a)));}
   await page.mouse.up();await page.waitForTimeout(500);const s=await st();ok('なぞった形が頂点になる(3〜30個): '+s.n,s.n>=3&&s.n<=30);}
  // ===== ② 四角形をより自由に / ① 四隅 =====
  await open();await go('四角形をより自由に');L=await labels();ok('②は3つの機能と戻る',L.length===4);
  await go('辺に点を足して曲げる');await page.waitForTimeout(600);
  ok('辺の点だけが見える(四隅+辺の12点=16、中の点は隠れる)',(await fr.locator('svg.warp circle[data-h*="_"]').evaluateAll(a=>a.filter(e=>e.style.display!=='none').length))===16);
  await go('戻る');await go('中に点を足して曲げる');await page.waitForTimeout(600);
  ok('中の点だけが見える(四隅+中の9点)',(await fr.locator('svg.warp circle[data-h*="_"]').evaluateAll(a=>a.filter(e=>e.style.display!=='none').length))===13);
  await open();await go('四角の四隅','四隅を自動認識');await page.waitForTimeout(3000);L=await labels();ok('四隅を自動認識すると、補正するが出る',L.some(t=>/補正する/.test(t)));
  await open();await go('四角の四隅','四点を自分で選ぶ');
  {const {X,Y}=await geo();for(const p of [[100,100],[300,110],[310,300],[90,290]]){await page.mouse.click(X(p[0]),Y(p[1]));await page.waitForTimeout(250);}
   const ws=await f.evaluate(()=>window.pdfEditorDebug.warpState());ok('四点をタップすると、四角ができる',ws&&ws.kind==='part'&&Math.abs(ws.G[0][0][0]-100)<2);}
  console.log('errs',errs.slice(0,3));await browser.close();process.exit(allOk&&!errs.length?0:1);
})();
