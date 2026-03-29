/* ═══════════════════════════════════════════════════════════
   TANZEELA AIMAN — ANIMATIONS ENGINE
   Pure Vanilla JS · No dependencies
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════════════ */
export function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 6}px,${my - 6}px)`;
  });

  (function ringLoop() {
    rx += (mx - rx - 18) * .12;
    ry += (my - ry - 18) * .12;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(ringLoop);
  })();

  document.querySelectorAll('button,a,.polaroid-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform += ' scale(2.2)';
      dot.style.background = 'var(--deep-mint)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.background = 'var(--deep-rose)';
    });
  });
}

/* ══════════════════════════════════════════════
   2. HERO PARTICLE CANVAS (Page 1 background)
══════════════════════════════════════════════ */
export function initHeroParticles(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;';
  wrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const COLORS = ['#D0AFAB','#ECCAC6','#F7EAB3','#C2E5CD','#C9D8DE','#f5c0ba','#d4e8c2'];
  let W = 0, H = 0, particles = [];

  function resize() {
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
  }

  class P {
    constructor(init) {
      this.reset(init);
    }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 20;
      this.r  = 2 + Math.random() * 9;
      this.vx = (Math.random() - .5) * .35;
      this.vy = -(0.1 + Math.random() * .32);
      this.a  = 0;
      this.ta = .15 + Math.random() * .35;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.ph = Math.random() * Math.PI * 2;
    }
    update(t) {
      this.x += this.vx + Math.sin(t * .001 + this.ph) * .22;
      this.y += this.vy;
      this.a  = Math.min(this.a + .004, this.ta);
      if (this.y < -this.r * 3) this.reset(false);
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, this.c + 'ff');
      g.addColorStop(1, this.c + '00');
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 70 }, (_, i) => new P(true));
    window.addEventListener('resize', resize);
  }

  function loop(t) {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(loop);
  }

  init();
  requestAnimationFrame(loop);
}

/* ══════════════════════════════════════════════
   3. RISING STAR FIELD (Page 3)
══════════════════════════════════════════════ */
export function initStarField(containerId) {
  const sf = document.getElementById(containerId);
  if (!sf) return;

  const COLORS = ['#F7EAB3','#ECCAC6','#C9D8DE','#C2E5CD','#D0AFAB','#ffffff'];
  const SHAPES = ['●','★','✦','✧','·'];

  function spawn() {
    const el  = document.createElement('div');
    el.className = 'star-dot';
    const sz  = 3 + Math.random() * 11;
    const dur = 8 + Math.random() * 14;
    const del = Math.random() * 3;
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${Math.random() * 100}%;
      bottom: 0;
      background:${col};
      box-shadow: 0 0 ${sz * 2}px ${col}, 0 0 ${sz}px rgba(255,255,255,.5);
      animation-duration:${dur}s;
      animation-delay:${del}s;
    `;
    sf.appendChild(el);
    setTimeout(() => el.remove(), (dur + del + 1) * 1000);
  }

  for (let i = 0; i < 22; i++) spawn();
  setInterval(spawn, 550);
}

/* ══════════════════════════════════════════════
   4. POLAROID 3D TILT
══════════════════════════════════════════════ */
export function initPolaroidTilt() {
  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `
        ${card.dataset.baseTransform || ''}
        rotateY(${dx * 16}deg)
        rotateX(${-dy * 11}deg)
        scale(1.05)
        translateZ(20px)
      `;
      card.style.transition = 'transform .2s ease, box-shadow .2s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = card.dataset.baseTransform || '';
      card.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease';
    });

    // store initial CSS rotate
    const computed = getComputedStyle(card).transform;
    card.dataset.baseTransform = card.style.transform || '';
  });
}

