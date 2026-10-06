#!/usr/bin/env python3
"""坂口誠税理士事務所 SEO向け静的サイト生成スクリプト(外部ライブラリ不要)

使い方:
  python3 build.py                 # docs/apps/sakaguchi-site/ に生成(下書きは除く)
  python3 build.py --drafts        # 下書き(draft: true)も含めて生成
  python3 build.py --local --out /tmp/preview   # ローカル確認用(http://localhost:8765 で配信)

入力:  config.json / pages/*.md / posts/*.md / assets/site.css
出力:  各ページのHTML、blog/、sitemap.xml、robots.txt、feed.xml、404.html
"""
import argparse
import datetime
import email.utils
import hashlib
import html
import json
import pathlib
import re
import shutil
import sys
from urllib.parse import quote, urlparse

ROOT = pathlib.Path(__file__).resolve().parent
REPO = ROOT.parent.parent
DEFAULT_OUT = REPO / 'docs' / 'apps' / 'sakaguchi-site'

ap = argparse.ArgumentParser()
ap.add_argument('--drafts', action='store_true', help='下書きも生成する')
ap.add_argument('--local', action='store_true', help='base_urlをlocalhost:8765にする')
ap.add_argument('--out', help='出力先(省略時はdocs/apps/sakaguchi-site)')
args = ap.parse_args()

CFG = json.loads((ROOT / 'config.json').read_text('utf-8'))
if args.local:
    CFG['base_url'] = 'http://localhost:8765'
BASE = CFG['base_url'].rstrip('/')
BP = urlparse(BASE).path.rstrip('/')          # 例: /test001/apps/sakaguchi-site (独自ドメインなら空)
OUT = pathlib.Path(args.out) if args.out else DEFAULT_OUT
TODAY = datetime.date.today().isoformat()
SITE = CFG['site_name']
errors, warnings = [], []
_o = CFG['org']
if _o.get('postal') and _o.get('street'):
    ADDRESS = f'〒{_o["postal"]} {_o["region"]}{_o["locality"]}{_o["street"]}'
else:
    ADDRESS = f'{_o["region"]}{_o["locality"]}(詳しい住所は準備中です)'
_q = re.sub(r'\s*\d+F$', '', f'{_o["region"]}{_o["locality"]}{_o["street"]}')   # 末尾の階数(7Fなど)を除く
MAP_URL = 'https://www.google.com/maps/search/?api=1&query=' + quote(_q)
MAP_DIR = 'https://www.google.com/maps/dir/?api=1&destination=' + quote(_q)
MAP_EMBED = (
    f'<div class="mapbox"><iframe title="{html.escape(SITE)}の所在地の地図" src="https://www.google.com/maps?q={quote(_q)}&amp;hl=ja&amp;z=17&amp;output=embed" '
    'loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>'
    f'<p class="maplinks"><a href="{MAP_URL}" rel="noopener" target="_blank">Googleマップで開く</a>'
    f'<a href="{MAP_DIR}" rel="noopener" target="_blank">ここへの経路を調べる</a></p>')


# ---------- 文字列まわり ----------
def esc(s, quote=True):
    return html.escape(s, quote=quote)


def fmt_date(d):
    y, m, dd = d.split('-')
    return f'{int(y)}年{int(m)}月{int(dd)}日'


def parse(text):
    m = re.match(r'^---\n(.*?)\n---\n?(.*)$', text, re.S)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        if ':' in line and not line.strip().startswith('#'):
            k, v = line.split(':', 1)
            meta[k.strip()] = v.strip()
    return meta, m.group(2)


def url(path):
    """サイト内パス(/blog/ など)を、公開URLのパス(BP付き)にする"""
    return BP + path if path.startswith('/') else path


def abs_url(path):
    return BASE + path


def link(text, u):
    if u.startswith('/') and not u.startswith('//'):
        u = BP + u
        return f'<a href="{u}">{text}</a>'
    if u.startswith('http'):
        return f'<a href="{u}" rel="noopener" target="_blank">{text}</a>'
    return f'<a href="{u}">{text}</a>'


def inline(s):
    s = esc(s, quote=False)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', lambda m: link(m.group(1), m.group(2)), s)
    return s


def raw(s):
    """HTML直書きブロック。href="/..." をBP付きに直す"""
    return re.sub(r'(href|src|action)="/(?!/)', lambda m: f'{m.group(1)}="{BP}/', s)


def strip_tags(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s))


