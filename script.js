// ==================== PREMIUM macOS GLASS PORTFOLIO INTERACTIVITY ====================

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
    // 2. ACTIVE NAV & DOCK HIGHLIGHT ON SCROLL
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.mac-segment-nav .nav-item');
    const dockItems = document.querySelectorAll('.mac-desktop-dock .dock-item[href^="#"]');
    let isScrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 140;
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

                dockItems.forEach(item => {
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

    // ----------------------------------------------------
    // 3. DOCK ITEM BOUNCE ANIMATION ON CLICK
    // ----------------------------------------------------
    const allDockItems = document.querySelectorAll('.mac-desktop-dock .dock-item');
    allDockItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.add('bouncing');
            setTimeout(() => {
                item.classList.remove('bouncing');
            }, 600);
        });
    });

    // ----------------------------------------------------
    // 4. RESUME PDF DOWNLOAD HANDLER
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
    const aboutResumeBtn = document.getElementById('about-resume-btn');

    if (headerResumeBtn) headerResumeBtn.addEventListener('click', triggerResumeDownload);
    if (dockResumeBtn) dockResumeBtn.addEventListener('click', triggerResumeDownload);
    if (aboutResumeBtn) aboutResumeBtn.addEventListener('click', triggerResumeDownload);



    // ----------------------------------------------------
    // 6. SPOTLIGHT SEARCH SYSTEM (⌘ + K)
    // ----------------------------------------------------
    const spotlightBtn = document.getElementById('spotlight-btn');
    const spotlightOverlay = document.getElementById('spotlight-overlay');
    const spotlightInput = document.getElementById('spotlight-input');
    const spotlightResults = document.getElementById('spotlight-results');

    const searchableItems = [
        { title: 'Home / Profile', sub: 'Overview, Bio, Domain Pillars', href: '#hero', icon: 'fa-house' },
        { title: 'Deepfake Detection Web App', sub: 'AI & ML • Python, TensorFlow, MobileNetV2', href: '#projects', icon: 'fa-eye' },
        { title: 'YouTube Video Fetcher API', sub: 'Backend • FastAPI, MongoDB, Asyncio', href: '#projects', icon: 'fa-server' },
        { title: 'Heart Disease ML Predictor', sub: 'Healthcare ML • Scikit-Learn, Streamlit', href: '#projects', icon: 'fa-heart-pulse' },
        { title: 'Predictive API Latency Forecasting', sub: 'Time-Series • LSTM, XGBoost', href: '#projects', icon: 'fa-chart-line' },
        { title: 'Laptop Price Analysis & EDA', sub: 'Data Analysis • Pandas, Regression', href: '#projects', icon: 'fa-chart-column' },
        { title: 'Technical Skills & Competencies', sub: 'Languages, ML, Data Analytics, Databases', href: '#skills', icon: 'fa-sliders' },
        { title: 'Download Resume (PDF)', sub: 'Official Resume Document', action: triggerResumeDownload, icon: 'fa-file-pdf' },
        { title: 'Contact Anant Joshi', sub: 'Email: anantajjoshi@gmail.com', href: '#contact', icon: 'fa-envelope' }
    ];

    function openSpotlight() {
        if (!spotlightOverlay) return;
        spotlightOverlay.classList.add('active');
        if (spotlightInput) {
            spotlightInput.value = '';
            spotlightInput.focus();
            renderSpotlightResults('');
        }
    }

    function closeSpotlight() {
        if (spotlightOverlay) spotlightOverlay.classList.remove('active');
    }

    function renderSpotlightResults(query) {
        if (!spotlightResults) return;
        const q = query.toLowerCase().trim();
        const filtered = searchableItems.filter(item => 
            item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
        );

        if (filtered.length === 0) {
            spotlightResults.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 0.85rem;">No matching search results found.</div>`;
            return;
        }

        spotlightResults.innerHTML = filtered.map((item, i) => `
            <a href="${item.href || '#'}" class="spotlight-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
                <i class="fa-solid ${item.icon}"></i>
                <div>
                    <span class="spotlight-item-title">${item.title}</span>
                    <span class="spotlight-item-sub">${item.sub}</span>
                </div>
            </a>
        `).join('');

        // Attach click events
        const resultEls = spotlightResults.querySelectorAll('.spotlight-item');
        resultEls.forEach((el, index) => {
            el.addEventListener('click', (e) => {
                const targetItem = filtered[index];
                if (targetItem.action) {
                    e.preventDefault();
                    targetItem.action();
                }
                closeSpotlight();
            });
        });
    }

    if (spotlightBtn) spotlightBtn.addEventListener('click', openSpotlight);

    if (spotlightInput) {
        spotlightInput.addEventListener('input', (e) => {
            renderSpotlightResults(e.target.value);
        });
    }

    // Keyboard Shortcuts (⌘K / Ctrl+K / ESC)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (spotlightOverlay && spotlightOverlay.classList.contains('active')) {
                closeSpotlight();
            } else {
                openSpotlight();
            }
        } else if (e.key === 'Escape') {
            closeSpotlight();
            closeAboutMac();
            closeLaunchpad();
        }
    });

    if (spotlightOverlay) {
        spotlightOverlay.addEventListener('click', (e) => {
            if (e.target === spotlightOverlay) closeSpotlight();
        });
    }

    // ----------------------------------------------------
    // 7. ABOUT THIS MAC MODAL
    // ----------------------------------------------------
    const appleLogoTrigger = document.getElementById('apple-logo-trigger');
    const aboutMacOverlay = document.getElementById('about-mac-overlay');
    const aboutCloseBtn = aboutMacOverlay ? aboutMacOverlay.querySelector('.modal-close') : null;

    function openAboutMac() {
        if (aboutMacOverlay) aboutMacOverlay.classList.add('active');
    }

    function closeAboutMac() {
        if (aboutMacOverlay) aboutMacOverlay.classList.remove('active');
    }

    if (appleLogoTrigger) appleLogoTrigger.addEventListener('click', openAboutMac);
    if (aboutCloseBtn) aboutCloseBtn.addEventListener('click', closeAboutMac);

    if (aboutMacOverlay) {
        aboutMacOverlay.addEventListener('click', (e) => {
            if (e.target === aboutMacOverlay) closeAboutMac();
        });
    }

    // ----------------------------------------------------
    // 8. LAUNCHPAD OVERLAY
    // ----------------------------------------------------
    const launchpadDockBtn = document.getElementById('launchpad-dock-btn');
    const launchpadOverlay = document.getElementById('launchpad-overlay');
    const launchpadClose = document.getElementById('launchpad-close');

    function openLaunchpad(e) {
        if (e) e.preventDefault();
        if (launchpadOverlay) launchpadOverlay.classList.add('active');
    }

    function closeLaunchpad() {
        if (launchpadOverlay) launchpadOverlay.classList.remove('active');
    }

    if (launchpadDockBtn) launchpadDockBtn.addEventListener('click', openLaunchpad);
    if (launchpadClose) launchpadClose.addEventListener('click', closeLaunchpad);

    if (launchpadOverlay) {
        launchpadOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeLaunchpad);
        });
    }

    // ----------------------------------------------------
    // 9. macOS TRAFFIC LIGHTS INTERACTIVITY
    // ----------------------------------------------------
    const macDots = document.querySelectorAll('.mac-window-header .mac-dot');
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
    // 10. FINDER PROJECT FILTERING
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
    // 11. MOBILE NAV TOGGLE
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

        const navLinks = mainNav.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // ----------------------------------------------------
    // 12. CONTACT FORM HANDLING VIA FORMSUBMIT
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
                        formStatusMsg.style.color = '#16A34A';
                        formStatusMsg.innerHTML = '✓ Message sent successfully! Thank you.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Transmission failed');
                }
            } catch (err) {
                if (formStatusMsg) {
                    formStatusMsg.style.display = 'block';
                    formStatusMsg.style.color = '#E85D5D';
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
    // 13. ENTRANCE STAGGER ANIMATIONS
    // ----------------------------------------------------
    const allTiles = document.querySelectorAll('.apple-tile');
    allTiles.forEach((tile, i) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(18px)';
        tile.style.transition = `opacity 0.45s ease ${i * 0.05}s, transform 0.45s ease ${i * 0.05}s`;
        setTimeout(() => {
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, 80);
    });

});