/* ══════════════════════════════════════════════
   5. MASSIVE PARTICLE EXPLOSION — "Tap to Smile"
══════════════════════════════════════════════ */
export function initSmileParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#D0AFAB','#ECCAC6','#F7EAB3','#C2E5CD','#C9D8DE','#f5a8c8','#fdd8e8','#c8f0d8','#d0e8f8'];
  const SHAPES = ['heart','star','circle','diamond','petal'];

  function drawHeart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * .3);
    ctx.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .3);
    ctx.bezierCurveTo(x - s * .5, y + s * .65, x, y + s * .85, x, y + s);
    ctx.bezierCurveTo(x, y + s * .85, x + s * .5, y + s * .65, x + s * .5, y + s * .3);
    ctx.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .3);
    ctx.closePath();
  }

  function drawStar(ctx, x, y, r) {
    const pts = 5, inner = r * .4;
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const a  = (i * Math.PI / pts) - Math.PI / 2;
      const ri = i % 2 === 0 ? r : inner;
      i === 0
        ? ctx.moveTo(x + ri * Math.cos(a), y + ri * Math.sin(a))
        : ctx.lineTo(x + ri * Math.cos(a), y + ri * Math.sin(a));
    }
    ctx.closePath();
  }

  function drawDiamond(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * .55, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s * .55, y);
    ctx.closePath();
  }

  function drawPetal(ctx, x, y, s, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -s * .4, s * .25, s * .5, 0, 0, Math.PI * 2);
    ctx.restore();
  }

  class Particle {
    constructor(ox, oy, wave) {
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.x = ox + (Math.random() - .5) * wave * 80;
      this.y = oy + (Math.random() - .5) * wave * 40;
      this.size = 6 + Math.random() * 18;
      const speed = 2.5 + Math.random() * 11;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (wave === 0 ? 5 : 2);
      this.gravity = .14 + Math.random() * .1;
      this.drag    = .975;
      this.angle   = Math.random() * Math.PI * 2;
      this.spin    = (Math.random() - .5) * .14;
      this.life    = 1;
      this.decay   = .009 + Math.random() * .011;
    }
    update() {
      this.vx *= this.drag; this.vy *= this.drag;
      this.vy += this.gravity;
      this.x  += this.vx;  this.y  += this.vy;
      this.angle += this.spin;
      this.life  -= this.decay;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = this.size * 1.5;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const s = this.size;
      if      (this.shape === 'heart')   { drawHeart(ctx, -s*.25, -s*.5, s); }
      else if (this.shape === 'star')    { drawStar(ctx, 0, 0, s * .6); }
      else if (this.shape === 'diamond') { drawDiamond(ctx, 0, 0, s * .7); }
      else if (this.shape === 'petal')   { drawPetal(ctx, 0, 0, s, 0); }
      else { ctx.beginPath(); ctx.arc(0, 0, s * .4, 0, Math.PI * 2); }

      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];
  let raf;

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    if (particles.length > 0) {
      raf = requestAnimationFrame(loop);
    } else {
      canvas.style.display = 'none';
      cancelAnimationFrame(raf);
    }
  }

  window._launchSmile = function(btnEl) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const rect = btnEl.getBoundingClientRect();
    const ox = rect.left + rect.width  / 2;
    const oy = rect.top  + rect.height / 2;

    // Wave 1 — explosion from button
    for (let i = 0; i < 260; i++) particles.push(new Particle(ox, oy, 0));

    // Wave 2 — secondary burst
    setTimeout(() => {
      for (let i = 0; i < 100; i++) particles.push(new Particle(ox + (Math.random()-.5)*100, oy + (Math.random()-.5)*50, 1));
    }, 200);

    // Wave 3 — corners rain
    setTimeout(() => {
      [[0,0],[canvas.width,0],[0,canvas.height],[canvas.width,canvas.height]].forEach(([cx,cy]) => {
        for (let i = 0; i < 35; i++) particles.push(new Particle(cx, cy, 2));
      });
    }, 450);

    // Wave 4 — top rain
    setTimeout(() => {
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle(Math.random() * canvas.width, -10, 0));
        particles[particles.length - 1].vy = 4 + Math.random() * 6;
        particles[particles.length - 1].vx = (Math.random() - .5) * 5;
        particles[particles.length - 1].gravity = .2;
      }
    }, 700);

    cancelAnimationFrame(raf);
    loop();

    // Button bounce
    btnEl.style.transform = 'scale(.94)';
    setTimeout(() => btnEl.style.transform = 'scale(1.08)', 120);
    setTimeout(() => btnEl.style.transform = 'scale(1)',    250);
  };
}

/* ══════════════════════════════════════════════
   6. ENTRANCE ANIMATIONS (CSS class toggling)
══════════════════════════════════════════════ */
export function animatePageIn(pageId) {
  const page = document.getElementById(pageId);
  if (!page) return;

  // Select all direct children with .anim-item  or apply to tagged elements
  const items = page.querySelectorAll('.anim-item');
  items.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(40px) scale(.97)';
    el.style.transition = `opacity .8s ease ${i * .12}s, transform .9s cubic-bezier(.34,1.56,.64,1) ${i * .12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0) scale(1)';
      });
    });
  });
}

/* ══════════════════════════════════════════════
   7. PAGE TRANSITION (overlay flash)
══════════════════════════════════════════════ */
export function pageTransition(cb) {
  const ov = document.getElementById('page-overlay');
  ov.style.transition = 'opacity .35s ease';
  ov.style.opacity    = '1';
  ov.style.pointerEvents = 'all';
  setTimeout(() => {
    cb();
    setTimeout(() => {
      ov.style.opacity = '0';
      ov.style.pointerEvents = 'none';
    }, 350);
  }, 380);
}

/* ══════════════════════════════════════════════
   8. TOAST NOTIFICATION
══════════════════════════════════════════════ */
export function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._to);
  toast._to = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ══════════════════════════════════════════════
   9. FLOATING HEARTS AMBIENT (continuous)
══════════════════════════════════════════════ */
export function initAmbientHearts(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;

  const EMOJIS = ['🌸','✨','💮','🌷','⭐','🌼','💛','🩷','🩵','🍃'];

  function spawn() {
    const el = document.createElement('span');
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      bottom: -30px;
      font-size:${1.2 + Math.random() * 1.8}rem;
      opacity:0;
      pointer-events:none;
      z-index:2;
      animation: ambientRise ${5 + Math.random()*8}s ease-in forwards;
    `;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 14000);
  }

  // Inject keyframes once
  if (!document.getElementById('ambient-kf')) {
    const s = document.createElement('style');
    s.id = 'ambient-kf';
    s.textContent = `
      @keyframes ambientRise {
        0%  { transform: translateY(0) rotate(0deg) scale(.6); opacity:0; }
        10% { opacity:.7; }
        90% { opacity:.35; }
        100%{ transform: translateY(-85vh) rotate(${Math.random()*40-20}deg) scale(1.1); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }

  setInterval(spawn, 1200);
  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 300);
}

/* ══════════════════════════════════════════════
   10. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════════════ */
export function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0) scale(1)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: .1 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(.98)';
    el.style.transition = 'opacity .9s ease, transform .9s ease';
    io.observe(el);
  });
}
