import { icons, showToast, getStoredTheme } from '../components.js';
import { api } from '../api.js';

export function renderLogin(container) {
    let selectedRole = api.getRole() || 'Teacher';
    const currentStudent = api.getCurrentStudent();
    let selectedStudentPreset = 's301'; // Default: Babu Soren

    const studentPresets = [
        {
            id: 's301',
            name: 'Babu Soren',
            class: 'Class 3',
            roll: '01',
            motherTongue: 'Santhali',
            script: 'ᱥᱟᱱᱛᱟᱲᱤ · Ol Chiki',
            avatar: 'BS',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.12)',
            score: '88% Index'
        },
        {
            id: 's302',
            name: 'Pooja Murmu',
            class: 'Class 3',
            roll: '04',
            motherTongue: 'Santhali',
            script: 'ᱥᱟᱱᱛᱟᱲᱤ · Ol Chiki',
            avatar: 'PM',
            color: '#059669',
            bg: 'rgba(5, 150, 105, 0.12)',
            score: '92% Index'
        },
        {
            id: 's401',
            name: 'Anjali Hansda',
            class: 'Class 4',
            roll: '02',
            motherTongue: 'Santhali',
            script: 'ᱥᱟᱱᱛᱟᱲᱤ · Ol Chiki',
            avatar: 'AH',
            color: '#2563eb',
            bg: 'rgba(37, 99, 235, 0.12)',
            score: '84% Index'
        },
        {
            id: 's501',
            name: 'Manoj Marandi',
            class: 'Class 5',
            roll: '03',
            motherTongue: 'Santhali',
            script: 'ᱥᱟᱱᱛᱟᱲᱤ · Ol Chiki',
            avatar: 'MM',
            color: '#d97706',
            bg: 'rgba(217, 119, 6, 0.12)',
            score: '79% Index'
        }
    ];

    function renderView() {
        const isStudent = selectedRole === 'Student';
        const currentTheme = getStoredTheme();
        const isDark = currentTheme === 'dark';

        container.innerHTML = `
            <div class="split-layout" id="login-landing-page">
                <!-- Left Hero Section / Hackathon Branding -->
                <section class="hero-banner">
                    <div>
                        <div class="brand-logo mb-6" style="display: flex; align-items: center; gap: 14px;">
                            <div class="logo-box" style="width: 44px; height: 44px; background: var(--color-primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                                ${icons.translate}
                            </div>
                            <div>
                                <h1 style="font-size: 1.4rem; font-weight: 800; line-height: 1.1; margin: 0; color: #ffffff;">Vani Setu</h1>
                                <p style="font-size: 0.8rem; margin: 0; opacity: 0.85; color: #fde047; font-weight: 600;">ᱵᱟᱹᱬᱤ ᱥᱮᱛᱩ · SIH 2026</p>
                            </div>
                        </div>

                        <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.12); padding: 4px 12px; border-radius: 99px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 20px;">
                            <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span>
                            <span style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #ffffff;">Smart India Hackathon 2026</span>
                        </div>
                    </div>
                    
                    <div class="hero-content" style="margin: auto 0; padding: 24px 0;">
                        <h2 class="heading-display" style="font-size: 2.75rem; margin-bottom: 20px; line-height: 1.15; color: #ffffff;">
                            ${isStudent 
                                ? `Learn with joy in<br><span class="text-gold">your mother tongue.</span>` 
                                : `Every child's voice<br><span class="text-gold">belongs in class.</span>`}
                        </h2>
                        <p style="font-size: 1.05rem; line-height: 1.6; opacity: 0.92; color: #f3f4f6; max-width: 440px; margin-bottom: 28px;">
                            ${isStudent 
                                ? 'Connecting tribal primary school learners to bilingual lessons, interactive quizzes, vernacular audio words, and AI tutoring.' 
                                : 'AI-powered vernacular translation, audio bridges, and bilingual assessment generator for multilingual Class 3–5 classrooms.'}
                        </p>

                        <!-- Key Pillars -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 460px;">
                            <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                                <div style="font-size: 0.8rem; font-weight: 700; color: #fde047; margin-bottom: 4px;">🗣️ Vernacular Bridge</div>
                                <div style="font-size: 0.72rem; opacity: 0.85; line-height: 1.3;">Ol Chiki (ᱥᱟᱱᱛᱟᱲᱤ), Bengali & Hindi translation</div>
                            </div>
                            <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                                <div style="font-size: 0.8rem; font-weight: 700; color: #6ee7b7; margin-bottom: 4px;">📝 Dual Assessments</div>
                                <div style="font-size: 0.72rem; opacity: 0.85; line-height: 1.3;">Instant bilingual quiz generation & grading</div>
                            </div>
                            <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                                <div style="font-size: 0.8rem; font-weight: 700; color: #93c5fd; margin-bottom: 4px;">🤖 AI Tribal Tutor</div>
                                <div style="font-size: 0.72rem; opacity: 0.85; line-height: 1.3;">Mother-tongue explanations & voice playback</div>
                            </div>
                            <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
                                <div style="font-size: 0.8rem; font-weight: 700; color: #f472b6; margin-bottom: 4px;">📊 Class Analytics</div>
                                <div style="font-size: 0.72rem; opacity: 0.85; line-height: 1.3;">Comprehension gaps across Class 3, 4, 5</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hero-content" style="border-left: 3px solid var(--color-accent); padding-left: 16px; margin-top: 24px;">
                        <p style="font-size: 0.95rem; font-style: italic; opacity: 0.92; color: #ffffff; line-height: 1.4;">
                            ${isStudent 
                                ? `"ᱯᱟᱲᱦᱟᱣ ᱫᱚ ᱟᱞᱜᱟ ᱜᱮᱭᱟ! Learning is joyful when spoken in our heart language."` 
                                : `"When a child understands concepts in their own mother tongue, true education begins."`}
                        </p>
                        <span style="font-size: 0.75rem; opacity: 0.75; display: block; margin-top: 4px;">— Ministry of Tribal Affairs / NEP 2020 Multilingual Vision</span>
                    </div>
                </section>
                
                <!-- Right Form / Login Workspace -->
                <section class="form-panel" style="position: relative;">
                    <!-- Top Actions inside panel (Theme Toggle) -->
                    <div style="position: absolute; top: 24px; right: 28px; display: flex; align-items: center; gap: 10px;">
                        <button class="theme-toggle-btn" id="login-theme-toggle" type="button" title="${isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}">
                            <span class="theme-toggle-icon">${isDark ? icons.sun : icons.moon}</span>
                            <span class="theme-toggle-label">${isDark ? 'Light' : 'Dark'}</span>
                        </button>
                    </div>

                    <div class="setup-box" style="max-width: 520px;">
                        <div class="mb-4">
                            <span style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; color: var(--color-primary); text-transform: uppercase; margin-bottom: 6px; display: block;">
                                CLASSROOM ACCESS PORTAL
                            </span>
                            <h2 class="heading-display" style="font-size: 2rem; margin-bottom: 6px; color: var(--color-text-main);">
                                ${isStudent ? 'Student Desk Login' : 'Teacher Workspace Login'}
                            </h2>
                            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
                                ${isStudent ? 'Select your profile to open your quizzes, vocabulary words, and AI tutor.' : 'Sign in to manage multilingual translations, lesson plans, and assessments.'}
                            </p>
                        </div>
                        
                        <!-- Role Selector Tabs -->
                        <div class="role-selector" style="margin-bottom: 22px;">
                            <button type="button" class="role-btn ${!isStudent ? 'active' : ''}" id="role-teacher-tab" style="padding: 12px; font-size: 0.9rem; ${!isStudent ? 'border-color: var(--color-primary); background: var(--color-surface); box-shadow: 0 2px 6px rgba(226, 91, 54, 0.15);' : ''}">
                                ${icons.dashboard}
                                <span>I'm a Teacher</span>
                            </button>
                            <button type="button" class="role-btn ${isStudent ? 'active' : ''}" id="role-student-tab" style="padding: 12px; font-size: 0.9rem; ${isStudent ? 'border-color: #059669; color: #059669; background: var(--color-surface); box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);' : ''}">
                                ${icons.book}
                                <span>I'm a Student</span>
                            </button>
                        </div>

                        <!-- Main Form -->
                        <form id="login-form" class="flex flex-col gap-4">
                            ${isStudent ? `
                                <!-- Student Mode -->
                                <div>
                                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">Select Student Profile</label>
                                        <span style="font-size: 0.72rem; color: #059669; font-weight: 600;">One-click demo profiles</span>
                                    </div>

                                    <!-- Student Profile Grid -->
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
                                        ${studentPresets.map(preset => {
                                            const isSelected = selectedStudentPreset === preset.id;
                                            return `
                                                <button type="button" class="student-preset-card" data-preset="${preset.id}" style="text-align: left; padding: 10px 12px; border-radius: var(--radius-md); border: 2px solid ${isSelected ? preset.color : 'var(--color-border)'}; background: ${isSelected ? preset.bg : 'var(--color-surface-alt)'}; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 4px;">
                                                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                                        <span style="font-weight: 700; font-size: 0.88rem; color: var(--color-text-main);">${preset.name}</span>
                                                        <span style="font-size: 0.68rem; font-weight: 700; background: ${preset.color}; color: white; padding: 1px 6px; border-radius: 99px;">${preset.class}</span>
                                                    </div>
                                                    <div style="font-size: 0.72rem; color: var(--color-text-muted); display: flex; justify-content: space-between;">
                                                        <span>Roll: ${preset.roll} · ${preset.motherTongue}</span>
                                                        ${isSelected ? `<span style="color: ${preset.color}; font-weight: 800;">✓</span>` : ''}
                                                    </div>
                                                </button>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>

                                <div style="background: var(--color-surface-alt); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                                        <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-main);">Profile Information</span>
                                        <button type="button" id="toggle-custom-student" style="font-size: 0.72rem; color: #059669; font-weight: 600; text-decoration: underline; background: none; border: none; cursor: pointer;">
                                            Edit / Custom details
                                        </button>
                                    </div>

                                    <div id="student-form-fields">
                                        <div class="mb-3">
                                            <label style="display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 4px; color: var(--color-text-muted);">Learner Full Name</label>
                                            <input type="text" id="student-name-input" class="input-field" value="${currentStudent ? currentStudent.name : 'Babu Soren'}" required style="padding: 8px 12px; font-size: 0.9rem;">
                                        </div>
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
                                            <div>
                                                <label style="display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 4px; color: var(--color-text-muted);">Class Grade</label>
                                                <select id="student-class-input" class="input-field" style="padding: 8px 12px; font-size: 0.9rem;">
                                                    <option value="Class 3" ${currentStudent && currentStudent.class === 'Class 3' ? 'selected' : ''}>Class 3</option>
                                                    <option value="Class 4" ${currentStudent && currentStudent.class === 'Class 4' ? 'selected' : ''}>Class 4</option>
                                                    <option value="Class 5" ${currentStudent && currentStudent.class === 'Class 5' ? 'selected' : ''}>Class 5</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style="display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 4px; color: var(--color-text-muted);">Roll Number</label>
                                                <input type="text" id="student-roll-input" class="input-field" value="${currentStudent ? currentStudent.roll : '01'}" required style="padding: 8px 12px; font-size: 0.9rem;">
                                            </div>
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 4px; color: var(--color-text-muted);">Mother Tongue (Vernacular)</label>
                                            <select id="student-lang-input" class="input-field" style="padding: 8px 12px; font-size: 0.9rem;">
                                                <option value="Santhali" selected>Santhali (ᱥᱟᱱᱛᱟᱲᱤ · Ol Chiki)</option>
                                                <option value="Bengali">Bengali (বাংলা)</option>
                                                <option value="Hindi">Hindi (हिंदी)</option>
                                                <option value="Kudmali">Kudmali (कुड़माली)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; font-size: 0.95rem; font-weight: 700; background: #059669; border-radius: var(--radius-md); margin-top: 8px;">
                                    Sign In to Student Desk 🎒 ${icons.arrowRight}
                                </button>
                            ` : `
                                <!-- Teacher Mode -->
                                <div style="background: rgba(226, 91, 54, 0.08); border: 1px solid rgba(226, 91, 54, 0.25); padding: 12px 16px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
                                    <div>
                                        <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary);">Quick Demo Educator Login</div>
                                        <div style="font-size: 0.72rem; color: var(--color-text-muted);">Meera Hansda · Primary Multilingual Teacher · Kheria School</div>
                                    </div>
                                    <button type="button" id="quick-teacher-login-btn" class="btn-primary" style="padding: 6px 14px; font-size: 0.75rem; font-weight: 700;">
                                        Quick Fill ⚡
                                    </button>
                                </div>

                                <div>
                                    <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--color-text-main);">Teacher Name</label>
                                    <input type="text" id="teacher-name-input" class="input-field" value="Meera Hansda" required placeholder="e.g. Meera Hansda">
                                </div>

                                <div>
                                    <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--color-text-main);">School / Learning Centre</label>
                                    <input type="text" id="school-name-input" class="input-field" value="Kheria Primary School" required placeholder="e.g. Kheria Primary School">
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                                    <div>
                                        <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--color-text-main);">Primary Class</label>
                                        <select id="teacher-class-input" class="input-field">
                                            <option value="Class 3" selected>Class 3 (Primary)</option>
                                            <option value="Class 4">Class 4 (Primary)</option>
                                            <option value="Class 5">Class 5 (Upper Primary)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--color-text-main);">Designation / Role</label>
                                        <input type="text" class="input-field" value="Primary Educator" readonly style="background: var(--color-surface-alt);">
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; font-size: 0.95rem; font-weight: 700; border-radius: var(--radius-md); margin-top: 8px;">
                                    Sign In to Teacher Workspace 👩‍🏫 ${icons.arrowRight}
                                </button>
                            `}
                        </form>

                        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
                                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600;">System Online · Local SIH Session</span>
                            </div>
                            <span style="font-size: 0.72rem; color: var(--color-text-muted);">Class 3, 4, 5 Multilingual Deck</span>
                        </div>
                    </div>
                </section>
            </div>
        `;

        // Bind Theme Toggle in Login
        const themeBtn = container.querySelector('#login-theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const current = getStoredTheme();
                const next = current === 'dark' ? 'light' : 'dark';
                localStorage.setItem('vani_theme', next);
                if (next === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.body.classList.add('dark-mode');
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.body.classList.remove('dark-mode');
                }
                renderView();
            });
        }

        // Role Tab Switches
        const teacherTab = container.querySelector('#role-teacher-tab');
        const studentTab = container.querySelector('#role-student-tab');

        if (teacherTab) {
            teacherTab.addEventListener('click', () => {
                if (selectedRole !== 'Teacher') {
                    selectedRole = 'Teacher';
                    api.setRole('Teacher');
                    renderView();
                }
            });
        }

        if (studentTab) {
            studentTab.addEventListener('click', () => {
                if (selectedRole !== 'Student') {
                    selectedRole = 'Student';
                    api.setRole('Student');
                    renderView();
                }
            });
        }

        // Quick Teacher Fill
        const quickTeacherBtn = container.querySelector('#quick-teacher-login-btn');
        if (quickTeacherBtn) {
            quickTeacherBtn.addEventListener('click', () => {
                container.querySelector('#teacher-name-input').value = 'Meera Hansda';
                container.querySelector('#school-name-input').value = 'Kheria Primary School';
                container.querySelector('#teacher-class-input').value = 'Class 3';
                showToast('Preset Loaded', 'Teacher: Meera Hansda (Class 3)', 'info');
            });
        }

        // Student Presets click
        container.querySelectorAll('.student-preset-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetId = e.currentTarget.getAttribute('data-preset');
                selectedStudentPreset = presetId;
                const found = studentPresets.find(p => p.id === presetId);
                if (found) {
                    const nameInput = container.querySelector('#student-name-input');
                    const classInput = container.querySelector('#student-class-input');
                    const rollInput = container.querySelector('#student-roll-input');
                    const langInput = container.querySelector('#student-lang-input');

                    if (nameInput) nameInput.value = found.name;
                    if (classInput) classInput.value = found.class;
                    if (rollInput) rollInput.value = found.roll;
                    if (langInput) langInput.value = found.motherTongue;

                    // Update visually
                    container.querySelectorAll('.student-preset-card').forEach(c => {
                        c.style.borderColor = 'var(--color-border)';
                        c.style.background = 'var(--color-surface-alt)';
                    });
                    e.currentTarget.style.borderColor = found.color;
                    e.currentTarget.style.background = found.bg;

                    showToast('Student Selected', `${found.name} (${found.class})`, 'info');
                }
            });
        });

        // Form Submit Handler
        const form = container.querySelector('#login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (selectedRole === 'Student') {
                const name = container.querySelector('#student-name-input').value.trim() || 'Babu Soren';
                const sClass = container.querySelector('#student-class-input').value;
                const roll = container.querySelector('#student-roll-input').value.trim() || '01';
                const lang = container.querySelector('#student-lang-input').value;

                api.setRole('Student');
                api.setCurrentStudent({
                    id: 'std-' + roll,
                    name,
                    class: sClass,
                    roll,
                    motherTongue: lang,
                    comprehensionIndex: 88,
                    attendance: '96%',
                    assessmentsCompleted: 4
                });

                showToast('Welcome!', `Logged in as ${name} (${sClass})`, 'success');
                window.location.hash = '#/student';
            } else {
                const teacherName = container.querySelector('#teacher-name-input').value.trim() || 'Meera Hansda';
                const school = container.querySelector('#school-name-input').value.trim() || 'Kheria Primary School';
                const dClass = container.querySelector('#teacher-class-input').value;

                api.setRole('Teacher');
                api.updateUser({ name: teacherName, school, class: dClass });
                api.setActiveClass(dClass);

                showToast('Welcome!', `Welcome back, ${teacherName}`, 'success');
                window.location.hash = '#/dashboard';
            }
        });
    }

    renderView();
}

// Backwards compatibility alias
export const renderOnboarding = renderLogin;
