// 細かい明朝体(6〜8pt)の説明文がページいっぱいに並ぶスキャンを作る(税務書類の「記載要領」のようなページ。小さな文字が読み捨てられないかの確認用)。出力: samples/mincho_scan.pdf と mincho_truth.json
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
const OUT=path.join(WORK,'samples'),FONT=LIB+'@expo-google-fonts/sawarabi-mincho/400Regular/SawarabiMincho_400Regular.ttf',W=595,H=842;
const PARA=[
 ['1','「税理士又は税理士法人」の「事務所の名称及び所在地」欄には、税理士事務所又は税理士法人の名称及び所在地を記載してください。','なお、税理士法人の従たる事務所において実務を担当している場合には、当該従たる事務所の所在地等を記載してください。'],
 ['2','以下の欄については、次のとおり記載してください。','過年分に関する税務代理の対象に関する事項の年分等欄に記載した年分より前の年分を委任する場合は「１」、','委任しない場合は「２」。'],
 ['3','調査の通知・終了の際の手続に関する同意欄','今回委任する代理人に税務代理を委任した事項に関する調査の際に、依頼者への次の通知又は説明等は、今回','委任する代理人に対して行われることに同意する場合は「１」、同意しない場合は「２」。'],
 ['4','税務代理の対象に関する事項欄には、税務代理を委任する税目の区分に「１」を記載し、当該税目の区分に応じた年分等を記載してください。','また、表記税目以外の税目について税務代理を委任する場合は、当該税目に対応する数字及び年分等を記載してください。'],
 ['5','税務代理の対象となる書類の受領に関する事項欄には、税務官公署から送付される書類のうち、e-Taxにより代理受領することについて、','税務代理を委任する場合に記載し、e-Taxで提出してください。'],
 ['6','その他の事項欄には、税務代理の対象から除く事項がある場合にはその事項を記載してください。','また、当該税務代理の範囲を特に限定する場合にその旨を記載してください。']
];
(async()=>{
  const d=await PDFDocument.create();d.registerFontkit(fontkit);const f=await d.embedFont(fs.readFileSync(FONT),{subset:false}),p=d.addPage([W,H]);
  const T=[];let y=60;const SZ=7,LH=1.35;
  PARA.forEach(([no,...ls],pi)=>{
    p.drawText(no,{x:50,y:H-y,size:SZ,font:f});
    const lines=[];ls.forEach(t=>{let cur='';for(const c of Array.from(t)){if(f.widthOfTextAtSize(cur+c,SZ)>440){lines.push(cur);cur='';}cur+=c;}if(cur)lines.push(cur);});
    const x=66,top=y-SZ*0.9;
    lines.forEach((l,i)=>p.drawText(l,{x,y:H-(y+i*SZ*LH),size:SZ,font:f}));
    const w=Math.max(...lines.map(l=>f.widthOfTextAtSize(l,SZ)));
    T.push({name:'p'+pi,size:SZ,lh:LH,align:'left',x0:x,x1:x+w,top,bottom:y+(lines.length-1)*SZ*LH+SZ*0.25,lines});
    y+=lines.length*SZ*LH+16;
  });
  fs.writeFileSync(OUT+'/mincho_src.pdf',await d.save());execSync(`pdftoppm -png -r 150 ${OUT}/mincho_src.pdf ${OUT}/mincho_img`);
  const img=fs.readdirSync(OUT).find(n=>/^mincho_img-\d+\.png$/.test(n));const sd=await PDFDocument.create(),png=await sd.embedPng(fs.readFileSync(path.join(OUT,img)));
  sd.addPage([W,H]).drawImage(png,{x:0,y:0,width:W,height:H});fs.writeFileSync(OUT+'/mincho_scan.pdf',await sd.save());fs.writeFileSync(OUT+'/mincho_truth.json',JSON.stringify(T));console.log('OK mincho_scan.pdf',T.length);
})();
