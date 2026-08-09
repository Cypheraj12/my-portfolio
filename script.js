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
    // 2. ACTIVE NAV HIGHLIGHT ON SCROLL
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

                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }, { passive: true });

    // ----------------------------------------------------
    // 3. RESUME PDF DOWNLOAD HANDLER
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
    // 5. FINDER PROJECT FILTERING
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
    // 8. ENTRANCE STAGGER ANIMATIONS
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
