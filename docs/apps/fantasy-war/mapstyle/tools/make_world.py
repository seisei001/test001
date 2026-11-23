# 世界地図を「ゼロから」作る一本のアプリ(11-23 22:57 ユーザー指示:毎回PWGの起動から全ての実装を行い、データは塗り替え)
# 流れ: ①PWGで球体の世界を生成(pwg_sphere_probe3.ts) → ②2:1に展開・陸の少ない列で切る・ローポリ+面ごとのUV・川・湖・森・海・極(pwg_sphere_convert.py) → ③3D表示(world3d.html)用ファイルへ上書き配置(build_world.py)
# 残す絵はユーザーが言う。ここでは前回の生データ・途中の絵を使い回さず、作業ディレクトリを毎回空にして作り直す。
# 使い方: python3 -I make_world.py <seed> [<seed> ...]     (環境変数 FM_PWG_DIR=PWGのリポジトリ, FM_WORK=作業場所, FM_PINS='{"planetSize":8192,...}')
import sys, os, shutil, subprocess, time, json
T = os.path.dirname(os.path.abspath(__file__))
PWG = os.environ.get('FM_PWG_DIR', '/tmp/claude-0/pwg')                     # davudk/procedural-world-generation
WORK = os.environ.get('FM_WORK', '/tmp/claude-0/mkworld')
PINS = os.environ.get('FM_PINS', '{"planetSize":8192,"landFraction":0.5,"continentCount":[3,3]}')   # 周長8192km・陸5割・大陸3(球体PWG 2:1の基準)
def sh(cmd, cwd=None, **kw):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, **kw)
    if r.returncode: print(r.stdout[-800:], r.stderr[-1500:]); raise SystemExit('失敗: ' + ' '.join(cmd))
    return r.stdout
def ensure_pwg():
    if not os.path.isdir(os.path.join(PWG, '.git')): sh(['git', 'clone', '--depth', '1', 'https://github.com/davudk/procedural-world-generation.git', PWG])
    if not os.path.isdir(os.path.join(PWG, 'node_modules')): sh(['npm', 'ci'], cwd=PWG)
def gen(seed, out):
    src = open(os.path.join(T, 'pwg_sphere_probe3.ts'), encoding='utf-8').read().replace('Math.max(...rg.strahler)', 'rg.strahler.reduce((a: number, b: number) => Math.max(a, b), 0)')   # 川が多いと展開で落ちるため
    p = os.path.join(PWG, 'metrics', '_mk_probe.ts'); open(p, 'w', encoding='utf-8').write(src)
    t = time.time(); o = sh(['npx', 'tsx', p, str(seed), PINS, os.path.join(out, 'r%d' % seed)], cwd=PWG); print('PWG生成 seed%d %.0f秒' % (seed, time.time() - t), o.strip()[-300:])
def main(seeds):
    t0 = time.time(); ensure_pwg()
    shutil.rmtree(WORK, ignore_errors=True); os.makedirs(WORK)              # ゼロから(前回のデータは使わない)
    for s in seeds: gen(s, WORK)
    sys.path.insert(0, T); import build_world
    for s in seeds: build_world.build(WORK, s)
    print('全体 %.0f秒。出力: w3d/worldsp<seed>.{json,jpg,_riv.json,_sea.jpg}、mapstyle/pwgsphere/sp<seed>/' % (time.time() - t0))
if __name__ == '__main__':
    main([int(a) for a in sys.argv[1:]] or [31, 32])
