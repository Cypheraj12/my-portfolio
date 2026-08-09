// ==================== EXECUTIVE APPLE LIQUID GLASS INTERACTIVITY ====================

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
    // 2. CUPERTINO NEON ATMOSPHERIC CANVAS
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
        const particleCount = isMobile ? 22 : 45;
        const connectMaxDist = isMobile ? 95 : 140;
        const particles = [];
        const colors = ['rgba(56, 189, 248, 0.6)', 'rgba(192, 132, 252, 0.5)', 'rgba(0, 122, 255, 0.6)', 'rgba(255, 255, 255, 0.4)'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * bgWidth,
                y: Math.random() * bgHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        let mouseX = -1000;
        let mouseY = -1000;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function renderAtmosphere() {
            if (document.hidden) {
                requestAnimationFrame(renderAtmosphere);
                return;
            }

            bgCtx.clearRect(0, 0, bgWidth, bgHeight);

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
                if (mdist < 140) {
                    p.x += (mdx / mdist) * 0.4;
                    p.y += (mdy / mdist) * 0.4;
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
                        bgCtx.strokeStyle = '#38BDF8';
                        bgCtx.globalAlpha = (1 - dist / connectMaxDist) * 0.2;
                        bgCtx.lineWidth = 0.8;
                        bgCtx.beginPath();
                        bgCtx.moveTo(p.x, p.y);
                        bgCtx.lineTo(p2.x, p2.y);
                        bgCtx.stroke();
                        bgCtx.globalAlpha = 1;
                    }
                }
            }

            requestAnimationFrame(renderAtmosphere);
        }
        renderAtmosphere();
    }

    // ----------------------------------------------------
    // 3. HIGH PRIORITY DIRECT RESUME PDF DOWNLOAD HANDLER
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
    const macWindow = document.querySelector('.mac-window-container');
    
    if (macDots.length && macWindow) {
        macDots.forEach(dot => {
            dot.addEventListener('click', () => {
                macWindow.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
                macWindow.style.transform = 'scale(0.99)';
                setTimeout(() => {
                    macWindow.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    // ----------------------------------------------------
    // 5. FINDER PROJECT FILTERING INTERACTIVITY
    // ----------------------------------------------------
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.project-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category || '';
                if (filter === 'all' || category.includes(filter)) {
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
    const mainNav = document.getElementById('main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        const navItems = mainNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mainNav.classList.remove('active');
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
                formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
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
                        formStatusMsg.style.color = '#34D399';
                        formStatusMsg.innerHTML = '✓ Message sent successfully! Thank you.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Transmission failed');
                }
            } catch (err) {
                if (formStatusMsg) {
                    formStatusMsg.style.display = 'block';
                    formStatusMsg.style.color = '#38BDF8';
                    formStatusMsg.innerHTML = 'Opening default email client...';
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
    const navItems = document.querySelectorAll('.mac-segment-nav .nav-item');
    let isScrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 160;
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
