# ラグ(Projectsの hub/cards/)=ハブに落とした内容を整理したもの。元は rag/ の r00〜rNN.md(トピック別)。
# 旧方式(STATE.md から cards/ を機械的に作る)は 2026-11-24 に廃止。旧カードは cards_old/(辞書)。
# 使い方: 決定を受けたら該当の rag/rNN.md をその場で書き換え、Projectsの hub/cards/rNN.md へ project_write(local_path)する。目次を変えたら下を実行して _index.md を作り直し hub/STATE.md へ。
import glob
L=['# 世界ハニカム ラグ目次(検索の入口)','ハブに落とした内容を整理したもの。1カード=1トピック。印: [確]ユーザー決定 [案]私の提案 [評]ユーザー評価 [ボツ]不採用 [置]置換済み。答える前に該当カードを検索し、状態を確かめる。未決を決定として扱わない。','ハブの原本記録=repoの STATE.md / STATE_LOG.md / OVERVIEW.md(検索に入れない)。作業規則=docs/apps/fantasy-war/CLAUDE.md。','']
for f in sorted(glob.glob('rag/r*.md')):
    t=open(f,encoding='utf-8').read().split('\n')
    L.append('%s %s'%(f[4:-3].upper(),t[0].lstrip('# ')))
open('rag/_index.md','w',encoding='utf-8').write('\n'.join(L)+'\n'); print('\n'.join(L))
