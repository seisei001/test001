# STATE.md の各「## カード」を cards/ の1カード1ファイルに反映する(検索用の写し)。
# 先頭3行(見出し・検索語・出典)は既存のカードファイルのものを残し、本文だけ STATE.md から入れ替える。
# 使い方: python3 make_cards.py  → cards/*.md を Projects の hub/cards/ に入れ直す。
import re,glob
s=open('STATE.md',encoding='utf-8').read()
secs=re.split(r'(?m)^(?=## カード)',s)[1:]
def key(t):
    m=re.match(r'## カード(\w+)',t); return m.group(1).lower()
for t in secs:
    k=key(t); k=('c%03d'%int(k)) if k.isdigit() else 'c'+k
    f='cards/%s.md'%k
    try: head=open(f,encoding='utf-8').read().split('\n')[:4]
    except FileNotFoundError: print('新規カード(検索語を手で付ける):',k); continue
    body='\n'.join(t.split('\n')[1:]).strip().rstrip('-').strip()
    open(f,'w',encoding='utf-8').write('\n'.join(head)+'\n'+body+'\n')
    print(k,len(body))
