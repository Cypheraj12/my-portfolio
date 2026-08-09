// ==================== PREMIUM macOS DESKTOP SPACES INTERACTIVITY ====================

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
    // 2. DESKTOP SPACES NAVIGATION SYSTEM
    // ----------------------------------------------------
    const spacesContainer = document.getElementById('desktop-spaces');
    const desktopSpaces = document.querySelectorAll('.desktop-space');
    const navItems = document.querySelectorAll('.mac-segment-nav .nav-item');
    const desktopDots = document.querySelectorAll('.desktop-dot');
    const dockItems = document.querySelectorAll('.dock-item[data-space]');
    const sectionIds = ['hero', 'projects', 'skills', 'contact'];
    let currentSpace = 0;
    let isScrolling = false;

    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Navigate to a specific space
    function goToSpace(index) {
        if (index < 0 || index >= desktopSpaces.length || isScrolling) return;
        currentSpace = index;

        if (isMobile()) {
            // On mobile, scroll vertically to the section
            const target = document.getElementById(sectionIds[index]);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // On desktop, scroll horizontally within the spaces container
            isScrolling = true;
            desktopSpaces[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            setTimeout(() => { isScrolling = false; }, 600);
        }

        updateActiveIndicators(index);
    }

    // Update active state on nav, dots, and dock
    function updateActiveIndicators(index) {
        // Nav items
        navItems.forEach(item => item.classList.remove('active'));
        navItems.forEach(item => {
            const spaceIndex = item.getAttribute('data-space');
            if (spaceIndex !== null && parseInt(spaceIndex) === index) {
                item.classList.add('active');
            }
        });

        // Desktop dots
        desktopDots.forEach(dot => dot.classList.remove('active'));
        desktopDots.forEach(dot => {
            const spaceIndex = dot.getAttribute('data-space');
            if (spaceIndex !== null && parseInt(spaceIndex) === index) {
                dot.classList.add('active');
            }
        });
    }

    // Nav item clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const spaceIndex = item.getAttribute('data-space');
            if (spaceIndex !== null) {
                goToSpace(parseInt(spaceIndex));
            }

            // Close mobile nav if open
            const mainNav = document.getElementById('main-nav');
            if (mainNav) mainNav.classList.remove('active');
            const mobileToggle = document.getElementById('mobile-nav-toggle');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    });

    // Desktop dot clicks
    desktopDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const spaceIndex = dot.getAttribute('data-space');
            if (spaceIndex !== null) {
                goToSpace(parseInt(spaceIndex));
            }
        });
    });

    // Dock item clicks (with data-space)
    dockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const spaceIndex = item.getAttribute('data-space');
            if (spaceIndex !== null) {
                goToSpace(parseInt(spaceIndex));
            }
        });
    });

    // Hero CTA "View Projects" button
    document.querySelectorAll('[data-space]').forEach(el => {
        if (el.classList.contains('btn-apple') || el.classList.contains('dock-item') || el.classList.contains('nav-item') || el.classList.contains('desktop-dot')) {
            // Already handled above
        } else {
            el.addEventListener('click', (e) => {
                const spaceIndex = el.getAttribute('data-space');
                if (spaceIndex !== null) {
                    e.preventDefault();
                    goToSpace(parseInt(spaceIndex));
                }
            });
        }
    });

    // Scroll detection on the spaces container (desktop only)
    if (spacesContainer) {
        let scrollTimeout;
        spacesContainer.addEventListener('scroll', () => {
            if (isMobile() || isScrolling) return;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = spacesContainer.scrollLeft;
                const containerWidth = spacesContainer.clientWidth;
                const newIndex = Math.round(scrollLeft / containerWidth);
                if (newIndex !== currentSpace && newIndex >= 0 && newIndex < desktopSpaces.length) {
                    currentSpace = newIndex;
                    updateActiveIndicators(currentSpace);
                }
            }, 80);
        }, { passive: true });
    }

    // Keyboard arrow navigation
    document.addEventListener('keydown', (e) => {
        if (isMobile()) return;
        // Don't interfere with form inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            goToSpace(currentSpace + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToSpace(currentSpace - 1);
        }
    });

    // Touch/Swipe support for the spaces container
    if (spacesContainer) {
        let touchStartX = 0;
        let touchEndX = 0;

        spacesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        spacesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    goToSpace(currentSpace + 1);
                } else {
                    goToSpace(currentSpace - 1);
                }
            }
        }, { passive: true });
    }

    // Wheel event for horizontal scrolling (map vertical wheel to horizontal)
    if (spacesContainer) {
        let wheelTimeout;
        let wheelDelta = 0;

        spacesContainer.addEventListener('wheel', (e) => {
            if (isMobile()) return;

            // Prevent default vertical scroll
            e.preventDefault();

            wheelDelta += e.deltaY;

            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (Math.abs(wheelDelta) > 50) {
                    if (wheelDelta > 0) {
                        goToSpace(currentSpace + 1);
                    } else {
                        goToSpace(currentSpace - 1);
                    }
                }
                wheelDelta = 0;
            }, 100);
        }, { passive: false });
    }

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
    // 8. ENTRANCE ANIMATIONS
    // ----------------------------------------------------
    // Animate tiles appearing with staggered delay
    const allTiles = document.querySelectorAll('.apple-tile');
    allTiles.forEach((tile, i) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        tile.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
        setTimeout(() => {
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, 100);
    });

});
