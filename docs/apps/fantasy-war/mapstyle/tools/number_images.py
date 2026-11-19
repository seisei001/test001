# 各段階ページの絵に、重ならない通し番号(E001〜)を付ける。何度実行しても同じ絵は同じ番号(登録: mapstyle/image_ids.json)。
# 部品の一覧ページ(mapstyle25/26)は対象外(部品は部品ID p01・k04 などを使う)。 usage: python3 number_images.py  (docs/apps/fantasy-war で実行)
import re, glob, json, os, subprocess, html, datetime
SKIP = {25, 26}
reg_p = 'mapstyle/image_ids.json'
reg = json.load(open(reg_p)) if os.path.exists(reg_p) else {'next': 1, 'ids': {}}
reg.setdefault('t', {})
def pn(f): return int(re.findall(r'\d+', f)[0])
pages = sorted([f for f in glob.glob('mapstyle[0-9]*.html') if pn(f) not in SKIP], key=pn)
def made_at(src):    # その絵ファイルを最初にコミットした時刻(作った順の目安)
    r = subprocess.run(['git', 'log', '--diff-filter=A', '--format=%at', '--', 'mapstyle/' + src.split('mapstyle/', 1)[-1] if 'mapstyle/' in src else src], capture_output=True, text=True).stdout.split()
    return int(r[-1]) if r else 0
def title(f):
    m = re.search(r'<title>(.*?)</title>', open(f).read(), re.S); return html.unescape(m.group(1).strip()) if m else f
EID = re.compile(r'<small class="eid"[^>]*>[^<]*</small>')
first = {}                                   # src -> (時刻, ページ番号, 出現順, ページ)
n = 0
for f in pages:
    s = EID.sub('', open(f).read()); open(f, 'w').write(s)
    for m in re.finditer(r'<img\b[^>]*>', s):
        sm = re.search(r'src="([^"]+)"', m.group(0))
        if sm and sm.group(1) not in first: first[sm.group(1)] = (made_at(sm.group(1)), pn(f), n, f); n += 1
order = sorted(first, key=lambda k: first[k][:3])
reg = {'next': len(order) + 1, 'ids': {src: 'E%03d' % (i + 1) for i, src in enumerate(order)}}
index = []
for f in pages:
    s = open(f).read(); out = []; pos = 0
    for m in re.finditer(r'<img\b[^>]*>', s):
        sm = re.search(r'src="([^"]+)"', m.group(0))
        if not sm: continue
        out.append(s[pos:m.end()]); pos = m.end()
        out.append('<small class="eid" style="display:block;font-size:.85em;font-weight:bold;color:#7a2e1e">絵番号 %s</small>' % reg['ids'][sm.group(1)])
    out.append(s[pos:]); open(f, 'w').write(''.join(out))
json.dump(reg, open(reg_p, 'w'), ensure_ascii=False, indent=1)
rows = []
for src in order:
    t, pnum, _, f = first[src]; eid = reg['ids'][src]
    rows.append('<tr><td><b>%s</b></td><td><a href="%s"><img src="%s" loading="lazy"></a></td><td>%s<br><small>%s<br>%s</small></td></tr>' % (eid, src, src, html.escape(title(f)), f.replace('.html', ''), datetime.datetime.fromtimestamp(t, datetime.timezone(datetime.timedelta(hours=9))).strftime('%m-%d %H:%M') if t else '不明'))
open('mapstyle_ids.html', 'w').write('<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>絵の一覧(作った順・番号付き)</title><style>body{font-family:sans-serif;background:#f4ecd8;color:#2b2418;margin:0;padding:12px;line-height:1.5}table{border-collapse:collapse;width:100%}td{border:1px solid #b9a98a;padding:6px;vertical-align:top;background:#fff8e6}td img{width:100%;max-width:520px;border-radius:4px}td:first-child{white-space:nowrap;color:#7a2e1e;font-size:1.05em}</style></head><body><h1>絵の一覧(作った順・番号付き)</h1><p>各段階のページの絵を、作った順(絵ファイルを最初に公開した時刻の順。同時刻はページ番号順)に並べ、通し番号(E001〜)を付けました。評価は「E012は良い。ここがよい。足りないのは…」のように番号で教えてください。絵をタップすると原寸になります。部品の一覧(mapstyle25・26)は部品IDを使うので対象外です。</p><table>' + ''.join(rows) + '</table></body></html>')
print('番号', len(order), '個 / ページ', len(pages))
