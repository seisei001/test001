// 女性アバターの位置(自律的な歩き回り+ユーザーのちょい足し操作)と、
// スプライトシートのフレーム切り替えによる歩行アニメーションを担当するモジュール。
// キャラクター素材: Kenney "Toon Characters 1" の Female adventurer
// (CC0 Public Domain, https://kenney.nl/assets/toon-characters-1) を1枚のスプライトシートのまま使用。
// walk0〜walk7 は素材に収録されている実際の歩行モーション(8フレーム)をそのまま再生している。
const IDLE_FRAME = [0, 0];
const JUMP_FRAME = [96, 0];
const WALK_FRAMES = [
  [0, 512], [96, 512], [192, 512], [288, 512],
  [384, 512], [480, 512], [576, 512], [672, 512],
];
const WALK_FRAME_DURATION = 0.09; // 1フレームあたりの秒数(歩行アニメーションの速さ)

const AUTO_PAUSE_MS = 4000;
const WALK_SPEED_PX_PER_SEC = 90;
const JUMP_DURATION_MS = 500;

export default class Avatar {
  constructor(el, sceneEl) {
    this.el = el;
    this.sceneEl = sceneEl;
    this.sprite = el.querySelector('.avatar-sprite');
    this.x = sceneEl.clientWidth * 0.4;
    this.pausedUntil = 0;
    this.moving = false;
    this.jumping = false;
    this.walkFrameTimer = 0;
    this.walkFrameIndex = 0;

    this._applyPosition();
    this._setFrame(IDLE_FRAME);
    this._scheduleAutoWalk();

    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this._tick(t));
  }

  _bounds() {
    const half = this.el.clientWidth / 2;
    return { min: half, max: this.sceneEl.clientWidth - half };
  }

  _applyPosition() {
    this.el.style.left = `${this.x}px`;
  }

  _setFrame([x, y]) {
    this.sprite.style.backgroundPosition = `-${x}px -${y}px`;
  }

  _moveTo(targetX) {
    const { min, max } = this._bounds();
    targetX = Math.min(max, Math.max(min, targetX));
    const distance = Math.abs(targetX - this.x);
    const duration = Math.min(2.2, Math.max(0.3, distance / WALK_SPEED_PX_PER_SEC));

    this.el.classList.toggle('facing-left', targetX < this.x);
    this.el.style.transitionDuration = `${duration}s`;
    this.x = targetX;
    this._applyPosition();

    this.moving = true;
    clearTimeout(this._moveEndTimer);
    this._moveEndTimer = setTimeout(() => { this.moving = false; }, duration * 1000);
  }

  nudge(deltaPx) {
    this.pausedUntil = Date.now() + AUTO_PAUSE_MS;
    this._moveTo(this.x + deltaPx);
  }

  jump() {
    this.pausedUntil = Date.now() + AUTO_PAUSE_MS;
    this.jumping = true;
    this.jumpStart = performance.now();
    this.sprite.classList.remove('jumping');
    void this.sprite.offsetWidth;
    this.sprite.classList.add('jumping');
  }

  _scheduleAutoWalk() {
    const delay = 1500 + Math.random() * 2500;
    setTimeout(() => {
      if (Date.now() >= this.pausedUntil) {
        const { min, max } = this._bounds();
        this._moveTo(min + Math.random() * (max - min));
      }
      this._scheduleAutoWalk();
    }, delay);
  }

  _tick(now) {
    const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;

    if (this.jumping && now - this.jumpStart >= JUMP_DURATION_MS) {
      this.jumping = false;
      this.sprite.classList.remove('jumping');
    }

    if (this.jumping) {
      this._setFrame(JUMP_FRAME);
    } else if (this.moving) {
      this.walkFrameTimer += dt;
      while (this.walkFrameTimer >= WALK_FRAME_DURATION) {
        this.walkFrameTimer -= WALK_FRAME_DURATION;
        this.walkFrameIndex = (this.walkFrameIndex + 1) % WALK_FRAMES.length;
      }
      this._setFrame(WALK_FRAMES[this.walkFrameIndex]);
    } else {
      this.walkFrameIndex = 0;
      this.walkFrameTimer = 0;
      this._setFrame(IDLE_FRAME);
    }

    requestAnimationFrame((t) => this._tick(t));
  }
}
