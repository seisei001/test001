// PDFスタジオの確認用に、ページ番号が大きく書かれた複数ページのPDFを作る
//   node .claude/skills/pdf-app/scripts/make-studio-pdfs.js   → $PDFAPP_WORK/samples/studio_A4.pdf など
const fs=require('fs'),path=require('path');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb,StandardFonts}=require(LIB+'pdf-lib');
(async()=>{
  const OUT=path.join(WORK,'samples');fs.mkdirSync(OUT,{recursive:true});
  const defs=[['A',4,[0.85,0.93,1]],['B',1,[1,0.93,0.85]],['C',7,[0.88,1,0.88]],['D',2,[1,0.88,0.95]]];
  for(const [tag,n,col] of defs){
    const d=await PDFDocument.create(),f=await d.embedFont(StandardFonts.HelveticaBold);
    for(let i=1;i<=n;i++){const p=d.addPage([420,594]);p.drawRectangle({x:0,y:0,width:420,height:594,color:rgb(...col)});
      p.drawText(`${tag}-${i}`,{x:90,y:300,size:120,font:f,color:rgb(0.1,0.1,0.3)});p.drawText(`${tag} ${i}/${n}`,{x:40,y:40,size:24,font:f});}
    fs.writeFileSync(path.join(OUT,`studio_${tag}${n}.pdf`),await d.save());
  }
  console.log('OK: studio_A4 / studio_B1 / studio_C7 / studio_D2 →',OUT);
})();
