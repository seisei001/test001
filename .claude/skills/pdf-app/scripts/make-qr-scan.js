// 本物の二次元コード(QR)と文字がまざったスキャンを作る(コードを数字・文字と読み間違えないかの確認用)。出力: samples/qr_scan.pdf と qr_truth.json
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit'),QR=require(LIB+'qrcode');
const OUT=path.join(WORK,'samples'),FONT=LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf',W=595,H=842;
(async()=>{
  const d=await PDFDocument.create();d.registerFontkit(fontkit);const f=await d.embedFont(fs.readFileSync(FONT),{subset:false}),p=d.addPage([W,H]);
  const T=[];const text=(name,s,x,base,size)=>{p.drawText(s,{x,y:H-base,size,font:f});const w=f.widthOfTextAtSize(s,size);T.push({name,size,lh:1.3,align:'left',x0:x,x1:x+w,top:base-size*0.9,bottom:base+size*0.25,lines:[s]});};
  text('title','税務代理権限証書',60,70,14);text('l1','氏名又は名称',60,130,9);text('l2','電話番号',60,160,9);text('l3','提出年月日',60,190,9);
  for(const [i,[x,y,sz,msg]] of [[480,20,70,'NTAOSOZ074010010'],[380,300,60,'https://example.com/form?id=123456'],[60,500,50,'0123456789']].entries()){
    const q=QR.create(msg,{errorCorrectionLevel:'M'}),n=q.modules.size,m=sz/n;
    for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.modules.get(r,c))p.drawRectangle({x:x+c*m,y:H-y-(r+1)*m,width:m,height:m});
  }
  fs.writeFileSync(OUT+'/qr_src.pdf',await d.save());execSync(`pdftoppm -png -r 150 ${OUT}/qr_src.pdf ${OUT}/qr_img`);
  const img=fs.readdirSync(OUT).find(n=>/^qr_img-\d+\.png$/.test(n));const sd=await PDFDocument.create(),png=await sd.embedPng(fs.readFileSync(path.join(OUT,img)));
  sd.addPage([W,H]).drawImage(png,{x:0,y:0,width:W,height:H});fs.writeFileSync(OUT+'/qr_scan.pdf',await sd.save());fs.writeFileSync(OUT+'/qr_truth.json',JSON.stringify(T));console.log('OK qr_scan.pdf');
})();
