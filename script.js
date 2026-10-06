/**
 * ANANT JOSHI — PORTFOLIO SCRIPT
 * macOS Desktop Window Manager, Subtle 3D Parallax & iOS Home Screen Experience
 * Uses PORTFOLIO_DATA from data.js
 */

document.addEventListener("DOMContentLoaded", () => {
    // Check data availability
    if (typeof PORTFOLIO_DATA === "undefined") {
        console.error("PORTFOLIO_DATA configuration not loaded.");
        return;
    }

    const { personal, projects, skills, contact } = PORTFOLIO_DATA;

    // Reduced motion preference check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // State
    let topZIndex = 100;
    let isDraggingAnyWindow = false;

    const windows = {
        about: document.getElementById("win-about"),
        projects: document.getElementById("win-projects"),
        skills: document.getElementById("win-skills"),
        contact: document.getElementById("win-contact"),
        resume: document.getElementById("win-resume")
    };

    // Wallpaper layers for mouse parallax
    const wpLayer1 = document.getElementById("wp-layer-1");
    const wpLayer2 = document.getElementById("wp-layer-2");
    const wpLayer3 = document.getElementById("wp-layer-3");
    const wpLayer4 = document.getElementById("wp-layer-4");
    const dock = document.getElementById("mac-dock");

    // ==========================================================================
    // 1. DATA RENDERING (PROJECTS & SKILLS)
    // ==========================================================================

    const renderDesktopProjects = (filter = "all") => {
        const grid = document.getElementById("desktop-projects-grid");
        if (!grid) return;

        const filtered = filter === "all" 
            ? projects 
            : projects.filter(p => p.category === filter || (filter === "ml" && p.category.includes("ml")));

        grid.innerHTML = filtered.map(p => `
            <article class="project-finder-card" data-id="${p.id}" tabindex="0">
                <div>
                    <div class="project-header-row">
                        <span class="project-tag-pill">${escapeHtml(p.tag)}</span>
                        <span class="project-year">${escapeHtml(p.year)}</span>
                    </div>
                    <h4 class="project-title">${escapeHtml(p.title)}</h4>
                    <p class="project-desc">${escapeHtml(p.description)}</p>
                    <div class="project-highlights-list">
                        ${p.highlights.map(h => `<div class="highlight-row"><span>${escapeHtml(h)}</span></div>`).join("")}
                    </div>
                    <div class="project-tags-row">
                        ${p.stack.map(s => `<span class="tech-tag">${escapeHtml(s)}</span>`).join("")}
                    </div>
                </div>
                <div class="project-card-footer">
                    <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" onclick="event.stopPropagation();">
                        <span>View Source Code</span>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><path d="M10.5 1.5H7a.5.5 0 0 0 0 1h2.793L4.146 8.146a.5.5 0 1 0 .708.708L10.5 3.207V6a.5.5 0 0 0 1 0V1.5a.5.5 0 0 0-.5-.5z"/><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H5a.5.5 0 0 1 0 1H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v2.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 1 10.5v-7z"/></svg>
                    </a>
                </div>
            </article>
        `).join("");
    };

    const renderDesktopSkills = () => {
        const container = document.getElementById("desktop-skills-content");
        if (!container) return;

        container.innerHTML = skills.map(cat => `
            <div class="skill-category-box">
                <div class="skill-category-title">
                    <span>${escapeHtml(cat.category)}</span>
                    <span class="skill-category-count">${cat.items.length} items</span>
                </div>
                <div class="skills-plain-list">
                    ${cat.items.map(item => `<span class="skill-item-tag">${escapeHtml(item)}</span>`).join("")}
                </div>
            </div>
        `).join("");
    };

    renderDesktopProjects();
    renderDesktopSkills();

    // Project filtering in finder
    const filterChips = document.querySelectorAll(".finder-chip");
    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            filterChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            const filter = chip.getAttribute("data-filter");
            renderDesktopProjects(filter);
        });
    });

    // ==========================================================================
    // 2. DESKTOP WINDOW POSITIONING & MANAGEMENT
    // ==========================================================================

    const resetWindowScroll = (win) => {
        if (!win) return;
        win.scrollTop = 0;
        const body = win.querySelector(".window-body");
        if (body) body.scrollTop = 0;
        const main = win.querySelector(".about-content-main");
        if (main) main.scrollTop = 0;
    };

    const positionWindowsOnDesktop = () => {
        if (window.innerWidth < 1024) return;

        // Position About Window on the RIGHT side (~48px margin, vertically centered above dock)
        const winAbout = windows.about;
        if (winAbout) {
            const aboutWidth = Math.min(700, window.innerWidth - 120);
            const aboutHeight = Math.min(520, window.innerHeight - 130);
            winAbout.style.width = `${aboutWidth}px`;
            winAbout.style.height = `${aboutHeight}px`;

            const rightMargin = 48;
            const leftPos = Math.max(120, window.innerWidth - aboutWidth - rightMargin);

            const availableHeight = window.innerHeight - 28 - 80;
            const topPos = Math.max(38, Math.floor(28 + (availableHeight - aboutHeight) / 2));

            winAbout.style.left = `${leftPos}px`;
            winAbout.style.top = `${topPos}px`;
            resetWindowScroll(winAbout);
        }

        // Other windows open offset from center-left, cascading by 24px so they never cover About window
        const otherWidth = Math.min(740, window.innerWidth - 180);
        const otherHeight = Math.min(510, window.innerHeight - 140);

        const baseLeft = Math.max(110, Math.floor((window.innerWidth - otherWidth) / 2) - 100);
        const baseTop = Math.max(48, Math.floor((window.innerHeight - otherHeight) / 2) - 40);

        const cascadeOrder = ["projects", "skills", "contact", "resume"];
        cascadeOrder.forEach((name, idx) => {
            const win = windows[name];
            if (win) {
                win.style.width = `${otherWidth}px`;
                win.style.height = `${otherHeight}px`;
                win.style.left = `${baseLeft + idx * 24}px`;
                win.style.top = `${baseTop + idx * 24}px`;
                resetWindowScroll(win);
            }
        });
    };

    positionWindowsOnDesktop();
    window.addEventListener("resize", () => {
        if (!isDraggingAnyWindow) {
            positionWindowsOnDesktop();
        }
    });

    const updateDockIndicators = () => {
        Object.keys(windows).forEach(key => {
            const win = windows[key];
            const dockItem = document.querySelector(`.dock-item[data-open-window="${key}"]`);
            if (dockItem && win) {
                if (win.classList.contains("open") && !win.classList.contains("minimized")) {
                    dockItem.classList.add("running");
                } else {
                    dockItem.classList.remove("running");
                }
            }
        });
    };

    const focusWindow = (win) => {
        if (!win) return;
        topZIndex += 1;
        win.style.zIndex = topZIndex;

        Object.values(windows).forEach(w => {
            if (w) w.classList.remove("active");
        });
        win.classList.add("active");
    };

    const openWindow = (name) => {
        const win = windows[name];
        if (!win) return;

        win.classList.remove("minimized");
        win.classList.add("open");
        focusWindow(win);
        resetWindowScroll(win);
        updateDockIndicators();
    };

    const closeWindow = (win) => {
        if (!win) return;
        win.classList.remove("open", "active", "maximized");
        win.style.transform = "";
        updateDockIndicators();
    };

    const minimizeWindow = (win) => {
        if (!win) return;
        win.classList.add("minimized");
        win.classList.remove("active");
        win.style.transform = "";
        updateDockIndicators();
    };

    const toggleMaximizeWindow = (win) => {
        if (!win) return;
        win.classList.toggle("maximized");
        if (win.classList.contains("maximized")) {
            win.style.transform = "";
        }
    };

    // Attach click handlers to desktop icons and dock triggers
    document.querySelectorAll("[data-open-window]").forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const winName = trigger.getAttribute("data-open-window");
            const win = windows[winName];

            if (win && win.classList.contains("open") && !win.classList.contains("minimized") && win.classList.contains("active")) {
                if (trigger.classList.contains("dock-item")) {
                    minimizeWindow(win);
                    return;
                }
            }
            openWindow(winName);
        });
    });

    // Window traffic lights & clicking to focus
    Object.values(windows).forEach(win => {
        if (!win) return;

        win.addEventListener("mousedown", () => focusWindow(win));
        win.addEventListener("touchstart", () => focusWindow(win), { passive: true });

        const closeBtn = win.querySelector(".traffic-light.close");
        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                closeWindow(win);
            });
        }

        const minBtn = win.querySelector(".traffic-light.minimize");
        if (minBtn) {
            minBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                minimizeWindow(win);
            });
        }

        const maxBtn = win.querySelector(".traffic-light.maximize");
        if (maxBtn) {
            maxBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleMaximizeWindow(win);
            });
        }
    });

    // Draggable Window Logic
    Object.values(windows).forEach(win => {
        if (!win) return;
        const titlebar = win.querySelector(".window-titlebar");
        if (!titlebar) return;

        let isDragging = false;
        let startX = 0, startY = 0;
        let origLeft = 0, origTop = 0;

        const onMouseDown = (e) => {
            if (e.target.closest(".traffic-lights") || e.target.closest("button")) return;
            if (win.classList.contains("maximized")) return;

            isDragging = true;
            isDraggingAnyWindow = true;
            focusWindow(win);
            win.style.transform = "";

            startX = e.clientX || (e.touches && e.touches[0].clientX);
            startY = e.clientY || (e.touches && e.touches[0].clientY);

            const rect = win.getBoundingClientRect();
            origLeft = rect.left;
            origTop = rect.top;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            document.addEventListener("touchmove", onMouseMove, { passive: false });
            document.addEventListener("touchend", onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault();

            const curX = e.clientX || (e.touches && e.touches[0].clientX);
            const curY = e.clientY || (e.touches && e.touches[0].clientY);

            const deltaX = curX - startX;
            const deltaY = curY - startY;

            let newLeft = origLeft + deltaX;
            let newTop = origTop + deltaY;

            const maxLeft = window.innerWidth - 120;
            const maxTop = window.innerHeight - 80;
            newLeft = Math.max(10, Math.min(newLeft, maxLeft));
            newTop = Math.max(30, Math.min(newTop, maxTop));

            win.style.left = `${newLeft}px`;
            win.style.top = `${newTop}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            isDraggingAnyWindow = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("touchmove", onMouseMove);
            document.removeEventListener("touchend", onMouseUp);
        };

        titlebar.addEventListener("mousedown", onMouseDown);
        titlebar.addEventListener("touchstart", onMouseDown, { passive: true });
    });

    // Keyboard Shortcuts: ESC closes the active window
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const activeWin = document.querySelector(".mac-window.active.open");
            if (activeWin) {
                closeWindow(activeWin);
            }
        }
    });

    // Default open About window on desktop load
    if (window.innerWidth >= 1024) {
        openWindow("about");
    }

    // ==========================================================================
    // 3. WALLPAPER MOUSE PARALLAX & SUBTLE 3D PERSPECTIVE TILT
    // ==========================================================================

    if (!prefersReducedMotion && window.innerWidth >= 1024) {
        window.addEventListener("mousemove", (e) => {
            const normX = (e.clientX / window.innerWidth) - 0.5;
            const normY = (e.clientY / window.innerHeight) - 0.5;

            // Wallpaper layers shift 4px to 14px at different depths (with 600ms ease-out via CSS transition)
            if (wpLayer1) wpLayer1.style.transform = `translate3d(${(normX * 4).toFixed(1)}px, ${(normY * 4).toFixed(1)}px, 0)`;
            if (wpLayer2) wpLayer2.style.transform = `translate3d(${(normX * 8).toFixed(1)}px, ${(normY * 8).toFixed(1)}px, 0)`;
            if (wpLayer3) wpLayer3.style.transform = `translate3d(${(normX * 11).toFixed(1)}px, ${(normY * 11).toFixed(1)}px, 0)`;
            if (wpLayer4) wpLayer4.style.transform = `translate3d(${(normX * 14).toFixed(1)}px, ${(normY * 14).toFixed(1)}px, 0)`;

            // Subtle perspective tilt (max 2.5deg) on About window when open, not maximized, and not dragging
            const aboutWin = windows.about;
            if (aboutWin && aboutWin.classList.contains("open") && !aboutWin.classList.contains("maximized") && !isDraggingAnyWindow) {
                const tiltX = (-normY * 2.5).toFixed(2);
                const tiltY = (normX * 2.5).toFixed(2);
                aboutWin.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }

            // Subtle perspective tilt on dock
            if (dock) {
                const dockTiltX = (-normY * 1.8).toFixed(2);
                const dockTiltY = (normX * 1.8).toFixed(2);
                dock.style.transform = `perspective(800px) rotateX(${dockTiltX}deg) rotateY(${dockTiltY}deg)`;
            }
        });
    }

    // Mobile device tilt (if permitted)
    if (!prefersReducedMotion && window.innerWidth < 1024 && window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (e) => {
            if (e.gamma === null || e.beta === null) return;
            const tiltGamma = Math.max(-20, Math.min(20, e.gamma)) / 20; // -1 to 1
            const tiltBeta = Math.max(-20, Math.min(20, e.beta - 40)) / 20;

            if (wpLayer1) wpLayer1.style.transform = `translate3d(${(tiltGamma * 4).toFixed(1)}px, ${(tiltBeta * 4).toFixed(1)}px, 0)`;
            if (wpLayer2) wpLayer2.style.transform = `translate3d(${(tiltGamma * 8).toFixed(1)}px, ${(tiltBeta * 8).toFixed(1)}px, 0)`;
            if (wpLayer3) wpLayer3.style.transform = `translate3d(${(tiltGamma * 11).toFixed(1)}px, ${(tiltBeta * 11).toFixed(1)}px, 0)`;
            if (wpLayer4) wpLayer4.style.transform = `translate3d(${(tiltGamma * 14).toFixed(1)}px, ${(tiltBeta * 14).toFixed(1)}px, 0)`;
        }, { passive: true });
    }

    // ==========================================================================
    // 4. DOCK HOVER MAGNIFICATION EFFECT
    // ==========================================================================

    if (dock) {
        const dockItems = dock.querySelectorAll(".dock-item");

        dock.addEventListener("mousemove", (e) => {
            const mouseX = e.clientX;

            dockItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - itemCenterX);
                const maxDistance = 140;

                if (distance < maxDistance) {
                    const norm = 1 - distance / maxDistance;
                    const scale = 1 + 0.28 * Math.sin((norm * Math.PI) / 2);
                    item.style.transform = `scale(${scale.toFixed(3)})`;
                } else {
                    item.style.transform = "scale(1)";
                }
            });
        });

        dock.addEventListener("mouseleave", () => {
            dockItems.forEach(item => {
                item.style.transform = "scale(1)";
            });
        });
    }

    // ==========================================================================
    // 5. MOBILE iOS EXPERIENCE (< 768px)
    // ==========================================================================

    const sheetOverlay = document.getElementById("ios-sheet-overlay");
    const sheetTitle = document.getElementById("ios-sheet-title");
    const sheetBody = document.getElementById("ios-sheet-body");
    const sheetCloseBtn = document.getElementById("ios-sheet-close-btn");

    const getSheetContent = (key) => {
        switch (key) {
            case "about":
                return {
                    title: "About Me",
                    html: `
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="${personal.photo}" alt="${personal.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-medium); margin-bottom: 12px;">
                            <h2 style="font-size: 18px; font-weight: 600; color: #FFF; margin-bottom: 4px;">${personal.name}</h2>
                            <p style="font-size: 13px; color: var(--accent); margin-bottom: 8px;">${personal.role}</p>
                            <p style="font-size: 12px; color: var(--text-muted);">${personal.degree} • ${personal.specialization}</p>
                        </div>
                        <h4 style="font-family: var(--font-mono); font-size: 11px; color: var(--accent); margin-bottom: 8px; text-transform: uppercase;">Overview</h4>
                        <p style="font-size: 13px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px;">${personal.bio}</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <a href="Anant_Joshi_Resume.pdf" download="Anant_Joshi_Resume.pdf" class="btn-macos btn-macos-primary" style="width: 100%; padding: 10px;">Download Resume (PDF)</a>
                            <a href="https://linkedin.com/in/anant-joshi-52a6ab2a7/" target="_blank" rel="noopener noreferrer" class="btn-macos btn-macos-secondary" style="width: 100%; padding: 10px;">Visit LinkedIn</a>
                            <a href="https://github.com/Cypheraj12" target="_blank" rel="noopener noreferrer" class="btn-macos btn-macos-secondary" style="width: 100%; padding: 10px;">Visit GitHub</a>
                        </div>
                    `
                };
            case "projects":
                return {
                    title: "Projects",
                    html: `
                        <div style="display: flex; flex-direction: column; gap: 14px;">
                            ${projects.map(p => `
                                <div style="background: var(--base-dark-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                        <span class="project-tag-pill">${escapeHtml(p.tag)}</span>
                                        <span class="project-year">${escapeHtml(p.year)}</span>
                                    </div>
                                    <h4 style="font-size: 15px; font-weight: 600; color: #FFF; margin-bottom: 6px;">${escapeHtml(p.title)}</h4>
                                    <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px;">${escapeHtml(p.description)}</p>
                                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
                                        ${p.stack.map(s => `<span class="tech-tag">${escapeHtml(s)}</span>`).join("")}
                                    </div>
                                    <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--accent); font-weight: 500; text-decoration: underline;">View on GitHub →</a>
                                </div>
                            `).join("")}
                        </div>
                    `
                };
            case "skills":
                return {
                    title: "Technical Skills",
                    html: `
                        <div style="display: flex; flex-direction: column; gap: 14px;">
                            ${skills.map(cat => `
                                <div style="background: var(--base-dark-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px;">
                                    <h4 style="font-size: 13px; font-weight: 600; color: #FFF; margin-bottom: 10px;">${escapeHtml(cat.category)}</h4>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                        ${cat.items.map(i => `<span class="skill-item-tag">${escapeHtml(i)}</span>`).join("")}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `
                };
            case "contact":
                return {
                    title: "Contact",
                    html: `
                        <div style="margin-bottom: 20px;">
                            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">Direct channels for professional opportunities and technical inquiries:</p>
                            <div style="background: var(--base-dark-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                                <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 2px;">EMAIL</div>
                                <a href="mailto:anantajjoshi@gmail.com" style="color: var(--accent); font-size: 13px; word-break: break-all;">anantajjoshi@gmail.com</a>
                            </div>
                        </div>
                        <form action="https://formsubmit.co/anantajjoshi@gmail.com" method="POST" style="display: flex; flex-direction: column; gap: 12px;">
                            <input type="hidden" name="_subject" value="Mobile Portfolio Message">
                            <input type="hidden" name="_captcha" value="false">
                            <input type="text" name="name" placeholder="Your Name" required style="background: var(--base-dark-elevated); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px; color: #FFF; font-size: 13px;">
                            <input type="email" name="email" placeholder="Your Email" required style="background: var(--base-dark-elevated); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px; color: #FFF; font-size: 13px;">
                            <textarea name="message" rows="4" placeholder="Your Message..." required style="background: var(--base-dark-elevated); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px; color: #FFF; font-size: 13px; resize: none;"></textarea>
                            <button type="submit" class="btn-macos btn-macos-primary" style="padding: 10px;">Send Message</button>
                        </form>
                    `
                };
            case "resume":
                return {
                    title: "Resume",
                    html: `
                        <div style="text-align: center; padding: 20px 0;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#74D0FA" style="margin-bottom: 12px;">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                            </svg>
                            <h3 style="font-size: 16px; color: #FFF; margin-bottom: 6px;">Anant Joshi — Resume</h3>
                            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px;">Final-Year B.Tech CSE (Data Science) • 217 KB PDF</p>
                            <a href="Anant_Joshi_Resume.pdf" download="Anant_Joshi_Resume.pdf" class="btn-macos btn-macos-primary" style="display: block; width: 100%; padding: 12px; font-size: 14px;">Download PDF</a>
                        </div>
                    `
                };
            default:
                return { title: "Sheet", html: "" };
        }
    };

    const openSheet = (key) => {
        if (!sheetOverlay || !sheetBody || !sheetTitle) return;
        const data = getSheetContent(key);
        sheetTitle.textContent = data.title;
        sheetBody.innerHTML = data.html;
        sheetOverlay.classList.add("active");
    };

    const closeSheet = () => {
        if (!sheetOverlay) return;
        sheetOverlay.classList.remove("active");
    };

    document.querySelectorAll("[data-open-sheet]").forEach(item => {
        item.addEventListener("click", () => {
            const sheetKey = item.getAttribute("data-open-sheet");
            openSheet(sheetKey);
        });
    });

    if (sheetCloseBtn) {
        sheetCloseBtn.addEventListener("click", closeSheet);
    }
    if (sheetOverlay) {
        sheetOverlay.addEventListener("click", (e) => {
            if (e.target === sheetOverlay) closeSheet();
        });
    }

    // ==========================================================================
    // 6. CLOCKS & LIVE SYSTEM TIME
    // ==========================================================================

    const updateSystemClocks = () => {
        const now = new Date();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const day = days[now.getDay()];
        const hours24 = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        // Format: Sun 19:45
        const timeStr = `${day} ${hours24}:${minutes}`;
        const macClock = document.getElementById("mac-clock-display");
        if (macClock) macClock.textContent = timeStr;

        // iOS format: 9:41 or 19:41
        const iosClock = document.getElementById("ios-clock-display");
        if (iosClock) iosClock.textContent = `${now.getHours()}:${minutes}`;
    };

    updateSystemClocks();
    setInterval(updateSystemClocks, 1000);

    // ==========================================================================
    // 7. TOAST NOTIFICATIONS & EMAIL COPY
    // ==========================================================================

    const showToast = (message) => {
        const toast = document.getElementById("os-toast");
        const msgEl = document.getElementById("os-toast-msg");
        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2400);
    };

    const copyEmailBtn = document.getElementById("copy-email-btn");
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", (e) => {
            e.preventDefault();
            navigator.clipboard.writeText("anantajjoshi@gmail.com")
                .then(() => showToast("Copied anantajjoshi@gmail.com to clipboard"))
                .catch(() => window.location.href = "mailto:anantajjoshi@gmail.com");
        });
    }

    // ==========================================================================
    // 8. DESKTOP CONTACT FORM SUBMISSION FEEDBACK
    // ==========================================================================

    const contactForm = document.getElementById("desktop-contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", () => {
            const submitBtn = document.getElementById("send-mail-btn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending...";
            }
        });
    }

    // Apple Menu Logo Handler
    const appleLogo = document.getElementById("mac-apple-menu");
    if (appleLogo) {
        appleLogo.addEventListener("click", () => {
            openWindow("about");
        });
    }
});

// Helper for escaping strings into HTML
function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
