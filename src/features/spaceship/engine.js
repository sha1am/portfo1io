import { PHYSICS, TARGET_SELECTOR } from './constants';

const TAU = Math.PI * 2;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const rand = (min, max) => min + Math.random() * (max - min);

/**
 * Canvas overlay game: a ship that either flies itself toward the cursor or is
 * piloted with WASD, firing at the pointer. Deliberately framework-agnostic so
 * the React layer only has to call start() and destroy().
 *
 * Two rules shape the whole design:
 *  1. The page must stay usable. The canvas never takes pointer events, and
 *     keys are only swallowed once the visitor opts into piloting.
 *  2. The page must never be left broken. Hits move text with transforms only,
 *     and every one is restored on a timer and on destroy().
 */
export default class SpaceshipEngine {
  constructor({ canvas, onModeChange, accent = '#3ec8d4' }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onModeChange = onModeChange ?? (() => {});
    this.accent = accent;

    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    this.ship = { x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2 };
    this.pointer = { x: 0, y: 0, seen: false };
    this.bullets = [];
    this.particles = [];
    this.keys = new Set();

    this.piloted = false;
    this.cooldown = 0;
    this.lastFrame = 0;
    this.frame = null;
    this.running = false;

    this.targets = [];
    this.targetsStale = true;
    this.knocked = new Map();

    this.handleResize = this.handleResize.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.tick = this.tick.bind(this);
  }

  start(originX, originY) {
    if (this.running) return;
    this.running = true;

    this.handleResize();
    this.ship.x = originX ?? this.width / 2;
    this.ship.y = originY ?? this.height / 2;
    this.ship.vx = rand(-40, 40);
    this.ship.vy = -260;

    this.pointer.x = this.width / 2;
    this.pointer.y = this.height / 2;

    // A little burst so the ship reads as bursting out of the egg.
    this.spawnParticles(this.ship.x, this.ship.y, 26, '#f4e3c1');

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  destroy() {
    this.running = false;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    // Anything still displaced must be put back, whatever the reason we stopped.
    this.knocked.forEach((timers, element) => {
      clearTimeout(timers.recoil);
      clearTimeout(timers.settle);
      this.restore(element);
    });
    this.knocked.clear();

    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.keys.clear();
  }

  /* ---------------------------------------------------------------- input */

  handleResize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.targetsStale = true;
  }

  handleScroll() {
    this.targetsStale = true;
  }

  handlePointerMove(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.seen = true;
  }

  handleKeyDown(event) {
    // Never fight a real text field.
    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) {
      return;
    }

    const code = event.code;
    const isThrust = THRUST_KEYS.has(code);
    const isFire = code === 'Space';

    // WASD engages manual flight. Arrow keys and Space are how people scroll a
    // page, so they only become controls after the visitor has opted in -
    // otherwise the ship would silently break scrolling for everyone.
    if (!this.piloted) {
      if (!ENGAGE_KEYS.has(code)) return;
      this.piloted = true;
      this.onModeChange(true);
    }

