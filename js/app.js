import { initRouter } from './router.js';
import { initTheme } from './components.js';

// Apply saved theme immediately
initTheme();

document.addEventListener('DOMContentLoaded', () => {
    initRouter();
});
