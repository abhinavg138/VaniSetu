import { renderOnboarding } from './pages/setup.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderTranslate } from './pages/translate.js';
import { renderLearn } from './pages/learn.js';
import { renderAssessment } from './pages/assessment.js';
import { renderStudents } from './pages/students.js';
import { renderProfile } from './pages/profile.js';

const routes = {
    '': renderDashboard,
    '#/': renderDashboard,
    '#/setup': renderOnboarding,
    '#/dashboard': renderDashboard,
    '#/translate': renderTranslate,
    '#/learn': renderLearn,
    '#/lessons': renderLearn,
    '#/worksheets': renderLearn,
    '#/assessment': renderAssessment,
    '#/students': renderStudents,
    '#/profile': renderProfile
};

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Call on initial load
}

async function handleRoute() {
    const rawHash = window.location.hash || '';
    // Normalize hash (e.g. #/translate?foo=bar -> #/translate)
    const hash = rawHash.split('?')[0];
    const appRoot = document.getElementById('app-root');
    
    // Clear modals when navigating away
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
        modalRoot.innerHTML = '';
    }

    const renderFunc = routes[hash] || routes['#/dashboard'];
    
    try {
        await renderFunc(appRoot);
    } catch (e) {
        console.error("Error rendering route:", e);
        appRoot.innerHTML = `
            <div style="padding: 60px; text-align: center;">
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Error loading page</h3>
                <p style="color: #64748b; margin-bottom: 20px;">${e.message || 'An unexpected error occurred.'}</p>
                <a href="#/dashboard" class="btn-primary" style="display: inline-block; text-decoration: none; padding: 10px 20px;">
                    Return to Dashboard
                </a>
            </div>
        `;
    }
}
