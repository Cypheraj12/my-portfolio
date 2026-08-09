// ==================== EXECUTIVE macOS / iOS INTERACTIVITY ====================

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. LIVE macOS SYSTEM CLOCK UPDATER
    // ----------------------------------------------------
    const macClockEl = document.getElementById('mac-clock');
    function updateMacClock() {
        if (!macClockEl) return;
        const now = new Date();
        const options = { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true };
        macClockEl.innerText = now.toLocaleString('en-US', options);
    }
    updateMacClock();
    setInterval(updateMacClock, 1000);

    // ----------------------------------------------------
    // 2. LIVE DYNAMIC LIQUID GRADIENT & NEURAL MESH CANVAS (PINK & PURPLE PALETTE)
    // ----------------------------------------------------
    const bgCanvas = document.getElementById('bg-web-canvas');
    if (bgCanvas) {
        const bgCtx = bgCanvas.getContext('2d');
        let bgWidth = bgCanvas.width = window.innerWidth;
        let bgHeight = bgCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            bgWidth = bgCanvas.width = window.innerWidth;
            bgHeight = bgCanvas.height = window.innerHeight;
        }, { passive: true });

        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 24 : 55;
        const connectMaxDist = isMobile ? 95 : 145;
        const particles = [];
        const colors = ['#C04899', '#E879F9', '#8B5CF6', '#F4A6C7', '#ffffff'];

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

        // Live Liquid Orbs in Pink & Purple
        let orbAngle = 0;
        let mouseX = -1000;
        let mouseY = -1000;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function renderNeuralMesh() {
            if (document.hidden) {
                requestAnimationFrame(renderNeuralMesh);
                return;
            }

            bgCtx.clearRect(0, 0, bgWidth, bgHeight);

            // Render Animated Ambient Liquid Orbs in Pink & Purple
            orbAngle += 0.005;
            const ox1 = bgWidth * 0.25 + Math.sin(orbAngle) * 50;
            const oy1 = bgHeight * 0.3 + Math.cos(orbAngle * 0.8) * 40;
            const grad1 = bgCtx.createRadialGradient(ox1, oy1, 10, ox1, oy1, isMobile ? 180 : 360);
            grad1.addColorStop(0, 'rgba(244, 166, 199, 0.32)');
            grad1.addColorStop(1, 'rgba(250, 245, 255, 0)');
            bgCtx.fillStyle = grad1;
            bgCtx.beginPath();
            bgCtx.arc(ox1, oy1, isMobile ? 180 : 360, 0, Math.PI * 2);
            bgCtx.fill();

            const ox2 = bgWidth * 0.75 - Math.cos(orbAngle * 0.7) * 60;
            const oy2 = bgHeight * 0.65 + Math.sin(orbAngle * 0.9) * 50;
            const grad2 = bgCtx.createRadialGradient(ox2, oy2, 10, ox2, oy2, isMobile ? 160 : 320);
            grad2.addColorStop(0, 'rgba(216, 180, 248, 0.32)');
            grad2.addColorStop(1, 'rgba(253, 240, 248, 0)');
            bgCtx.fillStyle = grad2;
            bgCtx.beginPath();
            bgCtx.arc(ox2, oy2, isMobile ? 160 : 320, 0, Math.PI * 2);
            bgCtx.fill();

            // Render Interactive Particles & Network Lines
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > bgWidth) p.vx *= -1;
                if (p.y < 0 || p.y > bgHeight) p.vy *= -1;

                // Mouse interaction
                const mdx = mouseX - p.x;
                const mdy = mouseY - p.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 160) {
                    p.x += (mdx / mdist) * 0.5;
                    p.y += (mdy / mdist) * 0.5;
                }

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
                        bgCtx.strokeStyle = '#C04899';
                        bgCtx.globalAlpha = (1 - dist / connectMaxDist) * 0.28;
                        bgCtx.lineWidth = 0.8;
                        bgCtx.beginPath();
                        bgCtx.moveTo(p.x, p.y);
                        bgCtx.lineTo(p2.x, p2.y);
                        bgCtx.stroke();
                        bgCtx.globalAlpha = 1;
                    }
                }
            }

            requestAnimationFrame(renderNeuralMesh);
        }
        renderNeuralMesh();
    }

    // ----------------------------------------------------
    // 3. DIRECT RESUME PDF DOWNLOAD (ATTACHED TO HEADER & DOCK BUTTONS)
    // ----------------------------------------------------
    function triggerResumeDownload(e) {
        if (e) e.preventDefault();
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
            .catch(() => {
                const link = document.createElement('a');
                link.href = cacheBusterUrl;
                link.download = 'Anant_Joshi_FinalYear_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    const headerResumeBtn = document.getElementById('header-resume-btn');
    const dockResumeBtn = document.getElementById('dock-resume-btn');

    if (headerResumeBtn) headerResumeBtn.addEventListener('click', triggerResumeDownload);
    if (dockResumeBtn) dockResumeBtn.addEventListener('click', triggerResumeDownload);

    // ----------------------------------------------------
    // 4. macOS TRAFFIC LIGHTS INTERACTIVITY
    // ----------------------------------------------------
    const macDots = document.querySelectorAll('.mac-dot');
    macDots.forEach(dot => {
        dot.addEventListener('click', () => {
            document.body.style.transition = 'transform 0.15s ease';
            document.body.style.transform = 'scale(0.995)';
            setTimeout(() => {
                document.body.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // ----------------------------------------------------
    // 5. PROJECT FILTERING INTERACTIVITY
    // ----------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

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
    // 6. MOBILE NAV TOGGLE
    // ----------------------------------------------------
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        const navItems = navLinks.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // ----------------------------------------------------
    // 7. CONTACT FORM HANDLING VIA FORMSUBMIT
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';
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
                        formStatusMsg.style.color = '#10b981';
                        formStatusMsg.innerHTML = '⚡ Message transmitted successfully! Thank you.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Transmission failed');
                }
            } catch (err) {
                if (formStatusMsg) {
                    formStatusMsg.style.display = 'block';
                    formStatusMsg.style.color = '#C04899';
                    formStatusMsg.innerHTML = '⚠️ Transmission encounter. Opening email client...';
                }
                const name = document.getElementById('sender-name')?.value || '';
                const email = document.getElementById('sender-email')?.value || '';
                const msg = document.getElementById('sender-message')?.value || '';
                window.location.href = `mailto:anantajjoshi@gmail.com?subject=Portfolio Message from ${encodeURIComponent(name)}&body=Sender Email: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(msg)}`;
            } finally {
                if (formSubmitBtn) {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                }
            }
        });
    }

    // ----------------------------------------------------
    // 8. ACTIVE NAV ITEM SCROLL HIGHLIGHT
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
                    const sectionTop = section.offsetTop - 150;
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
