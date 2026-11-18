// Azgaar FMG から1枚の世界を取り出し、セルごとの (x,y,h,biome,state) をJSONで書く。
// 使い方: node export_az.cjs <出力json> [URL=http://localhost:8103/]
const { chromium } = require('playwright');
const out = process.argv[2], url = process.argv[3] || 'http://localhost:8103/';
(async () => {
  const t0 = Date.now();
  const b = await chromium.launch({ args: ['--enable-precise-memory-info'] });
  const p = await (await b.newContext({ viewport: { width: 1100, height: 760 } })).newPage();
  const lines = []; p.on('console', m => lines.push(m.text()));
  await p.goto(url);
  await p.waitForFunction('window.FMG&&FMG.pack&&FMG.pack.cells&&FMG.pack.cells.i&&FMG.pack.cells.i.length>0', null, { timeout: 120000 });
  await p.waitForTimeout(2500);
  // 生成時間を測るため、細かさ(density)を指定して作り直す。既定3(約1万セル)
  lines.length = 0; const tg = Date.now();
  await p.evaluate(n => { const O = FMG.Options, r = O.randomize.bind(O); O.randomize = () => { r(); FMG.options.map.graph.points = n; }; FMG.regenerateMap('verify'); }, +(process.argv[4] || 20000));
  await p.waitForFunction(() => window.__done = (FMG.pack.cells.i.length > 6000), null, { timeout: 300000 }).catch(() => {});
  const wall = Date.now() - tg; await p.waitForTimeout(2500);
  const d = await p.evaluate(() => {
    const c = FMG.pack.cells, n = c.i.length, W = Math.max(...c.p.map(q => q[0])), H = Math.max(...c.p.map(q => q[1]));
    const x = new Array(n), y = new Array(n);
    for (let i = 0; i < n; i++) { x[i] = Math.round(c.p[i][0] * 10) / 10; y[i] = Math.round(c.p[i][1] * 10) / 10; }
    return { W, H, x, y, h: Array.from(c.h), biome: Array.from(c.biome), state: Array.from(c.state), heap: Math.round(performance.memory.usedJSHeapSize / 1e6) };
  });
  d.logs = lines.filter(l => /ms$/.test(l)).slice(0, 12);
  d.gen_ms = wall - 0;
  d.total_ms = Date.now() - t0;
  require('fs').writeFileSync(out, JSON.stringify(d));
  console.log('az ok cells', d.x.length, 'gen_ms', d.gen_ms, 'heapMB', d.heap, 'size', d.W, d.H);
  await b.close();
})();
