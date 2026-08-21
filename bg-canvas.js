/* =====================================================
   DYNAMIC PHOENIX BIRD — Canvas Background Animation
   Features an elegant, soaring Phoenix bird with flowing flame tail
   and floating ember particle trails drifting behind it.
   Subtle opacity (18-22%) so text remains crisp and readable.
   ===================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const LOW = () => window.innerWidth <= 768;
  const MID = () => window.innerWidth <= 1024;

  let W, H, time = 0, lastTs = 0;
  let fpsInterval = 1000 / 45;
  let lastFrameTime = 0;

  /* ── Background Ambient Stars ── */
  let stars = [];
  function buildStars() {
    stars = [];
    const count = LOW() ? 40 : 80;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.35 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.2
      });
    }
  }

  /* ── Phoenix State ── */
  let phoenix = {
    x: -150,
    y: 200,
    vx: 1.8,
    scale: 1,
    wingPhase: 0,
    trail: []
  };

  /* ── Embers Array ── */
  let embers = [];

  function spawnEmber(x, y) {
    if (embers.length > (LOW() ? 30 : 60)) return;
    const colors = [
      'rgba(255,77,0,',    // Flame Orange
      'rgba(255,170,0,',   // Solar Gold
      'rgba(255,107,43,',  // Amber
      'rgba(225,29,72,'    // Crimson
    ];
    embers.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      vx: -(Math.random() * 1.5 + 0.5),
      vy: (Math.random() - 0.6) * 1.2,
      size: Math.random() * 2.8 + 0.8,
      alpha: Math.random() * 0.7 + 0.3,
      life: 1.0,
      decay: Math.random() * 0.015 + 0.008,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  /* ══════════════════════════════════
     RESIZE
  ══════════════════════════════════ */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, LOW() ? 1 : 1.5);
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    phoenix.scale = Math.min(W, H) / (LOW() ? 850 : 650);
    phoenix.vx    = LOW() ? 1.2 : 1.7;

    buildStars();
  }

  /* ══════════════════════════════════
     DRAW PHOENIX
  ══════════════════════════════════ */
  function drawPhoenix(x, y, scale, wingPhase) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    /* Wing flap angle calculation */
    const flap = Math.sin(wingPhase);
    const wingY = flap * 45; // vertical wing elevation

    /* Overall opacity — subtle background presence */
    const baseAlpha = LOW() ? 0.18 : 0.24;
    ctx.globalAlpha = baseAlpha;

    /* Body Glow Halo */
    const aura = ctx.createRadialGradient(0, 0, 5, 0, 0, 90);
    aura.addColorStop(0.0, 'rgba(255,77,0,0.35)');
    aura.addColorStop(0.4, 'rgba(255,170,0,0.18)');
    aura.addColorStop(1.0, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.fill();

    /* ── Tail Feathers (Flowing Streamers) ── */
    const numTails = 5;
    for (let t = 0; t < numTails; t++) {
      const offsetAngle = (t - (numTails - 1) / 2) * 0.18;
      const tailLen = 140 + t * 15;
      const wave = Math.sin(time * 3 + t * 0.8) * 22;

      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.quadraticCurveTo(
        -tailLen * 0.5, wave,
        -tailLen, wave * 1.4 + offsetAngle * 50
      );

      const tailG = ctx.createLinearGradient(0, 0, -tailLen, wave);
      tailG.addColorStop(0,   'rgba(255,170,0,0.7)');
      tailG.addColorStop(0.5, 'rgba(255,77,0,0.5)');
      tailG.addColorStop(1,   'transparent');
      ctx.strokeStyle = tailG;
      ctx.lineWidth   = 3.5 - t * 0.4;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    /* ── Left Wing ── */
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.bezierCurveTo(
      -20, -50 + wingY,
      -80, -90 + wingY * 1.3,
      -120, -40 + wingY * 0.8
    );
    ctx.bezierCurveTo(
      -80, -20 + wingY * 0.5,
      -30, -10,
      0, 0
    );
    const leftWingG = ctx.createLinearGradient(10, 0, -120, -90 + wingY);
    leftWingG.addColorStop(0,   'rgba(255,170,0,0.8)');
    leftWingG.addColorStop(0.5, 'rgba(255,77,0,0.6)');
    leftWingG.addColorStop(1,   'rgba(225,29,72,0.2)');
    ctx.fillStyle = leftWingG;
    ctx.fill();

    /* Left Wing Feather Lines */
    for (let f = 1; f <= 4; f++) {
      const fx = -f * 25;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(fx * 0.8, -60 + wingY, fx * 1.2, -45 + wingY * 0.9);
      ctx.strokeStyle = `rgba(255,200,80,${0.3 - f * 0.05})`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
    }

    /* ── Right Wing ── */
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.bezierCurveTo(
      -10, -60 - wingY * 0.8,
      -60, -110 - wingY * 1.1,
      -110, -60 - wingY * 0.7
    );
    ctx.bezierCurveTo(
      -70, -30 - wingY * 0.4,
      -25, -10,
      0, 0
    );
    const rightWingG = ctx.createLinearGradient(10, 0, -110, -110 - wingY);
    rightWingG.addColorStop(0,   'rgba(255,200,100,0.85)');
    rightWingG.addColorStop(0.5, 'rgba(255,100,0,0.65)');
    rightWingG.addColorStop(1,   'rgba(200,20,60,0.2)');
    ctx.fillStyle = rightWingG;
    ctx.fill();

    /* ── Phoenix Body & Head ── */
    ctx.beginPath();
    ctx.ellipse(5, 0, 32, 12, 0.15, 0, Math.PI * 2);
    const bodyG = ctx.createRadialGradient(10, 0, 2, 0, 0, 35);
    bodyG.addColorStop(0,   '#ffffff');
    bodyG.addColorStop(0.3, '#ffcc00');
    bodyG.addColorStop(0.7, '#ff4d00');
    bodyG.addColorStop(1,   '#b91c1c');
    ctx.fillStyle = bodyG;
    ctx.fill();

    /* Head & Crown Crest */
    ctx.beginPath();
    ctx.arc(32, -4, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#ffeedd';
    ctx.fill();

    /* Beak */
    ctx.beginPath();
    ctx.moveTo(39, -4);
    ctx.lineTo(50, -2);
    ctx.lineTo(39, 1);
    ctx.closePath();
    ctx.fillStyle = '#ffaa00';
    ctx.fill();

    /* Crown Feathers */
    ctx.beginPath();
    ctx.moveTo(32, -11);
    ctx.quadraticCurveTo(36, -24, 44, -28);
    ctx.quadraticCurveTo(34, -20, 30, -12);
    ctx.fillStyle = 'rgba(255,170,0,0.9)';
    ctx.fill();

    /* Eye Glow */
    ctx.beginPath();
    ctx.arc(35, -5, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }

  /* ══════════════════════════════════
     DRAW EMBERS & BACKGROUND
  ══════════════════════════════════ */

  function drawBackground() {
    /* Clean dark charcoal background */
    ctx.fillStyle = '#08080d';
    ctx.fillRect(0, 0, W, H);

    /* Ambient background stars */
    for (const s of stars) {
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(s.phase + time * s.speed));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,230,200,${(s.alpha * tw).toFixed(2)})`;
      ctx.fill();
    }
  }

  function updateAndDrawEmbers(dt) {
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.x += e.vx;
      e.y += e.vy;
      e.life -= e.decay;

      if (e.life <= 0) {
        embers.splice(i, 1);
        continue;
      }

      const currentAlpha = (e.alpha * e.life * (LOW() ? 0.25 : 0.35)).toFixed(2);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
      ctx.fillStyle   = `${e.color}${currentAlpha})`;
      ctx.shadowColor = 'rgba(255,100,0,0.5)';
      ctx.shadowBlur  = 4;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
  }

  /* Pause rendering ticks during active touch scroll */
  let isScrolling = false;
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (LOW() || MID()) {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { isScrolling = false; }, 120);
    }
  }, { passive: true });

  /* ══════════════════════════════════
     MAIN ANIMATION TICK
  ══════════════════════════════════ */
  function tick(ts) {
    requestAnimationFrame(tick);
    if (isScrolling) return;

    const elapsed = ts - lastFrameTime;
    if (elapsed < fpsInterval) return;
    lastFrameTime = ts - (elapsed % fpsInterval);

    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs   = ts;
    time    += dt;

    drawBackground();

    /* ── Move Phoenix in smooth soaring flight ── */
    phoenix.x += phoenix.vx;
    phoenix.wingPhase += dt * 5.5;

    /* Undulating wave trajectory */
    phoenix.y = H * 0.38 + Math.sin(time * 0.7) * (H * 0.18) + Math.cos(time * 1.3) * 25;

    /* Reset loop when phoenix flies off-screen right */
    if (phoenix.x > W + 220) {
      phoenix.x = -220;
      phoenix.y = H * 0.40;
    }

    /* Spawn tail embers */
    spawnEmber(phoenix.x - 30 * phoenix.scale, phoenix.y);
    if (Math.random() < 0.6) {
      spawnEmber(phoenix.x - 60 * phoenix.scale, phoenix.y + (Math.random() - 0.5) * 20);
    }

    updateAndDrawEmbers(dt);
    drawPhoenix(phoenix.x, phoenix.y, phoenix.scale, phoenix.wingPhase);
  }

  /* Handle resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
    }, 150);
  });

  resize();
  requestAnimationFrame(tick);
})();
