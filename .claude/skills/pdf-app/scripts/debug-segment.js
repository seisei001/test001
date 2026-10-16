// 画像解析(文字の塊の見つけ方)を目で確かめる: ページを描画→(背景処理)→塊に分け、塊と行の枠を画像に描いて保存する
//   node .claude/skills/pdf-app/scripts/debug-segment.js [PDFファイル] [出力PNG]
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
(async()=>{
  const pdf=process.argv[2]||WORK+'/samples/receipt.pdf',out=process.argv[3]||WORK+'/shot_segment.png';
  const {browser,page}=await launch();
  await page.setInputFiles('#fOpen',pdf);await page.waitForTimeout(2500);
  const r=await page.evaluate(async()=>{
    const D=window.pdfEditorDebug.ocr,VW=+document.querySelector('#stage').width/1; 
    const S=3,cv=await D.renderRegion(0,0,9999,9999,S).catch(()=>null);
    return null;
  }).catch(()=>null);
  const res=await page.evaluate(async()=>{
    const D=window.pdfEditorDebug.ocr;
    const info=window.pdfEditorDebug.page();            // {VW,VH}
    const S=Math.min(4,Math.max(2.5,2600/Math.max(info.VW,info.VH)));
    const cv=await D.renderRegion(0,0,info.VW,info.VH,S);
    const flat=D.flatten(cv);
    const seg=D.segment(cv,S);
    const g=cv.getContext('2d');g.lineWidth=2;
    seg.chunks.forEach((c,i)=>{c.lines.forEach(l=>{g.strokeStyle='rgba(0,160,0,.9)';g.strokeRect(l.x0,l.y0,l.x1-l.x0,l.y1-l.y0);});g.strokeStyle='rgba(220,0,0,.95)';g.lineWidth=3;g.strokeRect(c.x0,c.y0,c.x1-c.x0,c.y1-c.y0);g.lineWidth=2;});
    g.fillStyle='#00f';seg.hrules.forEach(r=>g.fillRect(r.x0,r.y-1,r.x1-r.x0,3));seg.vrules.forEach(r=>g.fillRect(r.x-1,r.y0,3,r.y1-r.y0));
    return{png:cv.toDataURL('image/png'),flat,chunks:seg.chunks.length,lines:seg.chunks.reduce((a,c)=>a+c.lines.length,0),S,w:cv.width,h:cv.height};
  });
  fs.writeFileSync(out,Buffer.from(res.png.split(',')[1],'base64'));
  console.log(`背景処理: ${res.flat?'した':'しない'} / 塊 ${res.chunks}個 / 行 ${res.lines}本 / 倍率 ${res.S.toFixed(2)} / 画像 ${res.w}x${res.h} →`,out,'(赤=塊、緑=行、青=罫線)');
  await browser.close();
})();
