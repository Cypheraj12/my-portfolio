/* =====================================================
   PORTFOLIO ENHANCEMENTS
   - Loading screen with animated grid
   - Typewriter effect on hero accent text
   - Custom glow cursor
   - Scroll reveal (Intersection Observer)
   - Animated stats counters
   - 3D card tilt on mouse move
   - EmailJS contact form
   ===================================================== */
(function () {
  'use strict';

  /* ══════════════════════════════════
     1. LOADING SCREEN
  ══════════════════════════════════ */
  const loader    = document.getElementById('loading-screen');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPct = document.getElementById('loader-pct');
  const lCanvas   = document.getElementById('loader-canvas');

  if (loader && lCanvas) {
    const lCtx = lCanvas.getContext('2d');
    let lW, lH, lTime = 0, lLast = 0;

    function resizeLoader() {
      lW = lCanvas.width  = lCanvas.offsetWidth;
      lH = lCanvas.height = lCanvas.offsetHeight;
    }
    resizeLoader();

    /* Animate a small synthwave grid in the loader */
    function drawLoaderGrid(ts) {
      const dt = Math.min((ts - lLast) / 1000, 0.05);
      lLast = ts;
      lTime += dt;

      lCtx.clearRect(0, 0, lW, lH);

      const gy = lH * 0.58;
      const gB = lH;

      /* Floor */
      const fg = lCtx.createLinearGradient(0, gy, 0, gB);
      fg.addColorStop(0, '#0e0030');
      fg.addColorStop(1, '#04000e');
      lCtx.fillStyle = fg;
      lCtx.fillRect(0, gy, lW, gB - gy);

      /* Horizon */
      lCtx.strokeStyle = 'rgba(255,50,210,0.50)';
      lCtx.lineWidth   = 1.5;
      lCtx.beginPath();
      lCtx.moveTo(0, gy); lCtx.lineTo(lW, gy);
      lCtx.stroke();

      const vp = lW / 2;
      const numV = 18, numH = 14;
      const offset = (lTime * 0.4) % 1;

      lCtx.save();
      for (let i = 0; i <= numV; i++) {
        const t  = i / numV;
        const bx = t * lW;
        lCtx.strokeStyle = 'rgba(140,0,255,0.10)';
        lCtx.lineWidth   = 0.7;
        lCtx.beginPath();
        lCtx.moveTo(vp + (bx - vp) * 0.01, gy);
        lCtx.lineTo(bx, gB);
        lCtx.stroke();
      }
      for (let i = 0; i < numH; i++) {
        const t = (i + offset) / numH;
        const pT = Math.pow(t, 2.8);
        const y  = gy + pT * (gB - gy);
        if (y < gy) continue;
        const p  = (y - gy) / (gB - gy);
        lCtx.strokeStyle = `rgba(200,30,255,${(0.04 + p * 0.28).toFixed(2)})`;
        lCtx.lineWidth   = 0.4 + p * 1.4;
        lCtx.beginPath();
        lCtx.moveTo(0, y); lCtx.lineTo(lW, y);
        lCtx.stroke();
      }
      lCtx.restore();

      if (loader && !loader.classList.contains('hidden')) {
        requestAnimationFrame(drawLoaderGrid);
      }
    }
    requestAnimationFrame(drawLoaderGrid);

    /* Progress bar animation — fills over ~1.6s then hides */
    let pct = 0;
    const fillSpeed = 100 / 25; // 25 ticks → 100%
    const ticker = setInterval(() => {
      pct = Math.min(pct + fillSpeed + Math.random() * 3, 100);
      if (loaderBar) loaderBar.style.width = pct + '%';
      if (loaderPct) loaderPct.textContent = Math.floor(pct) + '%';
      if (pct >= 100) {
        clearInterval(ticker);
        setTimeout(() => {
          loader.classList.add('hidden');
          /* Trigger reveals after loader hides */
          triggerReveal();
          startTypewriter();
          animateStats();
        }, 300);
      }
    }, 55);
  }

  /* ══════════════════════════════════
     2. TYPEWRITER EFFECT on hero accent
  ══════════════════════════════════ */
  function startTypewriter() {
    const accentEl = document.querySelector('.hero-title .accent-text');
    if (!accentEl) return;

    const text     = accentEl.textContent.trim();
    const cursor   = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    accentEl.textContent = '';
    accentEl.parentNode.insertBefore(cursor, accentEl.nextSibling);

    let i = 0;
    const speed = 65; // ms per character

    function type() {
      if (i <= text.length) {
        accentEl.textContent = text.slice(0, i);
        i++;
        setTimeout(type, speed);
      } else {
        /* Keep cursor blinking for 2s then fade it out */
        setTimeout(() => {
          cursor.style.transition = 'opacity 0.5s ease';
          cursor.style.opacity    = '0';
          setTimeout(() => cursor.remove(), 600);
        }, 2000);
      }
    }
    setTimeout(type, 200);
  }

  /* ══════════════════════════════════
     3. CUSTOM CURSOR
  ══════════════════════════════════ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  /* Only enable on non-touch devices */
  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = -100, my = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    /* Ring lags slightly behind */
    let rx = -100, ry = -100;
    function animateRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Hover state on interactive elements */
    const hoverTargets = 'a, button, .project-card, .skill-pill, .nav-item, .btn-apple, input, textarea';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('cursor-hover');
        ring.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      });
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });
  }

  /* ══════════════════════════════════
     4. SCROLL REVEAL (Intersection Observer)
  ══════════════════════════════════ */
  function triggerReveal() {
    /* Tag elements to reveal */
    const revealTargets = [
      '.project-card',
      '.setting-pane',
      '.hero-stats-row',
      '.contact-mail-window',
      '.section-header',
    ];
    revealTargets.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('reveal');
      });
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // fire once
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ══════════════════════════════════
     5. ANIMATED STATS COUNTERS
  ══════════════════════════════════ */
  function animateStats() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target   = parseInt(el.dataset.target, 10);
      const duration = 1400; // ms
      const start    = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        /* Ease out cubic */
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  /* ══════════════════════════════════
     6. 3D CARD TILT on mouse move
  ══════════════════════════════════ */
  /* Skip tilt on touch devices */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      const MAX_TILT = 9; // degrees

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
        const dy   = (e.clientY - cy) / (rect.height / 2); // -1 to 1

        const rotY =  dx * MAX_TILT;
        const rotX = -dy * MAX_TILT;

        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.025)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  /* ══════════════════════════════════
     8. CONTACT FORM — EmailJS
     Replace YOUR_SERVICE_ID / YOUR_TEMPLATE_ID / YOUR_PUBLIC_KEY
     with values from https://www.emailjs.com
  ══════════════════════════════════ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm && window.emailjs) {
    /* Init EmailJS — replace with your public key */
    emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn    = document.getElementById('form-submit-btn');
      const status = document.getElementById('form-status-msg');

      btn.disabled    = true;
      btn.textContent = 'Sending…';
      if (status) { status.className = 'form-status-msg'; status.textContent = ''; }

      const params = {
        from_name:    contactForm.querySelector('[name="name"]')?.value    || '',
        from_email:   contactForm.querySelector('[name="email"]')?.value   || '',
        message:      contactForm.querySelector('[name="message"]')?.value || '',
        to_name:      'Anant Joshi',
      };

      try {
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params);
        if (status) {
          status.className  = 'form-status-msg success';
          status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        }
        contactForm.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        if (status) {
          status.className  = 'form-status-msg error';
          status.textContent = '✗ Something went wrong — please email me directly.';
        }
      } finally {
        btn.disabled    = false;
        btn.innerHTML   = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      }
    });
  } else if (contactForm && !window.emailjs) {
    /* Fallback: keep formsubmit.co (already in action attr) */
  }

})();
