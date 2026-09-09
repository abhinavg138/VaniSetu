// Reusable UI Components for Vani Setu
import { api } from './api.js';

export const icons = {
    translate: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
    bulb: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    book: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M10 6h6"/><path d="M10 10h6"/><path d="M10 14h4"/></svg>`,
    clipboard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect height="4" rx="1" ry="1" width="8" x="8" y="2"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`,
    users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    monitor: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect height="12" rx="2" width="18" x="3" y="4"/><polygon points="10 8 16 10 10 12 10 8"/><line x1="2" x2="22" y1="20" y2="20"/></svg>`,
    mic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
    arrowRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    dashboard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect height="7" rx="1" width="7" x="3" y="3"/><rect height="7" rx="1" width="7" x="14" y="3"/><rect height="7" rx="1" width="7" x="14" y="14"/><rect height="7" rx="1" width="7" x="3" y="14"/></svg>`,
    profile: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    volume: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    filter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    waveform: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v4"/><path d="M6 7v10"/><path d="M10 4v16"/><path d="M14 8v8"/><path d="M18 5v14"/><path d="M22 11v2"/></svg>`,
    micOff: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
    radio: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>`,
    moon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    sun: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
};

/* Theme Engine (Dark Mode / Light Mode) */
export function getStoredTheme() {
    try {
        const saved = localStorage.getItem('vani_theme');
        if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

export function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (typeof document !== 'undefined') {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
        }

        // Update all toggle buttons on screen
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.setAttribute('data-current-theme', theme);
            btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            const iconSpan = btn.querySelector('.theme-toggle-icon');
            if (iconSpan) {
                iconSpan.innerHTML = isDark ? icons.sun : icons.moon;
            }
            const labelSpan = btn.querySelector('.theme-toggle-label');
            if (labelSpan) {
                labelSpan.innerText = isDark ? 'Light' : 'Dark';
            }
        });
    }
    try {
        localStorage.setItem('vani_theme', theme);
    } catch (e) {}
}

export function toggleTheme() {
    const current = getStoredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast('Theme Changed', `Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    return next;
}

export function initTheme() {
    applyTheme(getStoredTheme());
}

// Auto-initialize theme on load
if (typeof window !== 'undefined') {
    initTheme();

    // Global listener for theme toggling
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.theme-toggle-btn');
        if (toggleBtn) {
            e.preventDefault();
            toggleTheme();
        }
    });
}

export function createSidebar(activeRoute = 'dashboard') {
    const navItems = [
        { id: 'dashboard', href: '#/dashboard', label: 'Dashboard', icon: icons.dashboard },
        { id: 'translate', href: '#/translate', label: 'Translate', icon: icons.translate },
        { id: 'learn', href: '#/learn', label: 'Learn', icon: icons.book },
        { id: 'assessment', href: '#/assessment', label: 'Assessment', icon: icons.clipboard, badge: 'Generator' },
        { id: 'students', href: '#/students', label: 'Students', icon: icons.users },
        { id: 'profile', href: '#/profile', label: 'Profile', icon: icons.profile }
    ];

    return `
        <aside class="sidebar" id="app-sidebar">
            <div class="sidebar-top">
                <a href="#/dashboard" class="brand-logo mb-6 px-2" style="display: flex; text-decoration: none;">
                    <div class="logo-box">
                        ${icons.translate}
                    </div>
                    <div class="logo-text">
                        <h1>Vani Setu</h1>
                        <p>वाणी सेतु · Tribal Edu Bridge</p>
                    </div>
                </a>

                <div class="workspace-switcher">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-main);">Teacher space</span>
                    </div>
                    <span style="font-size: 0.65rem; background: var(--hover-bg); padding: 2px 6px; border-radius: 4px; font-weight: 600; color: var(--color-text-muted);">Class 3-5</span>
                </div>

                <nav class="sidebar-nav">
                    ${navItems.map(item => {
                        const isActive = activeRoute === item.id;
                        return `
                            <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    ${item.icon}
                                    <span>${item.label}</span>
                                </div>
                                ${isActive ? `<span style="width: 6px; height: 6px; background: var(--color-primary); border-radius: 50%;"></span>` : (item.badge ? `<span style="font-size: 0.65rem; background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 1px 6px; border-radius: 99px; font-weight: 700;">${item.badge}</span>` : '')}
                            </a>
                        `;
                    }).join('')}
                </nav>
            </div>
            
            <div class="sidebar-bottom" style="border-top: 1px solid var(--color-border); padding-top: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%;"></span>
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-main);">SIH 2026 Demo</span>
                    </div>
                    <a href="#/setup" title="Re-open Onboarding" style="font-size: 0.7rem; color: var(--color-text-muted); text-decoration: underline;">Switch</a>
                </div>
                <p style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 4px;">Santhali / Hindi / Bengali</p>
            </div>
        </aside>
    `;
}

