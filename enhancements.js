/* =====================================================
   PORTFOLIO ENHANCEMENTS
   - Typewriter effect on hero accent text
   - Custom glow cursor
   - Scroll reveal (Intersection Observer)
   - Animated stats counters
   - 3D card tilt on mouse move
   ===================================================== */
(function () {
  'use strict';

  // Run initial animations immediately on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    triggerReveal();
    startTypewriter();
    animateStats();
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

})();
