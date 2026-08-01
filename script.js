// ==================== MARVEL, SPIDER-MAN & DOCTOR STRANGE INTERACTIVITY ====================

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. INTRO SEQUENCE ORCHESTRATION (Dynamic Color Cycling Greetings)
    // ----------------------------------------------------
    const greetings = [
        { text: 'NAMASTE', color: '#ffe600' },    // Flame Yellow
        { text: 'HELLO', color: '#ffffff' },      // Pure White
        { text: 'BONJOUR', color: '#c01116' },    // Dark Red
        { text: 'HOLA', color: '#ffe600' },       // Flame Yellow
        { text: 'KONICHIVA', color: '#ffffff' },   // Pure White
        { text: 'CIAO', color: '#c01116' }        // Dark Red
    ];
    let greetingIndex = 0;
    const greetingTextEl = document.getElementById('greeting-text');
    const introOverlay = document.getElementById('marvel-intro-overlay');
    const phaseGreetings = document.getElementById('intro-phase-greetings');
    const phaseNeighbourhood = document.getElementById('intro-phase-neighbourhood');

    let introFinished = false;

    // Set initial greeting color on page load
    if (greetingTextEl && greetings[0]) {
        greetingTextEl.innerText = greetings[0].text;
        greetingTextEl.style.color = greetings[0].color;
    }

    // Cycle Greetings & Dynamic Color (Flame Yellow, Pure White, Dark Red)
    const greetingInterval = setInterval(() => {
        greetingIndex++;
        if (greetingIndex < greetings.length) {
            if (greetingTextEl) {
                greetingTextEl.innerText = greetings[greetingIndex].text;
                greetingTextEl.style.color = greetings[greetingIndex].color;
                
                // Add pop scaling feedback on color change
                greetingTextEl.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    if (greetingTextEl) greetingTextEl.style.transform = 'scale(1)';
                }, 150);
            }
        } else {
            clearInterval(greetingInterval);
            transitionToPhase2();
        }
    }, 750);

    function transitionToPhase2() {
        if (introFinished) return;
        if (phaseGreetings) phaseGreetings.classList.remove('active');
        setTimeout(() => {
            if (phaseNeighbourhood) phaseNeighbourhood.classList.add('active');

            // Display duration (~2.8 seconds) for Upside Down Hanging Spider-Man & Pro Headline
            setTimeout(() => {
                finishIntro();
            }, 2800);
        }, 300);
    }

    function finishIntro() {
        if (introFinished) return;
        introFinished = true;
        if (introOverlay) {
            introOverlay.classList.add('fade-out');
            document.body.classList.remove('intro-active');
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 600);
        }
    }

    // ----------------------------------------------------
    // 2. FULL-SCREEN HIGH-PERFORMANCE EYE OF AGAMOTTO TIME STONE CANVAS (RETINA & MOBILE OPTIMIZED)
    // ----------------------------------------------------
    const bgCanvas = document.getElementById('bg-web-canvas');
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext('2d');
    
    // Limit pixel ratio to 2 max for silky smooth 60fps on 4K retina mobile screens
    const getDpr = () => Math.min(window.devicePixelRatio || 1, 2);
    let dpr = getDpr();
    let bgWidth = bgCanvas.width = window.innerWidth;
    let bgHeight = bgCanvas.height = window.innerHeight;

    const resizeBgCanvas = () => {
        dpr = getDpr();
        bgWidth = bgCanvas.width = window.innerWidth;
        bgHeight = bgCanvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeBgCanvas, { passive: true });

    const isMobile = window.innerWidth <= 768;
    const particles = [];
    const particleCount = isMobile ? 18 : 45;
    const connectMaxDist = isMobile ? 85 : 130;
    const colors = ['#10b981', '#059669', '#00ff88', '#e62429', '#ffd700'];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * bgWidth,
            y: Math.random() * bgHeight,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            size: Math.random() * 2.5 + 1,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    let timeAngle = 0;
    let bgAnimFrameId = null;

    function renderBgParticles() {
        // Pause animation loop if tab is hidden to preserve battery and mobile performance
        if (document.hidden) {
            bgAnimFrameId = requestAnimationFrame(renderBgParticles);
            return;
        }

        bgCtx.clearRect(0, 0, bgWidth, bgHeight);

        timeAngle += 0.003;
        const cx = bgWidth / 2;
        const cy = bgHeight / 2;
        const eyeW = Math.min(bgWidth, bgHeight) * (isMobile ? 0.85 : 0.72);
        const eyeH = eyeW * 0.58;

        bgCtx.save();
        bgCtx.translate(cx, cy);

        const grad = bgCtx.createRadialGradient(0, 0, 40, 0, 0, Math.max(bgWidth, bgHeight) * 0.7);
        grad.addColorStop(0, 'rgba(0, 40, 15, 0.4)');
        grad.addColorStop(0.5, 'rgba(0, 15, 5, 0.6)');
        grad.addColorStop(1, 'rgba(2, 7, 4, 0.92)');
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);

        bgCtx.strokeStyle = 'rgba(139, 101, 8, 0.4)';
        bgCtx.lineWidth = isMobile ? 5 : 10;

        bgCtx.beginPath();
        bgCtx.ellipse(0, 0, eyeW / 2, eyeH / 2, 0, 0, Math.PI * 2);
        bgCtx.stroke();

        bgCtx.save();
        bgCtx.rotate(timeAngle);
        bgCtx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
        bgCtx.lineWidth = 2;
        bgCtx.beginPath();
        bgCtx.arc(0, 0, eyeH * 0.42, 0, Math.PI * 2);
        bgCtx.stroke();

        bgCtx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        bgCtx.setLineDash([10, 8]);
        bgCtx.beginPath();
        bgCtx.arc(0, 0, eyeH * 0.48, 0, Math.PI * 2);
        bgCtx.stroke();
        bgCtx.restore();

        const stoneGrad = bgCtx.createRadialGradient(0, 0, 4, 0, 0, eyeH * 0.3);
        stoneGrad.addColorStop(0, '#ffffff');
        stoneGrad.addColorStop(0.3, '#10b981');
        stoneGrad.addColorStop(0.7, 'rgba(5, 150, 105, 0.7)');
        stoneGrad.addColorStop(1, 'rgba(0, 80, 30, 0)');

        bgCtx.fillStyle = stoneGrad;

        bgCtx.beginPath();
        bgCtx.arc(0, 0, eyeH * 0.3, 0, Math.PI * 2);
        bgCtx.fill();

        bgCtx.restore();

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

                if (dist < connectMaxDist) {
                    bgCtx.strokeStyle = p.color;
                    bgCtx.globalAlpha = 1 - dist / connectMaxDist;
                    bgCtx.lineWidth = 0.8;
                    bgCtx.beginPath();
                    bgCtx.moveTo(p.x, p.y);
                    bgCtx.lineTo(p2.x, p2.y);
                    bgCtx.stroke();
                    bgCtx.globalAlpha = 1;
                }
            }
        }

        bgAnimFrameId = requestAnimationFrame(renderBgParticles);
    }
    renderBgParticles();

    // Helper function for instant touch + click binding
    function addInstantTapListener(element, callback) {
        if (!element) return;
        let touchHandled = false;

        element.addEventListener('touchstart', (e) => {
            touchHandled = true;
            callback(e);
        }, { passive: true });

        element.addEventListener('click', (e) => {
            if (touchHandled) {
                touchHandled = false;
                return;
            }
            callback(e);
        });
    }

    // ----------------------------------------------------
    // 3. THOR'S MJOLNIR CLICK/TAP LIGHTNING & WORTHINESS TOAST
    // ----------------------------------------------------
    const thorHammer = document.getElementById('thor-hammer');
    const lightningCanvas = document.getElementById('lightning-canvas');
    const thorToastMsg = document.getElementById('thor-toast-msg');
    let lCtx = null;
    let thorToastTimeout;

    if (lightningCanvas) {
        lCtx = lightningCanvas.getContext('2d');
        lightningCanvas.width = window.innerWidth;
        lightningCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            lightningCanvas.width = window.innerWidth;
            lightningCanvas.height = window.innerHeight;
        }, { passive: true });
    }

    if (thorHammer) {
        addInstantTapListener(thorHammer, () => {
            const hammerRect = thorHammer.getBoundingClientRect();
            const startX = hammerRect.left + hammerRect.width / 2;
            const startY = hammerRect.top + hammerRect.height / 2;

            document.body.style.background = '#00d2ff';
            setTimeout(() => {
                document.body.style.background = '#030407';
            }, 100);

            const count = isMobile ? 3 : 6;
            for (let i = 0; i < count; i++) {
                const targetX = Math.random() * (lightningCanvas ? lightningCanvas.width : window.innerWidth);
                const targetY = Math.random() * (lightningCanvas ? lightningCanvas.height : window.innerHeight);
                drawLightningBolt(startX, startY, targetX, targetY);
            }

            playThunderSound();

            // Smooth Jump / Scroll to Projects Section
            const projectsSec = document.getElementById('projects');
            if (projectsSec) {
                projectsSec.scrollIntoView({ behavior: 'smooth' });
            }

            // Display "Proof of worthiness, below." Toast Message
            if (thorToastMsg) {
                thorToastMsg.classList.add('show');
                clearTimeout(thorToastTimeout);
                thorToastTimeout = setTimeout(() => {
                    thorToastMsg.classList.remove('show');
                }, 3500);
            }
        });
    }

    function drawLightningBolt(x1, y1, x2, y2) {
        if (!lCtx || !lightningCanvas) return;
        let currentX = x1;
        let currentY = y1;
        const distance = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.floor(distance / 25);

        lCtx.strokeStyle = '#00F3FF';
        lCtx.lineWidth = 2.5;

        lCtx.beginPath();
        lCtx.moveTo(currentX, currentY);

        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const nextX = x1 + (x2 - x1) * progress + (Math.random() - 0.5) * 35;
            const nextY = y1 + (y2 - y1) * progress + (Math.random() - 0.5) * 35;

            lCtx.lineTo(nextX, nextY);
            currentX = nextX;
            currentY = nextY;
        }

        lCtx.lineTo(x2, y2);
        lCtx.stroke();

        setTimeout(() => {
            if (lCtx && lightningCanvas) {
                lCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
            }
        }, 300);
    }

    function playThunderSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const audioCtx = new AudioCtx();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);

            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } catch (err) {
            // Audio fallback
        }
    }

    // ----------------------------------------------------
    // 4. DEADPOOL MASK CLICK/TAP: UNCACHED DIRECT SYSTEM RESUME DOWNLOAD
    // ----------------------------------------------------
    const deadpoolMask = document.getElementById('deadpool-mask');
    const deadpoolToastMsg = document.getElementById('deadpool-toast-msg');
    let deadpoolToastTimeout;

    if (deadpoolMask) {
        addInstantTapListener(deadpoolMask, (e) => {
            // 1. Display Deadpool Toast Popup Message
            if (deadpoolToastMsg) {
                deadpoolToastMsg.classList.add('show');
                clearTimeout(deadpoolToastTimeout);
                deadpoolToastTimeout = setTimeout(() => {
                    deadpoolToastMsg.classList.remove('show');
                }, 4000);
            }

            // 2. Play Deadpool Laugh Audio Effect
            playDeadpoolLaughSound();

            // 3. Forced Uncached Blob Download of Final Year Resume
            const cacheBusterUrl = 'Anant_Joshi_FinalYear_Resume.pdf?v=' + Date.now();
            fetch(cacheBusterUrl, { cache: 'no-cache' })
                .then(res => res.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = 'Anant_Joshi_FinalYear_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                })
                .catch(err => {
                    const link = document.createElement('a');
                    link.href = cacheBusterUrl;
                    link.download = 'Anant_Joshi_FinalYear_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
        });
    }

    function playDeadpoolLaughSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const audioCtx = new AudioCtx();
            const now = audioCtx.currentTime;
            [0, 0.18, 0.36].forEach((delay, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(350 + idx * 40, now + delay);
                osc.frequency.exponentialRampToValueAtTime(180, now + delay + 0.12);

                gain.gain.setValueAtTime(0.25, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.12);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now + delay);
                osc.stop(now + delay + 0.12);
            });
        } catch (err) {
            // Audio API fallback
        }
    }

    // ----------------------------------------------------
    // 5. DOCTOR STRANGE SUBTLE ELDRITCH SPELL PULSE (NO SPARKLES)
    // ----------------------------------------------------
    const portalCanvas = document.getElementById('portal-canvas');
    let pCtx = null;
    if (portalCanvas) {
        pCtx = portalCanvas.getContext('2d');
        portalCanvas.width = window.innerWidth;
        portalCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            portalCanvas.width = window.innerWidth;
            portalCanvas.height = window.innerHeight;
        }, { passive: true });
    }

    const clickableChants = document.querySelectorAll('.clickable-chant');

    clickableChants.forEach(chant => {
        addInstantTapListener(chant, (e) => {
            const cRect = chant.getBoundingClientRect();
            const cx = cRect.left + cRect.width / 2;
            const cy = cRect.top + cRect.height / 2;

            spawnDoctorStrangeSpellPulse(cx, cy);

            chant.classList.add('vanished-chant');

            setTimeout(() => {
                chant.classList.remove('vanished-chant');
            }, 8000);
        });
    });

    function spawnDoctorStrangeSpellPulse(cx, cy) {
        if (!pCtx || !portalCanvas) return;
        let radius = 10;
        let maxRadius = isMobile ? 180 : 320;
        let opacity = 1.0;
        let runeAngle = 0;

        function animateEldritchMandala() {
            if (!pCtx || !portalCanvas) return;
            pCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);

            if (opacity <= 0 || radius >= maxRadius) {
                pCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);
                return;
            }

            radius += 12;
            opacity -= 0.035;
            runeAngle += 0.05;

            pCtx.save();
            pCtx.translate(cx, cy);
            pCtx.globalAlpha = Math.max(0, opacity);

            const auraGrad = pCtx.createRadialGradient(0, 0, 5, 0, 0, radius);
            auraGrad.addColorStop(0, 'rgba(255, 230, 0, 0.4)');
            auraGrad.addColorStop(0.5, 'rgba(0, 85, 255, 0.25)');
            auraGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
            pCtx.fillStyle = auraGrad;
            pCtx.beginPath();
            pCtx.arc(0, 0, radius, 0, Math.PI * 2);
            pCtx.fill();

            pCtx.strokeStyle = '#ffe600';
            pCtx.lineWidth = 3;
            pCtx.beginPath();
            pCtx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
            pCtx.stroke();

            pCtx.save();
            pCtx.rotate(runeAngle);
            pCtx.strokeStyle = 'rgba(0, 243, 255, 0.8)';
            pCtx.lineWidth = 2;
            pCtx.strokeRect(-radius * 0.4, -radius * 0.4, radius * 0.8, radius * 0.8);
            pCtx.restore();

            pCtx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
            pCtx.setLineDash([12, 8]);
            pCtx.lineWidth = 2;
            pCtx.beginPath();
            pCtx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
            pCtx.stroke();

            pCtx.restore();

            requestAnimationFrame(animateEldritchMandala);
        }

        animateEldritchMandala();
    }

    // ----------------------------------------------------
    // 6. ARC REACTOR NAV BUTTON & TOAST MESSAGE DISPLAY
    // ----------------------------------------------------
    const arcNavBtn = document.getElementById('arc-reactor-nav-btn');
    const navSocialSlide = document.getElementById('nav-social-slide');
    const arcToastMsg = document.getElementById('arc-toast-msg');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    let toastTimeout;

    if (arcNavBtn && navSocialSlide) {
        addInstantTapListener(arcNavBtn, () => {
            navSocialSlide.classList.toggle('active');
            arcNavBtn.classList.toggle('active');

            // Trigger "Reactor's stable. Socials incoming." Toast Message
            if (arcToastMsg) {
                arcToastMsg.classList.add('show');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    arcToastMsg.classList.remove('show');
                }, 3200);
            }
        });
    }

    if (mobileNavToggle && navLinks) {
        addInstantTapListener(mobileNavToggle, () => {
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

        const navItemsList = navLinks.querySelectorAll('.nav-item');
        navItemsList.forEach(item => {
            addInstantTapListener(item, () => {
                navLinks.classList.remove('mobile-active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // ----------------------------------------------------
    // 7. DIRECT EMAIL TRANSMISSION FORM HANDLING
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING...';
            }

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://formsubmit.co/ajax/anantajjoshi@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (formStatusMsg) {
                        formStatusMsg.style.display = 'block';
                        formStatusMsg.className = 'form-status-msg';
                        formStatusMsg.innerHTML = '⚡ TRANSMISSION SUCCESSFUL! Message delivered directly to Anant Joshi.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Transmission failed');
                }
            } catch (err) {
                if (formStatusMsg) {
                    formStatusMsg.style.display = 'block';
                    formStatusMsg.className = 'form-status-msg error';
                    formStatusMsg.innerHTML = '⚠️ Transmission delay encountered. Opening email client...';
                }
                const name = document.getElementById('sender-name')?.value || '';
                const email = document.getElementById('sender-email')?.value || '';
                const msg = document.getElementById('sender-message')?.value || '';
                window.location.href = `mailto:anantajjoshi@gmail.com?subject=Portfolio Message from ${encodeURIComponent(name)}&body=Sender Email: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(msg)}`;
            } finally {
                if (formSubmitBtn) {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> TRANSMIT SIGNAL DIRECTLY';
                }
            }
        });
    }

    // ----------------------------------------------------
    // 8. PROJECT FILTERING INTERACTIVITY
    // ----------------------------------------------------
    const pFilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    pFilterBtns.forEach(btn => {
        addInstantTapListener(btn, () => {
            pFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.pfilter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------
    // 9. 3D CARD TILT & HOVER MOTION EFFECT (DESKTOP ONLY HOVER GUARD)
    // ----------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasHoverPointer) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 14;
                const rotateY = (centerX - x) / 14;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // ----------------------------------------------------
    // 10. ACTIVE NAVBAR HIGHLIGHT ON SCROLL (THROTTLED WITH RAF FOR SILKY SCROLLING)
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    let isScrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 180;
                    if (scrollPos >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${current}`) {
                        item.classList.add('active');
                    }
                });

                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }, { passive: true });
});
