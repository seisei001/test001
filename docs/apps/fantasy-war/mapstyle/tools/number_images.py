# 各段階ページの絵に、重ならない通し番号(E001〜)を付ける。何度実行しても同じ絵は同じ番号(登録: mapstyle/image_ids.json)。
# 部品の一覧ページ(mapstyle25/26)は対象外(部品は部品ID p01・k04 などを使う)。 usage: python3 number_images.py  (docs/apps/fantasy-war で実行)
import re, glob, json, os
SKIP = {25, 26}
reg_p = 'mapstyle/image_ids.json'
reg = json.load(open(reg_p)) if os.path.exists(reg_p) else {'next': 1, 'ids': {}}
def pn(f): return int(re.findall(r'\d+', f)[0])
pages = sorted([f for f in glob.glob('mapstyle[0-9]*.html') if pn(f) not in SKIP], key=pn)
index = []
for f in pages:
    s = open(f).read(); out = []; pos = 0
    for m in re.finditer(r'<img\b[^>]*>', s):
        tag = m.group(0); sm = re.search(r'src="([^"]+)"', tag)
        if not sm: continue
        src = sm.group(1)
        if src not in reg['ids']: reg['ids'][src] = 'E%03d' % reg['next']; reg['next'] += 1
        eid = reg['ids'][src]; index.append((eid, src, f))
        out.append(s[pos:m.end()]); pos = m.end()
        if not s[m.end():m.end() + 60].lstrip().startswith('<small class="eid"'):
            out.append('<small class="eid" style="display:block;font-size:.85em;font-weight:bold;color:#7a2e1e">絵番号 %s</small>' % eid)
    out.append(s[pos:]); open(f, 'w').write(''.join(out))
json.dump(reg, open(reg_p, 'w'), ensure_ascii=False, indent=1)
seen = set(); cells = []
for eid, src, f in index:
    if (eid, f) in seen: continue
    seen.add((eid, f)); cells.append('<div class="c"><a href="%s"><img src="%s" loading="lazy"></a><b>%s</b><br><small>%s</small></div>' % (f, src, eid, f.replace('.html', '')))
open('mapstyle_ids.html', 'w').write('<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>絵の番号表</title><style>body{font-family:sans-serif;background:#f4ecd8;color:#2b2418;margin:0;padding:12px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.c{background:#fff8e6;border:1px solid #b9a98a;border-radius:6px;padding:6px;font-size:.85em}.c img{width:100%%;border-radius:4px}</style></head><body><h1>絵の番号表(E番号)</h1><p>各段階のページの絵に付けた通し番号です。絵をタップすると、そのページへ行きます。評価は「E012は良い」のように番号で教えてください。部品の一覧(mapstyle25・26)は部品IDを使います。</p><div class="g">' + ''.join(cells) + '</div></body></html>')
print('番号', reg['next'] - 1, '個 / ページ', len(pages))
