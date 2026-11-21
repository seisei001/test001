import glob,re,math,collections,json
from janome.tokenizer import Tokenizer
tk=Tokenizer()
files=sorted(set(glob.glob('*.txt')))
seen=set();docs=[]
for f in files:
    t=open(f).read()
    if hash(t) in seen: continue
    seen.add(hash(t)); docs.append((f,t))
def sents(t):
    return [s for s in re.split(r'[。\n]',t) if len(s)>5]
stop=set('こと もの ため よう これ それ ここ 場合 他 的 等 一 二 三 年 月 日 世紀 作品 記事 出典 脚注 参照 項目 第 版 部 編 以下 中 後 前 上 下 間 者 方 点 内 外 同 名 語 氏 性 化 式 型 系 用 主 初 現 本 各 約 数 他 ページ 年代 一般 とき'.split())
def toks(s):
    out=[]
    for t in tk.tokenize(s):
        p=t.part_of_speech.split(',')
        if p[0]=='名詞' and p[1] in('一般','固有名詞','サ変接続') and t.surface not in stop and len(t.surface)>=2 and not re.fullmatch(r'[0-9A-Za-z\-\.]+',t.surface):
            out.append(t.surface)
    return set(out)
targets={'異世界':['異世界'],'ファンタジー':['ファンタジー'],'魔法':['魔法','魔術','魔力']}
N=0;df=collections.Counter();co={k:collections.Counter() for k in targets};nt=collections.Counter()
for f,t in docs:
    for s in sents(t):
        w=toks(s);N+=1
        for x in w: df[x]+=1
        for k,v in targets.items():
            if any(a in s for a in v):
                nt[k]+=1
                for x in w:
                    if x not in v: co[k][x]+=1
res={}
for k in targets:
    rows=[]
    for x,c in co[k].items():
        if c<3 or df[x]<4: continue
        pmi=math.log((c/nt[k])/(df[x]/N))
        rows.append((x,c,df[x],pmi,c*pmi))
    rows.sort(key=lambda r:-r[4])
    res[k]={'n':nt[k],'top':rows[:40],'topc':co[k].most_common(25)}
    print(k,nt[k],'sentences of',N)
    print(' 組合せ上位:',' '.join(f'{r[0]}({r[1]})' for r in rows[:35]))
    print(' 頻度上位:',' '.join(f'{a}({b})' for a,b in co[k].most_common(25)))
json.dump({'N':N,'docs':[f for f,_ in docs],'res':res},open('res.json','w'),ensure_ascii=False)
