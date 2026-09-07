// デフォルトのモーション素材一覧(このアプリが最初から同梱しているもの)。
// 別アプリにこのライブラリを組み込む場合、この一覧をまるごと差し替えても
// 良いし、一部だけ流用しても良い。パスは AvatarViewer の `assetsBaseUrl`
// オプションと結合されるので、先頭にスラッシュは付けない。
//
// 全ファイル、VRMのヒューマノイド「腰(hips)」ボーンの位置が地面付近で
// 安定していることを実機検証した上で採用している(Mixamo経由の変換
// ファイルの一部に、腰の位置スケールが壊れてアバターが地面の下に沈む
// 不具合があったため、そうしたものは除外している)。
//
// 出典・ライセンス:
// - official/test.vrma: pixiv/three-vrm公式サンプル(MIT)
// - vrmviewer/*: tk256ailab/vrm-viewer(MIT)
// - desktopwaifu/*: yv-was-taken/desktop-waifu(MIT)
// - hanami/*: Undi95/Hanami(vrma/配下)。大半はOverte由来(Apache-2.0)。
//   world-sit-enter/exitのみQuaternius Universal Animation Library由来(CC0-1.0)。
//   Apache-2.0部分の著作権表示は public/animations/hanami/NOTICE.md を参照
//   (このファイルは再配布時も一緒に残すこと)。
// - hmcs/idle-maid.vrma: npm `@hmcs/assets`(MIT AND CC-BY-4.0)

export const DEFAULT_ANIMATION_MANIFEST = {
  idleAnimation: 'animations/vrmviewer/Relax.vrma',

  // 直立のまま始まり直立のまま終わる、ランダム再生用の仕草・ジェスチャー
  actionAnimations: [
    'animations/official/test.vrma',
    'animations/vrmviewer/Angry.vrma',
    'animations/vrmviewer/Blush.vrma',
    'animations/vrmviewer/Clapping.vrma',
    'animations/vrmviewer/Goodbye.vrma',
    'animations/vrmviewer/Jump.vrma',
    'animations/vrmviewer/LookAround.vrma',
    'animations/vrmviewer/Sad.vrma',
    'animations/vrmviewer/Sleepy.vrma',
    'animations/vrmviewer/Surprised.vrma',
    'animations/vrmviewer/Thinking.vrma',
    'animations/desktopwaifu/Cross_Jumps.vrma',
    'animations/desktopwaifu/Joyful_Jump.vrma',
    'animations/desktopwaifu/Spinning.vrma',
    'animations/desktopwaifu/Arm_Stretching.vrma',
    'animations/desktopwaifu/Stroke_Shaking_Head.vrma',
    'animations/desktopwaifu/talking.vrma',
    'animations/desktopwaifu/talking_on_phone.vrma',
    'animations/desktopwaifu/thinking.vrma',
    'animations/desktopwaifu/Femme_Peek_Around_Corner.vrma',
    'animations/hanami/world-turn-left.vrma',
    'animations/hanami/world-turn-right.vrma',
    'animations/hmcs/idle-maid.vrma',
  ],

  // 歩行: 開始→ループ(移動しながら)→停止、の3段階で自然に繋ぐ
  walkAnimations: {
    start: 'animations/hanami/world-walk-start.vrma',
    loop: 'animations/hanami/world-walk.vrma',
    stop: 'animations/hanami/world-walk-stop.vrma',
  },

  // 走行: 開始/停止クリップが無いため単純ループとして扱う
  runAnimation: 'animations/desktopwaifu/Running.vrma',

  // 「入る→ループ→出る」の3点セットが必要な姿勢(座る、代替アイドル等)。
  // この形式のものだけが、直立アイドルと安全に行き来できる。
  // `prop`を指定すると、そのIDが AvatarController#activeProps に
  // enter開始〜exit終了の間だけ含まれる(呼び出し側で小道具の表示に使える)。
  poseSequences: [
    {
      id: 'sit',
      enter: 'animations/hanami/world-sit-enter.vrma',
      loop: 'animations/hanami/world-sit-idle.vrma',
      exit: 'animations/hanami/world-sit-exit.vrma',
      minLoopSeconds: 8,
      maxLoopSeconds: 16,
      prop: 'stool',
    },
    {
      id: 'idle-alt1',
      enter: 'animations/hanami/world-idle-alt1-enter.vrma',
      loop: 'animations/hanami/world-idle-alt1.vrma',
      exit: 'animations/hanami/world-idle-alt1-exit.vrma',
      minLoopSeconds: 5,
      maxLoopSeconds: 9,
    },
    {
      id: 'idle-alt2',
      enter: 'animations/hanami/world-idle-alt2-enter.vrma',
      loop: 'animations/hanami/world-idle-alt2.vrma',
      exit: 'animations/hanami/world-idle-alt2-exit.vrma',
      minLoopSeconds: 5,
      maxLoopSeconds: 9,
    },
  ],
};

// 上記のシーケンスのうち `prop: 'stool'` を使うものがある間、
// AvatarViewerが自動的にこのジオメトリ定義でスツールを表示する。
export const DEFAULT_PROPS = {
  stool: {
    radiusTop: 0.2,
    radiusBottom: 0.22,
    height: 0.42,
    color: 0xc9a27a,
  },
};