def md(body):
    """簡易Markdown変換: 見出し(##〜####、{#id}可)・段落・箇条書き・番号リスト・引用・HTML直書き"""
    L = body.strip('\n').split('\n')
    out, i = [], 0

    def block_start(x):
        return bool(re.match(r'^(#{2,4}\s|[-*]\s|\d+\.\s|>|<)', x))

    while i < len(L):
        ln = L[i]
        if not ln.strip():
            i += 1
            continue
        if ln.startswith('<'):
            blk = []
            while i < len(L) and L[i].strip():
                blk.append(L[i])
                i += 1
            out.append(raw('\n'.join(blk)))
            continue
        m = re.match(r'^(#{2,4})\s+(.*?)(?:\s*\{#([\w-]+)\})?\s*$', ln)
        if m:
            n = len(m.group(1))
            ida = f' id="{m.group(3)}"' if m.group(3) else ''
            out.append(f'<h{n}{ida}>{inline(m.group(2))}</h{n}>')
            i += 1
            continue
        if re.match(r'^[-*]\s+', ln):
            items = []
            while i < len(L) and re.match(r'^[-*]\s+', L[i]):
                items.append(re.sub(r'^[-*]\s+', '', L[i]))
                i += 1
            out.append('<ul>' + ''.join(f'<li>{inline(x)}</li>' for x in items) + '</ul>')
            continue
        if re.match(r'^\d+\.\s+', ln):
            items = []
            while i < len(L) and re.match(r'^\d+\.\s+', L[i]):
                items.append(re.sub(r'^\d+\.\s+', '', L[i]))
                i += 1
            out.append('<ol>' + ''.join(f'<li>{inline(x)}</li>' for x in items) + '</ol>')
            continue
        if ln.startswith('>'):
            q = []
            while i < len(L) and L[i].startswith('>'):
                q.append(L[i].lstrip('>').strip())
                i += 1
            out.append('<blockquote><p>' + inline(''.join(q)) + '</p></blockquote>')
            continue
        p = []
        while i < len(L) and L[i].strip() and not block_start(L[i]):
            p.append(L[i].strip())
            i += 1
        out.append('<p>' + inline(''.join(p)) + '</p>')
    return '\n'.join(out)


def faq_items(body):
    items, cur = [], None
    for ln in body.split('\n'):
        m = re.match(r'^##\s+(.*?)(?:\s*\{#[\w-]+\})?\s*$', ln)
        if m:
            cur = [m.group(1), []]
            items.append(cur)
        elif cur is not None and ln.strip():
            cur[1].append(ln.strip())
    return [(q, strip_tags(inline(''.join(a)))) for q, a in items if a]


# ---------- 構造化データ(JSON-LD) ----------
def ld_script(obj):
    j = json.dumps(obj, ensure_ascii=False).replace('</', '<\\/')
    return f'<script type="application/ld+json">{j}</script>'


def ld_org():
    o = CFG['org']
    addr = {'@type': 'PostalAddress', 'addressCountry': 'JP',
            'addressRegion': o['region'], 'addressLocality': o['locality']}
    if o.get('postal'):
        addr['postalCode'] = o['postal']
    if o.get('street'):
        addr['streetAddress'] = o['street']
    d = {'@context': 'https://schema.org', '@type': o['type'], 'name': SITE,
         'url': abs_url('/'), 'description': CFG['tagline'],
         'areaServed': {'@type': 'City', 'name': o['locality']},
         'founder': {'@type': 'Person', 'name': o['founder'], 'jobTitle': o['founder_title']},
         'foundingDate': o['opening'], 'knowsAbout': o['knows_about'], 'address': addr}
    if o.get('telephone'):
        d['telephone'] = o['telephone']
    if o.get('email'):
        d['email'] = o['email']
    if CFG.get('og_image'):
        d['image'] = CFG['og_image']
    return d


def ld_website():
    return {'@context': 'https://schema.org', '@type': 'WebSite', 'name': SITE,
            'url': abs_url('/'), 'inLanguage': 'ja'}


def ld_breadcrumb(trail):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList',
            'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': abs_url(p)}
                                for i, (n, p) in enumerate(trail)]}


