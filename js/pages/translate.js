import { createSidebar, createHeader, bindHeaderClassSwitcher, icons, showToast, speakText, stopSpeech } from '../components.js';
import { api } from '../api.js';

export async function renderTranslate(container) {
    const user = await api.getUser();
    let activeClass = api.getActiveClass();

    // Translation state
    let sourceLang = 'Hindi';
    let targetLang = 'Santhali (Ol Chiki & Roman)';
    let simplifyLevel = activeClass;
    let currentResult = null;
    let isTranslating = false;
    let debounceTimer = null;

    // Speech Recognition & TTS state
    let isListening = false;
    let isSpeaking = false;
    let speechRate = 0.9;
    let recognitionInstance = null;

    function getTTSLangCode(langName) {
        const lower = (langName || '').toLowerCase();
        if (lower.includes('hindi')) return 'hi-IN';
        if (lower.includes('bengali')) return 'bn-IN';
        if (lower.includes('odia')) return 'or-IN';
        if (lower.includes('santhali')) return 'hi-IN'; // Roman phonetics read smoothly by Indian voice engine
        return 'hi-IN';
    }

    async function loadAndRender() {
        container.innerHTML = `
            <div class="app-shell">
                ${createSidebar('translate')}
                
                <div class="main-wrapper">
                    ${createHeader(user, ['Teacher workspace', 'Live Translation'])}
                    
                    <main class="dashboard-content" style="max-width: 1120px; margin: 0 auto; width: 100%;">
                        <!-- Minimal Clean Header -->
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-primary); letter-spacing: 0.08em; text-transform: uppercase;">
                                        REAL-TIME CLASSROOM BRIDGE
                                    </span>
                                    <span class="badge badge-coral">${activeClass}</span>
                                </div>
                                <h2 class="heading-display" style="font-size: 1.85rem; margin: 0; display: flex; align-items: center; gap: 10px;">
                                    Live Translation
                                </h2>
                                <p style="color: var(--color-text-muted); font-size: 0.875rem; margin-top: 4px;">
                                    Speak or type classroom concepts to translate live into tribal mother tongues with speech synthesis.
                                </p>
                            </div>
                        </div>

                        <!-- Language Selector Toolbar -->
                        <div class="card" style="padding: 12px 20px; margin-bottom: 20px; background: white; border: 1.5px solid var(--color-border); border-radius: var(--radius-lg);">
                            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                    <!-- Source Language -->
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">From:</span>
                                        <select id="live-source-lang" style="padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--color-border); font-size: 0.85rem; font-weight: 700; background: #fafaf9; cursor: pointer;">
                                            <option value="Hindi" ${sourceLang === 'Hindi' ? 'selected' : ''}>Hindi (हिंदी)</option>
                                            <option value="English" ${sourceLang === 'English' ? 'selected' : ''}>English</option>
                                            <option value="Bengali" ${sourceLang === 'Bengali' ? 'selected' : ''}>Bengali (বাংলা)</option>
                                            <option value="Odia" ${sourceLang === 'Odia' ? 'selected' : ''}>Odia (ଓଡ଼ିଆ)</option>
                                            <option value="Santhali" ${sourceLang === 'Santhali' ? 'selected' : ''}>Santhali (ᱥᱟᱱᱛᱟᱲᱤ)</option>
                                        </select>
                                    </div>

                                    <!-- Swap Languages Button -->
                                    <button id="live-swap-lang-btn" class="role-btn" style="padding: 6px 10px; border-radius: 8px; font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; justify-content: center; background: #f4f4f5;" title="Swap source and target languages">
                                        ⇄
                                    </button>

                                    <!-- Target Language -->
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">To:</span>
                                        <select id="live-target-lang" style="padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--color-primary); font-size: 0.85rem; font-weight: 700; background: #fff7ed; color: var(--color-primary); cursor: pointer;">
                                            <option value="Santhali (Ol Chiki & Roman)" ${targetLang.includes('Santhali') ? 'selected' : ''}>Santhali (Ol Chiki & Roman)</option>
                                            <option value="Hindi (हिंदी)" ${targetLang.includes('Hindi') ? 'selected' : ''}>Hindi (हिंदी)</option>
                                            <option value="Bengali (বাংলা)" ${targetLang.includes('Bengali') ? 'selected' : ''}>Bengali (বাংলা)</option>
                                            <option value="Odia (ଓଡ଼ିଆ)" ${targetLang.includes('Odia') ? 'selected' : ''}>Odia (ଓଡ଼ିଆ)</option>
                                            <option value="Gondi" ${targetLang.includes('Gondi') ? 'selected' : ''}>Gondi</option>
                                            <option value="Kudmali" ${targetLang.includes('Kudmali') ? 'selected' : ''}>Kudmali</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Grade Simplification Level -->
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted);">Grade Level:</span>
                                    <select id="live-level-select" style="padding: 6px 10px; border-radius: 8px; border: 1.5px solid var(--color-border); font-size: 0.8rem; font-weight: 600; background: white; cursor: pointer;">
                                        <option value="Class 3" ${simplifyLevel === 'Class 3' ? 'selected' : ''}>Class 3 Vocabulary</option>
                                        <option value="Class 4" ${simplifyLevel === 'Class 4' ? 'selected' : ''}>Class 4 Vocabulary</option>
                                        <option value="Class 5" ${simplifyLevel === 'Class 5' ? 'selected' : ''}>Class 5 Vocabulary</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Main 2-Panel Live Translator -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            
                            <!-- Left Panel: Input & Speech -->
                            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 20px; border: 1.5px solid var(--color-border); min-height: 320px;">
                                <div>
                                    <!-- Input Header -->
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
                                                Source Input
                                            </span>
                                            <span id="live-listening-indicator" style="display: none; align-items: center; gap: 6px; font-size: 0.72rem; font-weight: 700; color: #dc2626; background: #fee2e2; padding: 2px 8px; border-radius: 99px;">
                                                <span style="width: 6px; height: 6px; border-radius: 50%; background: #dc2626; animation: pulse 0.8s infinite;"></span>
                                                Listening Live
                                            </span>
                                        </div>
                                        <button id="live-clear-input-btn" class="role-btn" style="padding: 2px 8px; font-size: 0.72rem; color: var(--color-text-muted); display: none;">
                                            ✕ Clear
                                        </button>
                                    </div>

                                    <!-- Live Text Input Area -->
                                    <textarea id="live-input-text" class="input-field" rows="6" placeholder="Type here or tap the microphone below to speak live..." style="font-size: 1rem; line-height: 1.6; resize: vertical; border: 1px solid var(--color-border); padding: 12px; border-radius: var(--radius-md); width: 100%; box-sizing: border-box;">पेड़ों के पत्ते धूप और पानी की मदद से अपना भोजन बनाते हैं, जिसे प्रकाश संश्लेषण कहते हैं।</textarea>
                                </div>

                                <!-- Bottom Controls of Left Panel -->
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--color-border);">
                                        <!-- Mic Voice Toggle -->
                                        <button id="live-mic-btn" class="role-btn" style="padding: 8px 14px; font-size: 0.8rem; font-weight: 700; border-radius: 8px; display: flex; align-items: center; gap: 8px; background: #fff1f2; color: #e11d48; border-color: #fecdd3; cursor: pointer; transition: all 0.2s;">
                                            <span id="live-mic-icon">${icons.mic}</span>
                                            <span id="live-mic-label">Speak (Voice Input)</span>
                                        </button>

                                        <span id="live-char-counter" style="font-size: 0.72rem; color: var(--color-text-muted);">
                                            Live Auto-Translating
                                        </span>
                                    </div>

                                    <!-- Quick Classroom Prompts -->
                                    <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                                        <span style="font-size: 0.68rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Quick Topics:</span>
                                        <button class="live-prompt-chip" data-text="पेड़ों के पत्ते धूप और पानी से अपना भोजन बनाते हैं, जिसे प्रकाश संश्लेषण कहते हैं।" style="font-size: 0.72rem; padding: 3px 8px; background: #f8fafc; border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer;">🌿 Photosynthesis</button>
                                        <button class="live-prompt-chip" data-text="अगर हमारे पास १२ आम हैं और ५ बच्चों में बांट दिए तो ७ शेष बचेंगे।" style="font-size: 0.72rem; padding: 3px 8px; background: #f8fafc; border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer;">🔢 Subtraction</button>
                                        <button class="live-prompt-chip" data-text="सभी बच्चे अपनी गणित की स्लेट और चॉक निकालें।" style="font-size: 0.72rem; padding: 3px 8px; background: #f8fafc; border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer;">📚 Slate & Chalk</button>
                                        <button class="live-prompt-chip" data-text="हाथों को साबुन से अच्छी तरह धोकर ही भोजन करना चाहिए।" style="font-size: 0.72rem; padding: 3px 8px; background: #f8fafc; border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer;">🧼 Handwashing</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Panel: Live Vernacular Translation Output -->
                            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 20px; background: #fafaf9; border: 1.5px solid #e7e5e4; min-height: 320px;">
                                <div>
                                    <!-- Output Header -->
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">
                                                Translation Output
                                            </span>
                                            <span id="live-target-badge" class="badge badge-coral" style="font-size: 0.7rem;">
                                                Santhali
                                            </span>
                                        </div>
                                        <div id="live-status-indicator" style="font-size: 0.72rem; font-weight: 600; color: #15803d; display: flex; align-items: center; gap: 4px;">
                                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #16a34a;"></span>
                                            <span>Live Translated</span>
                                        </div>
                                    </div>

                                    <!-- Translated Content Box -->
                                    <div id="live-output-container" style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px; min-height: 140px;">
                                        <div id="live-output-text" style="font-size: 1.15rem; font-weight: 700; line-height: 1.6; color: var(--color-text-main);">
                                            ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ ᱠᱷᱚᱱ ᱡᱚᱢᱟᱜ ᱮ ᱛᱮᱭᱟᱨ-ᱟ (Dare sakam chando marsal khon aakowak jomak ko toiri-a).
                                        </div>
                                        <div id="live-script-indicator" style="margin-top: 10px; font-size: 0.72rem; color: var(--color-text-muted);">
                                            Script: Ol Chiki & Phonetic Roman
                                        </div>
                                    </div>
                                </div>

                                <!-- Bottom Action Bar of Right Panel -->
                                <div>
                                    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--color-border);">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <!-- Listen (TTS) Button -->
                                            <button id="live-listen-btn" class="role-btn" style="padding: 7px 14px; font-size: 0.8rem; font-weight: 700; background: #f0fdf4; border-color: #86efac; color: #15803d; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                                <span id="live-listen-icon">${icons.volume}</span>
                                                <span id="live-listen-label">Listen (TTS)</span>
                                            </button>

                                            <!-- Speed Toggle -->
                                            <select id="live-speech-rate" style="padding: 5px 8px; border-radius: 6px; border: 1px solid var(--color-border); font-size: 0.75rem; background: white; cursor: pointer;" title="Audio Playback Speed">
                                                <option value="0.8">0.8x (Gentle)</option>
                                                <option value="0.9" selected>0.9x (Standard)</option>
                                                <option value="1.0">1.0x (Normal)</option>
                                            </select>
                                        </div>

                                        <!-- Copy Button -->
                                        <button id="live-copy-btn" class="role-btn" style="padding: 7px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                            ${icons.copy} <span>Copy</span>
                                        </button>
                                    </div>

                                    <!-- Key Words Bridge Pill Container -->
                                    <div id="live-vocab-bridge-row" style="margin-top: 12px;">
                                        <div style="font-size: 0.68rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 6px;">
                                            Key Vocabulary Elements:
                                        </div>
                                        <div id="live-vocab-pills" style="display: flex; flex-wrap: wrap; gap: 6px;">
                                            <span class="badge" style="background: white; border: 1px solid var(--color-border); font-size: 0.75rem; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px;">
                                                <strong>Dare (ᱫᱟᱨᱮ)</strong> = Tree
                                                <button class="word-mini-tts" data-word="Dare, Tree" style="background:none;border:none;cursor:pointer;color:#16a34a;padding:0;" title="Listen word">${icons.volume}</button>
                                            </span>
                                            <span class="badge" style="background: white; border: 1px solid var(--color-border); font-size: 0.75rem; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px;">
                                                <strong>Sakam (ᱥᱟᱠᱟᱢ)</strong> = Leaves
                                                <button class="word-mini-tts" data-word="Sakam, Leaves" style="background:none;border:none;cursor:pointer;color:#16a34a;padding:0;" title="Listen word">${icons.volume}</button>
                                            </span>
                                            <span class="badge" style="background: white; border: 1px solid var(--color-border); font-size: 0.75rem; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px;">
                                                <strong>Chando Marsal (ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ)</strong> = Sunlight
                                                <button class="word-mini-tts" data-word="Chando Marsal, Sunlight" style="background:none;border:none;cursor:pointer;color:#16a34a;padding:0;" title="Listen word">${icons.volume}</button>
                                            </span>
                                            <span class="badge" style="background: white; border: 1px solid var(--color-border); font-size: 0.75rem; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px;">
                                                <strong>Jomak (ᱡᱚᱢᱟᱜ)</strong> = Food
                                                <button class="word-mini-tts" data-word="Jomak, Food" style="background:none;border:none;cursor:pointer;color:#16a34a;padding:0;" title="Listen word">${icons.volume}</button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;

        // Wire Header Class Switcher
        bindHeaderClassSwitcher((newClass) => {
            activeClass = newClass;
            simplifyLevel = newClass;
            const levelSelect = container.querySelector('#live-level-select');
            if (levelSelect) levelSelect.value = newClass;
            triggerLiveTranslation();
        });

        // DOM elements
        const inputText = container.querySelector('#live-input-text');
        const clearInputBtn = container.querySelector('#live-clear-input-btn');
        const sourceLangSelect = container.querySelector('#live-source-lang');
        const targetLangSelect = container.querySelector('#live-target-lang');
        const swapLangBtn = container.querySelector('#live-swap-lang-btn');
        const levelSelect = container.querySelector('#live-level-select');
        const micBtn = container.querySelector('#live-mic-btn');
        const micLabel = container.querySelector('#live-mic-label');
        const listeningIndicator = container.querySelector('#live-listening-indicator');
        const outputText = container.querySelector('#live-output-text');
        const targetBadge = container.querySelector('#live-target-badge');
        const statusIndicator = container.querySelector('#live-status-indicator');
        const scriptIndicator = container.querySelector('#live-script-indicator');
        const listenBtn = container.querySelector('#live-listen-btn');
        const listenIcon = container.querySelector('#live-listen-icon');
        const listenLabel = container.querySelector('#live-listen-label');
        const speechRateSelect = container.querySelector('#live-speech-rate');
        const copyBtn = container.querySelector('#live-copy-btn');
        const vocabPills = container.querySelector('#live-vocab-pills');
        const promptChips = container.querySelectorAll('.live-prompt-chip');

        // Function to perform live translation
        async function triggerLiveTranslation() {
            const text = (inputText.value || '').trim();
            if (!text) {
                outputText.innerText = 'Translation will appear here in real-time...';
                outputText.style.opacity = '0.5';
                if (statusIndicator) statusIndicator.innerHTML = `<span style="color: var(--color-text-muted);">Awaiting input...</span>`;
                if (vocabPills) vocabPills.innerHTML = '';
                if (clearInputBtn) clearInputBtn.style.display = 'none';
                currentResult = null;
                return;
            }

            outputText.style.opacity = '1';
            if (clearInputBtn) clearInputBtn.style.display = 'inline-block';
            if (statusIndicator) {
                statusIndicator.innerHTML = `
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; animation: pulse 0.8s infinite;"></span>
                    <span style="color: #b45309;">Translating...</span>
                `;
            }

            try {
                isTranslating = true;
                const result = await api.simulateTranslation(text, sourceLang, targetLang, simplifyLevel);
                currentResult = result;

                // Update Output
                outputText.innerText = result.translated;
                if (targetBadge) {
                    targetBadge.innerText = targetLang.split(' ')[0];
                }
                if (scriptIndicator) {
                    scriptIndicator.innerText = result.vernacularScript 
                        ? `Script: ${result.vernacularScript}` 
                        : `Target: ${targetLang} (${simplifyLevel})`;
                }
                if (statusIndicator) {
                    statusIndicator.innerHTML = `
                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #16a34a;"></span>
                        <span style="color: #15803d;">Live Translated (${result.timestamp})</span>
                    `;
                }

                // Update Vocabulary Pills
                if (vocabPills && result.breakdown && result.breakdown.length > 0) {
                    vocabPills.innerHTML = result.breakdown.map(b => `
                        <span class="badge" style="background: white; border: 1px solid var(--color-border); font-size: 0.75rem; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px;">
                            <strong>${b.word}</strong> = ${b.meaning}
                            <button class="word-mini-tts" data-word="${b.word}, ${b.meaning}" style="background:none;border:none;cursor:pointer;color:#16a34a;padding:0;" title="Listen word">${icons.volume}</button>
                        </span>
                    `).join('');
                    bindWordTTSButtons();
                } else if (vocabPills) {
                    vocabPills.innerHTML = `<span style="font-size: 0.72rem; color: var(--color-text-muted);">Standard vocabulary applied for ${simplifyLevel}.</span>`;
                }
            } catch (err) {
                console.error('Translation failed', err);
                if (statusIndicator) {
                    statusIndicator.innerHTML = `<span style="color: #dc2626;">Translation error</span>`;
                }
            } finally {
                isTranslating = false;
            }
        }

        // Debounced live typing translation
        inputText.addEventListener('input', () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                triggerLiveTranslation();
            }, 250);
        });

        // Clear input button
        if (clearInputBtn) {
            clearInputBtn.addEventListener('click', () => {
                inputText.value = '';
                triggerLiveTranslation();
                inputText.focus();
            });
        }

        // Language changes
        sourceLangSelect.addEventListener('change', (e) => {
            sourceLang = e.target.value;
            triggerLiveTranslation();
        });

        targetLangSelect.addEventListener('change', (e) => {
            targetLang = e.target.value;
            triggerLiveTranslation();
        });

        levelSelect.addEventListener('change', (e) => {
            simplifyLevel = e.target.value;
            triggerLiveTranslation();
        });

        // Swap source and target languages
        swapLangBtn.addEventListener('click', () => {
            const currentSource = sourceLangSelect.value;
            const currentTarget = targetLangSelect.value;

            // Invert cleanly
            if (currentTarget.includes('Hindi')) {
                sourceLangSelect.value = 'Hindi';
                sourceLang = 'Hindi';
            } else if (currentTarget.includes('Bengali')) {
                sourceLangSelect.value = 'Bengali';
                sourceLang = 'Bengali';
            } else if (currentTarget.includes('Odia')) {
                sourceLangSelect.value = 'Odia';
                sourceLang = 'Odia';
            } else if (currentTarget.includes('Santhali')) {
                sourceLangSelect.value = 'Santhali';
                sourceLang = 'Santhali';
            }

            if (currentSource === 'Hindi') {
                targetLangSelect.value = 'Hindi (हिंदी)';
                targetLang = 'Hindi (हिंदी)';
            } else if (currentSource === 'Bengali') {
                targetLangSelect.value = 'Bengali (বাংলা)';
                targetLang = 'Bengali (বাংলা)';
            } else if (currentSource === 'Odia') {
                targetLangSelect.value = 'Odia (ଓଡ଼ᱤଆ)';
                targetLang = 'Odia (ଓଡ଼ᱤଆ)';
            } else {
                targetLangSelect.value = 'Santhali (Ol Chiki & Roman)';
                targetLang = 'Santhali (Ol Chiki & Roman)';
            }

            // Swap text if translation exists
            if (currentResult && currentResult.translated) {
                inputText.value = currentResult.translated.replace(/\([^)]+\)/g, '').trim();
            }

            triggerLiveTranslation();
        });

        // Prompt chips
        promptChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const sampleText = chip.getAttribute('data-text');
                if (sampleText) {
                    inputText.value = sampleText;
                    triggerLiveTranslation();
                }
            });
        });

        // Text-to-Speech Playback
        function setSpeakingState(speaking) {
            isSpeaking = speaking;
            if (speaking) {
                listenBtn.style.background = '#dcfce7';
                listenBtn.style.borderColor = '#4ade80';
                listenLabel.innerText = 'Stop Audio';
                listenIcon.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #16a34a; animation: pulse 0.6s infinite; display: inline-block;"></span>`;
            } else {
                listenBtn.style.background = '#f0fdf4';
                listenBtn.style.borderColor = '#86efac';
                listenLabel.innerText = 'Listen (TTS)';
                listenIcon.innerHTML = icons.volume;
            }
        }

        listenBtn.addEventListener('click', () => {
            if (isSpeaking) {
                stopSpeech();
                setSpeakingState(false);
                return;
            }

            const textToSpeak = outputText.innerText;
            if (!textToSpeak || textToSpeak.includes('Translation will appear')) {
                showToast('No Text', 'Please enter or dictate text to translate first.', 'info');
                return;
            }

            const langCode = getTTSLangCode(targetLang);
            const rate = parseFloat(speechRateSelect.value) || 0.9;

            setSpeakingState(true);
            speakText(textToSpeak, langCode, {
                rate,
                onStart: () => setSpeakingState(true),
                onEnd: () => setSpeakingState(false),
                onError: () => setSpeakingState(false)
            });
        });

        // Copy button
        copyBtn.addEventListener('click', async () => {
            const textToCopy = outputText.innerText;
            if (!textToCopy || textToCopy.includes('Translation will appear')) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast('Copied', 'Translated text copied to clipboard', 'success');
                copyBtn.innerHTML = `✓ <span>Copied!</span>`;
                setTimeout(() => {
                    copyBtn.innerHTML = `${icons.copy} <span>Copy</span>`;
                }, 1800);
            } catch (e) {
                showToast('Copy Failed', 'Unable to copy text', 'warning');
            }
        });

        // Word level mini TTS
        function bindWordTTSButtons() {
            const buttons = container.querySelectorAll('.word-mini-tts');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const word = btn.getAttribute('data-word');
                    if (word) {
                        speakText(word, getTTSLangCode(targetLang), { rate: 0.85 });
                    }
                });
            });
        }
        bindWordTTSButtons();

        // Microphone Live Dictation (Speech-to-Text)
        function toggleMicrophone() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                showToast('Speech Not Supported', 'Speech recognition is not supported in this browser. Please type your concept.', 'warning');
                return;
            }

            if (isListening) {
                // Stop listening
                if (recognitionInstance) {
                    try { recognitionInstance.stop(); } catch (e) {}
                }
                setMicListeningState(false);
                return;
            }

            try {
                recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = true;
                recognitionInstance.interimResults = true;

                // Set recognition language based on source language
                if (sourceLang === 'Hindi') recognitionInstance.lang = 'hi-IN';
                else if (sourceLang === 'Bengali') recognitionInstance.lang = 'bn-IN';
                else if (sourceLang === 'Odia') recognitionInstance.lang = 'or-IN';
                else recognitionInstance.lang = 'en-IN';

                recognitionInstance.onstart = () => {
                    setMicListeningState(true);
                    showToast('Microphone Active', 'Speak clearly into your microphone...', 'info');
                };

                recognitionInstance.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        transcript += event.results[i][0].transcript;
                    }
                    if (transcript.trim()) {
                        inputText.value = transcript;
                        triggerLiveTranslation();
                    }
                };

                recognitionInstance.onerror = (event) => {
                    console.warn('Speech recognition error', event);
                    setMicListeningState(false);
                    if (event.error !== 'no-speech') {
                        showToast('Mic Error', `Speech recognition error: ${event.error}`, 'warning');
                    }
                };

                recognitionInstance.onend = () => {
                    setMicListeningState(false);
                };

                recognitionInstance.start();
            } catch (err) {
                console.error('Recognition error', err);
                setMicListeningState(false);
                showToast('Mic Error', 'Could not access microphone.', 'warning');
            }
        }

        function setMicListeningState(listening) {
            isListening = listening;
            if (listening) {
                micBtn.style.background = '#fee2e2';
                micBtn.style.borderColor = '#ef4444';
                micBtn.style.color = '#dc2626';
                micLabel.innerText = 'Listening... (Tap to stop)';
                if (listeningIndicator) listeningIndicator.style.display = 'inline-flex';
            } else {
                micBtn.style.background = '#fff1f2';
                micBtn.style.borderColor = '#fecdd3';
                micBtn.style.color = '#e11d48';
                micLabel.innerText = 'Speak (Voice Input)';
                if (listeningIndicator) listeningIndicator.style.display = 'none';
            }
        }

        micBtn.addEventListener('click', toggleMicrophone);

        // Initial translation trigger on page load
        triggerLiveTranslation();
    }

    await loadAndRender();
}
