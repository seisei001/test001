// 手持ちのテキスト層つきPDF(DRIVE_DIR)から、「画像だけのPDF」と正解テキストを作る(OCRの文字の一致率を測る用)。リポジトリには入れない。
//   DRIVE_DIR=/tmp/drivepdf node make-drive-eval.js   → $DRIVE_DIR/eval/<名前>_p<ページ>_scan.pdf と _truth.txt
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work',LIB=path.join(WORK,'lib/node_modules')+'/';
const {PDFDocument}=require(LIB+'pdf-lib');
const DIR=process.env.DRIVE_DIR||'/tmp/drivepdf',OUT=DIR+'/eval';fs.mkdirSync(OUT,{recursive:true});
const LIST=(process.env.DRIVE_LIST||'iinjo:1,iinjo:2,iinjo_edited:1,koseki:1,koueki1:1,koueki1:2,koueki1:3,ryusui1:1,ryusui2:1,iinjo_edited2:2').split(',');
(async()=>{
  for(const it of LIST){
    const [n,pg]=it.split(':'),src=`${DIR}/${n}.pdf`,tag=`${n}_p${pg}`;
    execSync(`pdftoppm -png -r 150 -f ${pg} -l ${pg} ${src} ${OUT}/${tag}_img`);
    const img=fs.readdirSync(OUT).find(f=>f.startsWith(tag+'_img')&&f.endsWith('.png'));
    const png=fs.readFileSync(path.join(OUT,img));
    const info=execSync(`pdfinfo -f ${pg} -l ${pg} ${src}`).toString(),m=info.match(/Page\s+\d+ size:\s+([\d.]+) x ([\d.]+)/),W=+m[1],H=+m[2];
    const d=await PDFDocument.create(),e=await d.embedPng(png);d.addPage([W,H]).drawImage(e,{x:0,y:0,width:W,height:H});
    fs.writeFileSync(`${OUT}/${tag}_scan.pdf`,await d.save());
    fs.writeFileSync(`${OUT}/${tag}_truth.txt`,execSync(`pdftotext -f ${pg} -l ${pg} ${src} -`).toString());
    console.log(tag,W,H,'正解の文字数',fs.readFileSync(`${OUT}/${tag}_truth.txt`,'utf8').replace(/\s+/g,'').length);
  }
})();