def ld_faq(items):
    return {'@context': 'https://schema.org', '@type': 'FAQPage',
            'mainEntity': [{'@type': 'Question', 'name': q,
                            'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in items]}


def ld_post(p):
    d = {'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': p['title'],
         'description': p['desc'], 'datePublished': p['date'], 'dateModified': p['updated'],
         'inLanguage': 'ja', 'mainEntityOfPage': abs_url(p['path']), 'url': abs_url(p['path']),
         'author': {'@type': 'Person', 'name': CFG['org']['founder'], 'jobTitle': CFG['org']['founder_title']},
         'publisher': {'@type': CFG['org']['type'], 'name': SITE, 'url': abs_url('/')}}
    if CFG.get('og_image'):
        d['image'] = CFG['og_image']
    return d


# ---------- 共通レイアウト ----------
CSS_SRC = ROOT / 'assets' / 'site.css'
CSS_VER = hashlib.md5(CSS_SRC.read_bytes()).hexdigest()[:8]


def breadcrumb_html(trail):
    parts = []
    for i, (n, p) in enumerate(trail):
        if i == len(trail) - 1:
            parts.append(f'<li aria-current="page">{esc(n)}</li>')
        else:
            parts.append(f'<li><a href="{url(p)}">{esc(n)}</a></li>')
    return '<nav class="crumb" aria-label="パンくず"><ol>' + ''.join(parts) + '</ol></nav>'


def layout(*, title, desc, path, main, jsonld, og_type='website', nav_path=None, noindex=None):
    full_title = title if path == '/' else f'{title}｜{SITE}'
    canon = abs_url(path)
    if noindex is None:
        noindex = CFG.get('noindex', False)
    nav = []
    for name, p in CFG['nav']:
        cur = ' aria-current="page"' if p == (nav_path or path) else ''
        nav.append(f'<a href="{url(p)}"{cur}>{esc(name)}</a>')
    og_img = CFG.get('og_image', '')
    card = 'summary_large_image' if og_img else 'summary'
    head = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f'<title>{esc(full_title)}</title>',
        f'<meta name="description" content="{esc(desc)}">',
        f'<link rel="canonical" href="{canon}">',
    ]
    if noindex:
        head.append('<meta name="robots" content="noindex,nofollow">')
    head += [
        f'<meta name="theme-color" content="{CFG["theme_color"]}">',
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:site_name" content="{esc(SITE)}">',
        f'<meta property="og:title" content="{esc(full_title)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:url" content="{canon}">',
        '<meta property="og:locale" content="ja_JP">',
    ]
    if og_img:
        head.append(f'<meta property="og:image" content="{esc(og_img)}">')
    head += [
        f'<meta name="twitter:card" content="{card}">',
        f'<link rel="alternate" type="application/rss+xml" title="{esc(SITE)} ブログ" href="{url("/feed.xml")}">',
        f'<link rel="stylesheet" href="{url("/assets/site.css")}?v={CSS_VER}">',
    ]
    head += [ld_script(j) for j in jsonld]
    hub = ''
    if CFG.get('hub_link'):
        hub = f'<div class="hubbar"><div class="wrap"><a href="{CFG["hub_url"]}">← ハブに戻る(試作の確認用リンク)</a></div></div>'
    o = CFG['org']
    footer = (
        f'<footer class="site-footer"><div class="wrap">'
        f'<p class="f-name">{esc(SITE)}</p>'
        f'<p>代表税理士 {esc(o["founder"])}</p><p>{esc(ADDRESS)}</p>'
        f'<nav class="fnav" aria-label="フッター">{"".join(nav)}</nav>'
        f'<p class="copy">&copy; {esc(SITE)}</p></div></footer>'
    )
    return (
        f'<!doctype html>\n<html lang="{CFG["lang"]}">\n<head>\n' + '\n'.join(head) + '\n</head>\n<body>\n'
        f'<a class="skip" href="#main">本文へ</a>\n{hub}\n'
        f'<header class="site-header"><div class="wrap bar"><a class="brand" href="{url("/")}">{esc(SITE)}</a>'
        f'<nav class="gnav" aria-label="メイン">{"".join(nav)}</nav></div></header>\n'
        f'<main id="main">\n{main}\n</main>\n{footer}\n</body>\n</html>\n'
    )


GENERATED = []   # (path, title, desc, lastmod)


def write_page(path, content):
    dest = OUT / 'index.html' if path == '/' else OUT / path.strip('/') / 'index.html'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, 'utf-8')


def require(meta, keys, where):
    for k in keys:
        if not meta.get(k):
            errors.append(f'{where}: front matter に {k} がありません')


# ---------- 出力先の初期化 ----------
if OUT.exists():
    for child in OUT.iterdir():
        shutil.rmtree(child) if child.is_dir() else child.unlink()
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'assets').mkdir()
shutil.copy(CSS_SRC, OUT / 'assets' / 'site.css')

