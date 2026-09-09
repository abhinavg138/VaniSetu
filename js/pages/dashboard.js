import { createSidebar, createHeader, bindHeaderClassSwitcher, createToolkitCard, createLessonItem, icons, showToast } from '../components.js';
import { api } from '../api.js';

export async function renderDashboard(container) {
    let activeClass = api.getActiveClass();
    const user = await api.getUser();

    async function loadAndRender() {
        const [lessons, stats] = await Promise.all([
            api.getLessons(activeClass),
            api.getStats(activeClass)
        ]);

        const interactiveToolkitItems = [
            { id: 'translate', title: 'Live Translate', desc: 'Real-time classroom bridge', icon: 'translate', color: '#f97316', href: '#/translate' },
            { id: 'lesson-plans', title: 'Lesson plans', desc: 'Bilingual outlines & steps', icon: 'bulb', color: '#059669', href: '#/learn' },
            { id: 'worksheets', title: 'Worksheets', desc: 'Printable practice that speaks', icon: 'book', color: '#f59e0b', href: '#/learn' },
            { id: 'assessment', title: 'Assessment', desc: 'Classwise generator & tracker', icon: 'clipboard', color: '#0284c7', href: '#/assessment' },
            { id: 'students', title: 'Students', desc: 'See every learner', icon: 'users', color: '#9333ea', href: '#/students' }
        ];

        // Build the shell
        container.innerHTML = `
            <div class="app-shell">
                ${createSidebar('dashboard')}
                
                <div class="main-wrapper">
                    ${createHeader(user, ['Teacher workspace', 'Overview', activeClass])}
                    
                    <main class="dashboard-content">
                        <!-- Greeting Section -->
                        <section class="flex justify-between items-center mb-6">
                            <div>
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-light); letter-spacing: 0.1em; text-transform: uppercase;">SMART INDIA HACKATHON 2026 · MULTILINGUAL HUB</span>
                                <h2 class="heading-display" style="font-size: 2.25rem; display: flex; align-items: center; gap: 8px;">
                                    Good morning, ${user.name.split(' ')[0]} <span style="color: var(--color-primary);">✦</span>
                                </h2>
                                <p style="color: var(--color-text-muted); font-size: 0.875rem;">Your classroom is ready for a language-rich day with ${activeClass}.</p>
                            </div>
                            <div style="background: var(--color-surface); padding: 8px 16px; border-radius: var(--radius-lg); border: 1px solid var(--color-border); display: flex; align-items: center; gap: 12px; box-shadow: var(--shadow-xs);">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
                                    <span style="font-weight: 700; font-size: 0.75rem;">${activeClass}</span>
                                </div>
                                <span style="color: var(--color-border); font-size: 1.2rem;">|</span>
                                <span style="font-size: 0.7rem; font-weight: 500; color: var(--color-text-muted);">Purulia Tribal District</span>
                            </div>
                        </section>
                        
                        <!-- Hero Banner -->
                        <section class="hero-dashboard mb-6">
                            <div style="padding: 40px; display: flex; flex-direction: column; justify-content: space-between;">
                                <div>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: 0.1em; text-transform: uppercase;">TODAY'S FOCUS</span>
                                    <h3 class="heading-display" style="font-size: 2.5rem; margin-top: 12px; margin-bottom: 8px; line-height: 1.1;">
                                        Teach the idea.<br>
                                        <span style="color: var(--color-accent);">Not the language barrier.</span>
                                    </h3>
                                    <p style="opacity: 0.8; font-size: 0.9rem; max-width: 400px;">Translate your next explanation into Santhali, Bengali or Hindi.</p>
                                </div>
                                <div style="margin-top: 24px; display: flex; gap: 12px;">
                                    <a href="#/translate" id="start-translating-btn" style="background: white; color: var(--color-secondary); padding: 10px 20px; border-radius: var(--radius-full); font-weight: 700; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); text-decoration: none; transition: transform 0.2s;">
                                        Start translating ${icons.arrowRight}
                                    </a>
                                    <a href="#/assessment" style="background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 10px 20px; border-radius: var(--radius-full); font-weight: 600; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
                                        ${icons.clipboard} Assign Assessment
                                    </a>
                                </div>
                            </div>
                            <div class="image-wrapper" style="background: url('https://lh3.googleusercontent.com/aida/AEtjO1XV5STl7jL5osygz28zkwwRjuLFThZ3K7v3WfZuF1WDa8U6vIjVcUBXbSWGoVaqs0wZW7_Lsu954QDPlMPwVjB5z-f21R7sdutvqa63kn9ZF_QqD4OOouROI7gWHNKi43zmNyoTKp3-mm_7Fh4pwI7FRakdqem9fygkhgIYKWXuhLHPRWslNDuEstX83CBVRzbwtEfOBP0Oh0vH24VmkaoPmNh0KE8uS0gLkZp24D2J00rugg3lySjjpw') center/cover no-repeat;">
                                <!-- Image area -->
                            </div>
                        </section>
                        
                        <!-- Toolkit -->
                        <section class="mb-6">
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px;">
                                <div>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-light); letter-spacing: 0.1em; text-transform: uppercase;">YOUR TOOLKIT</span>
                                    <h3 style="font-size: 1.25rem; font-weight: 700;">What would you like to do?</h3>
                                </div>
                                <a href="#/learn" style="font-size: 0.75rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 4px;">View all learning tools ${icons.arrowRight}</a>
                            </div>
                            <div class="toolkit-grid">
                                ${interactiveToolkitItems.map(item => createToolkitCard(item)).join('')}
                            </div>
                        </section>
                        
                        <!-- Bottom Split -->
                        <section class="dashboard-split">
                            <div class="card">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                    <div>
                                        <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-light); letter-spacing: 0.1em; text-transform: uppercase;">UP NEXT FOR ${activeClass.toUpperCase()}</span>
                                        <h3 style="font-size: 1.25rem; font-weight: 700;">Today's scheduled lessons</h3>
                                    </div>
                                    <button id="add-lesson-btn" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);" title="Add quick lesson">${icons.plus}</button>
                                </div>
                                <div>
                                    ${lessons.map(lesson => createLessonItem(lesson)).join('')}
                                </div>
                            </div>
                            
                            <div class="card" style="background: var(--color-surface-alt);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                    <div>
                                        <span style="font-size: 0.7rem; font-weight: 700; color: #b45309; letter-spacing: 0.1em; text-transform: uppercase;">CLASS SNAPSHOT</span>
                                        <h3 style="font-size: 1.25rem; font-weight: 700;">How is ${activeClass.replace('Class ', '')}A doing?</h3>
                                    </div>
                                    <a href="#/students" style="font-size: 0.75rem; font-weight: 600; color: #b45309; display: flex; align-items: center; gap: 4px;">Open class roster ${icons.arrowRight}</a>
                                </div>
                                
                                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 24px;">
                                    <div style="position: relative; width: 130px; height: 130px;">
                                        <svg class="circular-chart" viewBox="0 0 36 36">
                                            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                            <path class="circle" stroke-dasharray="${stats.averageUnderstanding}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                        </svg>
                                        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                            <span style="font-size: 1.75rem; font-weight: 800;">${stats.averageUnderstanding}%</span>
                                            <span style="font-size: 0.65rem; color: var(--color-text-muted); text-align: center; line-height: 1.1; max-width: 60px;">average understanding</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    ${stats.subjects.map(subj => `
                                        <div style="display: flex; align-items: center; gap: 12px; font-size: 0.75rem;">
                                            <span style="font-weight: 600; width: 60px; color: var(--color-text-muted);">${subj.name}</span>
                                            <div style="flex: 1; height: 8px; background: var(--color-border); border-radius: 4px; overflow: hidden;">
                                                <div style="height: 100%; width: ${subj.value}%; background: ${subj.color}; border-radius: 4px;"></div>
                                            </div>
                                            <span style="font-weight: 700; width: 28px; text-align: right;">${subj.value}%</span>
                                        </div>
                                    `).join('')}
                                </div>

                                <div style="margin-top: 20px; border-top: 1px solid var(--color-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">Vernacular Bridge Need:</span>
                                    <span class="badge badge-coral">${stats.activeNeedsBridge || 12} students</span>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        `;

        // Bind Class Switcher in Header
        bindHeaderClassSwitcher((newClass) => {
            activeClass = newClass;
            loadAndRender();
        });

        // Add Quick Lesson modal
        const addLessonBtn = container.querySelector('#add-lesson-btn');
        if (addLessonBtn) {
            addLessonBtn.addEventListener('click', () => {
                openQuickLessonModal(activeClass, () => {
                    loadAndRender();
                });
            });
        }
    }

    await loadAndRender();
}

