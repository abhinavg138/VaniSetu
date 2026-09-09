import { icons } from '../components.js';

export function renderOnboarding(container) {
    container.innerHTML = `
        <div class="split-layout">
            <section class="hero-banner">
                <div class="brand-logo mb-6">
                    <div class="logo-box">${icons.translate}</div>
                    <span style="font-size: 1.5rem; font-weight: 700;">Vani Setu</span>
                </div>
                
                <div class="hero-content" style="margin: auto 0;">
                    <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: var(--color-accent); text-transform: uppercase; margin-bottom: 16px; display: block;">SMART INDIA HACKATHON 2024</span>
                    <h1 class="heading-display" style="font-size: 3rem; margin-bottom: 24px; line-height: 1.1;">
                        Every child's voice<br>
                        <span class="text-gold">belongs in class.</span>
                    </h1>
                    <p style="font-size: 1.125rem; opacity: 0.9;">Connecting Voices, Breaking Language Barriers.</p>
                </div>
                
                <div class="hero-content" style="border-left: 3px solid var(--color-accent); padding-left: 16px; margin-top: 40px;">
                    <p style="font-size: 1rem; font-style: italic; opacity: 0.9;">"When a child understands in their own language, learning begins."</p>
                </div>
            </section>
            
            <section class="form-panel">
                <div class="setup-box">
                    <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: var(--color-primary); text-transform: uppercase; margin-bottom: 12px; display: block;">WELCOME TO VANI SETU</span>
                    <h2 class="heading-display" style="font-size: 2rem; margin-bottom: 12px; color: var(--color-text-main);">Let's set up your space</h2>
                    <p style="font-size: 1rem; color: var(--color-text-muted); margin-bottom: 32px;">Tell us a little about yourself to personalize your experience.</p>
                    
                    <div class="role-selector">
                        <button class="role-btn active" id="role-teacher">${icons.dashboard} I'm a teacher</button>
                        <button class="role-btn" id="role-student">${icons.book} I'm a student</button>
                    </div>
                    
                    <form id="setup-form" class="flex flex-col gap-4">
                        <div>
                            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">Your name</label>
                            <input type="text" class="input-field" value="Meera Hansda" required>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">School / learning centre</label>
                            <input type="text" class="input-field" value="Kheria Primary School" required>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">Class</label>
                                <select class="input-field">
                                    <option>Class 1</option>
                                    <option>Class 2</option>
                                    <option selected>Class 3</option>
                                    <option>Class 4</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">Profession</label>
                                <input type="text" class="input-field" value="Teacher" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn-primary mt-4" style="width: 100%; padding: 16px; font-size: 1rem;">
                            Enter my classroom ${icons.arrowRight}
                        </button>
                    </form>
                    
                    <p style="font-size: 0.75rem; color: var(--color-text-light); text-align: center; margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Demo profile · saved only on this device
                    </p>
                </div>
            </section>
        </div>
    `;

    // Add interactivity
    const teacherBtn = container.querySelector('#role-teacher');
    const studentBtn = container.querySelector('#role-student');
    const form = container.querySelector('#setup-form');

    teacherBtn.addEventListener('click', () => {
        teacherBtn.classList.add('active');
        studentBtn.classList.remove('active');
    });

    studentBtn.addEventListener('click', () => {
        studentBtn.classList.add('active');
        teacherBtn.classList.remove('active');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.hash = '#/dashboard';
    });
}
