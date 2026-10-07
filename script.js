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
                    <h4 class="project-title">
                        <a href="${escapeHtml(p.liveUrl || p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-title-link" onclick="event.stopPropagation();">
                            ${escapeHtml(p.title)}
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" style="opacity: 0.65; flex-shrink: 0;"><path d="M10.5 1.5H7a.5.5 0 0 0 0 1h2.793L4.146 8.146a.5.5 0 1 0 .708.708L10.5 3.207V6a.5.5 0 0 0 1 0V1.5a.5.5 0 0 0-.5-.5z"/><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H5a.5.5 0 0 1 0 1H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v2.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 1 10.5v-7z"/></svg>
                        </a>
                    </h4>
                    <p class="project-desc">${escapeHtml(p.description)}</p>
                    <div class="project-highlights-list">
                        ${p.highlights.map(h => `<div class="highlight-row"><span>${escapeHtml(h)}</span></div>`).join("")}
                    </div>
                    <div class="project-tags-row">
                        ${p.stack.map(s => `<span class="tech-tag">${escapeHtml(s)}</span>`).join("")}
                    </div>
                </div>
                <div class="project-card-footer" style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
                    ${p.liveUrl ? `
                        <a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn project-link-demo" onclick="event.stopPropagation();">
                            <span>Live Demo</span>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><path d="M10.5 1.5H7a.5.5 0 0 0 0 1h2.793L4.146 8.146a.5.5 0 1 0 .708.708L10.5 3.207V6a.5.5 0 0 0 1 0V1.5a.5.5 0 0 0-.5-.5z"/><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H5a.5.5 0 0 1 0 1H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v2.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 1 10.5v-7z"/></svg>
                        </a>
                    ` : ""}
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
    const allChip = document.querySelector('.finder-chip[data-filter="all"]');
    if (allChip) {
        allChip.textContent = `All (${projects.length})`;
    }

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

        // Position About Window PROMINENTLY in the CENTER of the desktop
        const winAbout = windows.about;
        if (winAbout) {
            // Noticeably larger dimensions: 940px wide x 620px tall, responsive to screen
            const aboutWidth = Math.min(940, Math.max(740, window.innerWidth - 220));
            const availableHeight = window.innerHeight - 28 - 84; // Space between top menu bar (28px) and dock
            const aboutHeight = Math.min(620, Math.max(500, availableHeight - 32));

            winAbout.style.width = `${aboutWidth}px`;
            winAbout.style.height = `${aboutHeight}px`;

            // Prominently centered horizontally on the desktop
            const leftPos = Math.max(124, Math.floor((window.innerWidth - aboutWidth) / 2));

            // Visually centered vertically between top menu bar and bottom dock
            const topPos = Math.max(38, Math.floor(28 + (availableHeight - aboutHeight) / 2));

            winAbout.style.left = `${leftPos}px`;
            winAbout.style.top = `${topPos}px`;
            resetWindowScroll(winAbout);
        }

        // Other windows open offset and cascade cleanly
        const otherWidth = Math.min(780, window.innerWidth - 180);
        const otherHeight = Math.min(550, window.innerHeight - 150);

        const baseLeft = Math.max(120, Math.floor((window.innerWidth - otherWidth) / 2) - 40);
        const baseTop = Math.max(48, Math.floor((window.innerHeight - otherHeight) / 2) - 30);

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
                            <p style="font-size: 13px; color: var(--accent); margin-bottom: 4px;">${personal.role}</p>
                            <p style="font-size: 12px; color: var(--text-muted);">${personal.degree} • ${personal.specialization}</p>
                        </div>
                        <h4 style="font-family: var(--font-mono); font-size: 11px; color: var(--accent); margin-bottom: 8px; text-transform: uppercase;">Overview</h4>
                        <div style="font-size: 13px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px; white-space: pre-line;">${personal.bio}</div>
                        
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
                                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 6px;">
                                        <a href="${escapeHtml(p.liveUrl || p.githubUrl)}" target="_blank" rel="noopener noreferrer" style="color: #FFF; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                            ${escapeHtml(p.title)}
                                            <svg width="11" height="11" viewBox="0 0 12 12" fill="var(--accent)"><path d="M10.5 1.5H7a.5.5 0 0 0 0 1h2.793L4.146 8.146a.5.5 0 1 0 .708.708L10.5 3.207V6a.5.5 0 0 0 1 0V1.5a.5.5 0 0 0-.5-.5z"/><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H5a.5.5 0 0 1 0 1H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v2.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 1 10.5v-7z"/></svg>
                                        </a>
                                    </h4>
                                    <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px;">${escapeHtml(p.description)}</p>
                                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
                                        ${p.stack.map(s => `<span class="tech-tag">${escapeHtml(s)}</span>`).join("")}
                                    </div>
                                    <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
                                        ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--accent); font-weight: 600; text-decoration: underline;">Live Demo ↗</a>` : ""}
                                        <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--text-secondary); font-weight: 500; text-decoration: underline;">View on GitHub ↗</a>
                                    </div>
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
    // 6. DESKTOP FILE & GO MENUS & PROJECT NAVIGATION
    // ==========================================================================

    const fileWrap = document.getElementById("file-menu-wrap");
    const goWrap = document.getElementById("go-menu-wrap");
    const fileBtn = document.getElementById("mac-file-btn");
    const goBtn = document.getElementById("mac-go-btn");

    const closeAllDropdowns = () => {
        if (fileWrap) fileWrap.classList.remove("open");
        if (goWrap) goWrap.classList.remove("open");
    };

    if (fileBtn) {
        fileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = fileWrap.classList.contains("open");
            closeAllDropdowns();
            if (!isOpen) fileWrap.classList.add("open");
        });
    }

    if (goBtn) {
        goBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = goWrap.classList.contains("open");
            closeAllDropdowns();
            if (!isOpen) goWrap.classList.add("open");
        });
    }

    const focusAndScrollToProject = (projectId) => {
        openWindow("projects");
        // Reset filter chips to "all" if the project is filtered out
        const allFilterChip = document.querySelector('.finder-chip[data-filter="all"]');
        if (allFilterChip && !allFilterChip.classList.contains("active")) {
            const filterChips = document.querySelectorAll(".finder-chip");
            filterChips.forEach(c => c.classList.remove("active"));
            allFilterChip.classList.add("active");
            renderDesktopProjects("all");
        }

        setTimeout(() => {
            const card = document.querySelector(`.project-finder-card[data-id="${projectId}"]`);
            if (card) {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                card.focus();
                card.style.outline = "2px solid var(--accent)";
                card.style.boxShadow = "0 0 24px rgba(116, 208, 250, 0.45)";
                setTimeout(() => {
                    card.style.outline = "";
                    card.style.boxShadow = "";
                }, 2200);
            }
        }, 120);
    };

    document.querySelectorAll("[data-open-project]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const projId = btn.getAttribute("data-open-project");
            closeAllDropdowns();
            focusAndScrollToProject(projId);
        });
    });

    document.querySelectorAll("[data-go-target]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const target = btn.getAttribute("data-go-target");
            closeAllDropdowns();
            openWindow(target);
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".mac-dropdown-wrap")) {
            closeAllDropdowns();
        }
    });

    // ==========================================================================
    // 7. FINDER GLOBAL SEARCH (⌘K / Ctrl+K / Finder button / Search icon)
    // ==========================================================================

    const searchModal = document.getElementById("finder-search-modal");
    const searchInput = document.getElementById("finder-search-input");
    const searchResultsContainer = document.getElementById("finder-search-results");
    const searchBackdrop = document.getElementById("finder-search-backdrop");
    const searchEscBtn = document.getElementById("finder-search-esc-btn");
    const finderMenuBtn = document.getElementById("mac-menu-finder");
    const searchTrigger = document.getElementById("mac-search-trigger");

    let activeResultIdx = 0;
    let currentResults = [];

    // Comprehensive portfolio search index
    const searchIndex = [
        ...projects.map(p => ({
            id: p.id,
            type: "Project",
            title: p.title,
            subtitle: `${p.tag} • ${p.stack.slice(0, 3).join(", ")}`,
            content: `${p.title} ${p.description} ${p.tag} ${p.category} ${p.stack.join(" ")} ${p.highlights.join(" ")}`,
            icon: `<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.293a1.5 1.5 0 0 1 1.06.44L8.207 3.8a.5.5 0 0 0 .354.15H13.5A1.5 1.5 0 0 1 15 5.45V12.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z" fill="#74D0FA"/></svg>`,
            action: () => focusAndScrollToProject(p.id)
        })),
        ...skills.map(s => ({
            id: s.category,
            type: "Skill Category",
            title: s.category,
            subtitle: s.items.join(", "),
            content: `${s.category} ${s.items.join(" ")}`,
            icon: `<svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 5.5l3 3-3 3M9.5 11.5h3" stroke="#74D0FA" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
            action: () => openWindow("skills")
        })),
        {
            id: "about-me-section",
            type: "About",
            title: "About Anant Joshi",
            subtitle: "AI/ML Engineer & Data Analyst • Core background and principles",
            content: "about anant joshi bio data science machine learning model optimization",
            icon: `<svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0-2.5-3-4-6-4s-6 1.5-6 4v1h12v-1z" fill="#74D0FA"/></svg>`,
            action: () => openWindow("about")
        },
        {
            id: "resume-doc",
            type: "Resume",
            title: "Anant_Joshi_Resume.pdf",
            subtitle: "Preview resume document or download PDF (217 KB)",
            content: "resume cv pdf download credentials experience education",
            icon: `<svg viewBox="0 0 16 16" width="16" height="16"><path d="M4 1.5h5.5L13 5v9.5H4V1.5z" stroke="#74D0FA" fill="none"/><path d="M9.5 1.5V5H13" stroke="#74D0FA" fill="none"/></svg>`,
            action: () => openWindow("resume")
        },
        {
            id: "contact-direct-email",
            type: "Contact",
            title: "Direct Email — anantajjoshi@gmail.com",
            subtitle: "Compose message or copy email address",
            content: "email anantajjoshi@gmail.com message contact hire get in touch",
            icon: `<svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4zm1.5.5v.382l4.5 2.812 4.5-2.812V4.5h-9zm9 7V6.118l-4.235 2.647a.5.5 0 0 1-.53 0L3.5 6.118v5.382h9z" fill="#74D0FA"/></svg>`,
            action: () => openWindow("contact")
        },
        {
            id: "contact-linkedin-link",
            type: "Social",
            title: "LinkedIn Profile",
            subtitle: "anant-joshi-52a6ab2a7",
            content: "linkedin profile connect network",
            icon: `<svg viewBox="0 0 16 16" width="16" height="16"><path d="M14 2H2v12h12V2zM5.5 12.5H3.7V6.7h1.8v5.8zm-.9-6.6a1 1 0 1 1 0-2.1 1 1 0 0 1 0 2.1zm8 6.6h-1.8V9.6c0-.7-.3-1.2-1-1.2-.5 0-.8.3-.9.7v3.4H7V6.7h1.8v.8c.3-.4.8-1 1.8-1 1.3 0 2.3.8 2.3 2.6v3.4z" fill="#74D0FA"/></svg>`,
            action: () => window.open(personal.linkedin, "_blank")
        },
        {
            id: "contact-github-link",
            type: "Social",
            title: "GitHub Profile",
            subtitle: "github.com/Cypheraj12",
            content: "github code repositories git cypheraj12",
            icon: `<svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8c0 2.9 1.9 5.3 4.5 6.2.3.1.4-.1.4-.3v-1.2c-1.8.4-2.2-.9-2.2-.9-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.7 0 1 .7 1 .7.6 1 1.5.7 1.9.5.1-.4.2-.7.4-.9-1.4-.2-3-.7-3-3.2 0-.7.3-1.3.7-1.8-.1-.2-.3-.8.1-1.7 0 0 .6-.2 1.8.7.5-.1 1.1-.2 1.6-.2s1.1.1 1.6.2c1.2-.8 1.8-.7 1.8-.7.4.9.1 1.6.1 1.7.4.5.7 1.1.7 1.8 0 2.5-1.5 3-3 3.2.2.2.4.6.4 1.2v1.8c0 .2.2.4.4.3 2.6-.9 4.5-3.3 4.5-6.2 0-3.6-2.9-6.5-6.5-6.5z" fill="#74D0FA"/></svg>`,
            action: () => window.open(personal.github, "_blank")
        }
    ];

    const updateSelectedResult = () => {
        if (!searchResultsContainer) return;
        const items = searchResultsContainer.querySelectorAll(".finder-result-item");
        items.forEach((item, idx) => {
            if (idx === activeResultIdx) {
                item.classList.add("selected");
                item.setAttribute("aria-selected", "true");
                item.scrollIntoView({ block: "nearest" });
            } else {
                item.classList.remove("selected");
                item.setAttribute("aria-selected", "false");
            }
        });
    };

    const executeSearchResult = (idx) => {
        const item = currentResults[idx];
        if (!item) return;
        closeFinderSearch();
        if (typeof item.action === "function") {
            item.action();
        }
    };

    const renderSearchResults = (query = "") => {
        if (!searchResultsContainer) return;
        const q = query.trim().toLowerCase();
        if (!q) {
            currentResults = searchIndex.slice(0, 8);
        } else {
            currentResults = searchIndex.filter(item => 
                item.title.toLowerCase().includes(q) ||
                item.subtitle.toLowerCase().includes(q) ||
                item.content.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q)
            );
        }
        activeResultIdx = 0;

        if (currentResults.length === 0) {
            searchResultsContainer.innerHTML = `<div class="finder-search-empty">No results found for "${escapeHtml(query)}"</div>`;
            return;
        }

        searchResultsContainer.innerHTML = currentResults.map((item, idx) => `
            <button class="finder-result-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}" role="option" aria-selected="${idx === 0}">
                <div class="finder-result-left">
                    <div class="finder-result-icon">${item.icon}</div>
                    <div class="finder-result-info">
                        <span class="finder-result-title">${escapeHtml(item.title)}</span>
                        <span class="finder-result-subtitle">${escapeHtml(item.subtitle)}</span>
                    </div>
                </div>
                <span class="finder-result-badge">${escapeHtml(item.type)}</span>
            </button>
        `).join("");

        searchResultsContainer.querySelectorAll(".finder-result-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-idx"), 10);
                executeSearchResult(idx);
            });
        });
    };

    const openFinderSearch = () => {
        closeAllDropdowns();
        if (!searchModal) return;
        searchModal.classList.add("open");
        if (searchInput) {
            searchInput.value = "";
            searchInput.focus();
        }
        renderSearchResults("");
    };

    const closeFinderSearch = () => {
        if (!searchModal) return;
        searchModal.classList.remove("open");
    };

    if (finderMenuBtn) {
        finderMenuBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openFinderSearch();
        });
    }

    if (searchTrigger) {
        searchTrigger.addEventListener("click", (e) => {
            e.preventDefault();
            openFinderSearch();
        });
    }

    if (searchBackdrop) {
        searchBackdrop.addEventListener("click", closeFinderSearch);
    }
    if (searchEscBtn) {
        searchEscBtn.addEventListener("click", closeFinderSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderSearchResults(e.target.value);
        });
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (currentResults.length > 0) {
                    activeResultIdx = (activeResultIdx + 1) % currentResults.length;
                    updateSelectedResult();
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (currentResults.length > 0) {
                    activeResultIdx = (activeResultIdx - 1 + currentResults.length) % currentResults.length;
                    updateSelectedResult();
                }
            } else if (e.key === "Enter") {
                e.preventDefault();
                executeSearchResult(activeResultIdx);
            } else if (e.key === "Escape") {
                e.preventDefault();
                closeFinderSearch();
            }
        });
    }

    // Global shortcut keys (⌘K / Ctrl+K and ESC)
    window.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
            e.preventDefault();
            if (searchModal && searchModal.classList.contains("open")) {
                closeFinderSearch();
            } else {
                openFinderSearch();
            }
        } else if (e.key === "Escape") {
            closeFinderSearch();
            closeAllDropdowns();
        }
    });

    // ==========================================================================
    // 8. CLOCKS & LIVE SYSTEM TIME
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

        // Tablet format: 19:45
        const tabletClock = document.getElementById("tablet-clock-display");
        if (tabletClock) tabletClock.textContent = `${hours24}:${minutes}`;

        // iOS format: 9:41 or 19:41
        const iosClock = document.getElementById("ios-clock-display");
        if (iosClock) iosClock.textContent = `${now.getHours()}:${minutes}`;
    };

    updateSystemClocks();
    setInterval(updateSystemClocks, 1000);

    // ==========================================================================
    // 9. TOAST NOTIFICATIONS & EMAIL COPY
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
    // 10. DESKTOP CONTACT FORM SUBMISSION FEEDBACK
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

    // ==========================================================================
    // 11. SAFARI URL BAR & LOADING PROGRESS INTERACTION
    // ==========================================================================
    const triggerSafariLoading = () => {
        const loadingBars = document.querySelectorAll(".safari-loading-progress");
        loadingBars.forEach(bar => {
            bar.style.animation = "none";
            void bar.offsetWidth; // Force CSS reflow
            bar.style.animation = "safariLoadProgress 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards";
        });
    };

    // Reload buttons on Tablet header and iOS footer
    document.querySelectorAll(".safari-reload-btn, .safari-reload-action-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerSafariLoading();
            showToast("Reloaded anantjoshiportfolio.com");
        });
    });

    // Tapping URL pill re-triggers loading animation smoothly
    document.querySelectorAll(".safari-pill, .tablet-safari-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            triggerSafariLoading();
        });
    });
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
