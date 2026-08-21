/* =====================================================
   AMBIENT EMBERS & STARFIELD CANVAS BACKGROUND
   Ultra-lightweight 60fps ambient particle background.
   No heavy bird loops or canvas lag.
   ===================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let particles = [];

  function buildParticles() {
    particles = [];
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? 35 : 70;

    const colors = [
      'rgba(255, 77, 0,',   // Flame Orange
      'rgba(255, 170, 0,',  // Solar Gold
      'rgba(255, 107, 43,', // Amber
      'rgba(248, 250, 252,' // Warm Pearl Star
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.15),
        alpha: Math.random() * 0.45 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildParticles();
  }

  let time = 0;
  function tick() {
    time += 0.016;

    /* Clean dark charcoal slate fill */
    ctx.fillStyle = '#08080d';
    ctx.fillRect(0, 0, W, H);

    /* Render soft floating embers and stars */
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += p.speed;

      /* Wrap particles vertically & horizontally */
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      const twinkle = 0.5 + 0.5 * Math.sin(p.phase);
      const alpha = (p.alpha * twinkle).toFixed(2);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  requestAnimationFrame(tick);
})();
