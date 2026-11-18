# 世界地図の最新処理を1本で回す道具(2026-11-19)
1. 世界を書き出す(3種): `node export_az.cjs out.json`(Azgaar, :8103) / `node export_pwg.cjs <seed> <dir>`(PWG, :8101) / `node export_own.cjs <seed> out.json`(自作 world.js)
2. world-data.png にそろえる: `python3 -I rasterize.py az|own in.json outdir` / `python3 -I pwg_convert.py <seed> outdir <h_,b_画像のdir>`
3. 最新処理: `python3 run_pipeline.py <世界dir> <出力dir> "題" "副題" [--num 99] [--iro 5]` → timing.json(各工程の秒とメモリ)
世界dir = world-data.png(R=高さ×2.55, G=群系0〜12(Azgaar番号), B=国)+ world-map.jpg