    if (isThrust || isFire) {
      event.preventDefault();
      this.keys.add(code);
    }
  }

  handleKeyUp(event) {
    this.keys.delete(event.code);
  }

  /* --------------------------------------------------------------- update */

  tick(now) {
    if (!this.running) return;

    // Cap dt so a backgrounded tab does not teleport the ship on return.
    const dt = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;

    this.update(dt);
    this.render();

    this.frame = requestAnimationFrame(this.tick);
  }

  update(dt) {
    const ship = this.ship;

    if (this.piloted) {
      let ax = 0;
      let ay = 0;
      if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) ay -= 1;
      if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) ay += 1;
      if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) ax -= 1;
      if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) ax += 1;

      const len = Math.hypot(ax, ay);
      if (len > 0) {
        ship.vx += (ax / len) * PHYSICS.THRUST * dt;
        ship.vy += (ay / len) * PHYSICS.THRUST * dt;
        this.thrusting = true;
      } else {
        this.thrusting = false;
      }
    } else {
      // Auto-pilot: steer toward a point just short of the cursor so the ship
      // circles it rather than sitting on top of it.
      const dx = this.pointer.x - ship.x;
      const dy = this.pointer.y - ship.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = dist > PHYSICS.SEEK_STANDOFF ? 1 : -0.6;
      ship.vx += (dx / dist) * PHYSICS.SEEK * pull * dt;
      ship.vy += (dy / dist) * PHYSICS.SEEK * pull * dt;
      this.thrusting = dist > PHYSICS.SEEK_STANDOFF;
    }

    const decay = Math.exp(-PHYSICS.DRAG * dt);
    ship.vx *= decay;
    ship.vy *= decay;

    const speed = Math.hypot(ship.vx, ship.vy);
    if (speed > PHYSICS.MAX_SPEED) {
      ship.vx = (ship.vx / speed) * PHYSICS.MAX_SPEED;
      ship.vy = (ship.vy / speed) * PHYSICS.MAX_SPEED;
    }

    ship.x += ship.vx * dt;
    ship.y += ship.vy * dt;

    // Soft walls so the ship can never be lost off-screen.
    const pad = 22;
    if (ship.x < pad) { ship.x = pad; ship.vx = Math.abs(ship.vx) * PHYSICS.BOUNCE; }
    if (ship.x > this.width - pad) { ship.x = this.width - pad; ship.vx = -Math.abs(ship.vx) * PHYSICS.BOUNCE; }
    if (ship.y < pad) { ship.y = pad; ship.vy = Math.abs(ship.vy) * PHYSICS.BOUNCE; }
    if (ship.y > this.height - pad) { ship.y = this.height - pad; ship.vy = -Math.abs(ship.vy) * PHYSICS.BOUNCE; }

    // The nose tracks the pointer so firing is predictable - but only while
    // there is a meaningful direction to face. Sitting on top of the cursor
    // makes atan2 flip wildly and the ship spins on the spot.
    const aimX = this.pointer.x - ship.x;
    const aimY = this.pointer.y - ship.y;
    if (Math.hypot(aimX, aimY) > AIM_DEADZONE) {
      ship.angle = Math.atan2(aimY, aimX);
    }

    this.cooldown -= dt;
    const wantsFire = this.piloted
      ? this.keys.has('Space')
      : Math.hypot(this.pointer.x - ship.x, this.pointer.y - ship.y) > PHYSICS.SEEK_STANDOFF * 0.8;

    if (wantsFire && this.cooldown <= 0) {
      this.fire();
      this.cooldown = this.piloted
        ? PHYSICS.FIRE_COOLDOWN
        : PHYSICS.AUTO_FIRE_COOLDOWN;
    }

    this.updateBullets(dt);
    this.updateParticles(dt);
  }

  fire() {
    const { x, y, angle } = this.ship;
    this.bullets.push({
      x: x + Math.cos(angle) * 16,
      y: y + Math.sin(angle) * 16,
      vx: Math.cos(angle) * PHYSICS.BULLET_SPEED + this.ship.vx * 0.3,
      vy: Math.sin(angle) * PHYSICS.BULLET_SPEED + this.ship.vy * 0.3,
      life: PHYSICS.BULLET_LIFE,
    });
  }

  updateBullets(dt) {
    if (this.targetsStale) this.refreshTargets();

    for (let i = this.bullets.length - 1; i >= 0; i -= 1) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;

      const offscreen =
        b.life <= 0 || b.x < -40 || b.x > this.width + 40 || b.y < -40 || b.y > this.height + 40;

      if (offscreen) {
        this.bullets.splice(i, 1);
        continue;
      }

      const hit = this.hitTest(b.x, b.y);
      if (hit) {
        this.knock(hit, b.vx, b.vy);
        this.spawnParticles(b.x, b.y, 10, this.accent);
        this.bullets.splice(i, 1);
      }
    }
  }

  refreshTargets() {
    this.targetsStale = false;
    const nodes = document.querySelectorAll(TARGET_SELECTOR);
    const found = [];

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      // Only things actually on screen are worth testing each frame.
      if (rect.bottom < 0 || rect.top > this.height) return;
      if (rect.width === 0 || rect.height === 0) return;
      found.push({ node, rect });
    });

    this.targets = found;
  }

  hitTest(x, y) {
    for (let i = 0; i < this.targets.length; i += 1) {
      const { node, rect } = this.targets[i];
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return node;
      }
    }
    return null;
  }

  /**
   * Displaces an element using transform only. Transforms do not participate
   * in layout, so nothing can reflow, overlap or shift the page - and the
   * element is always put back.
   */
  knock(element, vx, vy) {
    const existing = this.knocked.get(element);
    if (existing) {
      clearTimeout(existing.recoil);
      clearTimeout(existing.settle);
    }

    const speed = Math.hypot(vx, vy) || 1;
    const power = 26;
    const dx = (vx / speed) * power + rand(-4, 4);
    const dy = (vy / speed) * power + rand(-4, 4);

    element.style.setProperty('--knock-x', `${dx.toFixed(1)}px`);
    element.style.setProperty('--knock-y', `${dy.toFixed(1)}px`);
    element.style.setProperty('--knock-rotate', `${rand(-7, 7).toFixed(1)}deg`);
    element.classList.add('is-knocked');

    // Two stages so the text springs back rather than snapping: first ease the
    // offsets to zero, then drop the class once the transition has finished.
    // Removing the class immediately would take the transition with it.
    const recoil = setTimeout(() => {
      element.style.setProperty('--knock-x', '0px');
      element.style.setProperty('--knock-y', '0px');
      element.style.setProperty('--knock-rotate', '0deg');

      const settle = setTimeout(() => {
        this.restore(element);
        this.knocked.delete(element);
      }, RECOVER_MS);

      const entry = this.knocked.get(element);
      if (entry) entry.settle = settle;
    }, HOLD_MS);

    this.knocked.set(element, { recoil, settle: null });
  }

  restore(element) {
    element.classList.remove('is-knocked');
    element.style.removeProperty('--knock-x');
    element.style.removeProperty('--knock-y');
    element.style.removeProperty('--knock-rotate');
  }

  spawnParticles(x, y, count, color) {
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, TAU);
      const speed = rand(60, 300);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: rand(0.3, 0.75),
        maxLife: 0.75,
        color,
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  /* --------------------------------------------------------------- render */

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Particles
    this.particles.forEach((p) => {
      ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    });
    ctx.globalAlpha = 1;

    // Bullets
    ctx.strokeStyle = this.accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    this.bullets.forEach((b) => {
      const norm = Math.hypot(b.vx, b.vy) || 1;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - (b.vx / norm) * 11, b.y - (b.vy / norm) * 11);
      ctx.stroke();
    });

    this.drawShip(ctx);
  }

  drawShip(ctx) {
    const { x, y, angle } = this.ship;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (this.thrusting) {
      ctx.beginPath();
      ctx.moveTo(-9, -4);
      ctx.lineTo(-9 - rand(8, 18), 0);
      ctx.lineTo(-9, 4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 176, 74, 0.9)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-10, -9);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, 9);
    ctx.closePath();

    ctx.fillStyle = this.accent;
    ctx.shadowColor = this.accent;
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.arc(3, 0, 2.4, 0, TAU);
    ctx.fill();

    ctx.restore();
  }
}

/** Below this distance the pointer gives no usable heading, so hold the last one. */
const AIM_DEADZONE = 26;

/** How long a hit element stays displaced before springing back. */
const HOLD_MS = 260;
/** Must be >= the CSS transition on .is-knocked, or the class drops mid-flight. */
const RECOVER_MS = 620;

const THRUST_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
]);

/** Only WASD engages manual flight - arrows and Space must keep scrolling. */
const ENGAGE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
