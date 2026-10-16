// 「模様入りの背景のスキャン」を再現するPDFを作る(OCRの背景処理・隠す色の確認用)。出力: $PDFAPP_WORK/samples/scan_pattern.pdf
// 事前に make-sample-pdfs.js を実行しておく(form.pdf と formimg-1.png を使う)
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument}=require(LIB+'pdf-lib');
(async()=>{
  const {browser,page}=await launch();
  const b64=fs.readFileSync(WORK+'/samples/formimg-1.png').toString('base64');
  const url=await page.evaluate(async b64=>{
    const im=new Image();im.src='data:image/png;base64,'+b64;await im.decode();
    const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const cx=cv.getContext('2d');
    cx.drawImage(im,0,0);const d=cx.getImageData(0,0,cv.width,cv.height),a=d.data;
    for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++){
      const i=(y*cv.width+x)*4,base=a[i]/255;                          // 文字・罫線=0(黒)、紙=1
      const pat=0.82+0.18*Math.abs(Math.sin(x/9)*Math.sin(y/9))+((x*7+y*13)%11)/200; // 花のような薄い模様+ノイズ
      a[i]=Math.min(255,255*base*pat);a[i+1]=Math.min(255,238*base*pat);a[i+2]=Math.min(255,200*base*pat); // 黄みがかった紙
    }
    cx.putImageData(d,0,0);
    // 文字のすぐ上に太い黒い罫線(隠す色の推定が罫線に引っ張られるかの確認用): 値の列の「坂口 誠」の真上
    cx.fillStyle='#111';cx.fillRect(Math.round(cv.width*0.52),Math.round(cv.height*0.468),Math.round(cv.width*0.42),9);
    return cv.toDataURL('image/png');
  },b64);
  await browser.close();
  const d=await PDFDocument.create();const png=await d.embedPng(Buffer.from(url.split(',')[1],'base64'));
  const p=d.addPage([420,300]);p.drawImage(png,{x:0,y:0,width:420,height:300});
  fs.writeFileSync(WORK+'/samples/scan_pattern.pdf',await d.save());
  console.log('OK:',WORK+'/samples/scan_pattern.pdf');
})();
