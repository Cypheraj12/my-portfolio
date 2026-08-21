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
    phoenix.scale = Math.min(W, H) / (LOW() ? 480 : 380);
    phoenix.vx    = LOW() ? 2.2 : 3.4;

    buildStars();
  }

  /* ══════════════════════════════════
     DRAW PHOENIX (Grounded in Reference Images 1, 2 & 3)
  ══════════════════════════════════ */
  function drawPhoenix(x, y, scale, wingPhase) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    /* Wing flap angle calculation */
    const flap = Math.sin(wingPhase);
    const wingElevation = flap * 32;

    /* Opacity — vibrant & 100% clearly visible soaring bird */
    ctx.globalAlpha = LOW() ? 0.62 : 0.75;

    /* ── Radiant Fire Aura Core ── */
    const aura = ctx.createRadialGradient(0, -10, 8, 0, -10, 110);
    aura.addColorStop(0.0, 'rgba(255, 235, 150, 0.45)');
    aura.addColorStop(0.25, 'rgba(255, 170, 0, 0.30)');
    aura.addColorStop(0.60, 'rgba(255, 77, 0, 0.18)');
    aura.addColorStop(1.0, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -10, 110, 0, Math.PI * 2);
    ctx.fill();

    /* ── Tail Plumes (Long Flowing Flame Ribbons like Ref 1, 2 & 3) ── */
    const tailPlumes = [
      { len: 180, offsety: 0,   thick: 4.5, speed: 2.8 },
      { len: 210, offsety: -12, thick: 3.5, speed: 3.2 },
      { len: 190, offsety: 12,  thick: 3.8, speed: 2.5 },
      { len: 230, offsety: -24, thick: 2.8, speed: 3.6 },
      { len: 200, offsety: 22,  thick: 3.0, speed: 3.0 }
    ];

    tailPlumes.forEach((p, idx) => {
      const wave = Math.sin(time * p.speed + idx * 0.7) * 28;
      const endX = -p.len;
      const endY = p.offsety + wave * 1.3;

      ctx.beginPath();
      ctx.moveTo(-10, 5);
      ctx.bezierCurveTo(
        -p.len * 0.4, p.offsety + wave * 0.6,
        -p.len * 0.75, p.offsety + wave * 1.1,
        endX, endY
      );

      const tailGrad = ctx.createLinearGradient(-10, 0, endX, endY);
      tailGrad.addColorStop(0.0, '#fff0aa');
      tailGrad.addColorStop(0.3, '#ffaa00');
      tailGrad.addColorStop(0.7, '#ff4d00');
      tailGrad.addColorStop(1.0, 'rgba(225, 29, 72, 0.0)');

      ctx.strokeStyle = tailGrad;
      ctx.lineWidth   = p.thick;
      ctx.lineCap     = 'round';
      ctx.stroke();

      /* Flame tip spark */
      ctx.beginPath();
      ctx.arc(endX, endY, p.thick * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,170,0,0.6)';
      ctx.fill();
    });

    /* Helper for Layered Sweeping Wings (References 1, 2 & 3) */
    function drawLayeredWing(sideMultiplier) {
      const wingGrad = ctx.createLinearGradient(0, 0, -60 * sideMultiplier, -130 + wingElevation);
      wingGrad.addColorStop(0.0, 'rgba(255, 240, 180, 0.95)');
      wingGrad.addColorStop(0.3, 'rgba(255, 170, 0, 0.85)');
      wingGrad.addColorStop(0.7, 'rgba(255, 77, 0, 0.65)');
      wingGrad.addColorStop(1.0, 'rgba(225, 29, 72, 0.25)');

      /* Main Wing Outline Path */
      ctx.beginPath();
      ctx.moveTo(5, -10);
      ctx.bezierCurveTo(
        -30 * sideMultiplier, -70 + wingElevation,
        -75 * sideMultiplier, -130 + wingElevation * 1.2,
        -115 * sideMultiplier, -145 + wingElevation * 1.4
      );
      ctx.bezierCurveTo(
        -105 * sideMultiplier, -100 + wingElevation * 0.9,
        -80 * sideMultiplier,  -65  + wingElevation * 0.6,
        -50 * sideMultiplier,  -30  + wingElevation * 0.3
      );
      ctx.bezierCurveTo(
        -30 * sideMultiplier, -15,
        -10 * sideMultiplier, -5,
        0, 0
      );
      ctx.fillStyle = wingGrad;
      ctx.fill();

      /* Individual Flame Feather Plumes */
      const featherTips = [
        { tx: -115, ty: -145, len: 45 },
        { tx: -95,  ty: -125, len: 40 },
        { tx: -75,  ty: -105, len: 35 },
        { tx: -55,  ty: -80,  len: 30 },
        { tx: -38,  ty: -55,  len: 25 }
      ];

      featherTips.forEach(tip => {
        const fx = tip.tx * sideMultiplier;
        const fy = tip.ty + wingElevation * 1.2;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(
          fx - 15 * sideMultiplier, fy - tip.len * 0.5,
          fx - 22 * sideMultiplier, fy - tip.len
        );
        ctx.quadraticCurveTo(
          fx - 8 * sideMultiplier, fy - tip.len * 0.6,
          fx + 8 * sideMultiplier, fy + 12
        );
        ctx.fillStyle = 'rgba(255, 170, 0, 0.7)';
        ctx.fill();
      });
    }

    /* Left & Right Wings spread */
    drawLayeredWing(1);  // Left wing
    drawLayeredWing(-1); // Right wing

    /* ── Torso & Chest (Golden Flame Core) ── */
    ctx.beginPath();
    ctx.ellipse(0, -5, 24, 45, 0.05, 0, Math.PI * 2);
    const chestGrad = ctx.createRadialGradient(0, -10, 3, 0, -5, 28);
    chestGrad.addColorStop(0.0, '#ffffff');
    chestGrad.addColorStop(0.3, '#ffea75');
    chestGrad.addColorStop(0.75, '#ff4d00');
    chestGrad.addColorStop(1.0, '#9f1239');
    ctx.fillStyle = chestGrad;
    ctx.fill();

    /* ── Head, Falcon Beak & Crown Crest Plumes (Ref 1, 2, 3) ── */
    ctx.beginPath();
    ctx.arc(0, -48, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#fff5cc';
    ctx.fill();

    /* Curved Sharp Beak */
    ctx.beginPath();
    ctx.moveTo(6, -48);
    ctx.quadraticCurveTo(18, -46, 20, -38);
    ctx.quadraticCurveTo(10, -40, 4, -42);
    ctx.closePath();
    ctx.fillStyle = '#ffaa00';
    ctx.fill();

    /* Eye */
    ctx.beginPath();
    ctx.arc(4, -50, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4.8, -50.8, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    /* 3 Flowing Crown Crest Plumes (Ref 1 & 2) */
    const crests = [
      { len: 45, curvey: -75, angle: -0.35 },
      { len: 55, curvey: -85, angle: -0.15 },
      { len: 42, curvey: -72, angle: 0.05 }
    ];
    crests.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(0, -56);
      ctx.quadraticCurveTo(
        -15 + c.angle * 20, c.curvey,
        -35 + c.angle * 30, c.curvey - 12
      );
      ctx.quadraticCurveTo(
        -15 + c.angle * 10, c.curvey + 10,
        2, -50
      );
      const crestGrad = ctx.createLinearGradient(0, -56, -35, c.curvey);
      crestGrad.addColorStop(0, '#ffffff');
      crestGrad.addColorStop(0.5, '#ffaa00');
      crestGrad.addColorStop(1, 'rgba(255,77,0,0.2)');
      ctx.fillStyle = crestGrad;
      ctx.fill();
    });

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
