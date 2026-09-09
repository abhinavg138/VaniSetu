import {
    currentActiveClass,
    mockUser,
    mockLessonsByClass,
    mockStatsByClass,
    mockStudents,
    mockVocabularyByClass,
    initialAssessments,
    quickClassroomPhrases,
    lessonPlansByClass,
    worksheetsByClass
} from './data.js';

// Local reactive storage in memory with localStorage persistence fallback
let activeClass = localStorage.getItem('vani_active_class') || currentActiveClass || 'Class 3';
let userState = { ...mockUser };
let assessmentsStore = JSON.parse(localStorage.getItem('vani_assessments')) || [...initialAssessments];
let studentsStore = JSON.parse(localStorage.getItem('vani_students')) || [...mockStudents];
let vocabStore = JSON.parse(localStorage.getItem('vani_vocab')) || { ...mockVocabularyByClass };
let currentRole = localStorage.getItem('vani_role') || 'Teacher';
let currentStudent = JSON.parse(localStorage.getItem('vani_active_student')) || { ...studentsStore[0] };

const defaultSubmissions = [
    {
        id: 'sub-1',
        assessmentId: 'asm-301',
        studentId: 's301',
        studentName: 'Babu Soren',
        roll: '01',
        class: 'Class 3',
        motherTongue: 'Santhali',
        score: 90,
        scoreFraction: '4/4',
        submittedAt: '07 Sep 2026, 10:15 AM',
        usedVernacularBridge: 'Ol Chiki audio assisted',
        feedback: 'Bes te bujhaw kate ol pe! Great job on fruit subtraction story.'
    },
    {
        id: 'sub-2',
        assessmentId: 'asm-302',
        studentId: 's301',
        studentName: 'Babu Soren',
        roll: '01',
        class: 'Class 3',
        motherTongue: 'Santhali',
        score: 100,
        scoreFraction: '3/3',
        submittedAt: '08 Sep 2026, 02:30 PM',
        usedVernacularBridge: 'Santhali tree vocabulary bridge',
        feedback: 'Excellent knowledge of local birds and alarm calls!'
    },
    {
        id: 'sub-3',
        assessmentId: 'asm-301',
        studentId: 's302',
        studentName: 'Pooja Murmu',
        roll: '04',
        class: 'Class 3',
        motherTongue: 'Santhali',
        score: 100,
        scoreFraction: '4/4',
        submittedAt: '07 Sep 2026, 11:00 AM',
        usedVernacularBridge: 'Independent (Fluent)',
        feedback: 'Perfect score with quick mental subtraction.'
    },
    {
        id: 'sub-4',
        assessmentId: 'asm-301',
        studentId: 's303',
        studentName: 'Rohan Bauri',
        roll: '09',
        class: 'Class 3',
        motherTongue: 'Bengali',
        score: 75,
        scoreFraction: '3/4',
        submittedAt: '07 Sep 2026, 01:20 PM',
        usedVernacularBridge: 'Bengali translation support',
        feedback: 'Good progress, practice more subtraction stories.'
    }
];

let submissionsStore = JSON.parse(localStorage.getItem('vani_submissions')) || defaultSubmissions;

// Translation dictionary simulation
const translationDictionary = {
    'photosynthesis': {
        santhali: 'ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱛᱮ ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ ᱠᱷᱚᱱ ᱡᱚᱢᱟᱜ ᱛᱮᱭᱟᱨ (Dare sakam chando marsal khon jomak toiri)',
        hindi: 'प्रकाश संश्लेषण (पौधों द्वारा धूप से भोजन बनाना)',
        bengali: 'সালোকসংশ্লেষ (গাছের সূর্যালোক দিয়ে খাদ্য তৈরি)'
    },
    'subtraction': {
        santhali: 'ᱵᱷᱮᱜᱟᱨ ᱞᱮᱠᱷᱟ (Bhegar lekha / Saréj hisab)',
        hindi: 'घटाना (कम करना)',
        bengali: 'বিয়োগ (বাদ দেওয়া)'
    },
    'solar system': {
        santhali: 'ᱪᱟᱸᱫᱚ ᱢᱚᱱᱰᱚᱞ ᱟᱨ ᱘ ᱜᱚᱴᱟᱝ ᱜᱽᱨᱟᱦᱚ (Chando mondol ar 8 gotang graho)',
        hindi: 'सौरमंडल और ग्रह',
        bengali: 'সৌরজগৎ এবং গ্রহমণ্ডলী'
    },
    'water cycle': {
        santhali: 'ᱫᱟᱜ ᱠᱷᱚᱱ ᱫᱷᱩᱠᱟ, ᱫᱷᱩᱠᱟ ᱠᱷᱚᱱ ᱨᱤᱢᱤᱞ, ᱨᱤᱢᱤᱞ ᱠᱷᱚᱱ ᱫᱟᱜ (Dah -> Dhuka -> Remil -> Dah)',
        hindi: 'जल चक्र (वाष्पीकरण और वर्षा)',
        bengali: 'জলচক্র (বাষ্প ও বৃষ্টি)'
    }
};

