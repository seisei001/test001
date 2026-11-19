#!/usr/bin/env python3
"""最新の地図処理を1本で回す(検証・公開用)。
使い方: python3 run_pipeline.py <世界ディレクトリ> <出力ディレクトリ> "<題>" "<副題>" [--num 99] [--iro 5]
  世界ディレクトリ = world-data.png(R=高さ×2.55, G=群系0〜12, B=国)と world-map.jpg を含む所
  出力ディレクトリ = s5a.jpg(地表) → s14a.jpg(山) → final.jpg(仕上げ) と timing.json
  --mtn icons で山を段階15(独立した山の記号)にする。--iro N を付けると最後に【色彩加算】(プリセットN)をかけて final_iro.jpg も作る
各工程の時間(秒)と最大メモリ(MB)を timing.json に記録する。"""
import os, sys, json, time, subprocess, resource
here = os.path.dirname(os.path.abspath(__file__)); P = here + '/pipeline'
a = [x for x in sys.argv[1:]]
def opt(n, d=None):
    if n in a: i = a.index(n); v = a[i + 1]; del a[i:i + 2]; return v
    return d
num = opt('--num', '99'); iro = opt('--iro'); mtn = opt('--mtn', 'stage14')   # --mtn icons = 山を下データと切り離して描く(段階15)
wd, out, title, sub = [os.path.abspath(x) if i < 2 else x for i, x in enumerate(a[:4])]
os.makedirs(out, exist_ok=True)
env = dict(os.environ, FM_MTN=(mtn if mtn in ('icons','parts') else ''), WROOT=wd, FM_WORLD=wd, FM_OUT=out, BASEJ=out + '/s5a.jpg', PYTHONDONTWRITEBYTECODE='1')
steps = [('1_地表(stage5w)', P + '/scale', ['python3', '-I', 'stage5w.py', out + '/']),
         ('2_山(stage14w)', P + '/mt', ['python3', 'stage14w.py', out + '/']),
         ('3_仕上げ(grun10)', P + '/gv', ['python3', 'grun10.py', num, title, sub])]
if mtn in ('icons','parts'): steps = [steps[0], steps[2]]     # 山の段階(stage14)は使わない
res = []
for name, cwd, cmd in steps:
    t0 = time.time(); pr = subprocess.Popen(cmd, cwd=cwd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    o, e = pr.communicate(); _, st, ru = os.wait4(pr.pid, 0) if False else (0, pr.returncode, None)
    dt = time.time() - t0
    mem = resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss / 1024  # 子の最大(累積の最大値)
    res.append({'step': name, 'sec': round(dt, 1), 'max_mem_mb_so_far': round(mem), 'rc': pr.returncode})
    open(f'{out}/log_{name[0]}.txt', 'w').write(o.decode('utf8', 'ignore') + '\n' + e.decode('utf8', 'ignore'))
    if pr.returncode: print('FAILED', name, e.decode()[-600:]); break
if iro and not res[-1]['rc']:
    sys.path.insert(0, P + '/gv'); import numpy as np; from PIL import Image; import iro_kasan as K
    t0 = time.time(); im = np.array(Image.open(out + '/final.jpg').convert('RGB')).astype(np.float32)
    pre = json.load(open(P + '/gv/iro_presets.json'))[iro]
    r = K.apply(im, pre, (110, 900, 110, 1390), strength=0.7, seed=int(num))
    Image.fromarray(r.astype(np.uint8)).save(out + '/final_iro.jpg', quality=93)
    res.append({'step': '4_色彩加算', 'sec': round(time.time() - t0, 1), 'max_mem_mb_so_far': round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024), 'rc': 0})
json.dump(res, open(out + '/timing.json', 'w'), ensure_ascii=False, indent=1)
for r in res: print(r)
print('total sec', round(sum(r['sec'] for r in res), 1))
