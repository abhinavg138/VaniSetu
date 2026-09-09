import { createSidebar, createHeader, bindHeaderClassSwitcher, icons, showToast } from '../components.js';
import { api } from '../api.js';

export async function renderAssessment(container) {
    let activeClass = api.getActiveClass();
    const user = await api.getUser();
    let currentFilterClass = activeClass;
    let currentFilterSubject = 'All';
    let generatedAssessment = null;

    async function loadAndRender() {
        const assessments = await api.getAssessments(currentFilterClass, currentFilterSubject);
        const stats = await api.getStats(currentFilterClass === 'All' ? 'Class 3' : currentFilterClass);

        container.innerHTML = `
            <div class="app-shell">
                ${createSidebar('assessment')}
                
                <div class="main-wrapper">
                    ${createHeader(user, ['Teacher workspace', 'Assessment', 'Classwise Generator'])}
                    
                    <main class="dashboard-content">
                        <!-- Top Header Title -->
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-primary); letter-spacing: 0.1em; text-transform: uppercase;">CLASSWISE LEARNING ASSESSMENTS</span>
                                <h2 class="heading-display" style="font-size: 2rem; margin-top: 4px; display: flex; align-items: center; gap: 10px;">
                                    Assessment Generator & Tracker
                                    <span class="badge badge-coral">${currentFilterClass}</span>
                                </h2>
                                <p style="color: var(--color-text-muted); font-size: 0.875rem;">Generate bilingual conceptual assessments and assign them directly to your classes.</p>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <a href="#/students" class="role-btn" style="padding: 8px 16px; font-size: 0.8rem; background: white;">
                                    ${icons.users} View Student Scores
                                </a>
                                <button id="scroll-to-generator-btn" class="btn-primary" style="padding: 10px 18px; font-size: 0.85rem;">
                                    ${icons.plus} Create New Assessment
                                </button>
                            </div>
                        </div>

                        <!-- Class Switcher Tabs -->
                        <div class="tabs-header">
                            <button class="tab-btn ${currentFilterClass === 'Class 3' ? 'active' : ''}" data-filter-class="Class 3">
                                <span>Class 3</span>
                                <span class="badge badge-zinc">28 Learners</span>
                            </button>
                            <button class="tab-btn ${currentFilterClass === 'Class 4' ? 'active' : ''}" data-filter-class="Class 4">
                                <span>Class 4</span>
                                <span class="badge badge-zinc">30 Learners</span>
                            </button>
                            <button class="tab-btn ${currentFilterClass === 'Class 5' ? 'active' : ''}" data-filter-class="Class 5">
                                <span>Class 5</span>
                                <span class="badge badge-zinc">26 Learners</span>
                            </button>
                            <button class="tab-btn ${currentFilterClass === 'All' ? 'active' : ''}" data-filter-class="All">
                                <span>All Classes</span>
                            </button>
                        </div>

                        <!-- KPI Summary Row for Selected Class -->
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
                            <div class="card" style="padding: 16px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Active Assessments</span>
                                <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-primary); margin-top: 4px;">
                                    ${assessments.filter(a => a.status === 'Active').length}
                                </div>
                                <span style="font-size: 0.7rem; color: #10b981; font-weight: 600;">In progress this week</span>
                            </div>
                            <div class="card" style="padding: 16px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Average Class Score</span>
                                <div style="font-size: 1.75rem; font-weight: 800; color: #059669; margin-top: 4px;">
                                    ${stats.averageUnderstanding}%
                                </div>
                                <span style="font-size: 0.7rem; color: var(--color-text-muted);">Comprehension Index</span>
                            </div>
                            <div class="card" style="padding: 16px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Total Submissions</span>
                                <div style="font-size: 1.75rem; font-weight: 800; color: #0284c7; margin-top: 4px;">
                                    ${assessments.reduce((acc, cur) => acc + (cur.submissionsCount || 0), 0)}
                                </div>
                                <span style="font-size: 0.7rem; color: var(--color-text-muted);">Across assigned tasks</span>
                            </div>
                            <div class="card" style="padding: 16px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Language Bridge</span>
                                <div style="font-size: 1.25rem; font-weight: 800; color: #7c3aed; margin-top: 8px;">
                                    Santhali · Hindi
                                </div>
                                <span style="font-size: 0.7rem; color: var(--color-text-muted);">Ol Chiki & Roman script</span>
                            </div>
                        </div>

                        <!-- Generator Section -->
                        <section class="card mb-6" id="generator-section" style="border-top: 4px solid var(--color-primary);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                                <div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 28px; height: 28px; border-radius: 6px; background: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
                                            ${icons.sparkles}
                                        </div>
                                        <h3 style="font-size: 1.25rem; font-weight: 700;">AI Bilingual Assessment Generator</h3>
                                    </div>
                                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 4px;">
                                        Generate culturally contextual questions in both standard curriculum language and the child's mother tongue.
                                    </p>
                                </div>
                                <span class="badge badge-emerald">Ready for ${currentFilterClass === 'All' ? 'Class 3' : currentFilterClass}</span>
                            </div>

                            <form id="assessment-generator-form">
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Target Class</label>
                                        <select id="gen-class-select" class="input-field" style="padding: 10px 14px;">
                                            <option value="Class 3" ${currentFilterClass === 'Class 3' ? 'selected' : ''}>Class 3 (Age 8-9)</option>
                                            <option value="Class 4" ${currentFilterClass === 'Class 4' ? 'selected' : ''}>Class 4 (Age 9-10)</option>
                                            <option value="Class 5" ${currentFilterClass === 'Class 5' ? 'selected' : ''}>Class 5 (Age 10-11)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Subject</label>
                                        <select id="gen-subject-select" class="input-field" style="padding: 10px 14px;">
                                            <option value="Mathematics">Mathematics (गणित)</option>
                                            <option value="Environmental Studies">Environmental Studies (EVS)</option>
                                            <option value="General Science">General Science (विज्ञान)</option>
                                            <option value="Language">Language & Storytelling</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Mother Tongue Bridge</label>
                                        <select id="gen-dialect-select" class="input-field" style="padding: 10px 14px;">
                                            <option value="Santhali (Ol Chiki & Roman)">Santhali (Ol Chiki & Roman script)</option>
                                            <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                                            <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                                            <option value="Odia (ଓଡ଼ିଆ)">Odia (ଓଡ଼ିଆ)</option>
                                            <option value="Kudmali">Kudmali</option>
                                        </select>
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Topic / Learning Objective</label>
                                        <input type="text" id="gen-topic-input" class="input-field" value="Subtraction with word problems" placeholder="e.g., Photosynthesis, Solar System, Fractions in nature..." style="padding: 10px 14px;" required>
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Questions Count</label>
                                        <select id="gen-count-select" class="input-field" style="padding: 10px 14px;">
                                            <option value="3">3 Questions (Quick check)</option>
                                            <option value="5" selected>5 Questions (Standard)</option>
                                            <option value="8">8 Questions (Full review)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Difficulty</label>
                                        <select id="gen-diff-select" class="input-field" style="padding: 10px 14px;">
                                            <option value="Easy">Easy (Foundation)</option>
                                            <option value="Medium" selected>Medium (Standard)</option>
                                            <option value="Challenging">Challenging</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Quick Topic Chips -->
                                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                    <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted);">Quick Topic Ideas:</span>
                                    <button type="button" class="topic-chip" data-topic="Subtraction with market fruit stories" data-subject="Mathematics" style="background: var(--color-surface-alt); padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; color: var(--color-text-main); border: 1px solid var(--color-border); cursor: pointer;">Fruit Subtraction</button>
                                    <button type="button" class="topic-chip" data-topic="Our Forest Trees and Animal Alert Calls" data-subject="Environmental Studies" style="background: var(--color-surface-alt); padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; color: var(--color-text-main); border: 1px solid var(--color-border); cursor: pointer;">Forest & Trees</button>
                                    <button type="button" class="topic-chip" data-topic="How Plant Leaves make food with sunlight" data-subject="General Science" style="background: var(--color-surface-alt); padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; color: var(--color-text-main); border: 1px solid var(--color-border); cursor: pointer;">Plant Photosynthesis</button>
                                    <button type="button" class="topic-chip" data-topic="Solar System: The Sun and 8 Orbiting Planets" data-subject="General Science" style="background: var(--color-surface-alt); padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; color: var(--color-text-main); border: 1px solid var(--color-border); cursor: pointer;">Solar System</button>
                                </div>

                                <div style="display: flex; justify-content: flex-end; gap: 12px;">
                                    <button type="submit" id="generate-btn" class="btn-primary" style="padding: 12px 28px; font-size: 0.9rem;">
                                        ${icons.sparkles} Generate Assessment with AI Bridge
                                    </button>
                                </div>
                            </form>

                            <!-- Generated Preview Box (Visible after generation) -->
                            <div id="generated-preview-container" style="display: ${generatedAssessment ? 'block' : 'none'}; margin-top: 24px; padding-top: 20px; border-top: 1px dashed var(--color-border);">
                                ${generatedAssessment ? renderGeneratedAssessmentCard(generatedAssessment) : ''}
                            </div>
                        </section>

                        <!-- Assigned Assessments Section -->
                        <section>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <div>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-light); letter-spacing: 0.1em; text-transform: uppercase;">TRACKING DASHBOARD</span>
                                    <h3 style="font-size: 1.25rem; font-weight: 700;">Assigned Assessments for ${currentFilterClass}</h3>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <select id="subject-filter-select" style="padding: 6px 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 0.8rem; font-weight: 600; background: var(--color-surface); color: var(--color-text-main); cursor: pointer;">
                                        <option value="All" ${currentFilterSubject === 'All' ? 'selected' : ''}>All Subjects</option>
                                        <option value="Mathematics" ${currentFilterSubject === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
                                        <option value="Environmental Studies" ${currentFilterSubject === 'Environmental Studies' ? 'selected' : ''}>EVS</option>
                                        <option value="General Science" ${currentFilterSubject === 'General Science' ? 'selected' : ''}>General Science</option>
                                    </select>
                                </div>
                            </div>

                            <div class="table-container">
                                <table class="vani-table">
                                    <thead>
                                        <tr>
                                            <th>Assessment Title & Topic</th>
                                            <th>Class & Subject</th>
                                            <th>Language Bridge</th>
                                            <th>Due Date</th>
                                            <th>Submissions</th>
                                            <th>Average Score</th>
                                            <th>Status</th>
                                            <th style="text-align: right;">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${assessments.length === 0 ? `
                                            <tr>
                                                <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
                                                    No assessments assigned yet for ${currentFilterClass}. Generate your first assessment above!
                                                </td>
                                            </tr>
                                        ` : assessments.map(item => `
                                            <tr>
                                                <td>
                                                    <div style="font-weight: 700; font-size: 0.875rem;">${item.title}</div>
                                                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">${item.topic} · ${item.questionCount || item.questions.length} questions</div>
                                                </td>
                                                <td>
                                                    <div style="font-weight: 600;">${item.class}</div>
                                                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">${item.subject}</div>
                                                </td>
                                                <td>
                                                    <span class="badge badge-zinc" style="text-transform: none; font-size: 0.75rem;">${item.language}</span>
                                                </td>
                                                <td>
                                                    <div style="font-size: 0.8rem; font-weight: 600;">${item.dueDate}</div>
                                                    <div style="font-size: 0.7rem; color: var(--color-text-light);">Assigned ${item.assignedDate}</div>
                                                </td>
                                                <td>
                                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                        <div style="flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; min-width: 60px; overflow: hidden;">
                                                            <div style="height: 100%; width: ${item.totalStudents ? Math.round((item.submissionsCount / item.totalStudents) * 100) : 80}%; background: #059669;"></div>
                                                        </div>
                                                        <span style="font-size: 0.75rem; font-weight: 700;">${item.submissionsCount}/${item.totalStudents || 28}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style="font-weight: 800; font-size: 0.875rem; color: ${item.averageScore >= 80 ? '#059669' : '#d97706'};">
                                                        ${item.averageScore ? item.averageScore + '%' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge ${item.status === 'Active' ? 'badge-emerald' : 'badge-zinc'}">
                                                        ${item.status}
                                                    </span>
                                                </td>
                                                <td style="text-align: right;">
                                                    <div style="display: inline-flex; gap: 6px;">
                                                        <button class="review-btn" data-id="${item.id}" style="padding: 6px 12px; background: var(--color-surface-alt); border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: var(--color-text-main);">
                                                            Review
                                                        </button>
                                                        <button class="preview-quiz-btn" data-id="${item.id}" style="padding: 6px 10px; background: white; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: var(--color-primary);">
                                                            Preview
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        `;

        // Bind Class Switcher in Header
        bindHeaderClassSwitcher((newClass) => {
            currentFilterClass = newClass;
            loadAndRender();
        });

        // Event listeners
        // Class filter tabs
        container.querySelectorAll('[data-filter-class]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                currentFilterClass = e.currentTarget.getAttribute('data-filter-class');
                if (currentFilterClass !== 'All') {
                    api.setActiveClass(currentFilterClass);
                }
                loadAndRender();
            });
        });

        // Subject filter dropdown
        const subjectSelect = container.querySelector('#subject-filter-select');
        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => {
                currentFilterSubject = e.target.value;
                loadAndRender();
            });
        }

        // Quick Topic chips
        container.querySelectorAll('.topic-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const topic = chip.getAttribute('data-topic');
                const subj = chip.getAttribute('data-subject');
                const topicInput = container.querySelector('#gen-topic-input');
                const subjSelect = container.querySelector('#gen-subject-select');
                if (topicInput) topicInput.value = topic;
                if (subjSelect) subjSelect.value = subj;
            });
        });

        // Scroll to generator button
        const scrollBtn = container.querySelector('#scroll-to-generator-btn');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => {
                const gen = container.querySelector('#generator-section');
                if (gen) gen.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Generator form submission
        const form = container.querySelector('#assessment-generator-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const generateBtn = container.querySelector('#generate-btn');
                generateBtn.disabled = true;
                generateBtn.innerHTML = `${icons.sparkles} Generating with Vernacular Bridge...`;

                const cls = container.querySelector('#gen-class-select').value;
                const subj = container.querySelector('#gen-subject-select').value;
                const dialect = container.querySelector('#gen-dialect-select').value;
                const topic = container.querySelector('#gen-topic-input').value;
                const count = container.querySelector('#gen-count-select').value;
                const diff = container.querySelector('#gen-diff-select').value;

                try {
                    generatedAssessment = await api.generateAssessment({
                        className: cls,
                        subject: subj,
                        language: dialect,
                        topic: topic,
                        count: count,
                        difficulty: diff
                    });

                    showToast('Assessment Generated', `Created ${generatedAssessment.questions.length} bilingual questions for ${cls}!`, 'success');
                    
                    const previewContainer = container.querySelector('#generated-preview-container');
                    previewContainer.style.display = 'block';
                    previewContainer.innerHTML = renderGeneratedAssessmentCard(generatedAssessment);
                    previewContainer.scrollIntoView({ behavior: 'smooth' });

                    bindGeneratedCardActions(container, generatedAssessment, () => {
                        loadAndRender();
                    });
                } catch (err) {
                    showToast('Generation Error', 'Could not generate assessment questions.', 'error');
                } finally {
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = `${icons.sparkles} Generate Assessment with AI Bridge`;
                }
            });
        }

        // Bind Review and Preview buttons
        container.querySelectorAll('.review-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const item = await api.getAssessmentById(id);
                openReviewModal(item);
            });
        });

        container.querySelectorAll('.preview-quiz-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const item = await api.getAssessmentById(id);
                openQuizPreviewModal(item);
            });
        });
    }

    await loadAndRender();
}

function renderGeneratedAssessmentCard(item) {
    return `
        <div style="background: white; border: 2px solid var(--color-primary-light); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <span class="badge badge-coral">${item.class} · ${item.subject}</span>
                    <h3 style="font-size: 1.35rem; font-weight: 800; margin-top: 6px;">${item.title}</h3>
                    <p style="font-size: 0.8rem; color: var(--color-text-muted);">Language Bridge: <strong>${item.language}</strong> · Difficulty: <strong>${item.difficulty}</strong></p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button id="discard-gen-btn" style="padding: 8px 16px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
                        Discard
                    </button>
                    <button id="assign-to-class-btn" class="btn-primary" style="padding: 10px 24px; font-size: 0.9rem;">
                        ${icons.clipboard} Assign to ${item.class} Now
                    </button>
                </div>
            </div>

            <div style="margin-top: 16px; margin-bottom: 20px;">
                <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 12px;">Generated Questions Preview (${item.questions.length}):</h4>
                ${item.questions.map((q, idx) => `
                    <div class="question-card" style="border-left: 4px solid var(--color-primary);">
                        <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 6px;">
                            Q${idx + 1}. ${q.qText}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--color-primary); font-weight: 600; background: var(--color-primary-light); padding: 8px 12px; border-radius: 6px; margin-bottom: 10px;">
                            ✦ Vernacular Mother-Tongue Bridge: "${q.vernacularText}"
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            ${q.options.map((opt, oIdx) => `
                                <div style="font-size: 0.8rem; padding: 8px 12px; border: 1px solid ${oIdx === q.correctIndex ? '#10b981' : 'var(--color-border)'}; background: ${oIdx === q.correctIndex ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-surface-alt)'}; color: var(--color-text-main); border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                                    <span>${String.fromCharCode(65 + oIdx)}) ${opt}</span>
                                    ${oIdx === q.correctIndex ? `<span style="font-size: 0.7rem; font-weight: 700; color: #10b981;">Correct Answer</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--color-text-muted); font-style: italic;">
                            Teacher Guidance: ${q.explanation}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function bindGeneratedCardActions(container, generatedAssessment, onSuccess) {
    const discardBtn = container.querySelector('#discard-gen-btn');
    const assignBtn = container.querySelector('#assign-to-class-btn');

    if (discardBtn) {
        discardBtn.addEventListener('click', () => {
            const preview = container.querySelector('#generated-preview-container');
            preview.style.display = 'none';
            preview.innerHTML = '';
            showToast('Draft Discarded', 'Assessment generation was cancelled.', 'info');
        });
    }

    if (assignBtn) {
        assignBtn.addEventListener('click', () => {
            openAssignModal(generatedAssessment, onSuccess);
        });
    }
}

function openAssignModal(assessment, onSuccess) {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="assign-modal">
            <div class="modal-box" style="max-width: 520px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center;">
                            ${icons.clipboard}
                        </div>
                        <h3 style="font-weight: 700; font-size: 1.15rem;">Assign to ${assessment.class}</h3>
                    </div>
                    <button id="close-assign-modal" style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface-alt); color: var(--color-text-main); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
                </div>

                <form id="confirm-assign-form" class="flex flex-col gap-4">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Assessment Title</label>
                        <input type="text" class="input-field" id="assign-title" value="${assessment.title}" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Target Learners</label>
                            <select class="input-field" id="assign-target">
                                <option value="All Students">All ${assessment.totalStudents} Students in ${assessment.class}</option>
                                <option value="Vernacular Learners">Students needing Santhali bridge only</option>
                                <option value="Revision Group">Reinforcement group (Score < 80%)</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Submission Due Date</label>
                            <input type="date" class="input-field" id="assign-due-date" value="${new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]}" required>
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Instructions in Vernacular / Mother Tongue</label>
                        <textarea class="input-field" rows="2" id="assign-notes">Gidra ko, joto katha bes te bujhaw kate ol pe. Dare ar bir reak katha menak-a.</textarea>
                    </div>

                    <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.8rem; color: var(--color-text-main);">
                        ✓ This will immediately distribute the assessment to the student portals for <strong>${assessment.class}</strong> and track live submissions.
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                        <button type="button" id="cancel-assign-btn" class="role-btn" style="padding: 10px 18px;">Cancel</button>
                        <button type="submit" class="btn-primary" style="padding: 10px 24px;">
                            ${icons.check} Confirm & Distribute Assessment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const modal = document.getElementById('assign-modal');
    const closeBtn = document.getElementById('close-assign-modal');
    const cancelBtn = document.getElementById('cancel-assign-btn');
    const form = document.getElementById('confirm-assign-form');

    const closeModal = () => {
        modal.classList.remove('open');
        modalRoot.innerHTML = '';
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedTitle = document.getElementById('assign-title').value;
        const targetGroup = document.getElementById('assign-target').value;
        const dueDateRaw = document.getElementById('assign-due-date').value;
        const d = new Date(dueDateRaw);
        const formattedDue = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        await api.assignAssessment({
            ...assessment,
            title: updatedTitle,
            assignedTo: targetGroup,
            dueDate: formattedDue,
            submissionsCount: 1, // simulated initial submission
            totalStudents: assessment.class === 'Class 3' ? 28 : (assessment.class === 'Class 4' ? 30 : 26)
        });

        closeModal();
        showToast('Assessment Assigned!', `Successfully assigned "${updatedTitle}" to ${assessment.class}!`, 'success');
        onSuccess();
    });
}

function openReviewModal(item) {
    if (!item) return;
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="review-modal">
            <div class="modal-box" style="max-width: 680px; max-height: 85vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <div>
                        <span class="badge badge-emerald">${item.class} · ${item.subject}</span>
                        <h3 style="font-weight: 700; font-size: 1.25rem; margin-top: 4px;">${item.title}</h3>
                        <p style="font-size: 0.75rem; color: var(--color-text-muted);">${item.submissionsCount || 24} of ${item.totalStudents || 28} Students Submitted · Average Score: ${item.averageScore || 84}%</p>
                    </div>
                    <button id="close-review-modal" style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface-alt); color: var(--color-text-main); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
                </div>

                <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 12px;">Student Submissions Overview</h4>
                <div class="table-container mb-4">
                    <table class="vani-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Mother Tongue</th>
                                <th>Score</th>
                                <th>Vernacular Bridge Used</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Babu Soren (Roll 01)</strong></td>
                                <td>Santhali</td>
                                <td><span style="font-weight: 700; color: #059669;">90%</span> (5/5)</td>
                                <td>Ol Chiki audio assisted</td>
                                <td><span class="badge badge-emerald">Completed</span></td>
                            </tr>
                            <tr>
                                <td><strong>Pooja Murmu (Roll 04)</strong></td>
                                <td>Santhali</td>
                                <td><span style="font-weight: 700; color: #059669;">100%</span> (5/5)</td>
                                <td>None (Independent)</td>
                                <td><span class="badge badge-emerald">Completed</span></td>
                            </tr>
                            <tr>
                                <td><strong>Rohan Bauri (Roll 09)</strong></td>
                                <td>Bengali</td>
                                <td><span style="font-weight: 700; color: #d97706;">75%</span> (3/5)</td>
                                <td>Hindi to Bengali translation</td>
                                <td><span class="badge badge-amber">Needs Practice</span></td>
                            </tr>
                            <tr>
                                <td><strong>Sunita Hembram (Roll 12)</strong></td>
                                <td>Santhali</td>
                                <td><span style="font-weight: 700; color: #059669;">85%</span> (4/5)</td>
                                <td>Story prompt listened</td>
                                <td><span class="badge badge-emerald">Completed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="download-results-btn" class="role-btn" style="padding: 8px 16px; font-size: 0.8rem;">
                        Export PDF Report
                    </button>
                    <button id="close-review-done" class="btn-primary" style="padding: 8px 18px; font-size: 0.8rem;">
                        Done
                    </button>
                </div>
            </div>
        </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-review-modal').addEventListener('click', close);
    document.getElementById('close-review-done').addEventListener('click', close);
    document.getElementById('download-results-btn').addEventListener('click', () => {
        showToast('Report Exported', 'Downloaded Class comprehension report as PDF.', 'success');
    });
}

function openQuizPreviewModal(item) {
    if (!item) return;
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay open" id="quiz-preview-modal">
            <div class="modal-box" style="max-width: 620px; max-height: 85vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
                    <div>
                        <span class="badge badge-coral">${item.class} Student View Preview</span>
                        <h3 style="font-weight: 800; font-size: 1.25rem; margin-top: 4px;">${item.title}</h3>
                    </div>
                    <button id="close-quiz-preview" style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface-alt); color: var(--color-text-main); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${item.questions.map((q, idx) => `
                        <div class="question-card">
                            <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">
                                ${idx + 1}. ${q.qText}
                            </div>
                            <div style="font-size: 0.85rem; color: var(--color-primary); font-weight: 600; margin-bottom: 12px;">
                                ✦ ${q.vernacularText}
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                ${q.options.map((opt, oIdx) => `
                                    <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer;">
                                        <input type="radio" name="preview-q-${idx}" value="${oIdx}">
                                        <span>${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
                    <button id="close-quiz-done" class="btn-primary" style="padding: 10px 20px;">
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-quiz-preview').addEventListener('click', close);
    document.getElementById('close-quiz-done').addEventListener('click', close);
}