export const api = {
    // Role selection (Teacher vs Student)
    getRole: () => currentRole,
    setRole: (newRole) => {
        currentRole = newRole;
        localStorage.setItem('vani_role', newRole);
        window.dispatchEvent(new CustomEvent('vani:role-changed', { detail: { role: newRole } }));
        return currentRole;
    },

    // Active Student in Student Panel
    getCurrentStudent: () => {
        return currentStudent || studentsStore[0];
    },
    setCurrentStudent: (student) => {
        currentStudent = { ...student };
        localStorage.setItem('vani_active_student', JSON.stringify(currentStudent));
        if (student && student.class) {
            activeClass = student.class;
            localStorage.setItem('vani_active_class', student.class);
        }
        window.dispatchEvent(new CustomEvent('vani:student-changed', { detail: { student: currentStudent } }));
        return currentStudent;
    },

    // Current Class selection
    getActiveClass: () => activeClass,
    setActiveClass: (newClass) => {
        activeClass = newClass;
        localStorage.setItem('vani_active_class', newClass);
        window.dispatchEvent(new CustomEvent('vani:class-changed', { detail: { newClass } }));
        return activeClass;
    },

    // User Profile
    getUser: async () => {
        return new Promise(resolve => setTimeout(() => resolve({ ...userState, class: activeClass }), 100));
    },
    updateUser: async (updatedData) => {
        userState = { ...userState, ...updatedData };
        return userState;
    },

    // Lessons for active class
    getLessons: async (className = activeClass) => {
        return new Promise(resolve => {
            const lessons = mockLessonsByClass[className] || mockLessonsByClass['Class 3'];
            setTimeout(() => resolve([...lessons]), 150);
        });
    },
    addLesson: async (lesson) => {
        if (!mockLessonsByClass[activeClass]) mockLessonsByClass[activeClass] = [];
        const newLesson = {
            id: Date.now(),
            ...lesson,
            status: 'up next'
        };
        mockLessonsByClass[activeClass].push(newLesson);
        return newLesson;
    },

    // Performance Stats by class
    getStats: async (className = activeClass) => {
        return new Promise(resolve => {
            const stats = mockStatsByClass[className] || mockStatsByClass['Class 3'];
            setTimeout(() => resolve({ ...stats }), 150);
        });
    },

    // Students
    getStudents: async (className = activeClass, search = '', language = '') => {
        return new Promise(resolve => {
            let filtered = studentsStore.filter(s => className === 'All' || s.class === className);
            if (search) {
                const q = search.toLowerCase();
                filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.roll.includes(q) || s.motherTongue.toLowerCase().includes(q));
            }
            if (language && language !== 'All') {
                filtered = filtered.filter(s => s.motherTongue.toLowerCase() === language.toLowerCase());
            }
            setTimeout(() => resolve(filtered), 150);
        });
    },
    addStudent: async (studentData) => {
        const newStudent = {
            id: 's' + Date.now(),
            roll: String(studentsStore.filter(s => s.class === studentData.class).length + 1).padStart(2, '0'),
            comprehensionIndex: 78,
            engagement: 'Enrolled Today',
            confidence: 'Getting Started',
            avatarBg: '#dbeafe',
            avatarColor: '#1e40af',
            assessmentsCompleted: 0,
            attendance: '100%',
            ...studentData
        };
        studentsStore.unshift(newStudent);
        localStorage.setItem('vani_students', JSON.stringify(studentsStore));
        return newStudent;
    },

    // Assessments
    getAssessments: async (className = activeClass, subject = 'All') => {
        return new Promise(resolve => {
            let list = assessmentsStore.filter(a => className === 'All' || a.class === className);
            if (subject && subject !== 'All') {
                list = list.filter(a => a.subject.toLowerCase() === subject.toLowerCase());
            }
            setTimeout(() => resolve([...list]), 200);
        });
    },
    getAssessmentById: async (id) => {
        return assessmentsStore.find(a => a.id === id);
    },

    // Assessment AI Generator
    generateAssessment: async ({ className, subject, topic, language, type, count, difficulty }) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const generatedQuestions = [];
                const num = parseInt(count) || 3;

                for (let i = 1; i <= num; i++) {
                    if (subject === 'Mathematics') {
                        generatedQuestions.push({
                            qText: `Problem ${i}: In a village market, if 18 earthen pots were made and ${4 * i} were sold, how many pots are still on the stall?`,
                            vernacularText: `ᱦᱟᱴ ᱨᱮ ᱑᱘ ᱜᱚᱴᱟᱝ ᱴᱩᱠᱩᱡ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ, ${4 * i} ᱜᱚᱴᱟᱝ ᱠᱚ ᱟᱹᱠᱷᱨᱤᱧ ᱠᱮᱫᱟ᱾ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡ ᱮᱱᱟ? (${topic} - Bilingual Bridge)`,
                            options: [`${18 - (4 * i)} pots`, `${18 - (4 * i) + 3} pots`, `${18 - (4 * i) - 2} pots`, `${18 + (4 * i)} pots`],
                            correctIndex: 0,
                            explanation: `18 minus ${4 * i} leaves ${18 - (4 * i)} pots. In vernacular: Bhegar / Saréj.`
                        });
                    } else if (subject === 'General Science') {
                        generatedQuestions.push({
                            qText: `Science Concept ${i}: How does the green leaf ("Sakam") capture energy from sunlight to prepare nutrition?`,
                            vernacularText: `ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱛᱮ ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ ᱠᱷᱚᱱ ᱡᱚᱢᱟᱜ ᱮ ᱛᱮᱭᱟᱨ-ᱟ? (Question ${i})`,
                            options: ['Using green chlorophyll & sunlight', 'Using river stones', 'By waiting for winter', 'By absorbing moon glow'],
                            correctIndex: 0,
                            explanation: 'Chlorophyll inside plant leaves absorbs sunlight wavelengths to perform photosynthesis.'
                        });
                    } else {
                        generatedQuestions.push({
                            qText: `Question ${i}: Which resource in our local habitat ("Bir ar Gada") must be kept clean for our community?`,
                            vernacularText: `ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱟᱨ ᱵᱤᱨ ᱨᱮ ᱚᱠᱟ ᱡᱤᱱᱤᱥ ᱥᱟᱯᱷᱟ ᱫᱚᱦᱚ ᱡᱟᱹᱨᱩᱨ-ᱟ? (Question ${i})`,
                            options: ['River drinking water (Dah)', 'Plastic wrappers', 'Smoke', 'Dust'],
                            correctIndex: 0,
                            explanation: 'Clean river water ensures healthy living for both humans and wildlife.'
                        });
                    }
                }

                const generated = {
                    id: 'gen-' + Date.now(),
                    title: `${className} ${subject} - ${topic}`,
                    class: className,
                    subject: subject,
                    topic: topic,
                    language: language || 'Santhali & Hindi Bridge',
                    questionCount: num,
                    difficulty: difficulty || 'Medium',
                    type: type || 'Bilingual Concept Quiz',
                    assignedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    dueDate: new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    assignedTo: `All students in ${className}`,
                    totalStudents: className === 'Class 3' ? 28 : (className === 'Class 4' ? 30 : 26),
                    submissionsCount: 0,
                    averageScore: 0,
                    status: 'Draft',
                    questions: generatedQuestions
                };

                resolve(generated);
            }, 600);
        });
    },

    // Assigning Assessment to a Class
    assignAssessment: async (assessment) => {
        return new Promise(resolve => {
            const assigned = {
                ...assessment,
                id: 'asm-' + Date.now(),
                assignedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: 'Active',
                submissionsCount: 0,
                averageScore: 0
            };
            assessmentsStore.unshift(assigned);
            localStorage.setItem('vani_assessments', JSON.stringify(assessmentsStore));
            userState.assessmentsAssigned += 1;
            setTimeout(() => resolve(assigned), 250);
        });
    },

    // Student Submissions & Assessment Taking
    getSubmissions: () => submissionsStore,
    getStudentSubmissions: (studentId) => {
        return submissionsStore.filter(s => s.studentId === studentId);
    },
    getSubmissionsForAssessment: (assessmentId) => {
        return submissionsStore.filter(s => s.assessmentId === assessmentId);
    },
    submitAssessment: async ({ assessmentId, studentId, studentName, roll, className, motherTongue, score, scoreFraction, answers, usedVernacularBridge }) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newSubmission = {
                    id: 'sub-' + Date.now(),
                    assessmentId,
                    studentId,
                    studentName: studentName || 'Student',
                    roll: roll || '01',
                    class: className || activeClass,
                    motherTongue: motherTongue || 'Santhali',
                    score: Math.round(score),
                    scoreFraction: scoreFraction || `${Math.round(score / 25)}/4`,
                    submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                    usedVernacularBridge: usedVernacularBridge ? 'Ol Chiki vernacular audio supported' : 'Standard bilingual bridge',
                    feedback: score >= 80 ? 'Adi bes! (Excellent understanding of concepts in native script)' : 'Bes koshish! (Good attempt, review vernacular bridge terms)',
                    answers: answers || []
                };

                // Add or replace existing submission for this student on this assessment
                const existingIdx = submissionsStore.findIndex(s => s.assessmentId === assessmentId && s.studentId === studentId);
                if (existingIdx >= 0) {
                    submissionsStore[existingIdx] = newSubmission;
                } else {
                    submissionsStore.unshift(newSubmission);
                }
                localStorage.setItem('vani_submissions', JSON.stringify(submissionsStore));

                // Update assessment counts & average
                const asm = assessmentsStore.find(a => a.id === assessmentId);
                if (asm) {
                    const asmSubs = submissionsStore.filter(s => s.assessmentId === assessmentId);
                    asm.submissionsCount = asmSubs.length;
                    const avg = Math.round(asmSubs.reduce((acc, curr) => acc + curr.score, 0) / asmSubs.length);
                    asm.averageScore = avg;
                    localStorage.setItem('vani_assessments', JSON.stringify(assessmentsStore));
                }

                // Update student stats
                const std = studentsStore.find(s => s.id === studentId);
                if (std) {
                    std.assessmentsCompleted = (std.assessmentsCompleted || 0) + 1;
                    std.comprehensionIndex = Math.min(99, Math.round(((std.comprehensionIndex || 80) * 0.7) + (score * 0.3)));
                    localStorage.setItem('vani_students', JSON.stringify(studentsStore));
                }

                resolve(newSubmission);
            }, 300);
        });
    },

    // Student AI Vernacular Doubt Companion
    answerStudentDoubt: async ({ question, studentLanguage = 'Santhali', className = 'Class 3' }) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const q = (question || '').toLowerCase();
                let answer = '';
                let vernacularAudioText = '';
                let scriptDisplay = '';
                let vocabulary = [];

                if (q.includes('photo') || q.includes('पत्त') || q.includes('leaf') || q.includes('धूप') || q.includes('खाद्य') || q.includes('खाना') || q.includes('food')) {
                    answer = 'पेड़ के हरे पत्ते सूरज की धूप (Chando marsal), पानी (Dah) और हवा से पेड़ के लिए भोजन बनाते हैं। पत्तों में हरा रंग (Chlorophyll) होता है जो धूप को पकड़ता है।';
                    vernacularAudioText = 'Dare sakam do chando marsal ar daah te aakowak jomak ko toiri-a. Sakam re hariyar rong thiko-a.';
                    scriptDisplay = 'ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱫᱚ ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ ᱟᱨ ᱫᱟᱜ ᱛᱮ ᱡᱚᱢᱟᱜ ᱮ ᱛᱮᱭᱟᱨ-ᱟ (Dare sakam chando marsal ar dah te jomak toiri)';
                    vocabulary = [
                        { word: 'Dare (ᱫᱟᱨᱮ)', meaning: 'Tree / पेड़' },
                        { word: 'Sakam (ᱥᱟᱠᱟᱢ)', meaning: 'Leaves / पत्ते' },
                        { word: 'Chando marsal (ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ)', meaning: 'Sunlight / धूप' },
                        { word: 'Jomak (ᱡᱚᱢᱟᱜ)', meaning: 'Food / भोजन' }
                    ];
                } else if (q.includes('subtract') || q.includes('घटा') || q.includes('minus') || q.includes('आम') || q.includes('बांट') || q.includes('कम')) {
                    answer = 'घटाना (Bhegar) का मतलब होता है कुल चीजों में से कुछ कम करना या बांटना। जैसे यदि 12 आम हैं और 5 खा लिए, तो 12 - 5 = 7 आम बचेंगे।';
                    vernacularAudioText = 'Bhegar lekha te do joto jinis khon thora kom-a. 12 khon 5 bhegar kate 7 sarej-a.';
                    scriptDisplay = 'ᱵᱷᱮᱜᱟᱨ ᱞᱮᱠᱷᱟ ᱫᱚ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱠᱚᱢ ᱠᱟᱛᱮ ᱥᱟᱨᱮᱡ ᱞᱮᱠᱷᱟ (Bhegar / Saréj hisab)';
                    vocabulary = [
                        { word: 'Bhegar (ᱵᱷᱮᱜᱟᱨ)', meaning: 'Subtract / घटाना' },
                        { word: 'Saréj (ᱥᱟᱨᱮᱡ)', meaning: 'Remaining / शेष' },
                        { word: 'Lekha (ᱞᱮᱠᱷᱟ)', meaning: 'Count / गिनती' }
                    ];
                } else if (q.includes('solar') || q.includes('सूरज') || q.includes('ग्रह') || q.includes('planet') || q.includes('चांद')) {
                    answer = 'हमारे सौरमंडल के केंद्र में सूरज (Chando) है और उसके चारों ओर 8 ग्रह चक्कर लगाते हैं। हमारी पृथ्वी तीसरा ग्रह है जिस पर हम रहते हैं।';
                    vernacularAudioText = 'Chando mondol re 8 gotang graho do chando aachur kate ko bihur-a. Aboa dharti do tesra graho kana.';
                    scriptDisplay = 'ᱪᱟᱸᱫᱚ ᱢᱚᱱᱰᱚᱞ ᱨᱮ ᱘ ᱜᱚᱴᱟᱝ ᱜᱽᱨᱟᱦᱚ ᱢᱮᱱᱟᱜ-ᱟ (Chando Mondol ar 8 Graho)';
                    vocabulary = [
                        { word: 'Chando (ᱪᱟᱸᱫᱚ)', meaning: 'Sun / सूरज' },
                        { word: 'Dharti (ᱫᱷᱟᱹᱨᱛᱤ)', meaning: 'Earth / पृथ्वी' },
                        { word: 'Graho (ᱜᱽᱨᱟᱦᱚ)', meaning: 'Planet / ग्रह' }
                    ];
                } else if (q.includes('water') || q.includes('पानी') || q.includes('river') || q.includes('नदी') || q.includes('dah')) {
                    answer = 'पानी हमारे जीवन की सबसे अनमोल चीज है। नदी और कुएं का साफ पानी पीना चाहिए। धूप से पानी भाप (Dhuka) बनता है और आसमान में बादल (Remil) बनकर बारिश करता है।';
                    vernacularAudioText = 'Daah do jibon re adi daman kana. Gada ar kuyan daah sapha doho dorkar. Daah seetong te dhuka ban kate remil re badlak-a.';
                    scriptDisplay = 'ᱫᱟᱜ ᱫᱚ ᱡᱤᱭᱚᱱ ᱨᱮ ᱟᱹᱰᱤ ᱫᱟᱢᱟᱱ ᱠᱟᱱᱟ (Dah do jibon re adi daman)';
                    vocabulary = [
                        { word: 'Dah (ᱫᱟᱜ)', meaning: 'Water / पानी' },
                        { word: 'Dhuka (ᱫᱷᱩᱠᱟ)', meaning: 'Vapor / भाप' },
                        { word: 'Remil (ᱨᱤᱢᱤᱞ)', meaning: 'Cloud / बादल' }
                    ];
                } else {
                    answer = `शानदार प्रश्न! कक्षा ${className} के लिए: इस विषय को अपनी मातृभाषा में याद रखना बहुत आसान है। अपने शिक्षक से भी कक्षा में पूछें और रोज़ अभ्यास करें।`;
                    vernacularAudioText = 'Adi bhalai kuli! Nawa katha do aam jahar poriwar ar school re bes te bujhaw pe.';
                    scriptDisplay = 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱠᱩᱠᱞᱤ! ᱵᱮᱥ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ (Adi napay kukli! Learn well)';
                    vocabulary = [
                        { word: 'Kukli (ᱠᱩᱠᱞᱤ)', meaning: 'Question / सवाल' },
                        { word: 'Cheda (ᱪᱮᱫᱚᱜ)', meaning: 'Learn / सीखना' },
                        { word: 'Gidra (ᱜᱤᱫᱽᱨᱟᱹ)', meaning: 'Child / विद्यार्थी' }
                    ];
                }

                resolve({
                    question,
                    answer,
                    vernacularAudioText,
                    scriptDisplay,
                    vocabulary,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }, 350);
        });
    },

    // Vocabulary Flashcards
    getVocabulary: async (className = activeClass, subject = 'All') => {
        return new Promise(resolve => {
            let cards = vocabStore[className] || vocabStore['Class 3'] || [];
            if (subject && subject !== 'All') {
                cards = cards.filter(c => c.theme.toLowerCase().includes(subject.toLowerCase()));
            }
            setTimeout(() => resolve([...cards]), 150);
        });
    },
    addVocabularyWord: async (className, wordData) => {
        if (!vocabStore[className]) vocabStore[className] = [];
        const newWord = {
            id: 'v-' + Date.now(),
            frequency: 'High',
            ...wordData
        };
        vocabStore[className].unshift(newWord);
        localStorage.setItem('vani_vocab', JSON.stringify(vocabStore));
        return newWord;
    },

    // Lesson Plans & Worksheets
    getLessonPlans: async (className = activeClass) => {
        return lessonPlansByClass[className] || lessonPlansByClass['Class 3'];
    },
    getWorksheets: async (className = activeClass) => {
        return worksheetsByClass[className] || worksheetsByClass['Class 3'];
    },

    // Quick Classroom Phrases
    getQuickPhrases: async (category = 'All') => {
        if (category === 'All') return quickClassroomPhrases;
        return quickClassroomPhrases.filter(p => p.category.toLowerCase() === category.toLowerCase());
    },

    // Translation simulation with vernacular AI engine
    simulateTranslation: async (text, sourceLang = 'Hindi', targetLang = 'Santhali', simplifyLevel = 'Class 3') => {
        return new Promise(resolve => {
            setTimeout(() => {
                const lower = text.toLowerCase();
                let translated = '';
                let vernacularScript = '';
                let breakdown = [];
                const isHindiTarget = targetLang.toLowerCase().includes('hindi');
                const isSanthaliTarget = targetLang.toLowerCase().includes('santhali');
                const isBengaliTarget = targetLang.toLowerCase().includes('bengali');
                const isOdiaTarget = targetLang.toLowerCase().includes('odia');
                const isReverseStudentSpeech = lower.includes('ᱢᱟᱰᱟᱢ') || lower.includes('dah ñu') || lower.includes('ᱫᱟᱜ ᱧᱩ') || lower.includes('ᱯᱩᱛᱷᱤ') || lower.includes('ᱵᱩᱡᱷᱟᱹᱣ');

                if (isReverseStudentSpeech) {
                    // Tribal student speaking -> translated to Hindi/English for teacher
                    if (lower.includes('dah') || lower.includes('ᱫᱟᱜ')) {
                        translated = 'मैडम, क्या मैं पानी पीने जा सकता हूँ? (Madam, may I go to drink drinking water?)';
                        vernacularScript = 'छात्र का अनुरोध: जलपान';
                        breakdown = [
                            { word: 'Dah (ᱫᱟᱜ)', meaning: 'Water / पानी' },
                            { word: 'Ñu (ᱧᱩ)', meaning: 'To drink / पीना' },
                            { word: 'Senok (ᱥᱮᱱᱚᱜ)', meaning: 'To go / जाना' }
                        ];
                    } else if (lower.includes('puthi') || lower.includes('ᱯᱩᱛᱷᱤ')) {
                        translated = 'मैडम, मैंने आज अपनी किताब नहीं लाई है। (Teacher, I did not bring my notebook today.)';
                        vernacularScript = 'छात्र का वक्तव्य: पुस्तक';
                        breakdown = [
                            { word: 'Puthi (ᱯᱩᱛᱷᱤ)', meaning: 'Book / किताब' },
                            { word: 'Agu (ᱟᱹᱜᱩ)', meaning: 'To bring / लाना' }
                        ];
                    } else {
                        translated = 'मैडम, मुझे यह गणित का सवाल अच्छे से समझ आ गया! (Teacher, I understood this problem well!)';
                        vernacularScript = 'छात्र की समझ: गणित';
                        breakdown = [
                            { word: 'Hisab (ᱦᱤᱥᱟᱹᱵᱽ)', meaning: 'Math calculation' },
                            { word: 'Bujhaw (ᱵᱩᱡᱷᱟᱹᱣ)', meaning: 'Understood' }
                        ];
                    }
                } else if (isHindiTarget) {
                    // Mother tongue Hindi target
                    if (lower.includes('photo') || lower.includes('प्रकाश') || lower.includes('food') || lower.includes('plant') || lower.includes('पत्त') || lower.includes('leaf') || lower.includes('धूप')) {
                        translated = 'पौधों के हरे पत्ते सूरज की धूप और जमीन के पानी से अपना भोजन बनाते हैं, जिसे सरल भाषा में प्रकाश संश्लेषण कहते हैं।';
                        vernacularScript = `सरल बाल-सुलभ हिंदी (${simplifyLevel})`;
                        breakdown = [
                            { word: 'हरे पत्ते (Green Leaves)', meaning: 'पौधे की भोजन बनाने वाली रसोई' },
                            { word: 'धूप (Sunlight)', meaning: 'सूर्य का प्रकाश व ऊर्जा' },
                            { word: 'प्रकाश संश्लेषण (Photosynthesis)', meaning: 'धूप से भोजन तैयार करने की प्राकृतिक प्रक्रिया' }
                        ];
                    } else if (lower.includes('subtract') || lower.includes('घटा') || lower.includes('minus') || lower.includes('बांट') || lower.includes('बचे') || lower.includes('आम') || lower.includes('mango')) {
                        translated = 'यदि हमारे पास १२ आम हैं और हमने ५ बच्चों में बांट दिए, तो हमारे पास ७ आम शेष बचेंगे (१२ - ५ = ७ घटाव)।';
                        vernacularScript = `सरल हिंदी: गणित घटाव (${simplifyLevel})`;
                        breakdown = [
                            { word: 'आम (Mango)', meaning: 'मीठा फल' },
                            { word: 'घटाना / बांटना (Subtract)', meaning: 'कुल संख्या में से कम करना' },
                            { word: 'शेष (Remaining)', meaning: 'बचा हुआ भाग' }
                        ];
                    } else if (lower.includes('स्लेट') || lower.includes('slate') || lower.includes('chalk') || lower.includes('चॉक') || lower.includes('निकाल') || lower.includes('किताब') || lower.includes('open')) {
                        translated = 'सभी बच्चे अपनी गणित की स्लेट और चॉक निकालें और सुंदर अक्षरों में हिसाब हल करें।';
                        vernacularScript = `कक्षा निर्देश: सरल हिंदी`;
                        breakdown = [
                            { word: 'स्लेट (Slate)', meaning: 'लिखने की छोटी तख्ती' },
                            { word: 'चॉक (Chalk)', meaning: 'सफेद खड़िया' }
                        ];
                    } else if (lower.includes('हाथ') || lower.includes('hand') || lower.includes('धो') || lower.includes('wash') || lower.includes('भोजन') || lower.includes('meal') || lower.includes('lunch')) {
                        translated = 'हाथों को साबुन और साफ पानी से अच्छी तरह धोकर ही दोपहर का भोजन (मिड-डे मील) करना चाहिए।';
                        vernacularScript = `दैनिक स्वच्छता नियम: हिंदी`;
                        breakdown = [
                            { word: 'हाथ धोना (Handwash)', meaning: 'कीटाणुओं को साफ करना' },
                            { word: 'भोजन (Meal)', meaning: 'दोपहर का खाना' }
                        ];
                    } else if (lower.includes('water') || lower.includes('पानी') || lower.includes('rain') || lower.includes('cloud') || lower.includes('नदी') || lower.includes('वर्षा')) {
                        translated = 'सूरज की तेज धूप से नदियों का पानी भाप बनकर ऊपर उठता है, आकाश में बादल बनाता है और फिर बारिश बनकर बरसता है।';
                        vernacularScript = `जल चक्र: सरल हिंदी`;
                        breakdown = [
                            { word: 'भाप (Water Vapor)', meaning: 'गर्म होकर उड़ा पानी' },
                            { word: 'बादल (Clouds)', meaning: 'आसमान में तैरते जल-कण' },
                            { word: 'वर्षा (Rainfall)', meaning: 'बारिश' }
                        ];
                    } else {
                        translated = `"${text}" का सरल एवं बाल-सुलभ हिंदी रूपांतरण (${simplifyLevel}): विद्यार्थियों को आसानी से समझ आने वाली भाषा।`;
                        vernacularScript = `सरल हिंदी रूपांतरण (${simplifyLevel})`;
                        breakdown = [
                            { word: 'विद्यार्थी (Student)', meaning: 'पढ़ने वाले बच्चे' },
                            { word: 'अवधारणा (Concept)', meaning: 'मुख्य विचार' }
                        ];
                    }
                } else if (lower.includes('photo') || lower.includes('प्रकाश') || lower.includes('food') || lower.includes('plant') || lower.includes('पत्त') || lower.includes('leaf') || lower.includes('धूप')) {
                    if (isBengaliTarget) {
                        translated = 'গাছের সবুজ পাতা সূর্যের আলো এবং জল দিয়ে তাদের নিজের খাবার তৈরি করে, তাকে সালোকসংশ্লেষ বলে।';
                        vernacularScript = 'সালোকসংশ্লেষ ও সবুজ পাতা';
                    } else if (isOdiaTarget) {
                        translated = 'ଗଛର ସବୁଜ ପତ୍ର ସୂର୍ଯ୍ୟାଲୋକ ଓ ଜଳ ସାହାଯ୍ୟରେ ନିଜ ଖାଦ୍ୟ ତିଆରି କରନ୍ତି, ଏହାକୁ ଆଲୋକ ସଂଶ୍ଳେଷଣ କୁହାଯାଏ।';
                        vernacularScript = 'ଆଲୋକ ସଂଶ୍ଳେଷଣ';
                    } else {
                        translated = 'ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ ᱠᱷᱚᱱ ᱡᱚᱢᱟᱜ ᱮ ᱛᱮᱭᱟᱨ-ᱟ (Dare sakam chando marsal khon aakowak jomak ko toiri-a).';
                        vernacularScript = 'ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ';
                    }
                    breakdown = [
                        { word: 'Dare (ᱫᱟᱨᱮ)', meaning: 'Tree / Plant' },
                        { word: 'Sakam (ᱥᱟᱠᱟᱢ)', meaning: 'Green leaves' },
                        { word: 'Chando Marsal (ᱪᱟᱸᱫᱚ ᱢᱟᱨᱥᱟᱞ)', meaning: 'Sunlight' },
                        { word: 'Jomak (ᱡᱚᱢᱟᱜ)', meaning: 'Food / Nutrition' }
                    ];
                } else if (lower.includes('subtract') || lower.includes('घटा') || lower.includes('minus') || lower.includes('बांट') || lower.includes('बचे') || lower.includes('आम') || lower.includes('mango')) {
                    if (isBengaliTarget) {
                        translated = '১২ টি আম থেকে ৫ টি আম দিলে আর ৭ টি আম অবশিষ্ট থাকে (বিয়োগ)।';
                        vernacularScript = 'বিয়োগ ও গণনা';
                    } else {
                        translated = 'ᱡᱩᱫᱤ ᱟᱵᱚ ᱴᱷᱮᱱ ᱑᱒ ᱜᱚᱴᱟᱝ ᱩᱞ ᱛᱟᱦᱮᱸᱱᱟ ᱟᱨ ᱕ ᱜᱚᱴᱟᱝ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱢᱟᱫ ᱠᱚᱣᱟ, ᱛᱚᱵᱮ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱡᱚᱜ-ᱟ? ᱗ ᱜᱚᱴᱟᱝ! (12 khon 5 bhegar kate 7 saréj-a!)';
                        vernacularScript = 'ᱵᱷᱮᱜᱟᱨ ᱞᱮᱠᱷᱟ (Subtraction)';
                    }
                    breakdown = [
                        { word: 'Ul (ᱩᱞ)', meaning: 'Mango fruit' },
                        { word: 'Bhegar (ᱵᱷᱮᱜᱟᱨ)', meaning: 'Subtract / Separate' },
                        { word: 'Saréj (ᱥᱟᱨᱮᱡ)', meaning: 'Remaining / Leftover' },
                        { word: 'Ema (ᱮᱢᱟ)', meaning: 'To distribute / Give' }
                    ];
                } else if (lower.includes('स्लेट') || lower.includes('slate') || lower.includes('chalk') || lower.includes('चॉक') || lower.includes('निकाल') || lower.includes('किताब') || lower.includes('open')) {
                    translated = 'ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱯᱱᱟᱨᱟᱜ ᱞᱮᱠᱷᱟ ᱥᱞᱮᱴ ᱟᱨ ᱠᱷᱚᱲᱤ ᱚᱰᱚᱠ ᱯᱮ ᱟᱨ ᱦᱤᱥᱟᱹᱵᱽ ᱛᱮᱭᱟᱨ ᱯᱮ (Joto gidra aapeyak slate ar khori oḍok pe ar hisab teyar pe).';
                    vernacularScript = 'ᱥᱞᱮᱴ ᱟᱨ ᱠᱷᱚᱲᱤ';
                    breakdown = [
                        { word: 'Joto gidra (ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ)', meaning: 'All children' },
                        { word: 'Slate (ᱥᱞᱮᱴ)', meaning: 'Writing Slate' },
                        { word: 'Khori (ᱠᱷᱚᱲᱤ)', meaning: 'Chalk piece' },
                        { word: 'Oḍok (ᱚᱰᱚᱠ)', meaning: 'Take out / Open' }
                    ];
                } else if (lower.includes('हाथ') || lower.includes('hand') || lower.includes('धो') || lower.includes('wash') || lower.includes('भोजन') || lower.includes('meal') || lower.includes('lunch')) {
                    translated = 'ᱛᱤ ᱟᱹᱨᱩᱵ ᱥᱟᱯᱷᱟ ᱠᱟᱛᱮ ᱜᱮ ᱛᱤᱠᱤᱱ ᱫᱟᱠᱟ ᱡᱚᱢ ᱫᱚᱨᱠᱟᱨ (Ti arup sapha kate ge tikin daka jom dorkar).';
                    vernacularScript = 'ᱛᱤ ᱟᱹᱨᱩᱵ ᱟᱨ ᱡᱚᱢᱟᱜ';
                    breakdown = [
                        { word: 'Ti (ᱛᱤ)', meaning: 'Hand' },
                        { word: 'Arup (ᱟᱹᱨᱩᱵ)', meaning: 'Wash / Clean' },
                        { word: 'Tikin daka (ᱛᱤᱠᱤᱱ ᱫᱟᱠᱟ)', meaning: 'Midday meal' },
                        { word: 'Dorkar (ᱫᱚᱨᱠᱟᱨ)', meaning: 'Necessary / Must' }
                    ];
                } else if (lower.includes('water') || lower.includes('पानी') || lower.includes('rain') || lower.includes('cloud') || lower.includes('नदी') || lower.includes('वर्षा')) {
                    translated = 'ᱫᱟᱜ ᱥᱮᱛᱚᱝ ᱛᱮ ᱫᱷᱩᱠᱟ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ᱨᱤᱢᱤᱞ ᱨᱮ ᱵᱟᱫᱽᱞᱟᱜ-ᱟ ᱟᱨ ᱫᱟᱜ ᱡᱟᱹᱲᱤᱜ-ᱟ (Dah do dhuka ban te remil re badla-a ar dah jorik-a).';
                    vernacularScript = 'ᱫᱟᱜ ᱟᱨ ᱨᱤᱢᱤᱞ';
                    breakdown = [
                        { word: 'Dah (ᱫᱟᱜ)', meaning: 'Water' },
                        { word: 'Dhuka (ᱫᱷᱩᱠᱟ)', meaning: 'Vapor / Steam' },
                        { word: 'Remil (ᱨᱤᱢᱤᱞ)', meaning: 'Cloud' },
                        { word: 'Dah jori (ᱫᱟᱜ ᱡᱟᱹᱲᱤ)', meaning: 'Rainfall' }
                    ];
                } else {
                    translated = `"${text}" ᱨᱮᱭᱟᱜ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱚᱨᱡᱚᱢᱟ: ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱦᱚᱡᱽ ᱠᱟᱛᱷᱟ (Simplified for ${simplifyLevel}: Gidra ko lagit bes te bujhaw).`;
                    vernacularScript = 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱚᱨᱡᱚᱢᱟ';
                    breakdown = [
                        { word: 'Gidra (ᱜᱤᱫᱽᱨᱟᱹ)', meaning: 'Child / Student' },
                        { word: 'Bujhaw (ᱵᱩᱡᱷᱟᱹᱣ)', meaning: 'Understand' },
                        { word: 'Cheda (ᱪᱮᱫᱚᱜ)', meaning: 'Learn' }
                    ];
                }

                userState.translationsMade += 1;
                resolve({
                    original: text,
                    sourceLang,
                    targetLang,
                    translated,
                    vernacularScript,
                    breakdown,
                    simplifiedFor: simplifyLevel,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }, 400);
        });
    }
};
