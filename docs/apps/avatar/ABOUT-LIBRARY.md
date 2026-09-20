# autovrm

自律的に動くVRM女性アバターを描画する、**特定のアプリに依存しないビューアライブラリ**です。
DOM要素のIDや特定のUI構造には一切依存せず、渡された`<canvas>`要素だけを使います。

呼吸・瞬き・仕草(拍手・驚き・伸び・電話・考え事等)・歩行(開始→移動→停止の3段階)・
走行・座る・代替アイドル、といった一通りの自律行動を、実際のモーションキャプチャ由来の
VRMAクリップで再生します(手続き型のサイン波モーションではありません)。

このリポジトリ(`seisei001/test001`)の`resources`ブランチは、この`autovrm`のような
**今後の再利用可能なコード資産を置いておく場所**として使っています。新しいモジュールが
増えたら、同じブランチに別フォルダとして追加していきます。

## 他のプロジェクトへの持ち込み方

このフォルダをまるごとコピーするだけで、別のアプリに組み込めます。

**方法A: このリポジトリ全体をクローン**
```bash
git clone -b resources --single-branch https://github.com/seisei001/test001.git
cp -r test001/autovrm /path/to/your-project/autovrm
```

**方法B: `degit`でこのフォルダだけ取得(gitの履歴なし、より軽量)**
```bash
npx degit seisei001/test001/autovrm#resources ./autovrm
```

取得したら:

1. 依存パッケージをインストール(peerDependencies、`package.json`参照):
   ```bash
   npm install three @pixiv/three-vrm @pixiv/three-vrm-animation
   ```
2. `autovrm/animations/` を自分のアプリの静的ファイル配信対象に置く
   (Apache-2.0のNOTICE.mdなど、ライセンス表示ファイルも一緒に持っていくこと)
3. VRMアバター本体(`.vrm`ファイル)を別途用意する。商用利用可・クレジット不要な
   ものとして、VRoid公式サンプル「AvatarSample_A」等がある(npm
   `@v-idol/vidol-agent-sample-a` から`model.vrm`を取り出して使うと、VRoid Hubへの
   ログインなしで入手できる)
4. 自分のアプリの`<canvas>`要素を用意して、`AvatarViewer`に渡す:

```js
import { AvatarViewer } from './autovrm/src/index.js';

const canvas = document.getElementById('my-canvas');
const viewer = new AvatarViewer(canvas, {
  avatarUrl: '/models/AvatarSample_A.vrm',
  assetsBaseUrl: '/autovrm', // animations/ を配信しているパスに合わせる
});

viewer.addEventListener('ready', () => console.log('avatar loaded'));
viewer.addEventListener('error', (e) => console.error('failed to load avatar', e.detail));
viewer.addEventListener('statechange', (e) => console.log('behavior:', e.detail));

viewer.start();

// 不要になったら
// viewer.dispose();
```

これだけで、呼吸・瞬き・仕草・歩行・座る等を含む一通りの自律行動が動き始めます。
ページ側で用意するのは`<canvas>`要素だけで良く、それ以外のDOM構造・CSSはビューア側は
一切要求しません。

## 主なAPI

### `new AvatarViewer(canvas, options)`

| オプション | 説明 |
|---|---|
| `avatarUrl` | VRMファイルのURL。省略時はプレースホルダー(ピンク色の簡易人形)のみ表示 |
| `assetsBaseUrl` | `avatarUrl`とアニメーション素材のパスすべてに付与するプレフィックス。CDNや別ディレクトリに素材を置く場合に指定(既定値: `''`) |
| `animationManifest` | `src/default-manifest.js`と同じ形式。省略時は同梱のデフォルト素材(座る・歩行・仕草など約40種)を使用。自分で用意したモーション集に丸ごと差し替えられる |
| `props` | シーンに用意する小道具(座る用スツール等)の定義。省略時はデフォルト |
| `behaviorWeights` | 行動選択の重み付け上書き(例: `[{type:'gesture', weight:80}, {type:'walk', weight:20}]`) |
| `behaviorTiming` | `{ minIntervalSeconds, maxIntervalSeconds }` — 次の行動までの待ち時間 |
| `walkConfig` | 歩行・走行の速度や範囲の調整 |
| `sceneOptions` | 背景色・カメラ距離・自動回転の有無など(`src/scene.js`参照) |

