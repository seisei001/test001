# 育てる質問箱

会話やWebページの内容をどんどん取り込み、質問するたびにその蓄積から関連情報を
探し出してAIに渡す、ブラウザだけで動くアプリです。iPhoneからも使えます。

## 全体構成

```
① このページ(index.html)  ── ハブ経由でiPhoneからもアクセス可能
        │
        ▼ 通信
② Cloudflare Worker(worker.js) ── CORSを解決する仲介役
        │
        ├──▶ Hugging Face(ベクトル化)
        ├──▶ Gemini / Claude / ChatGPT(回答生成)
        └──▶ Cloudflare D1(データの保存・検索)
```

画面(①)はGitHub Pagesの静的ファイルなのでサーバー不要ですが、②のWorkerだけは
別途Cloudflareに公開しておく必要があります。**デプロイは最初の1回だけ**で、
以降はWorkerが自動的に動き続けます(PCを起動しておく必要はありません)。

## デプロイ手順(最初の1回だけ、スマホのブラウザでも可能)

### 1. Cloudflareの無料アカウントを作る

https://dash.cloudflare.com/sign-up (まだ持っていない場合)

### 2. D1データベースを用意する

このリポジトリの管理者が既に `raglog-db` という名前のD1データベースを
作成済みです(自分で新しく作る場合は、Cloudflareダッシュボードの
**Workers & Pages → D1** から「Create database」)。

以下のテーブルが必要です(既に作成済みならスキップ可):

```sql
CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    embedding TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_ref TEXT,
    question TEXT,
    rating TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL
);
```

### 3. Workerを作成する

1. Cloudflareダッシュボード → **Workers & Pages** → **Create** → **Workers** → 適当な名前(例: `raglog`)で作成
2. 作成後、「Edit code」(Quick Edit)を開く
3. エディタの中身を全部削除し、このフォルダの `worker.js` の内容をコピー&ペースト
4. 「Deploy」を押す
5. 発行されたURL(例: `https://raglog.あなたのアカウント名.workers.dev`)をメモしておく

### 4. D1データベースをWorkerに紐付ける

1. 作成したWorkerの **Settings → Bindings** を開く
2. 「Add binding」→「D1 database」を選択
3. 変数名(Variable name)を **`DB`**(この名前が必須)、Database は `raglog-db` を選択
4. 保存

### 5. 合言葉(APP_SECRET)を設定する

1. 同じく **Settings → Variables and Secrets**
2. 「Add」で変数名 **`APP_SECRET`** を追加し、Type を **Secret** にして、好きな文字列(パスワードのようなもの)を値として設定
3. この値は後でアプリ側の「設定」画面にも同じものを入力します(この合言葉が一致しないと、他人がこのWorkerを勝手に使えないようにする仕組みです)

### 6. アプリ側の設定

このアプリ(`index.html`)を開き、「設定」タブで:

- **WorkerのURL**: 手順3でメモしたURL
- **合言葉**: 手順5で決めた `APP_SECRET` の値
- **Hugging Faceのキー**: https://huggingface.co/settings/tokens で無料発行
- 回答生成に使うAI(Gemini/Claude/ChatGPT)のキー

を入力して保存すれば完了です。

## セキュリティについて

- APIキー・合言葉は、あなたのブラウザ内(localStorage)だけに保存されます
- Workerは合言葉(`APP_SECRET`)が一致しないリクエストを拒否するので、
  URLを知らない第三者がこのWorker・データベースを勝手に使うことはできません
- ただしAPIキー自体はリクエストのたびにWorkerへ送られるので、
  信頼できる自分の端末以外でこのページを開かないようにしてください
