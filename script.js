/**
 * DRACO - Cinematic Luxury Landing Page Logic
 */

// Force scroll to top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ──── PARTICLE / EMBER SYSTEM ──────────────── */
(function() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(scattered) {
      this.scattered = scattered;
      this.reset(true);
    }
    reset(initial) {
      this.x      = Math.random() * W;
      this.y      = initial ? Math.random() * H : H + 20;
      this.r      = Math.random() * 1.8 + 0.4;
      this.vy     = -(Math.random() * 0.6 + 0.15);
      this.vx     = (Math.random() - 0.5) * 0.22;
      this.life   = 0;
      this.maxLife = Math.random() * 260 + 120;
      this.alpha  = Math.random() * 0.38 + 0.04;
      this.red    = Math.random() < 0.3;
      if (initial) this.life = Math.random() * this.maxLife;
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life ++;
      this.x += Math.sin(this.life * 0.015) * 0.18;
      const t = this.life / this.maxLife;
      if (t < 0.2)      this.a = this.alpha * (t / 0.2);
      else if (t > 0.75) this.a = this.alpha * (1 - (t - 0.75) / 0.25);
      else               this.a = this.alpha;
      if (this.life >= this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.red
        ? `rgba(139,0,0,${this.a})`
        : `rgba(28,18,18,${this.a * 1.4})`;
      ctx.fill();
    }
  }

  class Wisp {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 40;
      this.r    = Math.random() * 18 + 10;
      this.vy   = -(Math.random() * 0.25 + 0.06);
      this.vx   = (Math.random() - 0.5) * 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.alpha = Math.random() * 0.055 + 0.01;
      if (initial) this.life = Math.random() * this.maxLife;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.life++;
      const t = this.life / this.maxLife;
      this.r  += 0.04;
      if (t < 0.15)      this.a = this.alpha * (t / 0.15);
      else if (t > 0.65) this.a = this.alpha * (1 - (t - 0.65) / 0.35);
      else               this.a = this.alpha;
      if (this.life >= this.maxLife || this.y < -60) this.reset(false);
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, `rgba(60,0,0,${this.a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 110 }, () => new Particle(true));
  const wisps     = Array.from({ length: 18  }, () => new Wisp());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    wisps.forEach(w => { w.update(); w.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ──── COUNTDOWN TIMER ───────────────────────── */
(function() {
  const TARGET = new Date('2026-05-07T00:00:00').getTime();
  const fields = ['cnt-days','cnt-hours','cnt-min','cnt-sec'];

  function pad(n) { return String(n).padStart(2, '0'); }

  function setField(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const str = pad(val);
    if (el.textContent !== str) {
      el.textContent = str;
      el.classList.remove('flash');
      void el.offsetWidth; // Trigger reflow
      el.classList.add('flash');
    }
  }

  function tick() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const s = Math.floor(diff / 1000);
    setField('cnt-days',  Math.floor(s / 86400));
    setField('cnt-hours', Math.floor((s % 86400) / 3600));
    setField('cnt-min',   Math.floor((s % 3600)  / 60));
    setField('cnt-sec',   s % 60);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ──── MOUSE PARALLAX & GLOW ─────────────────── */
(function() {
  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  const logo  = document.getElementById('logoWrap');
  const title = document.getElementById('brandName');
  const glow  = document.getElementById('cursorGlow');

  if (!glow) return;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');

  function frame() {
    cx += (mx - cx) * 0.06;
    cy += (my - cy) * 0.06;

    if (logo) logo.style.transform  = `translate(${cx * 18}px, ${cy * 12}px)`;
    if (title) title.style.transform = `translate(${cx * 9}px,  ${cy * 5}px)`;

    requestAnimationFrame(frame);
  }
  frame();
})();

/* ──── EMAILJS HANDLER ───────────────────────── */
function handleNotify() {
  const input   = document.getElementById('emailInput');
  const form    = document.getElementById('notifyForm');
  const success = document.getElementById('notifySuccess');

  if (!input || !form) return;

  const email = input.value.trim();

  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailjs.send("service_bdheq4c", "template_b2djqxk", {
      user_email: email
    })
    .then(() => {
      form.style.opacity = '0';
      setTimeout(() => {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      }, 400);
    })
    .catch(() => {
      alert("حصل خطأ في الإرسال ❌");
    });
  } else {
    input.style.borderBottom = '1px solid rgba(255,60,60,0.6)';
    input.focus();
  }
}

const emailInput = document.getElementById('emailInput');
if (emailInput) {
  emailInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleNotify();
  });
}

// Initialize EmailJS
(function(){
  if (window.emailjs) {
    emailjs.init("nzIEIZr5Wa7d-YsMe");
  }
})();
