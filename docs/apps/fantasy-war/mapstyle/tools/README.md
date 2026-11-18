# 世界地図の最新処理を1本で回す道具(2026-11-19・簡易生成に差し替え)
1. 世界を作る(3種): `node export_az.cjs out.json`(Azgaar, :8103) / `node export_pwg.cjs <seed> <dir>`(PWG, :8101) / `python3 -I export_simple.py <型0〜9> <dir>`(簡易生成・約70行・画素に直接描く)
   ※ ハニカム(world.js)は構想から外れたため使わない。
2. world-data.png にそろえる: Azgaar= `python3 -I rasterize.py az in.json outdir` / PWG= `python3 -I pwg_convert.py <seed> outdir <h_,b_画像のdir>` / 簡易生成= export_simple.py が直接作る
3. 最新処理: `python3 run_pipeline.py <世界dir> <出力dir> "題" "副題" [--num 99] [--iro 5]` → timing.json(各工程の秒とメモリ)
世界dir = world-data.png(R=高さ×2.55, G=群系0〜12(Azgaar番号), B=国)+ world-map.jpg
