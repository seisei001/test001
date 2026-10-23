const {PDFDocument,StandardFonts}=require('/tmp/pdfapp-work/lib/node_modules/pdf-lib');const fs=require('fs');
(async()=>{const d=await PDFDocument.create(),f=await d.embedFont(StandardFonts.Helvetica),p=d.addPage([420,300]);
p.drawText('Left',{x:20,y:240,size:12,font:f});p.drawText('Right',{x:330,y:240,size:12,font:f});   // 同じ行で、空白が文字サイズの約25倍
fs.writeFileSync('/tmp/pdfapp-work/samples/gap.pdf',await d.save());})();