export function createHeader(user, breadcrumbs = ['Teacher workspace', 'Overview']) {
    const activeClass = api.getActiveClass();
    const classes = ['Class 3', 'Class 4', 'Class 5'];
    const currentTheme = getStoredTheme();
    const isDark = currentTheme === 'dark';

    return `
        <header class="top-header" id="app-top-header">
            <div class="breadcrumbs" style="font-size: 0.85rem; color: var(--color-text-muted); display: flex; align-items: center; gap: 8px;">
                ${breadcrumbs.map((b, i) => {
                    const isLast = i === breadcrumbs.length - 1;
                    return `
                        <span style="${isLast ? 'font-weight: 700; color: var(--color-text-main);' : ''}">${b}</span>
                        ${!isLast ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>` : ''}
                    `;
                }).join('')}
            </div>

            <div class="header-actions" style="display: flex; align-items: center; gap: 12px;">
                <!-- Dark Mode Toggle Button -->
                <button class="theme-toggle-btn" id="header-theme-toggle" type="button" title="${isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}" aria-label="Toggle theme">
                    <span class="theme-toggle-icon">${isDark ? icons.sun : icons.moon}</span>
                    <span class="theme-toggle-label">${isDark ? 'Light' : 'Dark'}</span>
                </button>

                <!-- Class Switcher Controls -->
                <div class="class-switcher-header" style="display: flex; align-items: center; background: var(--color-surface-alt); padding: 3px; border-radius: var(--radius-full); border: 1px solid var(--color-border);">
                    <span style="font-size: 0.7rem; font-weight: 700; padding: 0 8px; color: var(--color-text-muted); text-transform: uppercase;">Class:</span>
                    ${classes.map(c => `
                        <button class="header-class-btn ${activeClass === c ? 'active' : ''}" data-class="${c}" style="font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full); transition: all 0.2s; ${activeClass === c ? 'background: var(--color-primary); color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.15);' : 'color: var(--color-text-muted);'}">
                            ${c}
                        </button>
                    `).join('')}
                </div>

                <div class="status-indicator" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full);">
                    <span class="dot" style="width: 6px; height: 6px; border-radius: 50%; background-color: #10b981;"></span> Online
                </div>

                <a href="#/profile" class="avatar" title="View Profile: ${user ? user.name : 'Teacher'}" style="width: 34px; height: 34px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; text-decoration: none;">
                    ${user ? user.avatarInitials : 'MH'}
                </a>
            </div>
        </header>
    `;
}

export function bindHeaderClassSwitcher(onClassChange) {
    const btns = document.querySelectorAll('.header-class-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetClass = e.currentTarget.getAttribute('data-class');
            if (targetClass && targetClass !== api.getActiveClass()) {
                api.setActiveClass(targetClass);
                showToast('Class Switched', `Active workspace set to ${targetClass}`, 'info');
                if (typeof onClassChange === 'function') {
                    onClassChange(targetClass);
                }
            }
        });
    });
}

export function createToolkitCard(item) {
    return `
        <a href="${item.href || '#'}" class="toolkit-card" data-action="${item.action || ''}" style="text-decoration: none; color: inherit;">
            <div class="flex items-center gap-3">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: ${item.color}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    ${icons[item.icon] || ''}
                </div>
                <div>
                    <h4 style="font-size: 0.875rem; font-weight: 700; margin-bottom: 2px; color: var(--color-text-main);">${item.title}</h4>
                    <p style="font-size: 0.75rem; color: var(--color-text-muted);">${item.desc}</p>
                </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-text-light);"><path d="m9 18 6-6-6-6"/></svg>
        </a>
    `;
}

export function createLessonItem(lesson) {
    return `
        <div style="padding: 14px 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
            <div class="flex items-center gap-4">
                <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted); width: 44px;">${lesson.time}</span>
                <div style="width: 4px; height: 42px; border-radius: 4px; background: ${lesson.color};"></div>
                <div>
                    <h4 style="font-size: 0.875rem; font-weight: 700; margin-bottom: 2px; color: var(--color-text-main);">${lesson.title}</h4>
                    <p style="font-size: 0.75rem; color: var(--color-text-muted);">${lesson.subtitle}</p>
                    ${lesson.vernacularBridge ? `<p style="font-size: 0.7rem; color: var(--color-primary); font-weight: 600; margin-top: 2px;">✦ ${lesson.vernacularBridge}</p>` : ''}
                </div>
            </div>
            <span style="font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; background: ${lesson.bg}; color: ${lesson.text}; text-transform: uppercase;">
                ${lesson.status}
            </span>
        </div>
    `;
}

// Toast notification helper
export function showToast(title, message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderColors = {
        success: '#10b981',
        info: '#0284c7',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    const accent = borderColors[type] || borderColors.success;

    toast.style.cssText = `
        background: var(--color-surface);
        color: var(--color-text-main);
        padding: 12px 18px;
        border-radius: var(--radius-md);
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1);
        border: 1px solid var(--color-border);
        border-left: 4px solid ${accent};
        min-width: 280px;
        max-width: 400px;
        pointer-events: auto;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: flex-start;
        gap: 12px;
    `;

    toast.innerHTML = `
        <div style="flex: 1;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">${title}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 2px;">${message}</div>
        </div>
        <button class="toast-close" style="color: var(--color-text-light); font-size: 14px; padding: 2px; background: none; border: none; cursor: pointer;">✕</button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    const close = () => {
        toast.style.transform = 'translateY(10px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, 3500);
}

