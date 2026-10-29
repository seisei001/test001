// 歪み補正(部分): 元の範囲と、貼り付け先を別々に指定できる(緑の四角形)。元の場所は消す/残すを選べる
//   node .claude/skills/pdf-app/scripts/test-studio-warpdst.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib');
(async()=>{
  const src='/tmp/warpdst_src.pdf';
  {const d=await PDFDocument.create(),p=d.addPage([595,842]);
   p.drawRectangle({x:100,y:842-150,width:50,height:50,color:rgb(1,0,0)});   // 赤い四角(左上のほう)
   p.drawRectangle({x:116,y:842-134,width:18,height:18,color:rgb(0,0,1)});   // 中に青い四角
   fs.writeFileSync(src,await d.save());}
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  const bbox=(png)=>execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('${png}').convert('RGB');W,H=a.size;px=a.load()
def bb(f):
  l=[(x,y) for x in range(W) for y in range(H) if f(px[x,y])]
  return (len(l),min(p[0] for p in l),min(p[1] for p in l),max(p[0] for p in l),max(p[1] for p in l)) if l else (0,)
print(bb(lambda c:c[0]>200 and c[1]<60 and c[2]<60),bb(lambda c:c[2]>200 and c[0]<60 and c[1]<60))"`).toString().trim();
  for(const erase of [true,false]){
    await page.reload();await page.waitForTimeout(2300);
    await page.setInputFiles('#fAdd',[src]);await page.waitForTimeout(1800);
    await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'歪み補正'}).click();await page.waitForTimeout(3500);
    const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
    await fr.locator('#wkPart').click();await page.waitForTimeout(300);
    const ob=await fr.locator('#ov').boundingBox(),k=ob.width/595;
    const X=v=>ob.x+v*k,Y=v=>ob.y+v*k;
    await page.mouse.move(X(90),Y(90));await page.mouse.down();await page.mouse.move(X(160),Y(160),{steps:8});await page.mouse.up();await page.waitForTimeout(1200);
    ok('緑の貼り付け先の枠が出る',await fr.locator('svg.warp polygon').count()===1);
    ok('「元の場所は消す」の欄が出る',await fr.locator('#wEraseLbl').isVisible());
    if(!erase)await fr.locator('#wErase').uncheck();
    // 緑の枠の中(赤い四角の外側の角の近く)をつかんで、右へ 200pt、下へ 100pt 動かす
    await page.mouse.move(X(116),Y(116));await page.mouse.down();await page.mouse.move(X(316),Y(216),{steps:8});await page.mouse.up();await page.waitForTimeout(1200);
    console.log('   緑の枠:',JSON.stringify(await f.evaluate(()=>window.pdfEditorDebug.warpDst())));
    await fr.locator('#wApply').click();await page.waitForTimeout(6000);
    const u=await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)));fs.writeFileSync('/tmp/warpdst_out.pdf',Buffer.from(u));
    execSync('pdftoppm -r 72 -png -singlefile /tmp/warpdst_out.pdf /tmp/warpdst_out');
    const r=bbox('/tmp/warpdst_out.png');console.log('   erase='+erase,r);
    const m=r.match(/\((\d+), (\d+), (\d+), (\d+), (\d+)\) \((\d+), (\d+), (\d+), (\d+), (\d+)\)/);
    if(erase){
      ok('赤い四角は、右下へ動いた場所にある(元の場所には無い)',!!m&&+m[2]>=290&&+m[3]>=190&&+m[4]<=360&&+m[5]<=260);
      ok('中の青い四角も、一緒に動いた',!!m&&+m[7]>=300&&+m[8]>=200&&+m[9]<=345&&+m[10]<=245);
      ok('大きさは、ほぼ元のまま(約50pt)',!!m&&Math.abs((+m[4]-+m[2])-50)<=6&&Math.abs((+m[5]-+m[3])-50)<=6);
    }else{
      ok('元の場所にも赤が残り、動いた場所にもある(赤い画素が約2倍)',!!m&&+m[1]>2*2000*0.9);
    }
  }
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
