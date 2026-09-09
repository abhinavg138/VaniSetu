import { createSidebar, createHeader, bindHeaderClassSwitcher, icons, showToast, speakText } from '../components.js';
import { api } from '../api.js';

export async function renderLearn(container) {
    let activeClass = api.getActiveClass();
    const user = await api.getUser();
    let activeTab = 'vocabulary'; // 'vocabulary' | 'lessons' | 'worksheets'
    let currentFilterSubject = 'All';

    async function loadAndRender() {
        const vocabList = await api.getVocabulary(activeClass, currentFilterSubject);
        const lessonPlans = await api.getLessonPlans(activeClass);
        const worksheets = await api.getWorksheets(activeClass);

        container.innerHTML = `
            <div class="app-shell">
                ${createSidebar('learn')}
                
                <div class="main-wrapper">
                    ${createHeader(user, ['Teacher workspace', 'Learning Hub', activeClass])}
                    
                    <main class="dashboard-content">
                        <!-- Top Header -->
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-primary); letter-spacing: 0.1em; text-transform: uppercase;">MULTILINGUAL LEARNING SUITE</span>
                                <h2 class="heading-display" style="font-size: 2rem; margin-top: 4px; display: flex; align-items: center; gap: 10px;">
                                    Classroom Learning Hub
                                    <span class="badge badge-coral">${activeClass}</span>
                                </h2>
                                <p style="color: var(--color-text-muted); font-size: 0.875rem;">Vernacular flashcards, bilingual lesson outlines, and contextual worksheets tailored for ${activeClass}.</p>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button id="add-vocab-modal-btn" class="btn-primary" style="padding: 10px 18px; font-size: 0.85rem;">
                                    ${icons.plus} Add Concept Word
                                </button>
                                <a href="#/assessment" class="role-btn" style="padding: 10px 18px; font-size: 0.85rem;">
                                    ${icons.clipboard} Create Assessment
                                </a>
                            </div>
                        </div>

                        <!-- Class Switcher Tabs -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div class="tabs-header" style="margin-bottom: 0;">
                                <button class="tab-btn ${activeTab === 'vocabulary' ? 'active' : ''}" data-tab="vocabulary">
                                    ${icons.bulb}
                                    <span>Vocabulary Flashcards</span>
                                    <span class="badge badge-zinc">${vocabList.length}</span>
                                </button>
                                <button class="tab-btn ${activeTab === 'lessons' ? 'active' : ''}" data-tab="lessons">
                                    ${icons.book}
                                    <span>Bilingual Lesson Plans</span>
                                    <span class="badge badge-zinc">${lessonPlans.length}</span>
                                </button>
                                <button class="tab-btn ${activeTab === 'worksheets' ? 'active' : ''}" data-tab="worksheets">
                                    ${icons.clipboard}
                                    <span>Printable Worksheets</span>
                                    <span class="badge badge-zinc">${worksheets.length}</span>
                                </button>
                            </div>

                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted);">FILTER CLASS:</span>
                                <div style="display: flex; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); padding: 2px;">
                                    ${['Class 3', 'Class 4', 'Class 5'].map(c => `
                                        <button class="class-filter-pill ${activeClass === c ? 'active' : ''}" data-cls="${c}" style="padding: 4px 12px; font-size: 0.75rem; font-weight: 700; border-radius: var(--radius-full); ${activeClass === c ? 'background: var(--color-primary); color: white;' : 'color: var(--color-text-muted);'}">
                                            ${c}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- TAB 1: VOCABULARY FLASHCARDS -->
                        <div id="tab-vocab-content" style="display: ${activeTab === 'vocabulary' ? 'block' : 'none'};">
                            <!-- Subject Filter Row -->
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <div style="display: flex; gap: 8px;">
                                    ${['All', 'Science', 'Mathematics', 'Environment', 'Biology', 'Astronomy'].map(sub => `
                                        <button class="sub-filter-btn" data-sub="${sub}" style="padding: 6px 14px; font-size: 0.75rem; font-weight: 600; border-radius: 99px; border: 1px solid ${currentFilterSubject === sub ? 'var(--color-primary)' : 'var(--color-border)'}; background: ${currentFilterSubject === sub ? 'var(--color-primary-light)' : 'var(--color-surface)'}; color: ${currentFilterSubject === sub ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
                                            ${sub}
                                        </button>
                                    `).join('')}
                                </div>
                                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 500;">Click card speaker to hear Ol Chiki & Roman pronunciation</span>
                            </div>

                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                                ${vocabList.map(card => `
                                    <div class="vocab-card">
                                        <div>
                                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                                <span class="badge badge-zinc" style="font-size: 0.65rem;">${card.theme}</span>
                                                <span class="badge badge-coral">${card.frequency} Frequency</span>
                                            </div>
                                            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 2px;">
                                                ${card.target}
                                            </h4>
                                            <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 12px;">English: ${card.english}</p>
                                            
                                            <div style="background: var(--color-surface-alt); padding: 12px; border-radius: var(--radius-md); margin-bottom: 12px; border-left: 3px solid var(--color-primary);">
                                                <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary); margin-bottom: 2px;">
                                                    ${card.script}
                                                </div>
                                                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">
                                                    ✦ ${card.vernacular}
                                                </div>
                                            </div>
                                            <p style="font-size: 0.75rem; color: var(--color-text-muted); line-height: 1.4;">
                                                Context: "${card.context}"
                                            </p>
                                        </div>

                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; border-top: 1px solid var(--color-border); padding-top: 10px;">
                                            <button class="vocab-speak-btn" data-text="${card.vernacular}" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; border-radius: 6px; display: flex; align-items: center; gap: 6px;">
                                                ${icons.volume} Pronounce
                                            </button>
                                            <a href="#/translate" title="Open in translation workspace" style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600;">
                                                Translate ${icons.arrowRight}
                                            </a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- TAB 2: BILINGUAL LESSON PLANS -->
                        <div id="tab-lessons-content" style="display: ${activeTab === 'lessons' ? 'block' : 'none'};">
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${lessonPlans.map(lp => `
                                    <div class="card" style="padding: 24px;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                            <div>
                                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                                    <span class="badge badge-emerald">${activeClass}</span>
                                                    <span class="badge badge-zinc">${lp.subject}</span>
                                                    <span class="badge badge-coral">${lp.duration}</span>
                                                </div>
                                                <h3 style="font-size: 1.3rem; font-weight: 800;">${lp.title}</h3>
                                                <p style="font-size: 0.85rem; color: var(--color-primary); font-weight: 600; margin-top: 2px;">
                                                    Dialect Bridge: ${lp.dialectBridge}
                                                </p>
                                            </div>
                                            <div style="display: flex; gap: 8px;">
                                                <a href="#/assessment" class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem;">
                                                    ${icons.clipboard} Create Quiz for this Lesson
                                                </a>
                                            </div>
                                        </div>

                                        <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 16px;">
                                            ${lp.summary}
                                        </p>

                                        <div style="background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px;">
                                            <h4 style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 10px;">Recommended Classroom Steps:</h4>
                                            <ul style="display: flex; flex-direction: column; gap: 8px;">
                                                ${lp.steps.map((step, idx) => `
                                                    <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.85rem;">
                                                        <span style="width: 20px; height: 20px; border-radius: 50%; background: var(--color-primary-light); color: var(--color-primary); font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; flex-shrink: 0;">${idx + 1}</span>
                                                        <span>${step}</span>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- TAB 3: PRINTABLE WORKSHEETS -->
                        <div id="tab-worksheets-content" style="display: ${activeTab === 'worksheets' ? 'block' : 'none'};">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                                ${worksheets.map(ws => `
                                    <div class="card" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
                                        <div>
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                                <span class="badge badge-zinc">${ws.subject}</span>
                                                <span class="badge badge-emerald">${ws.level}</span>
                                            </div>
                                            <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">${ws.title}</h4>
                                            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 16px;">
                                                ${ws.questions} Questions · ${ws.pages} Page Printout · Includes Santhali Ol Chiki vocabulary clues
                                            </p>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: 14px;">
                                            <button class="preview-ws-btn role-btn" data-title="${ws.title}" style="padding: 8px 14px; font-size: 0.8rem; font-weight: 600;">
                                                Preview Sheet
                                            </button>
                                            <a href="#/assessment" class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem;">
                                                ${icons.clipboard} Assign as Assessment
                                            </a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;

        // Bind Class Switcher in Header
        bindHeaderClassSwitcher((newClass) => {
            activeClass = newClass;
            loadAndRender();
        });

        // Tab Navigation
        container.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                activeTab = e.currentTarget.getAttribute('data-tab');
                loadAndRender();
            });
        });

        // Class Filter Pills
        container.querySelectorAll('.class-filter-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-cls');
                activeClass = api.setActiveClass(target);
                showToast('Class Filter Changed', `Displaying learning content for ${activeClass}`, 'info');
                loadAndRender();
            });
        });

        // Subject Filter Buttons
        container.querySelectorAll('.sub-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentFilterSubject = e.currentTarget.getAttribute('data-sub');
                loadAndRender();
            });
        });

        // Vocabulary Pronounce Button
        container.querySelectorAll('.vocab-speak-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.getAttribute('data-text');
                speakText(text, 'hi-IN');
                showToast('Pronunciation', `Speaking aloud: "${text}"`, 'info');
            });
        });

        // Add Concept Word Modal Button
        const addWordBtn = container.querySelector('#add-vocab-modal-btn');
        if (addWordBtn) {
            addWordBtn.addEventListener('click', () => {
                openAddWordModal(activeClass, () => {
                    loadAndRender();
                });
            });
        }

        // Preview Worksheet
        container.querySelectorAll('.preview-ws-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.currentTarget.getAttribute('data-title');
                openWorksheetPreviewModal(title);
            });
        });
    }

    await loadAndRender();
}

