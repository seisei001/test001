# 全ての実装を一括で通すアプリ(11-23 ユーザー指示「全ての実装をするアプリを完成させて実行してみそ」)。
# 入力: PWGの生データ(pwg_sphere_probe3.ts が書く r<seed>_*.bin。ドライブ「世界データ」の球体PWG_seed<seed>_生データ に保管)
# 通す実装(見せ方の列): 球体2:1の展開・陸の少ない列で海に切る → ローポリ(mapstyle40の基準)→ 面ごとのUV(アトラス)
#   → 川(大河のみの帯)・湖(大小で濃淡)→ 森(第10版の描き方・森の群系)→ 海の深さ・浅瀬 → 3D表示(world3d.html)用ファイルとハブへの配置。
# 使い方: python3 -I build_world.py <生データのあるディレクトリ> <seed> [<seed> ...]   例: python3 -I build_world.py /tmp/claude-0/riv2 31 32
import sys, os, shutil, time, subprocess
T = os.path.dirname(os.path.abspath(__file__)); FW = os.path.abspath(os.path.join(T, '..', '..'))
def build(raw, seed, work=None):
    t0 = time.time(); work = work or os.path.join(raw, 'o%dt' % seed); os.makedirs(work, exist_ok=True)
    name = 'worldsp%d' % seed
    r = subprocess.run([sys.executable, '-I', os.path.join(T, 'pwg_sphere_convert.py'), os.path.join(raw, 'r%d' % seed), work, name, str(seed)], cwd=work, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); raise SystemExit('変換に失敗 seed%d' % seed)
    for f in ('.json', '.jpg', '_a.png', '_riv.json', '_sea.jpg'): shutil.copy(os.path.join(work, name + f), os.path.join(FW, 'w3d', name + f))
    d = os.path.join(FW, 'mapstyle', 'pwgsphere', 'sp%d' % seed); os.makedirs(d, exist_ok=True)
    for f in ('world-data.png', 'water-layer.png'): shutil.copy(os.path.join(work, f), os.path.join(d, f))
    print('seed', seed, '完了 %.1f秒' % (time.time() - t0)); print(r.stdout.strip())
if __name__ == '__main__':
    raw = sys.argv[1]
    for s in sys.argv[2:]: build(raw, int(s))
