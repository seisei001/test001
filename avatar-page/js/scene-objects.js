// 空を飛ぶ蝶・鳥と、地面で弾むボールを自律的に動かすモジュール
const FLYER_EMOJIS = ['🦋', '🐦', '🐝'];
const GRAVITY = 320; // px/sec^2

class Flyer {
  constructor(el, bounds) {
    this.el = el;
    this.bounds = bounds;
    this.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    this.y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
    this.retargetIn = 0;
  }

  _pickNewDirection() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 25 + Math.random() * 35;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.retargetIn = 1.5 + Math.random() * 2.5;
  }

  update(dt) {
    this.retargetIn -= dt;
    if (this.retargetIn <= 0) this._pickNewDirection();

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const { minX, maxX, minY, maxY } = this.bounds;
    if (this.x < minX || this.x > maxX) { this.vx *= -1; this.x = Math.min(maxX, Math.max(minX, this.x)); }
    if (this.y < minY || this.y > maxY) { this.vy *= -1; this.y = Math.min(maxY, Math.max(minY, this.y)); }

    this.el.style.transform = `translate(${this.x}px, ${this.y}px) scaleX(${this.vx < 0 ? -1 : 1})`;
  }
}

class BouncingBall {
  constructor(el, bounds) {
    this.el = el;
    this.bounds = bounds; // { minX, maxX, groundY }
    this.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    this.y = bounds.groundY;
    this.vx = (Math.random() < 0.5 ? -1 : 1) * 60;
    this.vy = -200;
  }

  update(dt) {
    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.y > this.bounds.groundY) {
      this.y = this.bounds.groundY;
      this.vy = Math.abs(this.vy) < 40 ? -220 : this.vy * -0.7;
    }
    if (this.x < this.bounds.minX || this.x > this.bounds.maxX) {
      this.vx *= -1;
      this.x = Math.min(this.bounds.maxX, Math.max(this.bounds.minX, this.x));
    }

    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }
}

export function initSceneObjects(sceneEl) {
  const width = sceneEl.clientWidth;
  const height = sceneEl.clientHeight;
  const grassHeightPx = window.innerHeight * 0.22;
  const groundY = height - grassHeightPx - 10;

  const objects = FLYER_EMOJIS.flatMap((emoji) => {
    const el = document.createElement('div');
    el.className = 'flyer';
    el.textContent = emoji;
    sceneEl.appendChild(el);
    return [new Flyer(el, { minX: 10, maxX: width - 40, minY: 10, maxY: height - 40 })];
  });

  const ballEl = document.createElement('div');
  ballEl.className = 'flyer';
  ballEl.textContent = '⚽';
  sceneEl.appendChild(ballEl);
  objects.push(new BouncingBall(ballEl, { minX: 10, maxX: width - 40, groundY }));

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    objects.forEach((o) => o.update(dt));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
