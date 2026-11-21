import json,re,html,glob,os,sys
D='/root/.claude/projects/-home-claude/1cd05bc6-9ed2-5956-b484-3fece23bc169/tool-results/'
out=sys.argv[1]
for p in sorted(glob.glob(D+'mcp-Wikipeaia-page_html-*.txt')):
    try: d=json.load(open(p))
    except Exception as e: print('ng',p,e); continue
    raw=d['html']
    m=re.search(r'<title>(.*?)</title>',raw,flags=re.S)
    ti=html.unescape(m.group(1)) if m else '?'
    h=re.sub(r'<(script|style)[^>]*>.*?</\1>','',raw,flags=re.S)
    t=html.unescape(re.sub(r'<[^>]+>','',h)); t=re.sub(r'\n\s*\n+','\n',t)
    ti=re.sub(r'[ /]','_',ti)[:30]
    open(out+'/'+ti+'.txt','w').write(t)
    print(os.path.basename(p)[-12:],ti,len(t))