### メソッド・プロパティ

- `viewer.start()` / `viewer.stop()` — 描画ループの開始・停止
- `viewer.setAvatar(url)` — アバターを差し替える(非同期)
- `viewer.resize()` — キャンバスサイズ変更時に手動で呼ぶ(通常はwindowのresizeで自動対応)
- `viewer.dispose()` — 完全破棄。イベントリスナーやWebGLリソースを解放する
- `viewer.currentState` — 現在の行動状態の文字列(`'idle'` / `'gesture'` / `'walk-loop'` /
  `'seq-loop:sit'` 等)
- `viewer.activeProps` — 現在表示すべき小道具IDの`Set`

### イベント(`EventTarget`を継承)

- `'ready'` — アバターの読み込みが完了し、動き始めた
- `'error'`(`event.detail`にError) — アバターの読み込みに失敗し、プレースホルダー表示に切り替わった
- `'statechange'`(`event.detail`に状態文字列) — 行動状態が変化するたびに発行される

## 独自のモーション集に差し替える

`animationManifest`オプションに、`src/default-manifest.js`の`DEFAULT_ANIMATION_MANIFEST`と
同じ形の自作オブジェクトを渡せば、同梱のモーション素材を使わずに独自のVRMAファイル群で
動かせます。

```js
const myManifest = {
  idleAnimation: 'my-animations/idle.vrma',
  actionAnimations: ['my-animations/wave.vrma', 'my-animations/bow.vrma'],
  walkAnimations: { start: '...', loop: '...', stop: '...' }, // 省略可
  runAnimation: '...', // 省略可
  poseSequences: [
    { id: 'sit', enter: '...', loop: '...', exit: '...', minLoopSeconds: 8, maxLoopSeconds: 16, prop: 'stool' },
  ], // 省略可
};

new AvatarViewer(canvas, { animationManifest: myManifest, avatarUrl: '...' });
```

**重要**: `poseSequences`(座る等、前後で姿勢が変わる動作)は、必ず`enter`(立った状態から
入る遷移)・`loop`(その姿勢での待機ループ)・`exit`(元の姿勢に戻る遷移)の3点が揃っている
ものだけを登録すること。3点のうち1つでも読み込みに失敗すると、そのシーケンスは自動的に
無効化され使われない(直立⇔別の姿勢が不自然にワープするのを防ぐ安全策)。

## 同梱モーション素材の出典・ライセンス

| 出典 | ライセンス | 用途 |
|---|---|---|
| [pixiv/three-vrm](https://github.com/pixiv/three-vrm) 公式サンプル | MIT | デモ用アニメーション1個 |
| [tk256ailab/vrm-viewer](https://github.com/tk256ailab/vrm-viewer) | MIT | 感情表現11種 |
| [yv-was-taken/desktop-waifu](https://github.com/yv-was-taken/desktop-waifu) | MIT | 走行・ジャンプ・スピン・仕草類 |
| [Undi95/Hanami](https://github.com/Undi95/Hanami)(`vrma/`) | 大半はOverte由来(Apache-2.0)。座る動作の入退室のみQuaternius Universal Animation Library由来(CC0-1.0) | 歩行3段階・旋回・代替アイドル・座る一式 |
| npm `@hmcs/assets` | MIT AND CC-BY-4.0 | 立ち待機ポーズ1種 |

Apache-2.0部分の著作権表示は `animations/hanami/NOTICE.md` に同梱している(再配布時も
一緒に残すこと)。全ファイルについて、VRMのヒューマノイド「腰(hips)」ボーンの位置が
地面付近で安定していることを実機検証した上で採用している。

## 由来

このライブラリはもともと [`seisei001/vtubet`](https://github.com/seisei001/vtubet) という
Webアプリ(自律的に動くVRM女性アバターをただ眺めるアプリ)のために作られ、そこから
汎用部分だけを切り出したものです。
