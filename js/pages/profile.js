import { createSidebar, createHeader, bindHeaderClassSwitcher, icons, showToast } from '../components.js';
import { api } from '../api.js';

export async function renderProfile(container) {
    let activeClass = api.getActiveClass();
    const user = await api.getUser();

    async function loadAndRender() {
        container.innerHTML = `
            <div class="app-shell">
                ${createSidebar('profile')}
                
                <div class="main-wrapper">
                    ${createHeader(user, ['Teacher workspace', 'Profile & Settings'])}
                    
                    <main class="dashboard-content">
                        <!-- Top Header -->
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-primary); letter-spacing: 0.1em; text-transform: uppercase;">EDUCATOR PROFILE</span>
                                <h2 class="heading-display" style="font-size: 2rem; margin-top: 4px;">
                                    ${user.name}
                                </h2>
                                <p style="color: var(--color-text-muted); font-size: 0.875rem;">${user.title} · ${user.school} (${user.district})</p>
                            </div>
                            <div>
                                <span class="badge badge-emerald">Verified Teacher Profile</span>
                            </div>
                        </div>

                        <!-- Stats Banner -->
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
                            <div class="card" style="padding: 18px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Total Learners</span>
                                <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-primary); margin-top: 4px;">
                                    ${user.totalStudents}
                                </div>
                                <span style="font-size: 0.75rem; color: var(--color-text-muted);">Across Class 3, 4 & 5</span>
                            </div>
                            <div class="card" style="padding: 18px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Assigned Assessments</span>
                                <div style="font-size: 1.75rem; font-weight: 800; color: #059669; margin-top: 4px;">
                                    ${user.assessmentsAssigned}
                                </div>
                                <span style="font-size: 0.75rem; color: #059669; font-weight: 600;">Active & completed</span>
                            </div>
                            <div class="card" style="padding: 18px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Classroom Translations</span>
                                <div style="font-size: 1.75rem; font-weight: 800; color: #0284c7; margin-top: 4px;">
                                    ${user.translationsMade}
                                </div>
                                <span style="font-size: 0.75rem; color: var(--color-text-muted);">Bridged vernacular concepts</span>
                            </div>
                            <div class="card" style="padding: 18px;">
                                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Platform Journey</span>
                                <div style="font-size: 1.25rem; font-weight: 800; color: #7c3aed; margin-top: 8px;">
                                    SIH 2026
                                </div>
                                <span style="font-size: 0.75rem; color: var(--color-text-muted);">Active since ${user.activeSince}</span>
                            </div>
                        </div>

                        <!-- Profile Information Form -->
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                            <div class="card">
                                <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 20px;">Educator & Classroom Settings</h3>
                                
                                <form id="profile-edit-form" class="flex flex-col gap-4">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                        <div>
                                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Full Name</label>
                                            <input type="text" id="prof-name" class="input-field" value="${user.name}" required>
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Role / Title</label>
                                            <input type="text" id="prof-title" class="input-field" value="${user.title}" required>
                                        </div>
                                    </div>

                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                        <div>
                                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">School Name</label>
                                            <input type="text" id="prof-school" class="input-field" value="${user.school}" required>
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">District / State</label>
                                            <input type="text" id="prof-district" class="input-field" value="${user.district}" required>
                                        </div>
                                    </div>

                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Primary Vernacular Mother Tongue</label>
                                        <select id="prof-mother-tongue" class="input-field">
                                            <option selected>Santhali (Ol Chiki / Roman script)</option>
                                            <option>Bengali (বাংলা)</option>
                                            <option>Hindi (हिंदी)</option>
                                            <option>Odia (ଓଡ଼ିଆ)</option>
                                            <option>Gondi</option>
                                            <option>Kudmali</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: 6px; text-transform: uppercase;">Assigned Classes in Session</label>
                                        <div style="display: flex; gap: 12px; margin-top: 4px;">
                                            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600;">
                                                <input type="checkbox" checked disabled> Class 3
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600;">
                                                <input type="checkbox" checked disabled> Class 4
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600;">
                                                <input type="checkbox" checked disabled> Class 5
                                            </label>
                                        </div>
                                    </div>

                                    <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
                                        <button type="submit" class="btn-primary" style="padding: 10px 24px;">
                                            ${icons.check} Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Right Column: Settings & Quick Links -->
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                <div class="card">
                                    <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;">Speech & Audio Synthesis</h4>
                                    <p style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.4; margin-bottom: 16px;">
                                        Native Web Speech synthesis is enabled for real-time classroom pronunciation playback.
                                    </p>
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                        <label style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600;">
                                            <span>Speech Rate (0.9x Slow)</span>
                                            <input type="checkbox" checked>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600;">
                                            <span>Auto-play Ol Chiki Audio</span>
                                            <input type="checkbox" checked>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600;">
                                            <span>Simplified Classroom Vocabulary</span>
                                            <input type="checkbox" checked>
                                        </label>
                                    </div>
                                </div>

                                <div class="card" style="background: var(--color-surface-alt);">
                                    <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">Quick Shortcuts</h4>
                                    <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
                                        <li><a href="#/translate" style="color: var(--color-primary); font-weight: 600;">→ Open Translate & Speech</a></li>
                                        <li><a href="#/assessment" style="color: var(--color-primary); font-weight: 600;">→ Assessment Generator</a></li>
                                        <li><a href="#/learn" style="color: var(--color-primary); font-weight: 600;">→ Classwise Learning Hub</a></li>
                                        <li><a href="#/students" style="color: var(--color-primary); font-weight: 600;">→ Student Comprehension Roster</a></li>
                                        <li><a href="#/setup" style="color: var(--color-text-muted);">→ Reset to Welcome Screen</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;

        bindHeaderClassSwitcher((newClass) => {
            activeClass = newClass;
            loadAndRender();
        });

        const form = container.querySelector('#profile-edit-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newName = container.querySelector('#prof-name').value;
                const newTitle = container.querySelector('#prof-title').value;
                const newSchool = container.querySelector('#prof-school').value;
                const newDistrict = container.querySelector('#prof-district').value;
                const motherTongue = container.querySelector('#prof-mother-tongue').value;

                await api.updateUser({
                    name: newName,
                    title: newTitle,
                    school: newSchool,
                    district: newDistrict,
                    primaryMotherTongue: motherTongue
                });

                showToast('Profile Saved', 'Educator preferences updated successfully.', 'success');
                loadAndRender();
            });
        }
    }

    await loadAndRender();
}
