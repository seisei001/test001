# 今・これから・過去と親子の管理の検査(11-24 ユーザー確定の規則)。ハブの並び=fantasy-war/items.json。
# 使い方:
#   python3 -I check_now.py          今の項目を木で出し、全体の検査(親の存在・親が過去の子・派生の名前未確認・ラグの形)をする
#   python3 -I check_now.py <id>     これから手を付ける項目の派生の子を調べる。派生の子が複数なら『先に子供を決定』の注意を出す
# 確認ボタン: 今の作成中の項目の下に btn(l,h,s=未決|決定)を1つだけ。他の項目には作らない。過去の試作のリンクは過去の項目の links に集める。
# 規則: 派生の子には der:true を付ける(並びの別作業は派生ではない)。名付けは必ずユーザーに確認し、確認した日を named に書く(派生だけ)。
#       子が確定かボツになったら st を past にして理由を log に書く。
import json, glob, os, sys
H = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.environ.get('ITEMS') or os.path.join(H, '../../fantasy-war/items.json'), encoding='utf-8'))
items = d['items']; ids = {i['id']: i for i in items}
groups = {x['id'] for k in ('layers', 'works') for x in d.get(k, [])}
now = [i for i in items if i.get('st') == 'now' or (not i.get('who') and i.get('st') != 'past')]  # 今の作業+分類(親の入れ物)
kids = {}
for i in now: kids.setdefault(i.get('parent'), []).append(i)
warn = []

def name(i): return '%s(%s)%s' % (i['t'][:40], i['id'], ' ※名前未確認' if i.get('der') and not i.get('named') else '')

def tree(pid, depth):
    for c in kids.get(pid, []):
        print('  ' * depth + '- ' + name(c)); tree(c['id'], depth + 1)

target = sys.argv[1] if len(sys.argv) > 1 else None
if target:
    if target not in ids: print('その id は無い:', target); sys.exit(2)
    t = ids[target]; ch = [c for c in kids.get(target, []) if c.get('der')]
    print('これから手を付ける項目: ' + name(t)); print('派生の子 %d 件' % len(ch))
    for c in ch: print('  - ' + name(c))
    if len(ch) >= 2: warn.append('先に子供を決定してください(確定かボツ): ' + ' / '.join(c['id'] for c in ch))
    for c in [t] + ch:
        if c.get('der') and not c.get('named'): warn.append('名前をユーザーに確認してください: %s' % c['id'])
else:
    top = sorted({i.get('parent') for i in now if i.get('parent') not in {n['id'] for n in now}}, key=str)
    for p in top:
        print('[%s] %s' % (p, ids[p]['t'][:40] if p in ids else '(分類)'))
        tree(p, 1)
    for i in now:
        p = i.get('parent')
        if p and p not in ids and p not in groups: warn.append('親が無い: %s → %s' % (i['id'], p))
        if p in ids and ids[p].get('st') == 'past': warn.append('親が過去なのに子が今: %s' % i['id'])
        if i.get('der') and not i.get('named'): warn.append('派生の名前未確認: %s %s' % (i['id'], i['t'][:30]))
    for i in items:
        past = i.get('past') or i.get('st') == 'past'
        b = i.get('btn')
        if b and past: warn.append('過去の項目に確認ボタンがある(過去の試作は過去の管理に集める): ' + i['id'])
        if b and b.get('s') not in ('未決', '決定'): warn.append('確認ボタンの s は 未決 か 決定: ' + i['id'])
        if not past and i.get('links'): warn.append('今の項目にリンクが残っている(確認ボタンは btn に1つだけ。他は過去の管理へ): ' + i['id'])
    for f in sorted(glob.glob(os.path.join(H, 'rag/r*.md'))):
        L = open(f, encoding='utf-8').read().split('\n')
        if not (L[1].startswith('検索語:') and L[2].startswith('状態:')): warn.append('ラグの形が違う(2行目=検索語・3行目=状態): ' + os.path.basename(f))
        if len('\n'.join(L)) > 3500: warn.append('ラグが長い(3500字超。1カード=1トピックに分ける): ' + os.path.basename(f))
print('--- 検査 ---')
print('\n'.join('注意: ' + w for w in warn) if warn else '注意なし')
sys.exit(1 if warn else 0)
