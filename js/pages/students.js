import { createSidebar, createHeader, bindHeaderClassSwitcher, icons, showToast } from '../components.js';
import { api } from '../api.js';

export async function renderStudents(container) {
    let activeClass = api.getActiveClass();
    const user = await api.getUser();
    let currentFilterClass = activeClass;
    let searchQuery = '';
    let langFilter = 'All';

    async function loadAndRender() {
        const students = await api.getStudents(currentFilterClass, searchQuery, langFilter);

        container.innerHTML = `
            <div class="app-shell">
                ${createSidebar('students')}
                
                <div class="main-wrapper">
                    ${createHeader(user, ['Teacher workspace', 'Learners Roster', currentFilterClass])}
                    
                    <main class="dashboard-content">
                        <!-- Top Header -->
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-primary); letter-spacing: 0.1em; text-transform: uppercase;">MULTILINGUAL CLASSROOM ROSTER</span>
                                <h2 class="heading-display" style="font-size: 2rem; margin-top: 4px; display: flex; align-items: center; gap: 10px;">
                                    Student Comprehension Roster
                                    <span class="badge badge-coral">${currentFilterClass}</span>
                                </h2>
                                <p style="color: var(--color-text-muted); font-size: 0.875rem;">Track individual mother-tongue proficiency, classroom participation, and assigned assessment performance.</p>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button id="enroll-student-btn" class="btn-primary" style="padding: 10px 18px; font-size: 0.85rem;">
                                    ${icons.plus} Enroll Student
                                </button>
                            </div>
                        </div>

                        <!-- Class Switcher Tabs -->
                        <div class="tabs-header">
                            <button class="tab-btn ${currentFilterClass === 'Class 3' ? 'active' : ''}" data-filter-class="Class 3">
                                <span>Class 3</span>
                                <span class="badge badge-zinc">28 Students</span>
                            </button>
                            <button class="tab-btn ${currentFilterClass === 'Class 4' ? 'active' : ''}" data-filter-class="Class 4">
                                <span>Class 4</span>
                                <span class="badge badge-zinc">30 Students</span>
                            </button>
                            <button class="tab-btn ${currentFilterClass === 'Class 5' ? 'active' : ''}" data-filter-class="Class 5">
                                <span>Class 5</span>
                                <span class="badge badge-zinc">26 Students</span>
                            </button>
                            <button class="tab-btn ${currentFilterClass === 'All' ? 'active' : ''}" data-filter-class="All">
                                <span>All Enrolled</span>
                            </button>
                        </div>

                        <!-- Filter and Search Bar -->
                        <div class="card mb-6" style="padding: 16px 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
                                <div style="flex: 1; position: relative;">
                                    <input type="text" id="student-search-input" class="input-field" placeholder="Search by name, roll number, or mother tongue..." value="${searchQuery}" style="padding-left: 38px; font-size: 0.875rem;">
                                    <span style="position: absolute; left: 12px; top: 12px; color: var(--color-text-light);">
                                        ${icons.search}
                                    </span>
                                </div>

                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted);">MOTHER TONGUE:</span>
                                    <select id="language-filter-select" style="padding: 8px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 600; background: white;">
                                        <option value="All" ${langFilter === 'All' ? 'selected' : ''}>All Languages</option>
                                        <option value="Santhali" ${langFilter === 'Santhali' ? 'selected' : ''}>Santhali (संथाली)</option>
                                        <option value="Bengali" ${langFilter === 'Bengali' ? 'selected' : ''}>Bengali (বাংলা)</option>
                                        <option value="Kudmali" ${langFilter === 'Kudmali' ? 'selected' : ''}>Kudmali</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Students Table -->
                        <div class="table-container">
                            <table class="vani-table">
                                <thead>
                                    <tr>
                                        <th>Student & Roll #</th>
                                        <th>Class</th>
                                        <th>Home Language</th>
                                        <th>Comprehension Index</th>
                                        <th>Speech Confidence</th>
                                        <th>Engagement Level</th>
                                        <th>Assessments</th>
                                        <th style="text-align: right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${students.length === 0 ? `
                                        <tr>
                                            <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
                                                No students found matching current filters.
                                            </td>
                                        </tr>
                                    ` : students.map(s => `
                                        <tr>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 12px;">
                                                    <div style="width: 36px; height: 36px; border-radius: 50%; background: ${s.avatarBg}; color: ${s.avatarColor}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                                                        ${s.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div style="font-weight: 700; font-size: 0.875rem;">${s.name}</div>
                                                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">Roll: #${s.roll} · Attendance: ${s.attendance}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge badge-zinc">${s.class}</span>
                                            </td>
                                            <td>
                                                <span class="badge badge-coral" style="text-transform: none; font-size: 0.75rem;">
                                                    ${s.motherTongue}
                                                </span>
                                            </td>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 8px;">
                                                    <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; min-width: 65px; overflow: hidden;">
                                                        <div style="height: 100%; width: ${s.comprehensionIndex}%; background: ${s.comprehensionIndex >= 85 ? '#059669' : (s.comprehensionIndex >= 75 ? '#0284c7' : '#d97706')};"></div>
                                                    </div>
                                                    <span style="font-weight: 800; font-size: 0.8rem; color: ${s.comprehensionIndex >= 85 ? '#059669' : '#0f172a'};">
                                                        ${s.comprehensionIndex}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-main);">
                                                    ${s.confidence}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="badge badge-emerald" style="text-transform: none;">
                                                    ${s.engagement}
                                                </span>
                                            </td>
                                            <td>
                                                <span style="font-size: 0.8rem; font-weight: 700;">
                                                    ${s.assessmentsCompleted} completed
                                                </span>
                                            </td>
                                            <td style="text-align: right;">
                                                <button class="view-student-profile-btn" data-id="${s.id}" style="padding: 6px 12px; background: var(--color-surface-alt); border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: var(--color-primary);">
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        `;

        // Bind Class Switcher in Header
        bindHeaderClassSwitcher((newClass) => {
            currentFilterClass = newClass;
            loadAndRender();
        });

        // Filter Tabs
        container.querySelectorAll('[data-filter-class]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                currentFilterClass = e.currentTarget.getAttribute('data-filter-class');
                if (currentFilterClass !== 'All') {
                    api.setActiveClass(currentFilterClass);
                }
                loadAndRender();
            });
        });

        // Search Input
        const searchInput = container.querySelector('#student-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                loadAndRender();
            });
        }

        // Language Select
        const langSelect = container.querySelector('#language-filter-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                langFilter = e.target.value;
                loadAndRender();
            });
        }

        // Enroll Student Button
        const enrollBtn = container.querySelector('#enroll-student-btn');
        if (enrollBtn) {
            enrollBtn.addEventListener('click', () => {
                openEnrollModal(currentFilterClass === 'All' ? 'Class 3' : currentFilterClass, () => {
                    loadAndRender();
                });
            });
        }

        // View Student Profile Button
        container.querySelectorAll('.view-student-profile-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const sId = e.currentTarget.getAttribute('data-id');
                const student = (await api.getStudents('All')).find(s => s.id === sId);
                openStudentDetailModal(student);
            });
        });
    }

    await loadAndRender();
}

function openEnrollModal(defaultClass, onSuccess) {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="enroll-modal">
            <div class="modal-box" style="max-width: 480px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <h3 style="font-weight: 700; font-size: 1.15rem;">Enroll Learner in ${defaultClass}</h3>
                    <button id="close-enroll" style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">✕</button>
                </div>

                <form id="enroll-form" class="flex flex-col gap-4">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Full Name</label>
                        <input type="text" class="input-field" id="new-student-name" placeholder="e.g. Ramesh Marandi" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Class</label>
                            <select class="input-field" id="new-student-class">
                                <option value="Class 3" ${defaultClass === 'Class 3' ? 'selected' : ''}>Class 3</option>
                                <option value="Class 4" ${defaultClass === 'Class 4' ? 'selected' : ''}>Class 4</option>
                                <option value="Class 5" ${defaultClass === 'Class 5' ? 'selected' : ''}>Class 5</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Home Mother Tongue</label>
                            <select class="input-field" id="new-student-lang">
                                <option>Santhali</option>
                                <option>Bengali</option>
                                <option>Kudmali</option>
                                <option>Hindi</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                        <button type="button" id="cancel-enroll" class="role-btn" style="padding: 8px 16px;">Cancel</button>
                        <button type="submit" class="btn-primary" style="padding: 8px 20px;">
                            ${icons.check} Complete Enrollment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-enroll').addEventListener('click', close);
    document.getElementById('cancel-enroll').addEventListener('click', close);

    document.getElementById('enroll-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('new-student-name').value;
        const cls = document.getElementById('new-student-class').value;
        const lang = document.getElementById('new-student-lang').value;

        await api.addStudent({
            name,
            class: cls,
            motherTongue: lang
        });

        close();
        showToast('Student Enrolled', `Added ${name} to ${cls}!`, 'success');
        onSuccess();
    });
}

function openStudentDetailModal(student) {
    if (!student) return;
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="student-detail-modal">
            <div class="modal-box" style="max-width: 580px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 44px; height: 44px; border-radius: 50%; background: ${student.avatarBg}; color: ${student.avatarColor}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem;">
                            ${student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h3 style="font-weight: 800; font-size: 1.25rem;">${student.name}</h3>
                            <p style="font-size: 0.8rem; color: var(--color-text-muted);">Roll #${student.roll} · ${student.class} · Native Language: <strong>${student.motherTongue}</strong></p>
                        </div>
                    </div>
                    <button id="close-student-detail" style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">✕</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                    <div style="background: var(--color-surface-alt); padding: 12px; border-radius: var(--radius-md); text-align: center;">
                        <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase;">Understanding</span>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #059669; margin-top: 2px;">${student.comprehensionIndex}%</div>
                    </div>
                    <div style="background: var(--color-surface-alt); padding: 12px; border-radius: var(--radius-md); text-align: center;">
                        <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase;">Assessments</span>
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary); margin-top: 2px;">${student.assessmentsCompleted}</div>
                    </div>
                    <div style="background: var(--color-surface-alt); padding: 12px; border-radius: var(--radius-md); text-align: center;">
                        <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase;">Attendance</span>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #0284c7; margin-top: 2px;">${student.attendance}</div>
                    </div>
                </div>

                <div style="background: #fdfaf4; border: 1px solid #fde68a; border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
                    <h4 style="font-size: 0.85rem; font-weight: 700; color: #b45309; margin-bottom: 6px;">✦ Recommended Vernacular Bridge Actions</h4>
                    <p style="font-size: 0.8rem; color: #78350f; line-height: 1.4;">
                        ${student.name} responds with higher accuracy when story math problems are explained using <strong>${student.motherTongue} Ol Chiki vocabulary</strong>. Provide audio prompts during upcoming quizzes.
                    </p>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <a href="#/assessment" class="btn-primary" style="padding: 10px 18px; font-size: 0.85rem;">
                        Assign Targeted Assessment
                    </a>
                </div>
            </div>
        </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-student-detail').addEventListener('click', close);
}
