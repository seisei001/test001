// 女性アバターの表示位置と「自律的に歩き回る」「少しだけ操作できる」動きを管理するモジュール
const AUTO_PAUSE_MS = 4000; // 操作後、自動で歩き出すまでの待機時間
const WALK_SPEED_PX_PER_SEC = 90;

export default class Avatar {
  constructor(el, sceneEl) {
    this.el = el;
    this.sceneEl = sceneEl;
    this.x = sceneEl.clientWidth * 0.4;
    this.pausedUntil = 0;

    this.el.addEventListener('transitionend', () => this.el.classList.remove('walking'));
    this._applyPosition();
    this._scheduleAutoWalk();
  }

  _bounds() {
    const half = this.el.clientWidth / 2;
    return { min: half, max: this.sceneEl.clientWidth - half };
  }

  _applyPosition() {
    this.el.style.left = `${this.x}px`;
  }

  _moveTo(targetX) {
    const { min, max } = this._bounds();
    targetX = Math.min(max, Math.max(min, targetX));

    const distance = Math.abs(targetX - this.x);
    const duration = Math.min(2.2, Math.max(0.3, distance / WALK_SPEED_PX_PER_SEC));

    this.el.classList.toggle('facing-left', targetX < this.x);
    this.el.style.transitionDuration = `${duration}s`;
    this.el.classList.add('walking');

    this.x = targetX;
    this._applyPosition();
  }

  // ユーザー操作: 少しだけ左右に動かす
  nudge(deltaPx) {
    this.pausedUntil = Date.now() + AUTO_PAUSE_MS;
    this._moveTo(this.x + deltaPx);
  }

  jump() {
    this.pausedUntil = Date.now() + AUTO_PAUSE_MS;
    this.el.classList.remove('jumping');
    void this.el.offsetWidth; // アニメーション再生のための強制リフロー
    this.el.classList.add('jumping');
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
}
