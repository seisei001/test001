// ページ編集: スクリーンショット(クリップボードの画像)を貼る。縦横比はそのまま、拡大・縮小しても縦横比は変わらない
//   node .claude/skills/pdf-app/scripts/test-studio-paste.js
process.env.PDFAPP_TARGET='pdf-studio';
const fs=require('fs'),{execSync}=require('child_process');
const {launch,WORK}=require('./harness');
const S=WORK+'/samples/';
(async()=>{
  execSync(`python3 -W ignore -c "
from PIL import Image,ImageDraw
im=Image.new('RGB',(600,200),(255,0,0));d=ImageDraw.Draw(im);d.rectangle([300,0,600,200],fill=(0,0,255));im.save('/tmp/shot.png')"`);
  const b64=fs.readFileSync('/tmp/shot.png').toString('base64');
  const {browser,page}=await launch();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
  let allOk=true;const ok=(l,c)=>{console.log((c?'OK  ':'NG  ')+l);if(!c)allOk=false;};
  await page.waitForTimeout(2300);await page.setInputFiles('#fAdd',[S+'studio_A4.pdf']);await page.waitForTimeout(1800);
  await page.locator('.card').first().locator('.mnb').click();await page.locator('#menuBtns button',{hasText:'ページ編集'}).click();await page.waitForTimeout(3500);
  const fr=page.frameLocator('#formFrame'),f=page.frames().find(x=>x!==page.mainFrame());
  // Ctrl+V の貼り付け(クリップボードに画像)
  await f.evaluate(async b64=>{const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    const file=new File([u],'shot.png',{type:'image/png'}),dt=new DataTransfer();dt.items.add(file);
    document.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));},b64);
  await page.waitForTimeout(1200);
  let it=(await f.evaluate(()=>window.pdfEditorDebug.items())).pop();
  ok('画像の部品ができた: '+(it&&it.type),it&&it.type==='img');
  ok('縦横比がスクリーンショットのまま(3:1): '+(it.vw/it.vh).toFixed(3),Math.abs(it.vw/it.vh-3)<0.02);
  const pg=await f.evaluate(()=>window.pdfEditorDebug.page());
  ok('ページの中に収まっている',it.vx>=0&&it.vy>=0&&it.vx+it.vw<=pg.VW+0.5&&it.vy+it.vh<=pg.VH+0.5);
  // 角(⇲)をドラッグして拡大。縦横比は変わらない
  const rs=fr.locator('#ov .ibox.on .hdl.rs').first();await rs.waitFor({timeout:5000});
  const bb=await rs.boundingBox(),cx=bb.x+bb.width/2,cy=bb.y+bb.height/2,w0=it.vw;
  await page.mouse.move(cx,cy);await page.mouse.down();await page.mouse.move(cx+40,cy+5,{steps:6});await page.mouse.up();await page.waitForTimeout(500);
  it=(await f.evaluate(()=>window.pdfEditorDebug.items())).pop();
  ok('大きくなった: '+w0.toFixed(1)+' → '+it.vw.toFixed(1),it.vw>w0*1.1);
  ok('縦横比は変わらない(3:1): '+(it.vw/it.vh).toFixed(3),Math.abs(it.vw/it.vh-3)<0.02);
  const bb2=await rs.boundingBox(),cx2=bb2.x+bb2.width/2,cy2=bb2.y+bb2.height/2;
  await page.mouse.move(cx2,cy2);await page.mouse.down();await page.mouse.move(cx2-30,cy2-20,{steps:6});await page.mouse.up();await page.waitForTimeout(500);
  const it2=(await f.evaluate(()=>window.pdfEditorDebug.items())).pop();
  ok('縮小もできて、縦横比は変わらない: '+it2.vw.toFixed(1)+'x'+it2.vh.toFixed(1),it2.vw<it.vw&&Math.abs(it2.vw/it2.vh-3)<0.02);
  // 保存して、PDFに入った画像の縦横比を確かめる
  await fr.locator('#embSave').click();await page.waitForTimeout(3000);
  const u=await page.evaluate(()=>Array.from(window.pdfStudioDebug.bytes(0)));fs.writeFileSync('/tmp/paste_out.pdf',Buffer.from(u));
  execSync('pdftoppm -r 72 -png -f 1 -l 1 -singlefile /tmp/paste_out.pdf /tmp/paste_out');
  const r=execSync(`python3 -W ignore -c "
from PIL import Image
a=Image.open('/tmp/paste_out.png').convert('RGB');W,H=a.size;px=a.load()
def bb(f):
  l=[(x,y) for x in range(W) for y in range(H) if f(px[x,y])]
  return (len(l),min(p[0] for p in l),min(p[1] for p in l),max(p[0] for p in l),max(p[1] for p in l)) if l else (0,0,0,0,0)
r=bb(lambda c:c[0]>200 and c[1]<60 and c[2]<60);b=bb(lambda c:c[2]>200 and c[0]<60 and c[1]<60)
print(r[1],r[2],r[3],r[4],b[1],b[2],b[3],b[4])"`).toString().trim().split(' ').map(Number);
  const [rx0,ry0,rx1,ry1,bx0,by0,bx1,by1]=r;const w=bx1-rx0+1,h=Math.max(ry1,by1)-Math.min(ry0,by0)+1;
  ok('PDFの中でも、赤が左・青が右で、縦横比は3:1(幅'+w+' 高さ'+h+')',rx1<bx0+3&&Math.abs(w/h-3)<0.15);
  ok('エラーなし '+errs.join('|'),!errs.length);
  await browser.close();process.exit(allOk?0:1);
})();
