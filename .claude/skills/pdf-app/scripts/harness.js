// ヘッドレスChromiumでPDFエディタを開く共通部品。
// 外部CDN(cdn.jsdelivr.net/npm/...)へのアクセスを、setup.sh で入れたnpmの部品に差し替える。
//   const {launch,APP,WORK}=require('./harness'); const {browser,page}=await launch();
const {execSync}=require('child_process');
const fs=require('fs'),path=require('path');
const WORK=process.env.PDFAPP_WORK||'/tmp/pdfapp-work';
const LIB=path.join(WORK,'lib/node_modules')+'/';
const APP='file://'+path.resolve(__dirname,'../../../../docs/apps/pdf-editor/index.html');
const playwright=require(path.join(execSync('npm root -g').toString().trim(),'playwright'));
// アプリが指定している「パス」 → npmの実ファイルの場所
const FIXED={
  'pdf-lib@1.17.1/dist/pdf-lib.min.js':'pdf-lib/dist/pdf-lib.min.js',
  '@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js':'@pdf-lib/fontkit/dist/fontkit.umd.min.js',
  'pdfjs-dist@3.11.174/build/pdf.min.js':'pdfjs-dist/build/pdf.min.js',
  'pdfjs-dist@3.11.174/build/pdf.worker.min.js':'pdfjs-dist/build/pdf.worker.min.js',
  '@expo-google-fonts/m-plus-1p@0.4.2/400Regular/MPLUS1p_400Regular.ttf':'@expo-google-fonts/m-plus-1p/400Regular/MPLUS1p_400Regular.ttf',
};
function localPath(u){
  if(FIXED[u])return FIXED[u];
  let m;
  if((m=u.match(/^tesseract\.js@[^/]+\/dist\/(.+)$/)))return 'tesseract.js/dist/'+m[1];
  if((m=u.match(/^tesseract\.js-core@[^/]+\/(.+)$/)))return 'tesseract.js-core/'+m[1];
  if((m=u.match(/^@tesseract\.js-data\/(\w+)@[^/]+\/(.+)$/)))return '@tesseract.js-data/'+m[1]+'/'+m[2];
  return null;
}
async function launch(opts={}){
  const browser=await playwright.chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const page=await browser.newPage({viewport:{width:900,height:1400},acceptDownloads:true});
  page.on('pageerror',e=>console.log('PAGEERR',e.message));
  if(opts.log)page.on('console',m=>{const t=m.text();if(!/^Canvas2D|Warning: Parameter/.test(t))console.log('LOG',t.slice(0,200));});
  await page.route('https://cdn.jsdelivr.net/npm/**',r=>{
    const u=r.request().url().split('/npm/')[1],f=localPath(u);
    if(f&&fs.existsSync(LIB+f)){
      r.fulfill({body:fs.readFileSync(LIB+f),headers:{'access-control-allow-origin':'*'},
        contentType:u.endsWith('.js')?'application/javascript':u.endsWith('.wasm')?'application/wasm':'application/octet-stream'});
    }else{console.log('MISS(npmに無い)',u);r.abort();}
  });
  await page.goto(APP);await page.waitForTimeout(800);
  return {browser,page};
}
// 範囲ドラッグ(ov の相対位置 0〜1)。ドラッグ直前に位置を測り直す(画面の高さが変わることがあるため)
async function drag(page,x0,y0,x1,y1){
  const o=await page.locator('#ov').boundingBox();
  await page.mouse.move(o.x+o.width*x0,o.y+o.height*y0);await page.mouse.down();
  await page.mouse.move(o.x+o.width*x1,o.y+o.height*y1,{steps:6});await page.mouse.up();await page.waitForTimeout(800);
}
async function save(page,file){
  const [d]=await Promise.all([page.waitForEvent('download'),page.click('#bSave')]);await d.saveAs(file);
}
module.exports={launch,drag,save,APP,WORK};