// Text-to-speech pronunciation engine
export function speakText(text, lang = 'hi-IN', options = {}) {
    if (!('speechSynthesis' in window)) {
        showToast('Speech Not Supported', 'Web Speech API is not available in this browser', 'info');
        if (options.onError) options.onError('not_supported');
        return;
    }

    try {
        window.speechSynthesis.cancel();

        // Process text for crystal clear pronunciation
        let textToSpeak = text;
        const parenMatch = text.match(/\(([^)]+)\)/);
        const hasOlChiki = /[\u1C50-\u1C7F]/.test(text);

        if (hasOlChiki && parenMatch) {
            textToSpeak = parenMatch[1];
        } else if (hasOlChiki) {
            textToSpeak = text.replace(/[\u1C50-\u1C7F]/g, '').trim() || text;
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = lang;
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;

        const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
        if (voices && voices.length > 0) {
            const langPrefix = lang.split('-')[0].toLowerCase();
            const matchedVoice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase()) ||
                                 voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
                                 voices.find(v => v.lang.toLowerCase().includes('in'));
            if (matchedVoice) {
                utterance.voice = matchedVoice;
            }
        }

        utterance.onstart = () => {
            if (options.onStart) options.onStart();
        };

        utterance.onend = () => {
            if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (e) => {
            if (options.onError) options.onError(e);
        };

        window.speechSynthesis.speak(utterance);
    } catch (err) {
        if (options.onError) options.onError(err);
    }
}

export function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}
