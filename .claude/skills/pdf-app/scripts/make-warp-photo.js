// 歪み補正の確認用に、歪んだ写真のPDFを作る。出力: $PDFAPP_WORK/samples/photo_persp.pdf(斜めから撮った紙)/ photo_curve.pdf(曲がった紙)
//   文字の行は EXPECT に記録(OCRで読めた行数を、補正の前後で比べる)
const fs=require('fs'),path=require('path');
const {launch,WORK}=require('./harness');
const LIB=path.join(WORK,'lib/node_modules')+'/';const {PDFDocument}=require(LIB+'pdf-lib');
const EXPECT=['吾輩は猫である。','名前はまだ無い。','どこで生れたかとんと見当がつかぬ。','何でも薄暗いじめじめした所で','ニャーニャー泣いていた事だけは','記憶している。','ここで始めて人間というものを見た。'];
(async()=>{
  const {browser,page}=await launch();
  const out=await page.evaluate(async EXPECT=>{
    // 平らな紙(1000x1400)に文字の行を書く
    const paper=document.createElement('canvas');paper.width=1000;paper.height=1400;const px=paper.getContext('2d');
    px.fillStyle='#f4f1e8';px.fillRect(0,0,1000,1400);px.fillStyle='#111';px.font='46px "Noto Sans CJK JP","Hiragino Sans","Yu Gothic",sans-serif';px.textBaseline='alphabetic';
    EXPECT.forEach((t,i)=>px.fillText(t,70,200+i*150));
    px.strokeStyle='#111';px.lineWidth=5;px.strokeRect(40,70,920,1260);
    const pd=px.getImageData(0,0,1000,1400);
    const bil=(d,w,h,x,y)=>{const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,r=[0,0,0];for(let c=0;c<3;c++){const g=(xx,yy)=>d[((Math.max(0,Math.min(h-1,yy))*w)+Math.max(0,Math.min(w-1,xx)))*4+c];r[c]=g(x0,y0)*(1-fx)*(1-fy)+g(x0+1,y0)*fx*(1-fy)+g(x0,y0+1)*(1-fx)*fy+g(x0+1,y0+1)*fx*fy;}return r;};
    // ---- 斜めから撮った写真(射影)。机(暗い)の上の紙 ----
    const W1=1400,H1=1800,c1=document.createElement('canvas');c1.width=W1;c1.height=H1;const x1=c1.getContext('2d');
    const im1=x1.createImageData(W1,H1),o1=im1.data;
    const Q=[[230,170],[1190,300],[1110,1590],[120,1450]];                     // 紙の四隅(左上・右上・右下・左下)
    const [[X0,Y0],[X1,Y1],[X2,Y2],[X3,Y3]]=Q;const sx=X0-X1+X2-X3,sy=Y0-Y1+Y2-Y3;
    const dx1=X1-X2,dx2=X3-X2,dy1=Y1-Y2,dy2=Y3-Y2,det=dx1*dy2-dx2*dy1,g=(sx*dy2-dx2*sy)/det,h=(dx1*sy-sx*dy1)/det;
    const a=X1-X0+g*X1,b=X3-X0+h*X3,c=X0,d=Y1-Y0+g*Y1,e=Y3-Y0+h*Y3,f=Y0;
    const M=[[a,b,c],[d,e,f],[g,h,1]];const inv=(m)=>{const [[a,b,c],[d,e,f],[g,h,i]]=m;const A=e*i-f*h,B=-(d*i-f*g),C=d*h-e*g,D=-(b*i-c*h),E=a*i-c*g,F=-(a*h-b*g),G=b*f-c*e,H=-(a*f-c*d),I=a*e-b*d,dt=a*A+b*B+c*C;return [[A/dt,D/dt,G/dt],[B/dt,E/dt,H/dt],[C/dt,F/dt,I/dt]];};
    const Mi=inv(M);
    for(let y=0;y<H1;y++)for(let x=0;x<W1;x++){
      const k=(y*W1+x)*4,uu=Mi[0][0]*x+Mi[0][1]*y+Mi[0][2],vv=Mi[1][0]*x+Mi[1][1]*y+Mi[1][2],ww=Mi[2][0]*x+Mi[2][1]*y+Mi[2][2],u=uu/ww,v=vv/ww;
      const noise=((x*17+y*31)%13);
      if(u>=0&&u<=1&&v>=0&&v<=1){const rgb=bil(pd.data,1000,1400,u*999,v*1399),shade=0.92+0.1*(1-v);o1[k]=rgb[0]*shade;o1[k+1]=rgb[1]*shade;o1[k+2]=rgb[2]*shade;}
      else{o1[k]=o1[k+1]=o1[k+2]=58+noise;}
      o1[k+3]=255;
    }
    x1.putImageData(im1,0,0);
    // ---- 曲がった紙(ページの中央が下にふくらむ。文字の行が弓なりになる) ----
    const c2=document.createElement('canvas');c2.width=1000;c2.height=1400;const x2=c2.getContext('2d');
    const im2=x2.createImageData(1000,1400),o2=im2.data,A=50;
    for(let y=0;y<1400;y++)for(let x=0;x<1000;x++){const k=(y*1000+x)*4,dy=A*Math.sin(Math.PI*x/1000),rgb=bil(pd.data,1000,1400,x,y-dy);o2[k]=rgb[0];o2[k+1]=rgb[1];o2[k+2]=rgb[2];o2[k+3]=255;}
    x2.putImageData(im2,0,0);
    return{persp:c1.toDataURL('image/jpeg',0.92),curve:c2.toDataURL('image/jpeg',0.92)};
  },EXPECT);
  await browser.close();
  const mk=async(url,w,h,file)=>{const d=await PDFDocument.create();const img=await d.embedJpg(Buffer.from(url.split(',')[1],'base64'));const p=d.addPage([w,h]);p.drawImage(img,{x:0,y:0,width:w,height:h});fs.writeFileSync(WORK+'/samples/'+file,await d.save());};
  await mk(out.persp,420,540,'photo_persp.pdf');await mk(out.curve,420,588,'photo_curve.pdf');
  fs.writeFileSync(WORK+'/samples/expect.json',JSON.stringify(EXPECT));
  console.log('OK: photo_persp.pdf, photo_curve.pdf →',WORK+'/samples');
})();
