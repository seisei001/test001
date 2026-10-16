// 動作確認用のPDFを作る(日本語はM PLUS 1pを丸ごと埋め込み)。出力: $PDFAPP_WORK/samples/*.pdf
//   table.pdf  … 罫線なしの表+右寄せの日付+点線代わりの文字
//   grid.pdf   … 縦横の罫線ありの表(2ページ目)
//   form.pdf   … ブラウザ印刷風のフォーム(ラベル列と値列を縦線で区切る)
//   scan.pdf   … form.pdf を画像にしただけのPDF(OCR用。poppler の pdftoppm が必要)
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
const OUT=path.join(WORK,'samples');fs.mkdirSync(OUT,{recursive:true});
(async()=>{
  const mk=async()=>{const d=await PDFDocument.create();d.registerFontkit(fontkit);
    const f=await d.embedFont(fs.readFileSync(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf'),{subset:false});return{d,f};};
  const T=(p,f)=>(t,x,y,s=12)=>p.drawText(t,{x,y,size:s,font:f});
  { // table.pdf + grid.pdf(2ページ)
    const {d,f}=await mk();let p=d.addPage([400,300]);const t=T(p,f);
    t('見積書',40,265,18);t('(株)サンプル御中',150,267);
    const cols=[40,130,200,290];['品名','数量','単価','金額'].forEach((h,i)=>t(h,cols[i],230));
    [['りんご','3','100','300'],['みかん','10','50','500']].forEach((r,ri)=>r.forEach((c,i)=>t(c,cols[i],200-ri*26)));
    t('請求先:サンプル株式会社',40,140);t('2024年10月15日',300,140);
    t('第1章 はじめに',40,110);t('.........................',130,110);t('1',360,110);
    fs.writeFileSync(OUT+'/table.pdf',await d.save());
    p=d.addPage([400,300]);const t2=T(p,f);const X=[30,120,190,280,370];
    X.forEach(x=>p.drawLine({start:{x,y:250},end:{x,y:170},thickness:.7}));
    [250,222,196,170].forEach(y=>p.drawLine({start:{x:30,y},end:{x:370,y},thickness:.7}));
    ['品名','数量','単価','金額'].forEach((h,i)=>t2(h,X[i]+6,232));
    [['りんご','3','100','300'],['みかん','10','50','500']].forEach((r,ri)=>r.forEach((c,i)=>t2(c,X[i]+6,207-ri*26)));
    fs.writeFileSync(OUT+'/grid.pdf',await d.save());
  }
  { // form.pdf
    const {d,f}=await mk();const p=d.addPage([420,300]);const t=T(p,f);
    t('入力内容確認',30,270,16);t('利用種別',40,236,13);
    p.drawLine({start:{x:30,y:226},end:{x:400,y:226},thickness:.6});
    t('利用種別',40,208,11);t('税理士',230,206,13);
    p.drawLine({start:{x:30,y:194},end:{x:400,y:194},thickness:.6});
    p.drawLine({start:{x:215,y:226},end:{x:215,y:150},thickness:.6});
    t('氏名(フリガナ)',40,172,11);t('サカグチ',230,172,13);t('マコト',300,172,13);
    p.drawLine({start:{x:30,y:160},end:{x:400,y:160},thickness:.6});
    t('氏名',40,140,11);t('坂口',230,140,13);t('誠',270,140,13);
    fs.writeFileSync(OUT+'/form.pdf',await d.save());
  }
  try{ // scan.pdf(画像だけのPDF)
    execSync(`pdftoppm -png -r 130 ${OUT}/form.pdf ${OUT}/formimg`);
    const d=await PDFDocument.create();const png=await d.embedPng(fs.readFileSync(OUT+'/formimg-1.png'));
    const p=d.addPage([420,300]);p.drawImage(png,{x:0,y:0,width:420,height:300});
    fs.writeFileSync(OUT+'/scan.pdf',await d.save());
  }catch(e){console.log('scan.pdf は作れませんでした(pdftoppm が必要):',e.message);}
  console.log('OK:',fs.readdirSync(OUT).filter(f=>f.endsWith('.pdf')).join(', '),'→',OUT);
})();