function openAddWordModal(activeClass, onSuccess) {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="add-word-modal">
            <div class="modal-box" style="max-width: 500px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center;">
                            ${icons.plus}
                        </div>
                        <h3 style="font-weight: 700; font-size: 1.15rem;">Add Concept Word for ${activeClass}</h3>
                    </div>
                    <button id="close-add-word" style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface-alt); color: var(--color-text-main); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
                </div>

                <form id="add-word-form" class="flex flex-col gap-4">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Curriculum Word (Hindi / English)</label>
                        <input type="text" class="input-field" id="new-target-word" placeholder="e.g., बादल (Clouds)" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Mother Tongue Word</label>
                            <input type="text" class="input-field" id="new-vernacular-word" placeholder="e.g., ᱨᱤᱢᱤᱞ (Remil)" required>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Subject Theme</label>
                            <select class="input-field" id="new-theme-select">
                                <option>General Science</option>
                                <option>Mathematics</option>
                                <option>Environmental Studies</option>
                                <option>Language</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Classroom Context</label>
                        <input type="text" class="input-field" id="new-context-word" placeholder="How is this explained in class..." required>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                        <button type="button" id="cancel-add-word" class="role-btn" style="padding: 8px 16px;">Cancel</button>
                        <button type="submit" class="btn-primary" style="padding: 8px 20px;">
                            ${icons.check} Save to Flashcards
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-add-word').addEventListener('click', close);
    document.getElementById('cancel-add-word').addEventListener('click', close);

    document.getElementById('add-word-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const target = document.getElementById('new-target-word').value;
        const vern = document.getElementById('new-vernacular-word').value;
        const theme = document.getElementById('new-theme-select').value;
        const context = document.getElementById('new-context-word').value;

        await api.addVocabularyWord(activeClass, {
            target: target,
            vernacular: vern,
            script: vern,
            english: target,
            theme: theme,
            context: context
        });

        close();
        showToast('Word Added', `Added "${target}" to ${activeClass} flashcard deck.`, 'success');
        onSuccess();
    });
}

function openWorksheetPreviewModal(title) {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="ws-preview-modal">
            <div class="modal-box" style="max-width: 600px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <h3 style="font-weight: 800; font-size: 1.2rem;">${title}</h3>
                    <button id="close-ws-preview" style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface-alt); color: var(--color-text-main); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
                </div>
                <div style="background: var(--color-surface-alt); border: 2px dashed var(--color-border); border-radius: var(--radius-md); padding: 24px; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">📄</div>
                    <h4 style="font-weight: 700; margin-bottom: 4px;">Printable Bilingual Worksheet</h4>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted); max-width: 400px; margin: 0 auto 16px;">
                        Contains side-by-side problems in Standard Script and Santhali Vernacular with visual illustrations for village classrooms.
                    </p>
                    <button id="print-sheet-btn" class="btn-primary" style="padding: 10px 20px; font-size: 0.85rem;">
                        Print / Download Worksheet
                    </button>
                </div>
            </div>
        </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-ws-preview').addEventListener('click', close);
    document.getElementById('print-sheet-btn').addEventListener('click', () => {
        showToast('Download Started', 'Worksheet PDF generated successfully.', 'success');
        close();
    });
}