# ---------- 記事 ----------
posts = []
for f in sorted((ROOT / 'posts').glob('*.md')):
    if f.name.startswith('_'):
        continue
    meta, body = parse(f.read_text('utf-8'))
    require(meta, ['title', 'description', 'date'], f.name)
    if errors:
        continue
    if meta.get('draft', '').lower() == 'true' and not args.drafts:
        continue
    slug = meta.get('slug') or f.stem
    posts.append({
        'slug': slug, 'path': f'/blog/{slug}/', 'title': meta['title'], 'desc': meta['description'],
        'date': meta['date'], 'updated': meta.get('updated', meta['date']),
        'tags': [t.strip() for t in meta.get('tags', '').split(',') if t.strip()],
        'html': md(body), 'draft': meta.get('draft', '').lower() == 'true'})
posts.sort(key=lambda p: p['date'], reverse=True)


def post_list(items):
    if not items:
        return '<p class="muted">記事は準備中です。</p>'
    rows = []
    for p in items:
        rows.append(
            f'<li><a href="{url(p["path"])}"><time datetime="{p["date"]}">{fmt_date(p["date"])}</time>'
            f'<span class="pt">{esc(p["title"])}</span></a><p>{esc(p["desc"])}</p></li>')
    return '<ul class="post-list">' + ''.join(rows) + '</ul>'


# ---------- 固定ページ ----------
for f in sorted((ROOT / 'pages').glob('*.md')):
    meta, body = parse(f.read_text('utf-8'))
    require(meta, ['title', 'description'], f.name)
    if errors:
        continue
    slug = f.stem
    path = '/' if slug == 'index' else f'/{slug}/'
    body_html = (md(body).replace('{{latest_posts}}', post_list(posts[:3]))
                 .replace('{{address}}', esc(ADDRESS)).replace('{{map_url}}', esc(MAP_URL))
                 .replace('{{map_embed}}', MAP_EMBED))
    jsonld = []
    if path == '/':
        jsonld = [ld_org(), ld_website()]
        main = body_html
    else:
        trail = [('ホーム', '/'), (meta.get('h1', meta['title']), path)]
        jsonld = [ld_breadcrumb(trail)]
        if meta.get('faq', '').lower() == 'true':
            items = faq_items(body)
            if items:
                jsonld.append(ld_faq(items))
        main = (f'<div class="wrap page">{breadcrumb_html(trail)}<h1>{inline(meta.get("h1", meta["title"]))}</h1>'
                f'<div class="prose">{body_html}</div></div>')
    write_page(path, layout(title=meta['title'], desc=meta['description'], path=path, main=main, jsonld=jsonld))
    GENERATED.append((path, meta['title'], meta['description'], meta.get('updated', TODAY)))

# ---------- ブログ一覧・記事 ----------
blog_trail = [('ホーム', '/'), ('ブログ', '/blog/')]
blog_main = (f'<div class="wrap page">{breadcrumb_html(blog_trail)}<h1>ブログ</h1>'
             f'<p class="lead">税務調査への備え、公益法人の会計、システム・AI活用など、実務で役立つ情報を発信します。</p>'
             f'{post_list(posts)}</div>')
blog_desc = '坂口誠税理士事務所のブログ。国税局37年の経験をもとに、税務調査への備え、公益法人の会計、システム・AI活用などの情報を発信します。'
write_page('/blog/', layout(title='ブログ', desc=blog_desc, path='/blog/', main=blog_main,
                            jsonld=[ld_breadcrumb(blog_trail)]))
GENERATED.append(('/blog/', 'ブログ', blog_desc, posts[0]['updated'] if posts else TODAY))

