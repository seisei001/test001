// PWG(procedural-world-generation)から1枚の世界を取り出し、高さ図(h_<seed>.png)と群系図(b_<seed>.png)を書く。
// 使い方: node export_pwg.cjs <seed> <出力ディレクトリ> [URL=http://localhost:8101/]
const { chromium } = require('playwright');
const sd = process.argv[2], S = process.argv[3].replace(/\/?$/, '/'), base = process.argv[4] || 'http://localhost:8101/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-precise-memory-info'] });
  const p = await (await b.newContext({ viewport: { width: 1100, height: 760 }, acceptDownloads: true })).newPage();
  const t0 = Date.now(); await p.goto(base + '?seed=' + sd);
  for (let i = 0; i < 500; i++) { await p.waitForTimeout(500); const t = await p.evaluate(() => document.getElementById('progress')?.innerText || ''); if (!/Building/i.test(t) && i > 6) break; }
  const gen = Date.now() - t0; await p.waitForTimeout(1500);
  await p.click('#export-toggle'); await p.waitForTimeout(400);
  const [d1] = await Promise.all([p.waitForEvent('download', { timeout: 180000 }), p.click('.export-item[data-id="heightmap"]')]);
  await d1.saveAs(S + `h_${sd}.png`);
  await p.selectOption('#layer-select', 'biome'); await p.waitForTimeout(1500);
  if (!(await p.isVisible('.export-item[data-id="colormap"]'))) { await p.click('#export-toggle'); await p.waitForTimeout(400); }
  const [d2] = await Promise.all([p.waitForEvent('download', { timeout: 180000 }), p.click('.export-item[data-id="colormap"]')]);
  await d2.saveAs(S + `b_${sd}.png`);
  const heap = await p.evaluate(() => Math.round(performance.memory.usedJSHeapSize / 1e6));
  console.log('pwg ok seed', sd, 'gen_ms(build wait)', gen, 'total_ms', Date.now() - t0, 'heapMB', heap);
  await b.close();
})();
