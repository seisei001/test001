// 文字サイズ・配置を変えた「正解つき」のページを作る(OCRの文字サイズ/行間/文字揃いの精度を数字で測る用)。
//   出力: $PDFAPP_WORK/samples/${TAG}_scan.pdf(A4の画像だけのPDF)と ${TAG}_truth.json(正解)
//   pdf-lib で描いた本物のPDF → pdftoppm で画像化(150dpi) → 画像だけのPDFにする
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
const OUT=path.join(WORK,'samples'),TAG=process.env.LAYOUT_TAG||'layout',FONT=process.env.LAYOUT_FONT||(LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf');   // LAYOUT_FONT=別のフォント(.ttf) LAYOUT_TAG=layout2 で、別のフォントの見本も作れる(フォントが違うときの幅の合わせ込みを測る)
fs.mkdirSync(OUT,{recursive:true});
const W=595,H=842;
// 正解: name / 文字サイズ(pt) / 行間(倍) / 揃え / 1行目の基準線の上からの位置(pt) / 行
// LAYOUT_SET=form: 委任状のような「ラベル + 離れた値」が並ぶ見本(横に並んで見えて、実は別々の部品であるべきもの)
const FORM=[
  {name:'title',size:16,lh:1.3,align:'center',x:W/2,base:80,lines:['委任状']},
  {name:'l1',size:10.5,lh:1.3,align:'left',x:60,base:140,lines:['代理人住所:']},
  {name:'v1',size:10.5,lh:1.3,align:'left',x:190,base:140,lines:['兵庫県神戸市中央区小野柄通2-2-22']},
  {name:'l2',size:10.5,lh:1.3,align:'left',x:60,base:170,lines:['代理人名称:']},
  {name:'v2',size:10.5,lh:1.3,align:'left',x:190,base:170,lines:['公認会計士','税理士 坂口 誠']},
  {name:'l3',size:10.5,lh:1.3,align:'left',x:60,base:230,lines:['委任者名称:']},
  {name:'v3',size:10.5,lh:1.3,align:'left',x:190,base:230,lines:['特定非営利活動法人福祉ネット寿']},
  {name:'v3b',size:10.5,lh:1.3,align:'left',x:300,base:243,lines:['理事長']},   // 上の行の下にたまたま収まっている、字下げされた別の行
  {name:'l4',size:10.5,lh:1.3,align:'left',x:60,base:290,lines:['委任期間:']},
  {name:'v4',size:10.5,lh:1.3,align:'left',x:190,base:290,lines:['令和8年10月20日から委任事項が終了するまで']},
  {name:'i1',size:10.5,lh:1.3,align:'left',x:60,base:400,lines:['1行目は、ふつうの位置から始まります。']},
  {name:'i2',size:10.5,lh:1.3,align:'left',x:75,base:414,lines:['2行目は、少し字下げされています。']},   // 行の始まりが違う行は、別の部品
  {name:'n1',size:10.5,lh:1.3,align:'left',x:300,base:340,lines:['令和']},
  {name:'n2',size:10.5,lh:1.3,align:'left',x:380,base:340,lines:['年']},
  {name:'n3',size:10.5,lh:1.3,align:'left',x:440,base:340,lines:['月']},
];
const BLOCKS_BASE=[
  {name:'title',size:20,lh:1.3,align:'center',x:W/2,base:80,lines:['入力内容確認']},
  {name:'head',size:14,lh:1.3,align:'left',x:60,base:140,lines:['1. 利用者情報']},
  {name:'body',size:10.5,lh:1.5,align:'left',x:60,base:172,lines:['吾輩は猫である。名前はまだ無い。どこで生れたかとんと','見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー','泣いていた事だけは記憶している。']},
  {name:'note',size:8,lh:1.4,align:'left',x:60,base:262,lines:['※この書類は見本です。内容は架空のものです。','ご不明な点は窓口までお問い合わせください。']},
  {name:'center3',size:12,lh:1.5,align:'center',x:W/2,base:340,lines:['合同会社サンプル','代表取締役 山田 太郎','東京都千代田区サンプル1-2-3']},
  {name:'date',size:11,lh:1.3,align:'right',x:535,base:440,lines:['2024年10月15日']},
  {name:'big',size:16,lh:1.3,align:'left',x:60,base:500,lines:['お支払い金額 ¥123,456']},
];
// LAYOUT_SET=track: 字間の広い(均等割付のような)行と、普通の行
const TRACK=[
  {name:'t1',size:10.5,ls:3.2,lh:1.3,align:'left',x:60,base:120,lines:['私は、上記のものを代理人と定め、下記の権限を委任します。']},
  {name:'t2',size:12,ls:2.4,lh:1.3,align:'left',x:60,base:170,lines:['特定非営利活動法人福祉ネット寿']},
  {name:'t3',size:10.5,ls:0,lh:1.3,align:'left',x:60,base:220,lines:['この行は字間が普通で、位置と大きさだけを合わせます。']},
  {name:'t4',size:14,ls:4.5,lh:1.3,align:'left',x:60,base:270,lines:['委任状の写しを添付します']},
  {name:'t5',size:10.5,ls:1.8,lh:1.3,align:'left',x:60,base:320,lines:['兵庫県神戸市中央区小野柄通３－２－２２']},   // 全角の数字・記号(OCRは半角で読みがち)
  {name:'t6',size:10.5,ls:6,lh:1.3,align:'left',x:60,base:370,lines:['委任事項']},   // 字間の広いラベル
  {name:'t7',size:10.5,ls:0,lh:1.3,align:'left',x:190,base:370,lines:['特定非営利活動法人福祉ネット寿に係る市に対する質疑']},
];
const BLOCKS=process.env.LAYOUT_SET==='form'?FORM:process.env.LAYOUT_SET==='track'?TRACK:BLOCKS_BASE;
(async()=>{
  const d=await PDFDocument.create();d.registerFontkit(fontkit);
  const f=await d.embedFont(fs.readFileSync(FONT),{subset:false});
  const p=d.addPage([W,H]);
  const truth=BLOCKS.map(b=>{
    const lw=b.lines.map(l=>f.widthOfTextAtSize(l,b.size)+(b.ls||0)*(Array.from(l).length-1));
    b.lines.forEach((l,i)=>{const x=b.align==='left'?b.x:b.align==='center'?b.x-lw[i]/2:b.x-lw[i];if(b.ls){let cx=x;for(const c of Array.from(l)){p.drawText(c,{x:cx,y:H-(b.base+i*b.size*b.lh),size:b.size,font:f});cx+=f.widthOfTextAtSize(c,b.size)+b.ls;}}else p.drawText(l,{x,y:H-(b.base+i*b.size*b.lh),size:b.size,font:f});});
    const x0=b.align==='left'?b.x:b.align==='center'?b.x-Math.max(...lw)/2:b.x-Math.max(...lw);
    return{...b,x0,x1:x0+Math.max(...lw),top:b.base-b.size*0.9,bottom:b.base+(b.lines.length-1)*b.size*b.lh+b.size*0.25};
  });
  fs.writeFileSync(OUT+'/'+TAG+'_src.pdf',await d.save());
  execSync(`pdftoppm -png -r 150 ${OUT}/${TAG}_src.pdf ${OUT}/${TAG}_img`);
  const img=fs.readdirSync(OUT).find(n=>new RegExp('^'+TAG+'_img-\\d+\\.png$').test(n));
  const sd=await PDFDocument.create();const png=await sd.embedPng(fs.readFileSync(path.join(OUT,img)));
  sd.addPage([W,H]).drawImage(png,{x:0,y:0,width:W,height:H});
  fs.writeFileSync(OUT+'/'+TAG+'_scan.pdf',await sd.save());
  // 画像の中の実際の文字の黒い部分(インク)の左右の端を測る(文字の送り幅ではなく、見えている幅)
  const ink=JSON.parse(execSync(`python3 -c "
import json,sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('L');s=150/72;t=json.loads(sys.argv[2]);out=[]
for b in t:
    x0=int((b['x0']-6)*s);x1=int((b['x1']+6)*s);y0=int(b['top']*s);y1=int(b['bottom']*s)
    c=im.crop((max(0,x0),max(0,y0),min(im.width,x1),min(im.height,y1)));px=c.load();xs=[x for x in range(c.width) for y in range(c.height) if px[x,y]<140]
    out.append([(max(0,x0)+min(xs))/s,(max(0,x0)+max(xs)+1)/s])
print(json.dumps(out))" ${path.join(OUT,img)} '${JSON.stringify(truth)}'`).toString());
  truth.forEach((b,i)=>{b.inkx0=ink[i][0];b.inkx1=ink[i][1];});
  fs.writeFileSync(OUT+'/'+TAG+'_truth.json',JSON.stringify(truth));
  console.log('OK: '+TAG+'_scan.pdf / '+TAG+'_truth.json →',OUT);
})();
