// ==================== MARVEL, SPIDER-MAN, DOCTOR STRANGE & GHOST RIDER INTERACTIVITY ====================

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. INTRO SEQUENCE ORCHESTRATION
    // ----------------------------------------------------
    const greetings = ['NAMASTE', 'HELLO', 'BONJOUR', 'HOLA', 'KONICHIVA', 'CIAO'];
    let greetingIndex = 0;
    const greetingTextEl = document.getElementById('greeting-text');
    const introOverlay = document.getElementById('marvel-intro-overlay');
    const phaseGreetings = document.getElementById('intro-phase-greetings');
    const phaseNeighbourhood = document.getElementById('intro-phase-neighbourhood');
    const phaseSpider = document.getElementById('intro-phase-spider');
    const neighbourhoodText = document.getElementById('neighbourhood-text');
    const spiderCrawler = document.getElementById('spider-crawler');
    const webCanvas = document.getElementById('web-canvas');

    let introFinished = false;

    // Cycle Greetings in Big Bold Text (Red -> White -> Fire Flame Inspired)
    const greetingInterval = setInterval(() => {
        greetingIndex++;
        if (greetingIndex < greetings.length) {
            greetingTextEl.innerText = greetings[greetingIndex];
            
            // Cycle between 1. Red, 2. White, 3. Fire Flame
            const mode = greetingIndex % 3;
            if (mode === 1) {
                greetingTextEl.className = 'red-greeting';
            } else if (mode === 2) {
                greetingTextEl.className = 'white-greeting';
            } else {
                greetingTextEl.className = 'fire-greeting';
            }

            greetingTextEl.style.transform = 'scale(1.1)';
            setTimeout(() => greetingTextEl.style.transform = 'scale(1)', 150);
        } else {
            clearInterval(greetingInterval);
            transitionToPhase2();
        }
    }, 850);

    function transitionToPhase2() {
        if (introFinished) return;
        phaseGreetings.classList.remove('active');
        setTimeout(() => {
            phaseNeighbourhood.classList.add('active');

            // Trigger 3D web shooting animation
            shootWeb3D();

            // Reduced display duration (~2.6 seconds) for Friendly Neighbourhood text
            setTimeout(() => {
                transitionToPhase3();
            }, 2600);
        }, 400);
    }

    function transitionToPhase3() {
        if (introFinished) return;
        phaseNeighbourhood.classList.remove('active');
        phaseSpider.classList.add('active');
        spiderCrawler.classList.add('crawl-up');

        setTimeout(() => {
            finishIntro();
        }, 2200);
    }

    function finishIntro() {
        if (introFinished) return;
        introFinished = true;
        introOverlay.classList.add('fade-out');
        document.body.classList.remove('intro-active');
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 800);
    }

    // ----------------------------------------------------
    // 2. CANVAS 3D WEB SHOOTING EFFECT (INTRO)
    // ----------------------------------------------------
    function shootWeb3D() {
        const ctx = webCanvas.getContext('2d');
        webCanvas.width = window.innerWidth;
        webCanvas.height = window.innerHeight;

        const centerX = webCanvas.width / 2;
        const centerY = webCanvas.height / 2;
        const numRadials = 16;
        let radiusProgress = 0;

        function animateWeb() {
            if (radiusProgress > Math.max(webCanvas.width, webCanvas.height)) return;
            ctx.clearRect(0, 0, webCanvas.width, webCanvas.height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 2.5;

            for (let i = 0; i < numRadials; i++) {
                const angle = (i * 2 * Math.PI) / numRadials;
                const endX = centerX + Math.cos(angle) * radiusProgress;
                const endY = centerY + Math.sin(angle) * radiusProgress;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            const ringCount = 8;
            for (let r = 1; r <= ringCount; r++) {
                const currentRadius = (radiusProgress / ringCount) * r;
                if (currentRadius <= 0) continue;

                ctx.beginPath();
                for (let i = 0; i <= numRadials; i++) {
                    const angle = (i * 2 * Math.PI) / numRadials;
                    const x = centerX + Math.cos(angle) * currentRadius;
                    const y = centerY + Math.sin(angle) * currentRadius;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }

            radiusProgress += 35;
            requestAnimationFrame(animateWeb);
        }

        animateWeb();
    }

    // ----------------------------------------------------
    // 3. FULL-SCREEN DYNAMIC EYE OF AGAMOTTO TIME STONE CANVAS
    // ----------------------------------------------------
    const bgCanvas = document.getElementById('bg-web-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    let bgWidth = bgCanvas.width = window.innerWidth;
    let bgHeight = bgCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        bgWidth = bgCanvas.width = window.innerWidth;
        bgHeight = bgCanvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 70;
    const colors = ['#00ff88', '#00cc66', '#00ffaa', '#e62429', '#ffd700'];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * bgWidth,
            y: Math.random() * bgHeight,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            size: Math.random() * 3.5 + 1,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    let timeAngle = 0;

    function renderBgParticles() {
        bgCtx.clearRect(0, 0, bgWidth, bgHeight);

        // Draw Fullscreen Eye of Agamotto Time Stone Image Relic Artwork
        timeAngle += 0.004;
        const cx = bgWidth / 2;
        const cy = bgHeight / 2;
        const eyeW = Math.min(bgWidth, bgHeight) * 0.75;
        const eyeH = eyeW * 0.58;

        bgCtx.save();
        bgCtx.translate(cx, cy);

        // Dark Atmospheric Fog Background Gradient
        const grad = bgCtx.createRadialGradient(0, 0, 50, 0, 0, Math.max(bgWidth, bgHeight) * 0.7);
        grad.addColorStop(0, 'rgba(0, 50, 20, 0.45)');
        grad.addColorStop(0.5, 'rgba(0, 20, 8, 0.65)');
        grad.addColorStop(1, 'rgba(2, 7, 4, 0.95)');
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);

        // Outer Ancient Brass Relic Shell
        bgCtx.strokeStyle = 'rgba(139, 101, 8, 0.45)';
        bgCtx.lineWidth = 14;
        bgCtx.shadowBlur = 40;
        bgCtx.shadowColor = 'rgba(0, 255, 136, 0.4)';

        bgCtx.beginPath();
        bgCtx.ellipse(0, 0, eyeW / 2, eyeH / 2, 0, 0, Math.PI * 2);
        bgCtx.stroke();

        // Inner Filigree Rings (Rotating Time Runes)
        bgCtx.save();
        bgCtx.rotate(timeAngle);
        bgCtx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        bgCtx.lineWidth = 4;
        bgCtx.beginPath();
        bgCtx.arc(0, 0, eyeH * 0.42, 0, Math.PI * 2);
        bgCtx.stroke();

        bgCtx.strokeStyle = 'rgba(0, 255, 136, 0.35)';
        bgCtx.setLineDash([12, 8]);
        bgCtx.beginPath();
        bgCtx.arc(0, 0, eyeH * 0.48, 0, Math.PI * 2);
        bgCtx.stroke();
        bgCtx.restore();

        // Glowing Emerald Time Stone Core at Center
        const stoneGrad = bgCtx.createRadialGradient(0, 0, 5, 0, 0, eyeH * 0.3);
        stoneGrad.addColorStop(0, '#ffffff');
        stoneGrad.addColorStop(0.3, '#00ff88');
        stoneGrad.addColorStop(0.7, 'rgba(0, 204, 102, 0.8)');
        stoneGrad.addColorStop(1, 'rgba(0, 100, 40, 0)');

        bgCtx.fillStyle = stoneGrad;
        bgCtx.shadowBlur = 60;
        bgCtx.shadowColor = '#00ff88';

        bgCtx.beginPath();
        bgCtx.arc(0, 0, eyeH * 0.3, 0, Math.PI * 2);
        bgCtx.fill();

        bgCtx.restore();

        // Render Green Time Particles Network
        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > bgWidth) p.vx *= -1;
            if (p.y < 0 || p.y > bgHeight) p.vy *= -1;

            bgCtx.fillStyle = p.color;
            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            bgCtx.fill();

            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    bgCtx.strokeStyle = p.color;
                    bgCtx.globalAlpha = 1 - dist / 140;
                    bgCtx.lineWidth = 0.8;
                    bgCtx.beginPath();
                    bgCtx.moveTo(p.x, p.y);
                    bgCtx.lineTo(p2.x, p2.y);
                    bgCtx.stroke();
                    bgCtx.globalAlpha = 1;
                }
            }
        }

        requestAnimationFrame(renderBgParticles);
    }
    renderBgParticles();

    // ----------------------------------------------------
    // 4. THOR'S MJOLNIR CLICK LIGHTNING THUNDERBOLTS
    // ----------------------------------------------------
    const thorHammer = document.getElementById('thor-hammer');
    const lightningCanvas = document.getElementById('lightning-canvas');
    const lCtx = lightningCanvas.getContext('2d');
    lightningCanvas.width = window.innerWidth;
    lightningCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        lightningCanvas.width = window.innerWidth;
        lightningCanvas.height = window.innerHeight;
    });

    if (thorHammer) {
        thorHammer.addEventListener('click', () => {
            const hammerRect = thorHammer.getBoundingClientRect();
            const startX = hammerRect.left + hammerRect.width / 2;
            const startY = hammerRect.top + hammerRect.height / 2;

            document.body.style.background = '#00d2ff';
            setTimeout(() => {
                document.body.style.background = '#020704';
            }, 120);

            for (let i = 0; i < 8; i++) {
                const targetX = Math.random() * lightningCanvas.width;
                const targetY = Math.random() * lightningCanvas.height;
                drawLightningBolt(startX, startY, targetX, targetY);
            }

            playThunderSound();
        });
    }

    function drawLightningBolt(x1, y1, x2, y2) {
        let currentX = x1;
        let currentY = y1;
        const distance = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.floor(distance / 20);

        lCtx.strokeStyle = '#00F3FF';
        lCtx.lineWidth = 3;
        lCtx.shadowBlur = 20;
        lCtx.shadowColor = '#00d2ff';

        lCtx.beginPath();
        lCtx.moveTo(currentX, currentY);

        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const nextX = x1 + (x2 - x1) * progress + (Math.random() - 0.5) * 40;
            const nextY = y1 + (y2 - y1) * progress + (Math.random() - 0.5) * 40;

            lCtx.lineTo(nextX, nextY);
            currentX = nextX;
            currentY = nextY;
        }

        lCtx.lineTo(x2, y2);
        lCtx.stroke();

        setTimeout(() => {
            lCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
        }, 350);
    }

    function playThunderSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.4);

            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        } catch (err) {
            // Audio fallback
        }
    }

    // ----------------------------------------------------
    // 5. CAPTAIN AMERICA SHIELD LIVE LAUNCH TO HEADER & RETURN AFTER EXACTLY 5 SECONDS
    // ----------------------------------------------------
    const capShield = document.getElementById('cap-shield');
    const verticalNameBadge = document.getElementById('vertical-sidebar-name');

    if (capShield) {
        capShield.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Move Cap Shield smoothly live towards top Header section
            const isMobile = window.innerWidth <= 768;
            const targetX = isMobile ? '35vw' : '42vw';
            const targetY = isMobile ? '-78vh' : '-86vh';

            capShield.style.transition = 'all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            capShield.style.transform = `translate(${targetX}, ${targetY}) rotate(1440deg) scale(1.1)`;

            // Show Vertical Sidebar Name
            if (verticalNameBadge) {
                verticalNameBadge.classList.add('active');
            }

            // Return to original position after EXACTLY 5 seconds (5000ms)
            setTimeout(() => {
                capShield.style.transition = 'all 1s ease-in-out';
                capShield.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
                if (verticalNameBadge) {
                    verticalNameBadge.classList.remove('active');
                }
            }, 5000);
        });
    }

    // ----------------------------------------------------
    // 6. SCREEN-DOMINATING VIBRANT PURPLE & GOLD MAGIC SPARKLE BLAST
    // ----------------------------------------------------
    const portalCanvas = document.getElementById('portal-canvas');
    const pCtx = portalCanvas.getContext('2d');
    portalCanvas.width = window.innerWidth;
    portalCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        portalCanvas.width = window.innerWidth;
        portalCanvas.height = window.innerHeight;
    });

    const clickableChants = document.querySelectorAll('.clickable-chant');

    clickableChants.forEach(chant => {
        chant.addEventListener('click', (e) => {
            e.stopPropagation();

            const cRect = chant.getBoundingClientRect();
            const cx = cRect.left + cRect.width / 2;
            const cy = cRect.top + cRect.height / 2;

            // Throw Full Screen Dominating Purple & Yellow Magic Sparkle Star Flash
            spawnPurpleYellowMagicFlash(cx, cy);

            // Make chant vanish for EXACTLY 8 seconds (8000ms)
            chant.classList.add('vanished-chant');

            setTimeout(() => {
                chant.classList.remove('vanished-chant');
            }, 8000);
        });
    });

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    function spawnPurpleYellowMagicFlash(cx, cy) {
        const sparkCount = 380;
        const magicParticles = [];
        const magicColors = ['#c084fc', '#9d4edd', '#7b2cbf', '#FFD700', '#ffb703', '#ffffff', '#00f3ff'];
        let waveRadius = 0;

        for (let i = 0; i < sparkCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 26 + 6;
            magicParticles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: Math.random() * 0.015 + 0.008,
                size: Math.random() * 9 + 4,
                color: magicColors[Math.floor(Math.random() * magicColors.length)],
                spikes: Math.random() > 0.4 ? 5 : 4
            });
        }

        function animateMagicSparks() {
            pCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);
            let alive = false;
            waveRadius += 40;

            pCtx.save();
            pCtx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
            pCtx.lineWidth = 6;
            pCtx.shadowBlur = 40;
            pCtx.shadowColor = '#FFD700';
            pCtx.beginPath();
            pCtx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
            pCtx.stroke();
            pCtx.restore();

            for (let p of magicParticles) {
                if (p.life > 0) {
                    alive = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life -= p.decay;

                    pCtx.save();
                    pCtx.globalAlpha = p.life;
                    pCtx.shadowBlur = 30;
                    pCtx.shadowColor = p.color;

                    drawStar(pCtx, p.x, p.y, p.spikes, p.size, p.size / 2, p.color);
                    pCtx.restore();
                }
            }

            if (alive || waveRadius < Math.max(portalCanvas.width, portalCanvas.height) * 1.5) {
                requestAnimationFrame(animateMagicSparks);
            } else {
                pCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);
            }
        }

        animateMagicSparks();
    }

    // ----------------------------------------------------
    // 7. ARC REACTOR NAV BUTTON & MOBILE MENU TOGGLE
    // ----------------------------------------------------
    const arcNavBtn = document.getElementById('arc-reactor-nav-btn');
    const navSocialSlide = document.getElementById('nav-social-slide');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (arcNavBtn && navSocialSlide) {
        arcNavBtn.addEventListener('click', () => {
            navSocialSlide.classList.toggle('active');
            arcNavBtn.classList.toggle('active');
        });
    }

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('mobile-active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        // Close mobile nav on item click
        const navItemsList = navLinks.querySelectorAll('.nav-item');
        navItemsList.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // ----------------------------------------------------
    // 8. PROJECT FILTERING INTERACTIVITY
    // ----------------------------------------------------
    const pFilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    pFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.pfilter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'levitateMotion 6s ease-in-out infinite alternate';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------
    // 9. 3D CARD TILT & HOVER MOTION EFFECT
    // ----------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Disable tilt on mobile for performance
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
    });

    // ----------------------------------------------------
    // 10. ACTIVE NAVBAR HIGHLIGHT ON SCROLL
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
});
