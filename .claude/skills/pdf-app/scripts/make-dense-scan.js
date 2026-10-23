// 税務書類のような「細かい表・小さな文字・二次元コード・縦の注記」だらけのページを、正解つきで作る(OCRのサイズ・ごみの検証用)
//   出力: $PDFAPP_WORK/samples/dense_scan.pdf(画像だけのPDF)と dense_truth.json
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument,rgb}=require(LIB+'pdf-lib'),fontkit=require(LIB+'@pdf-lib/fontkit');
const OUT=path.join(WORK,'samples'),FONT=LIB+'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf';
const W=595,H=842;
const T=[];   // 正解: {name,size,x,base,text}
(async()=>{
  const d=await PDFDocument.create();d.registerFontkit(fontkit);
  const f=await d.embedFont(fs.readFileSync(FONT),{subset:false}),p=d.addPage([W,H]);
  const line=(x0,y0,x1,y1,t=0.6)=>p.drawLine({start:{x:x0,y:H-y0},end:{x:x1,y:H-y1},thickness:t,color:rgb(0,0,0)});
  const text=(name,s,x,base,size)=>{p.drawText(s,{x,y:H-base,size,font:f});const w=f.widthOfTextAtSize(s,size);T.push({name,size,lh:1.3,align:'left',x0:x,x1:x+w,top:base-size*0.9,bottom:base+size*0.25,lines:[s],inkx0:x,inkx1:x+w});};
  text('title','税務代理権限証書',200,60,14);
  text('formid','様式ID',60,40,6);
  // 二次元コード(ランダムな黒い四角の集まり)
  const q0x=480,q0y=20,qn=25,qs=2.4;let seed=7;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  for(let i=0;i<qn;i++)for(let j=0;j<qn;j++)if(rnd()<0.5)p.drawRectangle({x:q0x+i*qs,y:H-q0y-j*qs-qs,width:qs,height:qs,color:rgb(0,0,0)});
  // 表
  const rows=[['氏名又は名称','E02',9],['登録番号等','E03',8],['事務所の名称','',8],['事務所の所在地','',8],['代理人の区分','1：税理士 2：税理士法人',7],['調査の通知','C03',7],['終了の通知','C04',7],['結果説明等','C05',7]];
  let y=110;
  rows.forEach(([a,b,s],i)=>{line(50,y,545,y);text('r'+i+'a',a,56,y+13,s);if(b)text('r'+i+'b',b,240,y+13,s);line(220,y,220,y+20);y+=20;});
  line(50,y,545,y);line(50,110,50,y);line(545,110,545,y);
  // 小さな注記の欄
  const notes=['年分欄は、該当アルファベットを記入欄へ記入','(N)1：贈与税 4：酒税 その他の国税','(M)3：相続税(財産評価基本通達)','5：揮発油税及び地方揮発油税','7：登録免許税 12：法定調査'];
  let ny=360;notes.forEach((s,i)=>{text('n'+i,s,300,ny,5.5);ny+=8;});
  // 大きめの見出しと本文
  text('h1','上記のものを代理人と定め、下記の権限を委任します。',56,330,9);
  text('h2','委任事項',56,400,11);
  text('b1','特定非営利活動法人福祉ネット寿に係る市に対する質疑応答に関する業務',56,420,8);
  // 縦の線と数字(1桁の小さい数字が縦に並ぶ欄)
  for(let i=0;i<6;i++){line(520,450+i*14,545,450+i*14);text('d'+i,String(i),528,461+i*14,7);}
  fs.writeFileSync(OUT+'/dense_src.pdf',await d.save());
  execSync(`pdftoppm -png -r 150 ${OUT}/dense_src.pdf ${OUT}/dense_img`);
  const img=fs.readdirSync(OUT).find(n=>/^dense_img-\d+\.png$/.test(n));
  const sd=await PDFDocument.create();const png=await sd.embedPng(fs.readFileSync(path.join(OUT,img)));
  sd.addPage([W,H]).drawImage(png,{x:0,y:0,width:W,height:H});
  fs.writeFileSync(OUT+'/dense_scan.pdf',await sd.save());
  fs.writeFileSync(OUT+'/dense_truth.json',JSON.stringify(T));
  console.log('OK dense_scan.pdf',T.length,'件');
})();
