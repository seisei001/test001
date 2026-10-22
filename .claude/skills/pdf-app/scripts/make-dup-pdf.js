const {PDFDocument,StandardFonts}=require('/tmp/pdfapp-work/lib/node_modules/pdf-lib');const fs=require('fs');
(async()=>{const d=await PDFDocument.create(),f=await d.embedFont(StandardFonts.Helvetica),p=d.addPage([420,300]);
for(let i=0;i<2;i++){p.drawText('Alpha Name',{x:30,y:240,size:14,font:f});}   // 同じ位置に2回
p.drawText('Beta',{x:230,y:240,size:14,font:f});
p.drawText('Gamma',{x:30,y:200,size:14,font:f});p.drawText('Gamma',{x:30.4,y:200.3,size:14,font:f});   // 少しずれて2回(太字風)
p.drawText('Delta',{x:230,y:200,size:14,font:f});
fs.writeFileSync('/tmp/pdfapp-work/samples/dup.pdf',await d.save());})();
