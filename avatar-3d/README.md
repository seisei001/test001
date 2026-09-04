# 自律で動く3D女性アバター (avatar-3d)

現代のゲームで主流な3D(VRM形式)の女性アバターが、呼吸・瞬き・視線の動き・軽い仕草を
完全に自律的に行う様子をただ眺めるWebアプリです。カメラはゆっくり自動で回転し、
ドラッグすると一時的に視点を操作できます(離すとまた自動回転に戻ります)。アバター自体への
操作はありません。

## 使い方

```bash
cd avatar-3d
npm install
npm run dev
```

表示されたURL(通常 `http://localhost:5173`)をブラウザで開いてください。

`public/models/avatar.vrm` が無い場合はピンク色のプレースホルダーが表示されます。
配置方法は `public/models/README.md` を参照してください。

## iPhoneなどスマホから見る(GitHub Pages公開)

このアプリ自体はWebGL・タッチ操作に対応しているためiPhoneのSafariでも動作しますが、
`npm run dev` はこの開発環境内でしか開けないため、外部からアクセスするには公開が必要です。

```bash
cd avatar-3d
npm run build
```

`vite.config.js` の設定により、ビルド結果は `docs/avatar-3d/` に出力されます
(GitHub Pagesのサブフォルダとして公開する想定)。`avatar.vrm` を配置してからビルドすれば、
アバター本体も含めて公開されます。

1. GitHubのリポジトリページで **Settings → Pages** を開く
2. 「Build and deployment」の **Source** を `Deploy from a branch` にする
3. **Branch** で公開したいブランチ、フォルダは **`/docs`** を選択して **Save**
4. 数分待つと `https://<ユーザー名>.github.io/<リポジトリ名>/avatar-3d/` で公開される

この設定はリポジトリの管理者権限が必要なため、GitHub上で手動で行ってください。

## 使用しているアバター素材

**VRoid公式サンプル「AvatarSample_A」**を想定しています。

- 配布元: https://hub.vroid.com/en/characters/2843975675147313744/models/5644550979324015604
- ライセンス: VRoid Hubの利用条件により、法人・個人問わず商用利用可、クレジット表記不要、改変も可能
- ファイル自体はライセンス上の理由でこのリポジトリには含めていません。`public/models/README.md` の手順に従って各自ダウンロードしてください

## 技術構成

- [Three.js](https://threejs.org/) — 3D描画
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) — VRM(VRoidアバター)のロードとヒューマノイドボーン操作
- [Vite](https://vitejs.dev/) — 開発サーバー/ビルド

## 自律動作の仕組み(`src/avatar-controller.js`)

外部モーションファイルは使わず、VRMのヒューマノイドボーンと表情(Expression)APIを直接
サイン波・乱数で駆動している。

- **呼吸**: 胸・背骨をゆっくり前後に傾ける
- **重心の揺れ**: 腰を左右にスウェイ
- **視線**: 数秒おきにランダムな方向へゆるやかに首・頭を向ける
- **瞬き**: ランダムな間隔で自動まばたき
- **仕草**: 数秒おきに軽く腕を上げ下げする

## 拡張性・将来のゲーム化について

- `avatar-controller.js` の各動作は独立した関数的な処理なので、新しい仕草(手を振る、
  お辞儀するなど)を同じ書き方で追加できる
- Three.jsは汎用3Dエンジンなので、将来的に当たり判定・入力操作・複数キャラクター・
  ネットワーク同期などを追加してゲーム化する余地がある
- VRM形式のアバターはVRChat/cluster/バーチャルキャストなど他のプラットフォームでも
  そのまま使われている業界標準フォーマットのため、素材の使い回しがしやすい
