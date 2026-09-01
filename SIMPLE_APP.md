# シンプルWebアプリ (app.py)

Pythonの標準ライブラリ(`http.server`)のみで動く、外部フレームワーク不要の単一ファイルWebアプリです。

## ローカルで動かす

```bash
python3 app.py
```

デフォルトで `http://localhost:8000` で起動します。ポートを変えたい場合は `PORT` 環境変数を指定してください。

```bash
PORT=8080 python3 app.py
```

- `/` : 現在時刻・稼働時間・アクセス回数などを表示するHTMLページ
- `/health` : ヘルスチェック用JSON(`{"status": "ok"}`)
- `/api/time` : 現在時刻のJSON
- `/api/hello?name=Claude` : 簡単な挨拶JSON

## Renderで自動公開する

このリポジトリ直下の `render.yaml` を使うと、Render側の細かい手動設定なしにデプロイできます。

1. https://dashboard.render.com を開き、GitHubアカウントと連携する(初回のみ)
2. **New → Blueprint** を選び、このリポジトリ(`seisei001/test001`)を選択する
   - もしくは次のURLを開くと同じ操作を自動で始められます:
     `https://render.com/deploy?repo=https://github.com/seisei001/test001`
3. ブランチに `claude/url-link-homepage-i7jbdz` を指定して **Apply** を押す(`render.yaml` の内容がそのまま使われる)
4. 数分でビルド・起動が完了し、`https://simple-stdlib-app.onrender.com` のようなURLが発行される

この初回の連携(GitHubアカウントとRenderを紐付ける操作)だけは手動で必要ですが、それ以降は**このブランチに `git push` するだけで自動的に再デプロイ**されます(Renderの自動デプロイ機能)。

### 無料プランの制限について

Renderの無料プラン(`plan: free`)は、一定時間アクセスが無いとスリープし、次のアクセス時に起動し直すため初回応答が遅くなることがあります。常時起動が必要な場合は有料プランへの変更が必要です。
