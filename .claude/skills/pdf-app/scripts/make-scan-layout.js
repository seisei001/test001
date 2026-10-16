// 文字サイズ・配置を変えた「正解つき」のページを作る(OCRの文字サイズ/行間/文字揃いの精度を数字で測る用)。
//   出力: $PDFAPP_WORK/samples/layout_scan.pdf(A4の画像だけのPDF)と layout_truth.json(正解)
//   pdf-lib で描いた本物のPDF → pdftoppm で画像化(150dpi) → 画像だけのPDFにする
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
const OUT=path.join(WORK,'samples');fs.mkdirSync(OUT,{recursive:true});
const W=595,H=842;
// 正解: name / 文字サイズ(pt) / 行間(倍) / 揃え / 1行目の基準線の上からの位置(pt) / 行
const BLOCKS=[
  {name:'title',size:20,lh:1.3,align:'center',x:W/2,base:80,lines:['入力内容確認']},
  {name:'head',size:14,lh:1.3,align:'left',x:60,base:140,lines:['1. 利用者情報']},
  {name:'body',size:10.5,lh:1.5,align:'left',x:60,base:172,lines:['吾輩は猫である。名前はまだ無い。どこで生れたかとんと','見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー','泣いていた事だけは記憶している。']},
  {name:'note',size:8,lh:1.4,align:'left',x:60,base:262,lines:['※この書類は見本です。内容は架空のものです。','ご不明な点は窓口までお問い合わせください。']},
  {name:'center3',size:12,lh:1.5,align:'center',x:W/2,base:340,lines:['合同会社サンプル','代表取締役 山田 太郎','東京都千代田区サンプル1-2-3']},
  {name:'date',size:11,lh:1.3,align:'right',x:535,base:440,lines:['2024年10月15日']},
  {name:'big',size:16,lh:1.3,align:'left',x:60,base:500,lines:['お支払い金額 ¥123,456']},
];
(async()=>{
  const d=await PDFDocument.create();d.registerFontkit(fontkit);
  const f=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf'),{subset:false});
  const p=d.addPage([W,H]);
  const truth=BLOCKS.map(b=>{
    const lw=b.lines.map(l=>f.widthOfTextAtSize(l,b.size));
    b.lines.forEach((l,i)=>{const x=b.align==='left'?b.x:b.align==='center'?b.x-lw[i]/2:b.x-lw[i];p.drawText(l,{x,y:H-(b.base+i*b.size*b.lh),size:b.size,font:f});});
    const x0=b.align==='left'?b.x:b.align==='center'?b.x-Math.max(...lw)/2:b.x-Math.max(...lw);
    return{...b,x0,x1:x0+Math.max(...lw),top:b.base-b.size*0.9,bottom:b.base+(b.lines.length-1)*b.size*b.lh+b.size*0.25};
  });
  fs.writeFileSync(OUT+'/layout_src.pdf',await d.save());
  execSync(`pdftoppm -png -r 150 ${OUT}/layout_src.pdf ${OUT}/layout_img`);
  const img=fs.readdirSync(OUT).find(n=>/^layout_img-\d+\.png$/.test(n));
  const sd=await PDFDocument.create();const png=await sd.embedPng(fs.readFileSync(path.join(OUT,img)));
  sd.addPage([W,H]).drawImage(png,{x:0,y:0,width:W,height:H});
  fs.writeFileSync(OUT+'/layout_scan.pdf',await sd.save());
  fs.writeFileSync(OUT+'/layout_truth.json',JSON.stringify(truth));
  console.log('OK: layout_scan.pdf / layout_truth.json →',OUT);
})();
