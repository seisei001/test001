// 女性アバターを完全に自律的(ユーザー操作なし)に動かすモジュール。
// キャラクター素材: Kenney "Toon Characters 1" の Female adventurer
// (CC0 Public Domain, https://kenney.nl/assets/toon-characters-1) を1枚のスプライトシートのまま使用。
// walk0〜7 / run0〜2 は素材に収録されている実際の歩行・走行モーションをそのまま再生している。
const FRAME = {
  idle: [0, 0],
  jump: [96, 0],
  think: [288, 384],
  cheer0: [672, 0],
  cheer1: [768, 0],
  talk: [0, 256],
  wide: [672, 384],
};
const WALK_FRAMES = [
  [0, 512], [96, 512], [192, 512], [288, 512],
  [384, 512], [480, 512], [576, 512], [672, 512],
];
const RUN_FRAMES = [[576, 256], [672, 256], [768, 256]];

const MOOD_EMOJI = { think: '💭', talk: '🎵', cheer: '✨' };

const WALK_FRAME_DURATION = 0.09;
const RUN_FRAME_DURATION = 0.07;
const WALK_SPEED_PX_PER_SEC = 90;
const RUN_SPEED_PX_PER_SEC = 190;
const JUMP_DURATION_MS = 500;

// 次に取る行動をランダムに選ぶための重み付き一覧。
// walk/run は移動、jump は足踏み、それ以外はその場での仕草。
const ACTIONS = [
  { name: 'walk', weight: 35 },
  { name: 'run', weight: 12 },
  { name: 'idle', weight: 18 },
  { name: 'think', weight: 12 },
  { name: 'talk', weight: 10 },
  { name: 'cheer', weight: 8 },
  { name: 'jump', weight: 5 },
];
const TOTAL_WEIGHT = ACTIONS.reduce((sum, a) => sum + a.weight, 0);

function pickAction() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const a of ACTIONS) {
    if ((r -= a.weight) <= 0) return a.name;
  }
  return 'idle';
}

export default class Avatar {
  constructor(el, sceneEl) {
    this.el = el;
    this.sceneEl = sceneEl;
    this.sprite = el.querySelector('.avatar-sprite');
    this.moodEl = el.querySelector('.avatar-mood');
    this.x = sceneEl.clientWidth * 0.4;

    this.state = 'idle';
    this.cheerFrameTimer = 0;
    this.cheerFrameIndex = 0;
    this.walkFrameTimer = 0;
    this.walkFrameIndex = 0;
    this.runFrameTimer = 0;
    this.runFrameIndex = 0;
    this.jumping = false;

    this._applyPosition();
    this._setFrame(FRAME.idle);
    this._scheduleNextAction(800);

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

  _showMood(mood) {
    if (!mood) {
      this.moodEl.classList.remove('visible');
      return;
    }
    this.moodEl.textContent = MOOD_EMOJI[mood];
    this.moodEl.classList.add('visible');
  }

  _moveTo(targetX, speed) {
    const { min, max } = this._bounds();
    targetX = Math.min(max, Math.max(min, targetX));
    const distance = Math.abs(targetX - this.x);
    const duration = Math.min(3, Math.max(0.3, distance / speed));

    this.el.classList.toggle('facing-left', targetX < this.x);
    this.el.style.setProperty('--move-duration', `${duration}s`);
    this.x = targetX;
    this._applyPosition();
    return duration;
  }

  _startIdleGesture(name, minMs, maxMs) {
    this.state = name;
    this._showMood(name === 'idle' ? null : name);
    if (name === 'cheer') {
      this.cheerFrameTimer = 0;
      this.cheerFrameIndex = 0;
    } else {
      this._setFrame(FRAME[name] || FRAME.idle);
    }
    const duration = minMs + Math.random() * (maxMs - minMs);
    this._scheduleNextAction(duration);
  }

  _startMove(kind) {
    this.state = kind;
    this._showMood(null);
    const { min, max } = this._bounds();
    const targetX = min + Math.random() * (max - min);
    const speed = kind === 'run' ? RUN_SPEED_PX_PER_SEC : WALK_SPEED_PX_PER_SEC;
    const duration = this._moveTo(targetX, speed);
    this._scheduleNextAction(duration * 1000 + 150);
  }

  _startJump() {
    this.state = 'idle';
    this._showMood(null);
    this.jumping = true;
    this.jumpStart = performance.now();
    this.sprite.classList.remove('jumping');
    void this.sprite.offsetWidth;
    this.sprite.classList.add('jumping');
    this._scheduleNextAction(JUMP_DURATION_MS + 300);
  }

  _scheduleNextAction(afterMs) {
    clearTimeout(this._nextActionTimer);
    this._nextActionTimer = setTimeout(() => this._chooseNextAction(), afterMs);
  }

  _chooseNextAction() {
    const action = pickAction();
    switch (action) {
      case 'walk':
      case 'run':
        this._startMove(action);
        break;
      case 'jump':
        this._startJump();
        break;
      case 'think':
      case 'talk':
        this._startIdleGesture(action, 1800, 3200);
        break;
      case 'cheer':
        this._startIdleGesture('cheer', 1400, 2200);
        break;
      default:
        this._startIdleGesture('idle', 1200, 2600);
    }
  }

  _tick(now) {
    const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;

    if (this.jumping && now - this.jumpStart >= JUMP_DURATION_MS) {
      this.jumping = false;
      this.sprite.classList.remove('jumping');
    }

    if (this.jumping) {
      this._setFrame(FRAME.jump);
    } else if (this.state === 'walk') {
      this.walkFrameTimer += dt;
      while (this.walkFrameTimer >= WALK_FRAME_DURATION) {
        this.walkFrameTimer -= WALK_FRAME_DURATION;
        this.walkFrameIndex = (this.walkFrameIndex + 1) % WALK_FRAMES.length;
      }
      this._setFrame(WALK_FRAMES[this.walkFrameIndex]);
    } else if (this.state === 'run') {
      this.runFrameTimer += dt;
      while (this.runFrameTimer >= RUN_FRAME_DURATION) {
        this.runFrameTimer -= RUN_FRAME_DURATION;
        this.runFrameIndex = (this.runFrameIndex + 1) % RUN_FRAMES.length;
      }
      this._setFrame(RUN_FRAMES[this.runFrameIndex]);
    } else if (this.state === 'cheer') {
      this.cheerFrameTimer += dt;
      while (this.cheerFrameTimer >= 0.25) {
        this.cheerFrameTimer -= 0.25;
        this.cheerFrameIndex = 1 - this.cheerFrameIndex;
      }
      this._setFrame(this.cheerFrameIndex === 0 ? FRAME.cheer0 : FRAME.cheer1);
    }

    requestAnimationFrame((t) => this._tick(t));
  }
}
