/* =====================================================
   SYNTHWAVE CITYSCAPE — Canvas Background Animation
   Performance-adaptive: full quality on desktop,
   lightweight (30fps, reduced elements) on mobile/tablet
   ===================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Adaptive quality based on screen width ── */
  const LOW  = () => window.innerWidth <= 768;   // phone
  const MID  = () => window.innerWidth <= 1024;  // tablet

  function getQ() {
    if (LOW()) return {
      stars: 70, buildings: 12, gridH: 9, gridV: 12,
      fps: 24, dpr: 1, milky: false, nebula: false, antennas: false
    };
    if (MID()) return {
      stars: 120, buildings: 18, gridH: 12, gridV: 18,
      fps: 30, dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      milky: false, nebula: false, antennas: true
    };
    return {
      stars: 220, buildings: 26, gridH: 22, gridV: 28,
      fps: 60, dpr: Math.min(window.devicePixelRatio || 1, 2),
      milky: true, nebula: true, antennas: true
    };
  }

  let Q = getQ();
  let W, H, time = 0, lastTs = 0;

  /* FPS limiter */
  let fpsInterval   = 1000 / Q.fps;
  let lastFrameTime = 0;

  /* ── Stars ── */
  let stars = [];

  /* ── Buildings ── */
  let buildings = [];
  let offCity   = null;   // offscreen canvas for static building bodies
  let cityDirty = true;   // re-bake when resized

  const BUILD_COLS = [
    'rgba(6,4,22,1)',  'rgba(8,4,28,1)',  'rgba(5,3,18,1)',
    'rgba(10,5,30,1)', 'rgba(4,3,16,1)',  'rgba(7,4,24,1)'
  ];
  const WIN_COLS = [
    'rgba(59,130,246,',  'rgba(168,85,247,',
    'rgba(236,72,153,',  'rgba(255,255,255,',
    'rgba(99,102,241,',  'rgba(6,182,212,'
  ];

  /* ── Grid ── */
  const GRID_SPEED = 0.35;

  /* ══════════════════════════════════
     RESIZE
  ══════════════════════════════════ */
  function resize() {
    Q           = getQ();
    fpsInterval = 1000 / Q.fps;

    const dpr = Q.dpr;
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildStars();
    buildCity();
    cityDirty = true;
  }

  /* ── Star init ── */
  function buildStars() {
    stars = [];
    for (let i = 0; i < Q.stars; i++) {
      const milky = Q.milky && i < Math.floor(Q.stars * 0.27);
      stars.push({
        x:     milky ? W * (0.35 + Math.random() * 0.55) : Math.random() * W,
        y:     milky ? Math.random() * H * 0.5            : Math.random() * H * 0.62,
        r:     milky ? Math.random() * 0.7                : Math.random() * 1.5 + 0.2,
        alpha: milky ? Math.random() * 0.3                : Math.random() * 0.65 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.7 + 0.3,
        milky
      });
    }
  }

  /* ── Building init ── */
  function buildCity() {
    buildings = [];
    const hy    = H * 0.52;
    const totalW = W * 0.64;
    const startX = W * 0.18;
    const slotW  = totalW / Q.buildings;

    for (let i = 0; i < Q.buildings; i++) {
      const bw = slotW * (0.52 + Math.random() * 0.48);
      const bh = 30 + Math.random() * 200;
      const bx = startX + slotW * i + (slotW - bw) / 2;
      const by = hy - bh;
      const antennaMark = Q.antennas && bh > 100 && Math.random() > 0.45;

      /* Fewer windows on low-power to cut fillRect calls */
      const winRatio = LOW() ? 0.30 : MID() ? 0.38 : 0.45;
      const colStep  = LOW() ? 12 : 9;
      const rowStep  = LOW() ? 16 : 13;
      const wins = [];
      const cols = Math.max(1, Math.floor(bw / colStep));
      const rows = Math.max(1, Math.floor(bh / rowStep));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < winRatio) {
            wins.push({
              cx: c * colStep + 2,
              cy: r * rowStep + 4,
              w:  colStep - 5,
              h:  rowStep - 7,
              col:    WIN_COLS[Math.floor(Math.random() * WIN_COLS.length)],
              alpha:  0.25 + Math.random() * 0.70,
              flicker: !LOW() && Math.random() < 0.06,
              phase:   Math.random() * Math.PI * 2
            });
          }
        }
      }
      buildings.push({ x: bx, y: by, w: bw, h: bh, antennaMark, wins });
    }
    cityDirty = true;
  }

  /* ── Bake static building shapes to an offscreen canvas ── */
  function bakeCityOffscreen() {
    offCity        = document.createElement('canvas');
    offCity.width  = Math.ceil(W);
    offCity.height = Math.ceil(H);
    const oc = offCity.getContext('2d');
    const hy = H * 0.52;

    /* Horizon glow bloom — baked once */
    const bloom = oc.createRadialGradient(W / 2, hy, 0, W / 2, hy, W * 0.55);
    bloom.addColorStop(0.0, 'rgba(255,50,180,0.18)');
    bloom.addColorStop(0.3, 'rgba(100,60,255,0.10)');
    bloom.addColorStop(0.6, 'rgba(160,30,220,0.06)');
    bloom.addColorStop(1.0, 'transparent');
    oc.fillStyle = bloom;
    oc.fillRect(0, hy - 60, W, 100);

    /* Building bodies */
    for (const b of buildings) {
      oc.fillStyle = BUILD_COLS[Math.floor(b.x) % BUILD_COLS.length];
      oc.fillRect(b.x, b.y, b.w, b.h);
      oc.strokeStyle = 'rgba(168,85,247,0.10)';
      oc.lineWidth   = 0.5;
      oc.strokeRect(b.x, b.y, b.w, b.h);
    }
    cityDirty = false;
  }

  /* ══════════════════════════════════
     DRAW FUNCTIONS
  ══════════════════════════════════ */

  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.53);
    g.addColorStop(0.00, '#030310');
    g.addColorStop(0.25, '#060620');
    g.addColorStop(0.55, '#0b0630');
    g.addColorStop(0.78, '#160844');
    g.addColorStop(1.00, '#220a58');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H * 0.53);
  }

  function drawMilkyWay() {
    if (!Q.milky) return;
    ctx.save();
    ctx.globalAlpha = 0.055 + 0.015 * Math.sin(time * 0.18);
    const gm = ctx.createLinearGradient(W * 0.28, 0, W * 0.92, H * 0.38);
    gm.addColorStop(0,   'transparent');
    gm.addColorStop(0.3, 'rgba(180,150,255,1)');
    gm.addColorStop(0.5, 'rgba(160,130,240,1)');
    gm.addColorStop(0.7, 'rgba(180,150,255,1)');
    gm.addColorStop(1,   'transparent');
    ctx.fillStyle = gm;
    ctx.beginPath();
    ctx.ellipse(W * 0.60, H * 0.17, W * 0.34, H * 0.09, -0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawStars() {
    for (const s of stars) {
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + time * s.speed));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.milky
        ? `rgba(200,185,255,${(s.alpha * tw * 0.6).toFixed(2)})`
        : `rgba(255,255,255,${(s.alpha * tw).toFixed(2)})`;
      ctx.fill();
    }
  }

  function drawMoon() {
    const mx = W * 0.135;
    const my = H * 0.165;
    const mr = Math.min(W, H) * (LOW() ? 0.07 : 0.092);

    /* Skip expensive outer halo on low-power */
    if (!LOW()) {
      const halo = ctx.createRadialGradient(mx, my, mr * 0.9, mx, my, mr * 3.0);
      halo.addColorStop(0.0, 'rgba(110,50,220,0.13)');
      halo.addColorStop(0.5, 'rgba(70,20,170,0.05)');
      halo.addColorStop(1.0, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(mx, my, mr * 3.0, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Moon body */
    const body = ctx.createRadialGradient(mx - mr * 0.22, my - mr * 0.18, mr * 0.08, mx, my, mr);
    body.addColorStop(0.0, '#3a1868');
    body.addColorStop(0.5, '#200e44');
    body.addColorStop(1.0, '#100728');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(150,70,255,0.38)';
    ctx.lineWidth   = 1.8;
    ctx.stroke();

    /* Crescent shadow */
    ctx.fillStyle = 'rgba(3,3,12,0.80)';
    ctx.beginPath();
    ctx.arc(mx + mr * 0.30, my - mr * 0.04, mr * 0.84, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMountains() {
    /* Left */
    ctx.beginPath();
    ctx.moveTo(0, H * 0.56);
    ctx.lineTo(0,         H * 0.37);
    ctx.lineTo(W * 0.055, H * 0.26);
    ctx.lineTo(W * 0.10,  H * 0.33);
    ctx.lineTo(W * 0.16,  H * 0.20);
    ctx.lineTo(W * 0.22,  H * 0.32);
    ctx.lineTo(W * 0.28,  H * 0.38);
    ctx.lineTo(W * 0.30,  H * 0.56);
    ctx.closePath();
    const gL = ctx.createLinearGradient(0, H * 0.18, W * 0.3, H * 0.56);
    gL.addColorStop(0, 'rgba(28,8,55,0.97)');
    gL.addColorStop(1, 'rgba(8,4,20,0.99)');
    ctx.fillStyle = gL;
    ctx.fill();
    ctx.strokeStyle = 'rgba(140,0,255,0.22)';
    ctx.lineWidth   = 1.2;
    ctx.stroke();

    /* Right */
    ctx.beginPath();
    ctx.moveTo(W,          H * 0.56);
    ctx.lineTo(W,          H * 0.35);
    ctx.lineTo(W * 0.945,  H * 0.24);
    ctx.lineTo(W * 0.90,   H * 0.32);
    ctx.lineTo(W * 0.84,   H * 0.19);
    ctx.lineTo(W * 0.78,   H * 0.32);
    ctx.lineTo(W * 0.72,   H * 0.38);
    ctx.lineTo(W * 0.70,   H * 0.56);
    ctx.closePath();
    const gR = ctx.createLinearGradient(W * 0.7, H * 0.17, W, H * 0.56);
    gR.addColorStop(0, 'rgba(8,4,20,0.99)');
    gR.addColorStop(1, 'rgba(28,8,55,0.97)');
    ctx.fillStyle = gR;
    ctx.fill();
    ctx.strokeStyle = 'rgba(140,0,255,0.22)';
    ctx.lineWidth   = 1.2;
    ctx.stroke();
  }

  function drawCity() {
    /* Blit the static pre-rendered city */
    if (cityDirty) bakeCityOffscreen();
    ctx.drawImage(offCity, 0, 0, W, H);

    /* Dynamic-only: flickering windows + antenna blink */
    for (const b of buildings) {
      for (const w of b.wins) {
        /* On low-power skip flicker entirely */
        if (!w.flicker && LOW()) {
          ctx.fillStyle = `${w.col}${w.alpha.toFixed(2)})`;
          ctx.fillRect(b.x + w.cx, b.y + w.cy, w.w, w.h);
        } else {
          let a = w.alpha;
          if (w.flicker) a *= 0.5 + 0.5 * Math.abs(Math.sin(w.phase + time * 4.5));
          ctx.fillStyle = `${w.col}${a.toFixed(2)})`;
          ctx.fillRect(b.x + w.cx, b.y + w.cy, w.w, w.h);
        }
      }

      /* Antenna pulse */
      if (b.antennaMark) {
        const ax = b.x + b.w / 2;
        const ay = b.y;
        ctx.strokeStyle = 'rgba(140,50,255,0.45)';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax, ay - 22);
        ctx.stroke();
        const pulse = 0.55 + 0.45 * Math.sin(time * 2.8 + b.x);
        ctx.fillStyle   = `rgba(255,60,180,${pulse.toFixed(2)})`;
        ctx.shadowColor = 'rgba(255,60,180,0.8)';
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(ax, ay - 22, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function drawGrid() {
    const gy = H * 0.52;
    const gb = H;

    /* Floor fill */
    const floorG = ctx.createLinearGradient(0, gy, 0, gb);
    floorG.addColorStop(0.00, '#0e0030');
    floorG.addColorStop(0.20, '#09001e');
    floorG.addColorStop(1.00, '#04000e');
    ctx.fillStyle = floorG;
    ctx.fillRect(0, gy, W, gb - gy);

    /* Horizon glow strip */
    const hg = ctx.createLinearGradient(0, gy, 0, gy + (gb - gy) * 0.32);
    hg.addColorStop(0.0, 'rgba(255,40,190,0.14)');
    hg.addColorStop(1.0, 'transparent');
    ctx.fillStyle = hg;
    ctx.fillRect(0, gy, W, (gb - gy) * 0.32);

    const vpX = W / 2;
    ctx.save();

    /* Vertical converging lines */
    for (let i = 0; i <= Q.gridV; i++) {
      const t  = i / Q.gridV;
      const bx = t * W;
      ctx.strokeStyle = `rgba(160,0,255,${0.09 + (Math.abs(t - 0.5) < 0.15 ? 0.06 : 0)})`;
      ctx.lineWidth   = 0.7;
      ctx.beginPath();
      ctx.moveTo(vpX + (bx - vpX) * 0.008, gy);
      ctx.lineTo(bx, gb);
      ctx.stroke();
    }

    /* Horizontal moving lines */
    const offset = (time * GRID_SPEED) % 1;
    for (let i = 0; i < Q.gridH; i++) {
      const t       = (i + offset) / Q.gridH;
      const perspT  = Math.pow(t, 2.8);
      const y       = gy + perspT * (gb - gy);
      if (y < gy) continue;

      const progress = (y - gy) / (gb - gy);
      ctx.strokeStyle = `rgba(210,30,255,${(0.05 + progress * 0.30).toFixed(2)})`;
      ctx.lineWidth   = 0.4 + progress * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    /* Bright horizon line */
    ctx.strokeStyle = 'rgba(255,50,210,0.55)';
    ctx.lineWidth   = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();

    ctx.restore();
  }

  function drawNebulaWisps() {
    if (!Q.nebula) return;
    const w1x = W * (0.42 + 0.04 * Math.sin(time * 0.09));
    const w1y = H * (0.32 + 0.02 * Math.sin(time * 0.13));
    const g1  = ctx.createRadialGradient(w1x, w1y, 0, w1x, w1y, W * 0.22);
    g1.addColorStop(0, `rgba(90,20,180,${(0.07 + 0.02 * Math.sin(time * 0.3)).toFixed(2)})`);
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H * 0.6);

    const w2x = W * (0.65 + 0.05 * Math.cos(time * 0.07));
    const w2y = H * (0.24 + 0.03 * Math.cos(time * 0.11));
    const g2  = ctx.createRadialGradient(w2x, w2y, 0, w2x, w2y, W * 0.18);
    g2.addColorStop(0, `rgba(40,10,140,${(0.06 + 0.02 * Math.cos(time * 0.25)).toFixed(2)})`);
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H * 0.6);
  }

  /* Pause canvas ticks during touch scroll on mobile for 60fps scrolling */
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
     MAIN LOOP — FPS throttled
  ══════════════════════════════════ */
  function tick(ts) {
    requestAnimationFrame(tick);
    if (isScrolling) return;

    /* FPS cap */
    const elapsed = ts - lastFrameTime;
    if (elapsed < fpsInterval) return;
    lastFrameTime = ts - (elapsed % fpsInterval);

    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs   = ts;
    time    += dt;

    ctx.clearRect(0, 0, W, H);

    drawSky();
    drawMilkyWay();
    drawNebulaWisps();
    drawStars();
    drawMoon();
    drawMountains();
    drawCity();
    drawGrid();
  }

  /* Handle resize — debounced */
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
