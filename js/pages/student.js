import { createSidebar, createHeader, icons, showToast, speakText, stopSpeech } from '../components.js';
import { api } from '../api.js';

export async function renderStudentPanel(container) {
    // Set role to Student
    api.setRole('Student');

    let currentStudent = api.getCurrentStudent();
    let activeClass = currentStudent.class || api.getActiveClass();
    
    // Parse tab from URL hash (e.g. #/student?tab=quizzes)
    const hashParts = window.location.hash.split('?');
    const urlParams = new URLSearchParams(hashParts[1] || '');
    let activeTab = urlParams.get('tab') || 'desk';

    // State for interactive quiz modal
    let activeQuiz = null;
    let quizCurrentIndex = 0;
    let quizSelectedAnswers = {};
    let isSpeaking = false;
    let recognitionInstance = null;
    let isListening = false;

    // Load fresh data
    const allStudents = await api.getStudents('All');
    const assessments = await api.getAssessments(activeClass);
    const vocabulary = await api.getVocabulary(activeClass);
    const lessons = await api.getLessons(activeClass);
    const submissions = api.getStudentSubmissions(currentStudent.id);

    // Audio helper for student panel
    function playTTS(text, lang = 'hi-IN') {
        stopSpeech();
        speakText(text, lang, {
            rate: 0.9,
            pitch: 1.05,
            onStart: () => {},
            onEnd: () => {},
            onError: () => {}
        });
    }

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Johar! ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟ (Good Morning)', audio: 'Johar! Sagun seta! School te hej kate bes te chena me.' };
        if (hour < 17) return { text: 'Johar! ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ (Good Afternoon)', audio: 'Johar! Sagun tikin! Kheli ar padhaw lagit bes samay.' };
        return { text: 'Johar! ᱥᱟᱹᱜᱩᱱ ᱟᱹᱭᱩᱵ (Good Evening)', audio: 'Johar! Sagun aayup! Aaj reya katha bes te bujhaw pe.' };
    }

    const greeting = getGreeting();

    function renderView() {
        container.innerHTML = `
            <div class="app-shell">
                ${createSidebar('student', 'Student')}
                
                <div class="main-wrapper">
                    ${createHeader(null, ['Student Desk', getTabTitle(activeTab)], 'Student')}
                    
                    <main class="dashboard-content" style="max-width: 1140px; margin: 0 auto; width: 100%; padding-bottom: 40px;">
                        <!-- Student Header Ribbon -->
                        <div class="student-hero-banner mb-6" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); border-radius: var(--radius-xl); padding: 24px 28px; color: white; position: relative; overflow: hidden; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);">
                            <div style="position: absolute; right: -15px; bottom: -20px; font-size: 8rem; opacity: 0.12; font-family: sans-serif; pointer-events: none;">
                                ᱥᱮᱛᱩ
                            </div>

                            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; position: relative; z-index: 2;">
                                <div>
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                        <span style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; background: rgba(255,255,255,0.25); padding: 3px 10px; border-radius: 99px; text-transform: uppercase;">
                                            VANI SETU · STUDENT DESK 2026
                                        </span>
                                        <span style="font-size: 0.75rem; background: #fef08a; color: #854d0e; font-weight: 700; padding: 2px 8px; border-radius: 99px;">
                                            ${currentStudent.class}
                                        </span>
                                    </div>
                                    <h2 class="heading-display" style="font-size: 2rem; margin: 0 0 6px 0; display: flex; align-items: center; gap: 10px; color: white;">
                                        ${greeting.text}
                                        <button id="student-listen-greeting" class="mini-audio-btn" style="background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; color: white; cursor: pointer; transition: all 0.2s;" title="Listen vernacular greeting">
                                            ${icons.volume}
                                        </button>
                                    </h2>
                                    <p style="margin: 0; font-size: 0.95rem; opacity: 0.95;">
                                        Johar, <strong>${currentStudent.name}</strong> (Roll ${currentStudent.roll}) · Mother Tongue: <strong>${currentStudent.motherTongue}</strong>
                                    </p>
                                </div>

                                <!-- Student Switcher & Teacher Switch Button -->
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                                    <div style="display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.18); padding: 6px 12px; border-radius: var(--radius-md); backdrop-filter: blur(4px);">
                                        <span style="font-size: 0.75rem; font-weight: 600;">Active Student:</span>
                                        <select id="switch-student-select" style="background: white; color: #0f172a; border: none; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
                                            ${allStudents.map(s => `
                                                <option value="${s.id}" ${s.id === currentStudent.id ? 'selected' : ''}>
                                                    ${s.name} (${s.class} · ${s.motherTongue})
                                                </option>
                                            `).join('')}
                                        </select>
                                    </div>
                                    <button id="quick-switch-teacher-btn" class="role-btn" style="padding: 6px 14px; font-size: 0.75rem; background: white; color: #065f46; border: none; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                                        👩‍🏫 Return to Teacher Space
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Student Navigation Tabs -->
                        <nav class="student-tabs-nav" style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--color-border); padding-bottom: 10px; overflow-x: auto;">
                            <button class="student-tab-btn ${activeTab === 'desk' ? 'active' : ''}" data-tab="desk">
                                ${icons.dashboard} <span>My Desk</span>
                            </button>
                            <button class="student-tab-btn ${activeTab === 'quizzes' ? 'active' : ''}" data-tab="quizzes">
                                ${icons.clipboard} <span>Quizzes & Tests</span>
                                ${assessments.length > 0 ? `<span class="badge badge-coral" style="padding: 1px 6px; font-size: 0.65rem;">${assessments.length}</span>` : ''}
                            </button>
                            <button class="student-tab-btn ${activeTab === 'vocab' ? 'active' : ''}" data-tab="vocab">
                                ${icons.book} <span>Vernacular Words</span>
                            </button>
                            <button class="student-tab-btn ${activeTab === 'ask' ? 'active' : ''}" data-tab="ask">
                                ${icons.bulb} <span>Ask AI Tutor</span>
                            </button>
                            <button class="student-tab-btn ${activeTab === 'game' ? 'active' : ''}" data-tab="game">
                                <span>🎮 Word Match</span>
                            </button>
                            <button class="student-tab-btn ${activeTab === 'badges' ? 'active' : ''}" data-tab="badges">
                                <span>🏅 My Badges</span>
                            </button>
                        </nav>

                        <!-- Tab Content Container -->
                        <div id="student-tab-content">
                            ${renderTabContent()}
                        </div>
                    </main>
                </div>
            </div>

            <!-- Quiz Modal Mount Point -->
            <div id="student-quiz-modal-container"></div>
        `;

        bindEvents();
    }

    function getTabTitle(tab) {
        switch (tab) {
            case 'quizzes': return 'Assigned Quizzes';
            case 'vocab': return 'Vernacular Vocabulary Bridge';
            case 'ask': return 'Voice & Text Doubt Assistant';
            case 'game': return 'Vernacular Word Match Game';
            case 'badges': return 'My Learning Badges';
            default: return 'My Learning Desk';
        }
    }

    function renderTabContent() {
        switch (activeTab) {
            case 'quizzes':
                return renderQuizzesTab();
            case 'vocab':
                return renderVocabTab();
            case 'ask':
                return renderAskTab();
            case 'game':
                return renderGameTab();
            case 'badges':
                return renderBadgesTab();
            default:
                return renderDeskTab();
        }
    }

    // 1. DESK TAB (Overview)
    function renderDeskTab() {
        const myQuizSubs = api.getStudentSubmissions(currentStudent.id);
        const pendingQuizzes = assessments.filter(a => !myQuizSubs.some(s => s.assessmentId === a.id));
        const completedQuizzes = assessments.filter(a => myQuizSubs.some(s => s.assessmentId === a.id));
        const totalStars = myQuizSubs.reduce((acc, curr) => acc + Math.max(1, Math.round(curr.score / 25)), 0) + 12;

        return `
            <!-- Quick Kid-Friendly Stats -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div class="card" style="padding: 18px; border-left: 4px solid #10b981;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Comprehension</span>
                            <div style="font-size: 1.75rem; font-weight: 800; color: #059669; margin-top: 4px;">
                                ${currentStudent.comprehensionIndex}%
                            </div>
                        </div>
                        <span style="font-size: 1.5rem;">🎯</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">Fluent bilingual understanding</span>
                </div>

                <div class="card" style="padding: 18px; border-left: 4px solid #3b82f6;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Quizzes Solved</span>
                            <div style="font-size: 1.75rem; font-weight: 800; color: #2563eb; margin-top: 4px;">
                                ${myQuizSubs.length} / ${assessments.length}
                            </div>
                        </div>
                        <span style="font-size: 1.5rem;">📝</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">${pendingQuizzes.length} pending to solve</span>
                </div>

                <div class="card" style="padding: 18px; border-left: 4px solid #f59e0b;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Stars Earned</span>
                            <div style="font-size: 1.75rem; font-weight: 800; color: #d97706; margin-top: 4px;">
                                ${totalStars} ⭐
                            </div>
                        </div>
                        <span style="font-size: 1.5rem;">⭐</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">Super learner score</span>
                </div>

                <div class="card" style="padding: 18px; border-left: 4px solid #8b5cf6;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Class Attendance</span>
                            <div style="font-size: 1.75rem; font-weight: 800; color: #7c3aed; margin-top: 4px;">
                                ${currentStudent.attendance || '96%'}
                            </div>
                        </div>
                        <span style="font-size: 1.5rem;">🔥</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">Present all week</span>
                </div>
            </div>

            <!-- Two Columns: Assigned Quizzes & Daily Vernacular Learning -->
            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: start;">
                <!-- Left Column: Active Quizzes -->
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <h3 class="heading-display" style="font-size: 1.25rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                            ${icons.clipboard} My Active Quizzes
                        </h3>
                        <button class="student-switch-tab-btn" data-target="quizzes" style="background: none; border: none; color: var(--color-primary); font-size: 0.8rem; font-weight: 700; cursor: pointer;">
                            View All (${assessments.length}) →
                        </button>
                    </div>

                    ${assessments.length === 0 ? `
                        <div class="card" style="padding: 30px; text-align: center;">
                            <p style="color: var(--color-text-muted);">No quizzes assigned yet for ${activeClass}.</p>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${assessments.slice(0, 3).map(asm => {
                                const sub = myQuizSubs.find(s => s.assessmentId === asm.id);
                                const isCompleted = !!sub;

                                return `
                                    <div class="card" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; gap: 16px; border-left: 4px solid ${isCompleted ? '#10b981' : '#f97316'};">
                                        <div>
                                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                                                <span class="badge ${asm.subject === 'Mathematics' ? 'badge-coral' : 'badge-emerald'}" style="font-size: 0.7rem;">
                                                    ${asm.subject}
                                                </span>
                                                <span style="font-size: 0.75rem; color: var(--color-text-muted);">Due: ${asm.dueDate}</span>
                                            </div>
                                            <h4 style="font-weight: 700; font-size: 1rem; margin: 0 0 4px 0;">${asm.title}</h4>
                                            <p style="font-size: 0.75rem; color: var(--color-text-muted); margin: 0;">
                                                ${asm.questions ? asm.questions.length : (asm.questionCount || 3)} Questions · Bilingual Support (${currentStudent.motherTongue})
                                            </p>
                                        </div>

                                        <div style="text-align: right; flex-shrink: 0;">
                                            ${isCompleted ? `
                                                <div style="margin-bottom: 6px;">
                                                    <span class="badge badge-emerald" style="font-size: 0.8rem; font-weight: 700;">
                                                        ✓ ${sub.score}%
                                                    </span>
                                                </div>
                                                <button class="role-btn take-quiz-btn" data-id="${asm.id}" style="padding: 6px 12px; font-size: 0.75rem;">
                                                    Review
                                                </button>
                                            ` : `
                                                <button class="btn-primary take-quiz-btn" data-id="${asm.id}" style="padding: 8px 16px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                                                    Start Quiz ${icons.arrowRight}
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}

                    <!-- Today's Lessons from Teacher Meera Hansda -->
                    <div style="margin-top: 24px;">
                        <h3 class="heading-display" style="font-size: 1.25rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            ${icons.book} Today's Class Schedule (${activeClass})
                        </h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${lessons.map(l => `
                                <div class="card" style="padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="padding: 8px 12px; background: var(--color-surface-alt); border-radius: 8px; font-weight: 700; font-size: 0.85rem; color: var(--color-text-main);">
                                            ${l.time}
                                        </div>
                                        <div>
                                            <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: ${l.color};">${l.subject}</span>
                                            <h5 style="margin: 0; font-size: 0.95rem; font-weight: 700;">${l.subtitle || l.title}</h5>
                                            <span style="font-size: 0.72rem; color: var(--color-text-muted);">Vernacular Bridge: ${l.vernacularBridge}</span>
                                        </div>
                                    </div>
                                    <span class="badge ${l.status === 'in progress' ? 'badge-coral' : 'badge-emerald'}" style="font-size: 0.7rem;">
                                        ${l.status}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Vernacular Word of the Day & Quick Doubt Box -->
                <div>
                    <!-- Word of the Day -->
                    <div class="card" style="padding: 20px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%); border: 1px solid rgba(245, 158, 11, 0.3); margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 0.7rem; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 0.08em;">
                                🌟 VERNACULAR WORD OF THE DAY
                            </span>
                            <span class="badge badge-amber" style="font-size: 0.65rem;">Santhali / Ol Chiki</span>
                        </div>

                        <div style="text-align: center; padding: 10px 0 16px 0;">
                            <div style="font-size: 2.2rem; font-weight: 800; color: #b45309; margin-bottom: 4px;">
                                ᱪᱟᱸᱫᱚ (Chando)
                            </div>
                            <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-main);">
                                Sun / सूरज / সূর্য
                            </div>
                            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 8px 0 14px 0;">
                                "ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ ᱛᱮ ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱡᱚᱢᱟᱜ ᱮ ᱛᱮᱭᱟᱨ-ᱟ"<br>
                                (Plants make food with sunlight)
                            </p>

                            <button id="listen-word-of-day" class="role-btn" style="margin: 0 auto; padding: 8px 16px; font-size: 0.8rem; font-weight: 700; color: #b45309; border-color: rgba(245, 158, 11, 0.4); background: white; display: inline-flex; align-items: center; gap: 6px;">
                                ${icons.volume} Listen Pronunciation
                            </button>
                        </div>
                    </div>

                    <!-- Ask Doubt Quick Card -->
                    <div class="card" style="padding: 20px;">
                        <h4 style="font-size: 1rem; font-weight: 700; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
                            ${icons.bulb} Have a doubt in class?
                        </h4>
                        <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0 0 14px 0;">
                            Type or speak your question in Santhali or Hindi. Your vernacular AI companion will explain simply!
                        </p>

                        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                            <input type="text" id="desk-quick-doubt-input" class="input-field" placeholder="e.g. 12 में से 5 आम घटाने पर कितने बचे?" style="font-size: 0.85rem;">
                            <button id="desk-quick-doubt-submit" class="btn-primary" style="padding: 8px 14px; font-size: 0.85rem; flex-shrink: 0;">
                                Ask
                            </button>
                        </div>

                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            <button class="doubt-suggestion-chip" data-q="पेड़ के पत्ते धूप से क्या बनाते हैं?">
                                🌿 Photosynthesis
                            </button>
                            <button class="doubt-suggestion-chip" data-q="घटाव का मतलब क्या होता है?">
                                🔢 Subtraction
                            </button>
                            <button class="doubt-suggestion-chip" data-q="सौरमंडल में कितने ग्रह हैं?">
                                🪐 Solar System
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. QUIZZES TAB (Interactive Test Taker)
    function renderQuizzesTab() {
        const myQuizSubs = api.getStudentSubmissions(currentStudent.id);

        return `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <h3 class="heading-display" style="font-size: 1.5rem; margin: 0;">Assigned Classroom Quizzes</h3>
                        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 4px 0 0 0;">
                            Interactive bilingual assessments prepared by Teacher Meera Hansda for ${activeClass}.
                        </p>
                    </div>

                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="font-size: 0.75rem; color: var(--color-text-muted);">
                            Solved: <strong>${myQuizSubs.length}</strong> / ${assessments.length}
                        </span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                    ${assessments.map(asm => {
                        const sub = myQuizSubs.find(s => s.assessmentId === asm.id);
                        const isCompleted = !!sub;

                        return `
                            <div class="card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid ${isCompleted ? '#10b981' : 'var(--color-primary)'};">
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                        <span class="badge ${asm.subject === 'Mathematics' ? 'badge-coral' : 'badge-emerald'}">
                                            ${asm.subject}
                                        </span>
                                        ${isCompleted ? `
                                            <span class="badge badge-emerald" style="font-weight: 700;">
                                                Score: ${sub.score}% (${sub.scoreFraction || 'Complete'})
                                            </span>
                                        ` : `
                                            <span class="badge badge-amber">Active Quiz</span>
                                        `}
                                    </div>

                                    <h4 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 8px 0;">${asm.title}</h4>
                                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 16px;">
                                        Topic: <strong>${asm.topic}</strong> · Questions: <strong>${asm.questions ? asm.questions.length : (asm.questionCount || 3)}</strong>
                                    </p>

                                    <div style="background: var(--color-surface-alt); padding: 10px 12px; border-radius: 8px; margin-bottom: 16px; font-size: 0.75rem; color: var(--color-text-muted);">
                                        <div>📅 Assigned: <strong>${asm.assignedDate}</strong></div>
                                        <div>⏰ Due by: <strong>${asm.dueDate}</strong></div>
                                        <div>🗣️ Support: <strong>${asm.language || 'Santhali & Hindi Bridge'}</strong></div>
                                        ${isCompleted ? `<div>🕒 Submitted: <strong>${sub.submittedAt}</strong></div>` : ''}
                                    </div>
                                </div>

                                <div>
                                    ${isCompleted ? `
                                        <div style="display: flex; gap: 8px;">
                                            <button class="role-btn take-quiz-btn" data-id="${asm.id}" style="flex: 1; padding: 10px; font-size: 0.85rem; font-weight: 700;">
                                                Retake / Practice
                                            </button>
                                        </div>
                                    ` : `
                                        <button class="btn-primary take-quiz-btn" data-id="${asm.id}" style="width: 100%; padding: 10px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                            Take Interactive Quiz ${icons.arrowRight}
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // 3. VOCABULARY TAB (Flashcards & Audio)
    function renderVocabTab() {
        return `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <h3 class="heading-display" style="font-size: 1.5rem; margin: 0;">Vernacular Word Bridge</h3>
                        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 4px 0 0 0;">
                            Classroom vocabulary with Ol Chiki script, Roman phonetics, and audio pronunciations for ${activeClass}.
                        </p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    ${vocabulary.map(v => `
                        <div class="card vocab-card" style="padding: 18px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border); transition: all 0.2s;">
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                    <span class="badge badge-emerald" style="font-size: 0.7rem;">${v.theme}</span>
                                    <button class="word-card-audio-btn role-btn" data-text="${v.vernacular} ${v.target}" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #10b981;" title="Listen word">
                                        ${icons.volume}
                                    </button>
                                </div>

                                <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-primary); margin-bottom: 4px;">
                                    ${v.script || v.vernacular}
                                </div>
                                <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 2px;">
                                    ${v.vernacular}
                                </div>
                                <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 8px;">
                                    Hindi: <strong>${v.target}</strong> · English: <strong>${v.english}</strong>
                                </div>
                                
                                <p style="font-size: 0.75rem; color: var(--color-text-muted); background: var(--color-surface-alt); padding: 8px; border-radius: 6px; margin: 0;">
                                    💡 <em>"${v.context}"</em>
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 4. ASK AI TUTOR TAB (Vernacular Voice Doubt Companion)
    function renderAskTab() {
        return `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--color-primary-light); color: var(--color-primary); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        ${icons.bulb}
                    </div>
                    <h3 class="heading-display" style="font-size: 1.75rem; margin: 0 0 6px 0;">Classroom Doubt Companion</h3>
                    <p style="font-size: 0.9rem; color: var(--color-text-muted); margin: 0;">
                        Ask any question in Santhali, Hindi, or English. Your tutor will respond with simplified explanations and audio!
                    </p>
                </div>

                <!-- Input Box -->
                <div class="card" style="padding: 20px; margin-bottom: 24px;">
                    <div style="display: flex; gap: 10px; margin-bottom: 14px;">
                        <input type="text" id="tutor-doubt-input" class="input-field" placeholder="Ask your question here... (e.g. पेड़ खाना कैसे बनाते हैं? / ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱛᱮ ᱡᱚᱢᱟᱜ ᱛᱮᱭᱟᱨ-ᱟ?)" style="font-size: 0.95rem; padding: 12px 16px;">
                        <button id="tutor-doubt-mic" class="role-btn" style="padding: 12px 16px; border-color: rgba(244, 63, 94, 0.4); color: #f43f5e; background: rgba(244, 63, 94, 0.08);" title="Speak question">
                            ${icons.mic}
                        </button>
                        <button id="tutor-doubt-ask-btn" class="btn-primary" style="padding: 12px 20px; font-weight: 700; flex-shrink: 0;">
                            Ask Tutor
                        </button>
                    </div>

                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Sample Questions:</span>
                        <button class="tutor-sample-chip doubt-suggestion-chip" data-q="पेड़ के पत्ते धूप से क्या बनाते हैं?">
                            🌿 How leaves make food
                        </button>
                        <button class="tutor-sample-chip doubt-suggestion-chip" data-q="12 में से 5 आम कम करने पर कितने बचे?">
                            🔢 Subtraction story problem
                        </button>
                        <button class="tutor-sample-chip doubt-suggestion-chip" data-q="सूरज और 8 ग्रह क्या होते हैं?">
                            🪐 Solar system & Earth
                        </button>
                        <button class="tutor-sample-chip doubt-suggestion-chip" data-q="पानी से बादल कैसे बनते हैं?">
                            🌧️ Water cycle & Rain
                        </button>
                    </div>
                </div>

                <!-- Tutor Answer Mount Point -->
                <div id="tutor-answer-box" style="display: none;"></div>
            </div>
        `;
    }

    // 5. WORD MATCH MINI-GAME TAB
    function renderGameTab() {
        return `
            <div style="max-width: 800px; margin: 0 auto;">
                <div class="card" style="padding: 24px; text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 0.72rem; font-weight: 700; color: #10b981; letter-spacing: 0.1em; text-transform: uppercase;">VERNACULAR PRACTICE GAME</span>
                    <h3 class="heading-display" style="font-size: 1.75rem; margin: 8px 0;">Tribal Word Matcher</h3>
                    <p style="font-size: 0.9rem; color: var(--color-text-muted); margin: 0 0 16px 0;">
                        Click a Santhali / Ol Chiki word on the left, then click its matching Hindi/English meaning on the right!
                    </p>

                    <div style="display: inline-flex; align-items: center; gap: 20px; background: var(--color-surface-alt); padding: 8px 20px; border-radius: 99px; margin-bottom: 20px;">
                        <span>⭐ Score: <strong id="game-score-display">0</strong></span>
                        <span>🔥 Streak: <strong id="game-streak-display">0</strong></span>
                    </div>

                    <!-- Game Match Columns -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 0 auto; text-align: left;">
                        <!-- Left Column: Vernacular terms -->
                        <div id="game-left-col" style="display: flex; flex-direction: column; gap: 10px;"></div>
                        <!-- Right Column: Meanings -->
                        <div id="game-right-col" style="display: flex; flex-direction: column; gap: 10px;"></div>
                    </div>

                    <div style="margin-top: 24px;">
                        <button id="game-new-round-btn" class="role-btn" style="padding: 8px 20px; font-weight: 700; margin: 0 auto;">
                            🔄 New Round
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 6. BADGES TAB
    function renderBadgesTab() {
        const badges = [
            { icon: '🏅', title: 'Ol Chiki Pioneer', desc: 'Mastered 10+ tribal vocabulary terms in authentic script', unlocked: true, color: '#f59e0b' },
            { icon: '🌟', title: 'Math Story Wizard', desc: 'Solved story subtraction problems with vernacular bridge', unlocked: true, color: '#3b82f6' },
            { icon: '🌿', title: 'Forest & Wildlife Scout', desc: 'Identified local trees, birds and river habitats in EVS', unlocked: true, color: '#10b981' },
            { icon: '🎯', title: '100% Quiz Accuracy', desc: 'Scored full marks on an assessment in their mother tongue', unlocked: true, color: '#8b5cf6' },
            { icon: '🔥', title: 'Weekly Learning Streak', desc: 'Logged in and practiced lessons 5 consecutive school days', unlocked: true, color: '#ef4444' },
            { icon: '🗣️', title: 'Bilingual Orator', desc: 'Used voice speech assistant to answer questions in class', unlocked: false, color: '#64748b' }
        ];

        return `
            <div>
                <div style="margin-bottom: 20px;">
                    <h3 class="heading-display" style="font-size: 1.5rem; margin: 0;">My Learning Badges & Progress</h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 4px 0 0 0;">
                        Achievements earned by ${currentStudent.name} in classroom vernacular learning.
                    </p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 28px;">
                    ${badges.map(b => `
                        <div class="card" style="padding: 20px; border-top: 4px solid ${b.color}; opacity: ${b.unlocked ? '1' : '0.6'};">
                            <div style="font-size: 2.25rem; margin-bottom: 10px;">${b.icon}</div>
                            <h4 style="font-size: 1.05rem; font-weight: 700; margin: 0 0 6px 0; color: var(--color-text-main);">
                                ${b.title} ${b.unlocked ? `<span style="font-size: 0.7rem; color: #10b981; font-weight: 700;">✓ UNLOCKED</span>` : `<span style="font-size: 0.7rem; color: #94a3b8; font-weight: 700;">LOCKED</span>`}
                            </h4>
                            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0;">${b.desc}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Subject Mastery Breakdown -->
                <div class="card" style="padding: 24px;">
                    <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0 0 16px 0;">Classroom Subject Comprehension</h4>
                    <div style="display: flex; flex-direction: column; gap: 14px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Mathematics (Story Problems & Counting)</span>
                                <span style="color: #10b981;">88%</span>
                            </div>
                            <div style="height: 8px; background: var(--color-surface-alt); border-radius: 99px; overflow: hidden;">
                                <div style="height: 100%; width: 88%; background: #10b981; border-radius: 99px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Environmental Studies (Forests, Animals, Water)</span>
                                <span style="color: #3b82f6;">92%</span>
                            </div>
                            <div style="height: 8px; background: var(--color-surface-alt); border-radius: 99px; overflow: hidden;">
                                <div style="height: 100%; width: 92%; background: #3b82f6; border-radius: 99px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                                <span>Language & Vernacular Folk Stories</span>
                                <span style="color: #8b5cf6;">95%</span>
                            </div>
                            <div style="height: 8px; background: var(--color-surface-alt); border-radius: 99px; overflow: hidden;">
                                <div style="height: 100%; width: 95%; background: #8b5cf6; border-radius: 99px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // INTERACTIVE QUIZ MODAL
    function openQuizModal(assessmentId) {
        const targetAsm = assessments.find(a => a.id === assessmentId);
        if (!targetAsm) return;

        activeQuiz = targetAsm;
        quizCurrentIndex = 0;
        quizSelectedAnswers = {};

        const questions = activeQuiz.questions && activeQuiz.questions.length > 0 ? activeQuiz.questions : [
            {
                qText: `If 18 earthen pots were made in the village and 8 were sold, how many pots are still on the stall?`,
                vernacularText: `ᱦᱟᱴ ᱨᱮ ᱑᱘ ᱜᱚᱴᱟᱝ ᱴᱩᱠᱩᱡ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ, ᱘ ᱜᱚᱴᱟᱝ ᱠᱚ ᱟᱹᱠᱷᱨᱤᱧ ᱠᱮᱫᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ? (18 - 8 = 10 Bhegar / Saréj)`,
                options: ['10 pots (᱑᱐ ᱴᱩᱠᱩᱡ)', '12 pots (᱑᱒ ᱴᱩᱠᱩᱡ)', '8 pots (᱘ ᱴᱩᱠᱩᱡ)', '14 pots (᱑᱔ ᱴᱩᱠᱩᱡ)'],
                correctIndex: 0,
                explanation: '18 minus 8 leaves 10 pots. In vernacular: Bhegar lekha.'
            },
            {
                qText: `Which natural resource from the forest ("Bir") gives shade and clean air to our village?`,
                vernacularText: `ᱵᱤᱨ ᱠᱷᱚᱱ ᱟᱵᱚ ᱟᱹᱛᱩ ᱨᱮ ᱪᱮᱫ ᱡᱤᱱᱤᱥ ᱩᱢᱩᱞ ᱟᱨ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱮ ᱮᱢᱟᱵᱚᱱᱟ? (Forest Trees / Dare)`,
                options: ['Green Trees (ᱫᱟᱨᱮ / Dare)', 'Dusty Road', 'Smoke', 'Plastic'],
                correctIndex: 0,
                explanation: 'Trees (Dare) give oxygen, fruits and shelter to birds and animals.'
            }
        ];

        renderQuizModalContent(questions);
    }

    function renderQuizModalContent(questions) {
        const modalContainer = document.getElementById('student-quiz-modal-container');
        if (!modalContainer) return;

        const q = questions[quizCurrentIndex];
        const isLastQuestion = quizCurrentIndex === questions.length - 1;
        const selectedOpt = quizSelectedAnswers[quizCurrentIndex];

        modalContainer.innerHTML = `
            <div class="modal-overlay open" id="active-quiz-modal">
                <div class="modal-box" style="max-width: 680px; padding: 28px; border-radius: var(--radius-xl);">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--color-border); padding-bottom: 12px;">
                        <div>
                            <span class="badge badge-coral">${activeQuiz.subject} · ${activeQuiz.class}</span>
                            <h3 style="margin: 4px 0 0 0; font-size: 1.25rem; font-weight: 800;">${activeQuiz.title}</h3>
                        </div>
                        <button id="close-quiz-modal-btn" style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface-alt); border: 1px solid var(--color-border); cursor: pointer;">✕</button>
                    </div>

                    <!-- Progress Indicator -->
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 8px;">
                        <span>Question <strong>${quizCurrentIndex + 1}</strong> of <strong>${questions.length}</strong></span>
                        <span>⭐ Student: <strong>${currentStudent.name}</strong></span>
                    </div>
                    <div style="height: 6px; background: var(--color-surface-alt); border-radius: 99px; margin-bottom: 20px; overflow: hidden;">
                        <div style="height: 100%; width: ${((quizCurrentIndex + 1) / questions.length) * 100}%; background: var(--color-primary); transition: width 0.3s;"></div>
                    </div>

                    <!-- Question Display -->
                    <div style="background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                            <h4 style="font-size: 1.1rem; font-weight: 700; line-height: 1.4; margin: 0 0 10px 0;">
                                ${q.qText}
                            </h4>
                            <button id="quiz-tts-btn" class="role-btn" style="padding: 6px 10px; font-size: 0.75rem; border-color: #10b981; color: #10b981; flex-shrink: 0;" title="Listen question">
                                ${icons.volume} Listen
                            </button>
                        </div>

                        ${q.vernacularText ? `
                            <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 6px; font-size: 0.95rem; color: var(--color-text-main);">
                                <span style="font-size: 0.7rem; font-weight: 700; color: #059669; display: block; margin-bottom: 2px;">VERNACULAR BRIDGE (SANTHALI / OL CHIKI):</span>
                                ${q.vernacularText}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Options Grid -->
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
                        ${q.options.map((opt, i) => {
                            const isSelected = selectedOpt === i;
                            return `
                                <div class="quiz-option-card ${isSelected ? 'selected' : ''}" data-index="${i}" style="padding: 14px 18px; border: 2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}; background: ${isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)'}; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="width: 26px; height: 26px; border-radius: 50%; background: ${isSelected ? 'var(--color-primary)' : 'var(--color-surface-alt)'}; color: ${isSelected ? 'white' : 'var(--color-text-muted)'}; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">
                                            ${String.fromCharCode(65 + i)}
                                        </span>
                                        <span style="font-size: 0.95rem; font-weight: 600; color: var(--color-text-main);">
                                            ${opt}
                                        </span>
                                    </div>
                                    ${isSelected ? `<span style="color: var(--color-primary); font-weight: 700;">✓</span>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <button id="quiz-prev-btn" class="role-btn" style="padding: 10px 18px; font-size: 0.85rem;" ${quizCurrentIndex === 0 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>
                            ← Previous
                        </button>

                        ${isLastQuestion ? `
                            <button id="quiz-submit-btn" class="btn-primary" style="padding: 10px 24px; font-size: 0.9rem; font-weight: 700;">
                                Submit Quiz to Teacher ✓
                            </button>
                        ` : `
                            <button id="quiz-next-btn" class="btn-primary" style="padding: 10px 24px; font-size: 0.9rem; font-weight: 700;">
                                Next Question →
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Bind Quiz Controls
        const modal = modalContainer.querySelector('#active-quiz-modal');
        const closeBtn = modal.querySelector('#close-quiz-modal-btn');
        const ttsBtn = modal.querySelector('#quiz-tts-btn');
        const optionCards = modal.querySelectorAll('.quiz-option-card');
        const nextBtn = modal.querySelector('#quiz-next-btn');
        const prevBtn = modal.querySelector('#quiz-prev-btn');
        const submitBtn = modal.querySelector('#quiz-submit-btn');

        closeBtn.addEventListener('click', () => {
            stopSpeech();
            modalContainer.innerHTML = '';
        });

        ttsBtn.addEventListener('click', () => {
            const speechText = `${q.qText}. ${q.vernacularText || ''}`;
            playTTS(speechText, 'hi-IN');
        });

        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                const optIndex = parseInt(card.getAttribute('data-index'));
                quizSelectedAnswers[quizCurrentIndex] = optIndex;
                renderQuizModalContent(questions);
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (quizSelectedAnswers[quizCurrentIndex] === undefined) {
                    showToast('Select an answer', 'Please choose an option before continuing', 'warning');
                    return;
                }
                quizCurrentIndex++;
                renderQuizModalContent(questions);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (quizCurrentIndex > 0) {
                    quizCurrentIndex--;
                    renderQuizModalContent(questions);
                }
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                if (quizSelectedAnswers[quizCurrentIndex] === undefined) {
                    showToast('Select an answer', 'Please answer the final question before submitting', 'warning');
                    return;
                }

                // Calculate Score
                let correctCount = 0;
                questions.forEach((question, idx) => {
                    const ans = quizSelectedAnswers[idx];
                    const correctIdx = question.correctIndex !== undefined ? question.correctIndex : 0;
                    if (ans === correctIdx) correctCount++;
                });

                const scorePercentage = Math.round((correctCount / questions.length) * 100);

                // Submit to API
                await api.submitAssessment({
                    assessmentId: activeQuiz.id,
                    studentId: currentStudent.id,
                    studentName: currentStudent.name,
                    roll: currentStudent.roll,
                    className: currentStudent.class,
                    motherTongue: currentStudent.motherTongue,
                    score: scorePercentage,
                    scoreFraction: `${correctCount}/${questions.length}`,
                    usedVernacularBridge: true,
                    answers: quizSelectedAnswers
                });

                showToast('Quiz Submitted!', `Saved to Teacher Meera Hansda's Gradebook`, 'success');
                renderQuizCelebrationModal(scorePercentage, correctCount, questions.length);
            });
        }
    }

    function renderQuizCelebrationModal(score, correct, total) {
        const modalContainer = document.getElementById('student-quiz-modal-container');
        if (!modalContainer) return;

        const starsCount = score >= 80 ? '⭐⭐⭐' : (score >= 50 ? '⭐⭐' : '⭐');

        modalContainer.innerHTML = `
            <div class="modal-overlay open">
                <div class="modal-box" style="max-width: 520px; text-align: center; padding: 36px 28px; border-radius: var(--radius-xl);">
                    <div style="font-size: 3.5rem; margin-bottom: 8px;">🎉</div>
                    <div style="font-size: 2rem; margin-bottom: 6px;">${starsCount}</div>
                    <h3 class="heading-display" style="font-size: 1.85rem; margin: 0 0 6px 0; color: #059669;">
                        Adi Bes! (Excellent!)
                    </h3>
                    <p style="font-size: 1rem; color: var(--color-text-main); margin-bottom: 16px;">
                        You scored <strong>${score}%</strong> (${correct} of ${total} correct)!
                    </p>

                    <div style="background: var(--color-surface-alt); padding: 14px; border-radius: 12px; margin-bottom: 24px; font-size: 0.85rem; color: var(--color-text-muted);">
                        "ᱡᱚᱛᱚ ᱠᱩᱠᱞᱤ ᱵᱮᱥ ᱛᱮ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱟᱛᱮ ᱮᱢ ᱠᱮᱫᱟ! Your answers have been synchronized with Teacher Meera Hansda's class dashboard."
                    </div>

                    <button id="finish-quiz-celebration" class="btn-primary" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 700;">
                        Return to My Desk
                    </button>
                </div>
            </div>
        `;

        const finishBtn = modalContainer.querySelector('#finish-quiz-celebration');
        finishBtn.addEventListener('click', () => {
            modalContainer.innerHTML = '';
            renderStudentPanel(container); // Re-render to show updated stats
        });
    }

    // GAME INITIALIZATION
    function initGame() {
        const gameLeftCol = container.querySelector('#game-left-col');
        const gameRightCol = container.querySelector('#game-right-col');
        const scoreDisplay = container.querySelector('#game-score-display');
        const streakDisplay = container.querySelector('#game-streak-display');
        const newRoundBtn = container.querySelector('#game-new-round-btn');

        if (!gameLeftCol || !gameRightCol) return;

        let score = 0;
        let streak = 0;
        let selectedLeft = null;
        let selectedRight = null;

        const allPairs = [
            { id: 1, term: 'ᱪᱟᱸᱫᱚ (Chando)', meaning: 'Sun / सूरज' },
            { id: 2, term: 'ᱫᱟᱨᱮ (Dare)', meaning: 'Tree / पेड़' },
            { id: 3, term: 'ᱫᱟᱜ (Dah)', meaning: 'Water / पानी' },
            { id: 4, term: 'ᱵᱷᱮᱜᱟᱨ (Bhegar)', meaning: 'Subtract / घटाना' },
            { id: 5, term: 'ᱥᱟᱠᱟᱢ (Sakam)', meaning: 'Leaves / पत्ते' },
            { id: 6, term: 'ᱞᱮᱠᱷᱟ (Lekha)', meaning: 'Count / गिनती' }
        ];

        function loadRound() {
            const shuffledPairs = [...allPairs].sort(() => 0.5 - Math.random()).slice(0, 4);
            const leftItems = [...shuffledPairs].sort(() => 0.5 - Math.random());
            const rightItems = [...shuffledPairs].sort(() => 0.5 - Math.random());

            selectedLeft = null;
            selectedRight = null;

            gameLeftCol.innerHTML = leftItems.map(item => `
                <button class="game-btn game-left-btn role-btn" data-id="${item.id}" style="padding: 12px 16px; font-size: 0.9rem; font-weight: 700; width: 100%; text-align: left; justify-content: flex-start;">
                    ${item.term}
                </button>
            `).join('');

            gameRightCol.innerHTML = rightItems.map(item => `
                <button class="game-btn game-right-btn role-btn" data-id="${item.id}" style="padding: 12px 16px; font-size: 0.9rem; font-weight: 600; width: 100%; text-align: left; justify-content: flex-start;">
                    ${item.meaning}
                </button>
            `).join('');

            bindGameListeners();
        }

        function bindGameListeners() {
            const leftBtns = gameLeftCol.querySelectorAll('.game-left-btn');
            const rightBtns = gameRightCol.querySelectorAll('.game-right-btn');

            leftBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    leftBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedLeft = btn.getAttribute('data-id');
                    checkMatch();
                });
            });

            rightBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    rightBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedRight = btn.getAttribute('data-id');
                    checkMatch();
                });
            });
        }

        function checkMatch() {
            if (selectedLeft && selectedRight) {
                if (selectedLeft === selectedRight) {
                    // Match!
                    score += 10;
                    streak += 1;
                    scoreDisplay.innerText = score;
                    streakDisplay.innerText = streak;
                    showToast('Correct Match! ⭐', '+10 Points', 'success');

                    const matchedLeft = gameLeftCol.querySelector(`.game-left-btn[data-id="${selectedLeft}"]`);
                    const matchedRight = gameRightCol.querySelector(`.game-right-btn[data-id="${selectedRight}"]`);

                    if (matchedLeft) {
                        matchedLeft.style.background = '#dcfce7';
                        matchedLeft.style.borderColor = '#10b981';
                        matchedLeft.style.color = '#047857';
                        matchedLeft.disabled = true;
                    }
                    if (matchedRight) {
                        matchedRight.style.background = '#dcfce7';
                        matchedRight.style.borderColor = '#10b981';
                        matchedRight.style.color = '#047857';
                        matchedRight.disabled = true;
                    }

                    selectedLeft = null;
                    selectedRight = null;

                    // Check if all matched
                    const remaining = gameLeftCol.querySelectorAll('.game-left-btn:not([disabled])');
                    if (remaining.length === 0) {
                        setTimeout(() => {
                            showToast('Round Cleared! 🏆', 'Great vernacular matching!', 'info');
                            loadRound();
                        }, 800);
                    }
                } else {
                    // Miss
                    streak = 0;
                    streakDisplay.innerText = streak;
                    showToast('Try again', 'The meanings did not match', 'warning');
                    setTimeout(() => {
                        gameLeftCol.querySelectorAll('.game-left-btn').forEach(b => b.classList.remove('active'));
                        gameRightCol.querySelectorAll('.game-right-btn').forEach(b => b.classList.remove('active'));
                        selectedLeft = null;
                        selectedRight = null;
                    }, 400);
                }
            }
        }

        newRoundBtn.addEventListener('click', loadRound);
        loadRound();
    }

    // EVENT BINDINGS
    function bindEvents() {
        // Tab switching
        const tabBtns = container.querySelectorAll('.student-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                if (targetTab) {
                    activeTab = targetTab;
                    window.location.hash = `#/student?tab=${targetTab}`;
                    renderView();
                }
            });
        });

        // Switch to teacher
        const switchTeacherBtn = container.querySelector('#quick-switch-teacher-btn');
        if (switchTeacherBtn) {
            switchTeacherBtn.addEventListener('click', () => {
                api.setRole('Teacher');
                showToast('Switched to Teacher', 'Returning to Teacher Meera Hansda workspace', 'info');
                window.location.hash = '#/dashboard';
            });
        }

        // Switch student select
        const studentSelect = container.querySelector('#switch-student-select');
        if (studentSelect) {
            studentSelect.addEventListener('click', (e) => e.stopPropagation());
            studentSelect.addEventListener('change', async (e) => {
                const targetId = e.target.value;
                const found = allStudents.find(s => s.id === targetId);
                if (found) {
                    api.setCurrentStudent(found);
                    showToast('Student Changed', `Now viewing as ${found.name} (${found.class})`, 'success');
                    renderStudentPanel(container);
                }
            });
        }

        // Greeting voice button
        const greetingAudioBtn = container.querySelector('#student-listen-greeting');
        if (greetingAudioBtn) {
            greetingAudioBtn.addEventListener('click', () => {
                playTTS(greeting.audio, 'hi-IN');
            });
        }

        // Switch tab helpers (buttons inside desk view)
        const switchTabBtns = container.querySelectorAll('.student-switch-tab-btn');
        switchTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                if (target) {
                    activeTab = target;
                    window.location.hash = `#/student?tab=${target}`;
                    renderView();
                }
            });
        });

        // Take Quiz Buttons
        const quizBtns = container.querySelectorAll('.take-quiz-btn');
        quizBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const qId = btn.getAttribute('data-id');
                openQuizModal(qId);
            });
        });

        // Word of the day audio
        const wordOfDayBtn = container.querySelector('#listen-word-of-day');
        if (wordOfDayBtn) {
            wordOfDayBtn.addEventListener('click', () => {
                playTTS('Chando, Suraj, Dhup se dare sakam jomak toiri-a', 'hi-IN');
            });
        }

        // Vocabulary audio buttons
        const vocabAudioBtns = container.querySelectorAll('.word-card-audio-btn');
        vocabAudioBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const txt = btn.getAttribute('data-text');
                if (txt) playTTS(txt, 'hi-IN');
            });
        });

        // Desk quick doubt input
        const deskDoubtInput = container.querySelector('#desk-quick-doubt-input');
        const deskDoubtSubmit = container.querySelector('#desk-quick-doubt-submit');
        if (deskDoubtSubmit && deskDoubtInput) {
            deskDoubtSubmit.addEventListener('click', () => {
                const q = deskDoubtInput.value.trim();
                if (q) {
                    activeTab = 'ask';
                    window.location.hash = '#/student?tab=ask';
                    renderView();
                    handleAskTutor(q);
                }
            });
        }

        // Doubt suggestion chips
        const doubtChips = container.querySelectorAll('.doubt-suggestion-chip');
        doubtChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const q = chip.getAttribute('data-q');
                if (q) {
                    if (activeTab !== 'ask') {
                        activeTab = 'ask';
                        window.location.hash = '#/student?tab=ask';
                        renderView();
                    }
                    handleAskTutor(q);
                }
            });
        });

        // Ask Tab Controls
        const tutorInput = container.querySelector('#tutor-doubt-input');
        const tutorAskBtn = container.querySelector('#tutor-doubt-ask-btn');
        const tutorMicBtn = container.querySelector('#tutor-doubt-mic');

        if (tutorAskBtn && tutorInput) {
            tutorAskBtn.addEventListener('click', () => {
                const q = tutorInput.value.trim();
                if (q) handleAskTutor(q);
            });
            tutorInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const q = tutorInput.value.trim();
                    if (q) handleAskTutor(q);
                }
            });
        }

        if (tutorMicBtn && tutorInput) {
            tutorMicBtn.addEventListener('click', () => {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                    showToast('Speech Not Supported', 'Speech recognition is not supported in this browser.', 'warning');
                    return;
                }

                if (isListening) {
                    try { recognitionInstance.stop(); } catch(e) {}
                    isListening = false;
                    tutorMicBtn.style.background = 'rgba(244, 63, 94, 0.08)';
                    return;
                }

                try {
                    recognitionInstance = new SpeechRecognition();
                    recognitionInstance.lang = 'hi-IN';
                    recognitionInstance.interimResults = false;

                    recognitionInstance.onstart = () => {
                        isListening = true;
                        tutorMicBtn.style.background = '#fee2e2';
                        showToast('Listening...', 'Speak your question clearly', 'info');
                    };

                    recognitionInstance.onresult = (ev) => {
                        const transcript = ev.results[0][0].transcript;
                        if (transcript) {
                            tutorInput.value = transcript;
                            handleAskTutor(transcript);
                        }
                    };

                    recognitionInstance.onend = () => {
                        isListening = false;
                        tutorMicBtn.style.background = 'rgba(244, 63, 94, 0.08)';
                    };

                    recognitionInstance.start();
                } catch(err) {
                    showToast('Mic Error', 'Could not open microphone', 'warning');
                }
            });
        }

        // Initialize game if on game tab
        if (activeTab === 'game') {
            initGame();
        }
    }

    async function handleAskTutor(question) {
        const answerBox = container.querySelector('#tutor-answer-box');
        const tutorInput = container.querySelector('#tutor-doubt-input');
        if (tutorInput) tutorInput.value = question;
        if (!answerBox) return;

        answerBox.style.display = 'block';
        answerBox.innerHTML = `
            <div class="card" style="padding: 24px; text-align: center;">
                <div style="font-size: 1.5rem; animation: pulse 0.8s infinite;">✦</div>
                <p style="color: var(--color-text-muted); margin: 8px 0 0 0;">Thinking in ${currentStudent.motherTongue}...</p>
            </div>
        `;

        try {
            const result = await api.answerStudentDoubt({
                question,
                studentLanguage: currentStudent.motherTongue,
                className: currentStudent.class
            });

            answerBox.innerHTML = `
                <div class="card" style="padding: 24px; border-left: 4px solid #10b981; animation: fadeIn 0.3s;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <span class="badge badge-emerald">Vernacular AI Explanation</span>
                        <button id="tutor-speak-answer-btn" class="role-btn" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 700; color: #10b981; border-color: rgba(16, 185, 129, 0.4); display: flex; align-items: center; gap: 6px;">
                            ${icons.volume} Listen Answer
                        </button>
                    </div>

                    <div style="font-size: 1.05rem; line-height: 1.6; color: var(--color-text-main); margin-bottom: 16px;">
                        ${result.answer}
                    </div>

                    ${result.scriptDisplay ? `
                        <div style="background: rgba(16, 185, 129, 0.08); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                            <span style="font-size: 0.7rem; font-weight: 700; color: #059669; text-transform: uppercase; display: block; margin-bottom: 4px;">
                                SANTHALI / TRIBAL VERNACULAR BRIDGE:
                            </span>
                            <div style="font-size: 1.25rem; font-weight: 800; color: #065f46; margin-bottom: 4px;">
                                ${result.scriptDisplay}
                            </div>
                        </div>
                    ` : ''}

                    ${result.vocabulary && result.vocabulary.length > 0 ? `
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 8px;">
                            Key Learning Vocabulary:
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${result.vocabulary.map(v => `
                                <span class="badge" style="background: var(--color-surface-alt); border: 1px solid var(--color-border); font-size: 0.8rem; padding: 4px 10px;">
                                    <strong>${v.word}</strong> = ${v.meaning}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

            const speakBtn = answerBox.querySelector('#tutor-speak-answer-btn');
            if (speakBtn) {
                speakBtn.addEventListener('click', () => {
                    const speechText = result.vernacularAudioText ? `${result.answer}. ${result.vernacularAudioText}` : result.answer;
                    playTTS(speechText, 'hi-IN');
                });
            }
        } catch(e) {
            console.error(e);
            answerBox.innerHTML = `<div class="card" style="padding: 16px; color: #dc2626;">Failed to generate answer. Please try again.</div>`;
        }
    }

    renderView();
}
