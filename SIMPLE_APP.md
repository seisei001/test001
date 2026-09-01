# シンプルWebアプリ (app.py)

Pythonの標準ライブラリ(`http.server`)のみで動く、外部フレームワーク不要の単一ファイルWebアプリです。**ターミナル操作なし、iPhoneのブラウザだけ**で動作確認から公開まで完結します。

- `/` : 現在時刻・稼働時間・アクセス回数などを表示するHTMLページ
- `/health` : ヘルスチェック用JSON(`{"status": "ok"}`)
- `/api/time` : 現在時刻のJSON
- `/api/hello?name=Claude` : 簡単な挨拶JSON

## iPhoneのSafariでGitHub Codespacesを使って動作確認する(タップ操作のみ)

1. Safariで `https://github.com/seisei001/test001` を開く(デスクトップ用Webサイト表示にしておくと操作しやすい)
2. ブランチを `claude/url-link-homepage-i7jbdz` に切り替える
3. 緑色の **Code** ボタン → **Codespaces** タブ → **Create codespace on claude/url-link-homepage-i7jbdz** をタップ
4. 数十秒〜数分待つ(環境が自動的に構築される)。ブラウザ上にVS Codeの画面が開く
5. `.devcontainer/devcontainer.json` の設定により、起動と同時にアプリが自動で立ち上がり、ポート8000のプレビューが**自動的に新しいタブで開く**(ターミナルを開いたりコマンドを打つ操作は不要)
6. もし自動で開かない場合は、画面下の **PORTS** タブに8000番が表示されているので、そこの「地球儀アイコン(Open in Browser)」をタップする

コードを直接ブラウザ上で編集した場合も、画面左側の **Source Control(分岐アイコン)** パネルから、変更にメッセージを入力して **Commit** → **Sync Changes** をタップするだけでGitHubに反映できます(`git`コマンドの入力は不要)。

## Renderで無料公開する(タップ操作のみ)

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