for p in posts:
    trail = blog_trail + [(p['title'], p['path'])]
    others = [x for x in posts if x['slug'] != p['slug']][:3]
    tags = ''.join(f'<li>{esc(t)}</li>' for t in p['tags'])
    upd = f' <span>更新: <time datetime="{p["updated"]}">{fmt_date(p["updated"])}</time></span>' if p['updated'] != p['date'] else ''
    draft = '<p class="draftmark">※下書きのプレビューです(公開されません)</p>' if p['draft'] else ''
    related = f'<section class="related"><h2>ほかの記事</h2>{post_list(others)}</section>' if others else ''
    main = (
        f'<div class="wrap page article">{breadcrumb_html(trail)}{draft}<h1>{esc(p["title"])}</h1>'
        f'<p class="meta"><span>公開: <time datetime="{p["date"]}">{fmt_date(p["date"])}</time></span>{upd}</p>'
        f'{"<ul class=tags>" + tags + "</ul>" if tags else ""}'
        f'<div class="prose">{p["html"]}</div>'
        f'<aside class="note"><p>この記事は一般的な情報提供を目的としており、個別の事案についての税務上の助言ではありません。'
        f'具体的なご状況については、専門家へご相談ください。</p></aside>'
        f'<aside class="cta-box"><p class="cta-t">税務調査・公益法人・申告のご相談</p>'
        f'<p>ご相談の方法は<a href="{url("/contact/")}">お問い合わせ</a>をご覧ください。</p></aside>'
        f'{related}</div>')
    write_page(p['path'], layout(title=p['title'], desc=p['desc'], path=p['path'], main=main,
                                 jsonld=[ld_post(p), ld_breadcrumb(trail)], og_type='article', nav_path='/blog/'))
    if not p['draft']:
        GENERATED.append((p['path'], p['title'], p['desc'], p['updated']))

# ---------- 404 / sitemap / robots / feed ----------
nf = ('<div class="wrap page"><h1>ページが見つかりません</h1><p>お探しのページは移動または削除された可能性があります。</p>'
      f'<p><a href="{url("/")}">ホームへ戻る</a> ／ <a href="{url("/blog/")}">ブログ一覧</a></p></div>')
(OUT / '404.html').write_text(layout(title='ページが見つかりません', desc='お探しのページが見つかりません。', path='/404.html',
                                     main=nf, jsonld=[], noindex=True), 'utf-8')

sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path, _, _, lastmod in GENERATED:
    sm.append(f'<url><loc>{abs_url(path)}</loc><lastmod>{lastmod}</lastmod></url>')
sm.append('</urlset>')
(OUT / 'sitemap.xml').write_text('\n'.join(sm) + '\n', 'utf-8')

if CFG.get('noindex'):
    robots = 'User-agent: *\nDisallow: /\n'
else:
    robots = f'User-agent: *\nAllow: /\n\nSitemap: {abs_url("/sitemap.xml")}\n'
(OUT / 'robots.txt').write_text(robots, 'utf-8')

feed = ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0"><channel>',
        f'<title>{esc(SITE)} ブログ</title>', f'<link>{abs_url("/blog/")}</link>',
        f'<description>{esc(CFG["tagline"])}</description>', '<language>ja</language>']
for p in [x for x in posts if not x['draft']][:20]:
    dt = datetime.datetime.fromisoformat(p['date']).replace(tzinfo=datetime.timezone(datetime.timedelta(hours=9)))
    feed.append(f'<item><title>{esc(p["title"])}</title><link>{abs_url(p["path"])}</link>'
                f'<guid>{abs_url(p["path"])}</guid><pubDate>{email.utils.format_datetime(dt)}</pubDate>'
                f'<description>{esc(p["desc"])}</description></item>')
feed.append('</channel></rss>')
(OUT / 'feed.xml').write_text('\n'.join(feed) + '\n', 'utf-8')

# ---------- 検証(リンク切れ・JSON-LD・SEOの目安) ----------
for f in OUT.rglob('*.html'):
    t = f.read_text('utf-8')
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', t, re.S):
        try:
            json.loads(m.group(1).replace('<\\/', '</'))
        except Exception as e:
            errors.append(f'{f.relative_to(OUT)}: JSON-LDが不正 ({e})')
    for m in re.finditer(r'(?:href|src)="([^"#?]+)', t):
        u = m.group(1)
        if BP and u.startswith(BP + '/'):
            rel = u[len(BP):]
        elif not BP and u.startswith('/') and not u.startswith('//'):
            rel = u
        elif u.startswith(BASE + '/'):
            rel = u[len(BASE):]
        else:
            continue
        target = OUT / rel.lstrip('/')
        if rel.endswith('/'):
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'{f.relative_to(OUT)}: リンク先がありません → {u}')

for path, title, desc, _ in GENERATED:
    if len(title) > 32:
        warnings.append(f'{path}: タイトルが長め({len(title)}字)。検索結果では約30字前後で切れます')
    if len(desc) < 60 or len(desc) > 120:
        warnings.append(f'{path}: descriptionが{len(desc)}字(目安は60〜120字)')

print(f'生成: {len(GENERATED)}ページ(記事{len(posts)}件) → {OUT}')
print(f'noindex: {CFG.get("noindex")} / base_url: {BASE}')
for w in warnings:
    print('注意:', w)
for e in errors:
    print('エラー:', e)
sys.exit(1 if errors else 0)