function openQuickLessonModal(activeClass, onSuccess) {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="add-lesson-modal">
            <div class="modal-box" style="max-width: 460px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <h3 style="font-weight: 700; font-size: 1.15rem;">Schedule Lesson for ${activeClass}</h3>
                    <button id="close-quick-lesson" style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface-alt); color: var(--color-text-main); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
                </div>

                <form id="quick-lesson-form" class="flex flex-col gap-4">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Lesson Title</label>
                        <input type="text" class="input-field" id="new-lesson-title" placeholder="e.g. Science - Solar System" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Time</label>
                            <input type="time" class="input-field" id="new-lesson-time" value="13:30" required>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Subject</label>
                            <select class="input-field" id="new-lesson-subject">
                                <option>Mathematics</option>
                                <option>General Science</option>
                                <option>Environmental Studies</option>
                                <option>Language</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Vernacular Dialect Bridge Note</label>
                        <input type="text" class="input-field" id="new-lesson-bridge" placeholder="e.g. Santhali: Chando Mondol" required>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                        <button type="button" id="cancel-quick-lesson" class="role-btn" style="padding: 8px 16px;">Cancel</button>
                        <button type="submit" class="btn-primary" style="padding: 8px 20px;">
                            ${icons.check} Save Lesson
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-quick-lesson').addEventListener('click', close);
    document.getElementById('cancel-quick-lesson').addEventListener('click', close);

    document.getElementById('quick-lesson-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('new-lesson-title').value;
        const time = document.getElementById('new-lesson-time').value;
        const subj = document.getElementById('new-lesson-subject').value;
        const bridge = document.getElementById('new-lesson-bridge').value;

        await api.addLesson({
            time: time,
            title: subj,
            subtitle: `${title} · ${activeClass}`,
            vernacularBridge: bridge,
            color: '#059669',
            bg: '#ecfdf5',
            text: '#047857'
        });

        close();
        showToast('Lesson Scheduled', `Added "${title}" to today's timetable!`, 'success');
        onSuccess();
    });
}
