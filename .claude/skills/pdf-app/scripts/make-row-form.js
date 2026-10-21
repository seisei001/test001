// 同じ行の文字の大きさを基準にする確認用: 大きな題(30pt)・小さな注(7pt)・欄の行のラベル(12pt)がある1ページ(420x300)
const {PDFDocument,StandardFonts}=require('/tmp/pdfapp-work/lib/node_modules/pdf-lib');
const fs=require('fs');const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work';
(async()=>{const d=await PDFDocument.create(),f=await d.embedFont(StandardFonts.Helvetica),p=d.addPage([420,300]);
 p.drawText('TITLE FORM',{x:20,y:260,size:30,font:f});          // 上から約40pt
 p.drawText('note note note note note',{x:20,y:20,size:7,font:f});   // 下の小さな注
 p.drawText('Address',{x:20,y:150,size:12,font:f});               // 欄の行のラベル(12pt) y=150(下から) → 上から約138
 p.drawText('Name',{x:20,y:100,size:12,font:f});
 fs.writeFileSync(WORK+'/samples/rowform.pdf',await d.save());console.log('ok');})();
