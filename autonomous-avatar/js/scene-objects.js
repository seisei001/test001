// 空を飛ぶ蝶・鳥を自律的に動かす、見た目を賑やかにするだけの演出モジュール。
const FLYER_EMOJIS = ['🦋', '🐦', '🐝'];

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

export function initSceneObjects(sceneEl) {
  const width = sceneEl.clientWidth;
  const height = sceneEl.clientHeight;

  const objects = FLYER_EMOJIS.map((emoji) => {
    const el = document.createElement('div');
    el.className = 'flyer';
    el.textContent = emoji;
    sceneEl.appendChild(el);
    return new Flyer(el, { minX: 10, maxX: width - 40, minY: 10, maxY: height * 0.6 });
  });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    objects.forEach((o) => o.update(dt));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
