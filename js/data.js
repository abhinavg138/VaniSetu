// Mock Data Store for Vani Setu

export let currentActiveClass = 'Class 3';

export const availableClasses = ['Class 3', 'Class 4', 'Class 5'];

export const mockUser = {
    name: 'Meera Hansda',
    title: 'Assistant Teacher & Vernacular Lead',
    role: 'Teacher',
    school: 'Kheria Primary School',
    district: 'Purulia, West Bengal',
    assignedClasses: ['Class 3', 'Class 4', 'Class 5'],
    primaryMotherTongue: 'Santhali (Ol Chiki / Roman)',
    secondaryDialects: ['Bengali', 'Hindi', 'Kudmali'],
    avatarInitials: 'MH',
    totalStudents: 84,
    assessmentsAssigned: 19,
    translationsMade: 342,
    activeSince: 'August 2024'
};

export const mockLessonsByClass = {
    'Class 3': [
        { id: 301, time: '09:00', subject: 'Mathematics', title: 'Mathematics', subtitle: 'Subtraction with Story Problems · Class 3', status: 'in progress', color: '#f97316', bg: '#fff7ed', text: '#c2410c', vernacularBridge: 'Santhali: Bhegar / Gidra Khata' },
        { id: 302, time: '11:15', subject: 'Environmental Studies', title: 'Environmental Studies', subtitle: 'Our Forests & Wildlife · Class 3', status: 'up next', color: '#059669', bg: '#ecfdf5', text: '#047857', vernacularBridge: 'Santhali: Aaleak Bir Gada' },
        { id: 303, time: '14:00', subject: 'Language', title: 'Language & Storytelling', subtitle: 'Folktale: The Clever Jackal · Santhali / Hindi', status: 'up next', color: '#0284c7', bg: '#f0f9ff', text: '#0369a1', vernacularBridge: 'Bilingual Story Bridge' }
    ],
    'Class 4': [
        { id: 401, time: '09:45', subject: 'Mathematics', title: 'Mathematics', subtitle: 'Fractions & Shapes in Nature · Class 4', status: 'completed', color: '#059669', bg: '#ecfdf5', text: '#047857', vernacularBridge: 'Visual fractions in tribal patterns' },
        { id: 402, time: '11:45', subject: 'Environmental Studies', title: 'Environmental Studies', subtitle: 'Water Sources & Conservation · Class 4', status: 'in progress', color: '#f97316', bg: '#fff7ed', text: '#c2410c', vernacularBridge: 'Santhali: Daak doh ar chaash' },
        { id: 403, time: '13:30', subject: 'General Science', title: 'General Science', subtitle: 'Plant Parts & Photosynthesis · Class 4', status: 'up next', color: '#8b5cf6', bg: '#f5f3ff', text: '#6d28d9', vernacularBridge: 'Dare sakam ar marsal jomak' }
    ],
    'Class 5': [
        { id: 501, time: '08:45', subject: 'General Science', title: 'General Science', subtitle: 'Solar System & Planetary Orbits · Class 5', status: 'in progress', color: '#f97316', bg: '#fff7ed', text: '#c2410c', vernacularBridge: 'Chando Mondol ar Graho ko' },
        { id: 502, time: '10:30', subject: 'Mathematics', title: 'Mathematics', subtitle: 'Area, Perimeter & Practical Farming Math · Class 5', status: 'up next', color: '#0284c7', bg: '#f0f9ff', text: '#0369a1', vernacularBridge: 'Khet map ar hisab' },
        { id: 503, time: '13:00', subject: 'Environmental Studies', title: 'Environmental Studies', subtitle: 'Ecosystems, Forests & Climate Protection · Class 5', status: 'up next', color: '#059669', bg: '#ecfdf5', text: '#047857', vernacularBridge: 'Bilingual Hindi & Santhali' }
    ]
};

export const mockStatsByClass = {
    'Class 3': {
        averageUnderstanding: 78,
        totalLearners: 28,
        activeNeedsBridge: 14,
        subjects: [
            { name: 'Maths', value: 82, color: '#059669' },
            { name: 'Language', value: 93, color: '#059669' },
            { name: 'EVS', value: 71, color: '#059669' }
        ]
    },
    'Class 4': {
        averageUnderstanding: 84,
        totalLearners: 30,
        activeNeedsBridge: 11,
        subjects: [
            { name: 'Maths', value: 79, color: '#059669' },
            { name: 'Language', value: 89, color: '#059669' },
            { name: 'Science', value: 85, color: '#059669' }
        ]
    },
    'Class 5': {
        averageUnderstanding: 81,
        totalLearners: 26,
        activeNeedsBridge: 9,
        subjects: [
            { name: 'Maths', value: 86, color: '#059669' },
            { name: 'Science', value: 83, color: '#059669' },
            { name: 'Language', value: 75, color: '#059669' }
        ]
    }
};

export const mockStudents = [
    // Class 3 Students
    { id: 's301', roll: '01', name: 'Babu Soren', class: 'Class 3', motherTongue: 'Santhali', comprehensionIndex: 88, engagement: 'High (7 questions)', confidence: 'Growing steadily', avatarBg: '#fed7aa', avatarColor: '#c2410c', assessmentsCompleted: 6, attendance: '96%' },
    { id: 's302', roll: '04', name: 'Pooja Murmu', class: 'Class 3', motherTongue: 'Santhali', comprehensionIndex: 92, engagement: 'Very Active', confidence: 'Fluent', avatarBg: '#fee2e2', avatarColor: '#b91c1c', assessmentsCompleted: 7, attendance: '100%' },
    { id: 's303', roll: '09', name: 'Rohan Bauri', class: 'Class 3', motherTongue: 'Bengali', comprehensionIndex: 74, engagement: 'Moderate', confidence: 'Needs Hindi Bridge', avatarBg: '#e0f2fe', avatarColor: '#0369a1', assessmentsCompleted: 5, attendance: '88%' },
    { id: 's304', roll: '12', name: 'Sunita Hembram', class: 'Class 3', motherTongue: 'Santhali', comprehensionIndex: 85, engagement: 'High', confidence: 'Confident', avatarBg: '#fef3c7', avatarColor: '#b45309', assessmentsCompleted: 7, attendance: '92%' },
    { id: 's305', roll: '15', name: 'Karan Mahato', class: 'Class 3', motherTongue: 'Kudmali', comprehensionIndex: 69, engagement: 'Active', confidence: 'Developing', avatarBg: '#dcfce7', avatarColor: '#15803d', assessmentsCompleted: 4, attendance: '85%' },
    { id: 's306', roll: '18', name: 'Rani Tudu', class: 'Class 3', motherTongue: 'Santhali', comprehensionIndex: 94, engagement: 'Top Contributor', confidence: 'Fluent Bilingual', avatarBg: '#fae8ff', avatarColor: '#86198f', assessmentsCompleted: 7, attendance: '98%' },

    // Class 4 Students
    { id: 's401', roll: '02', name: 'Anjali Hansda', class: 'Class 4', motherTongue: 'Santhali', comprehensionIndex: 89, engagement: 'High', confidence: 'Fluent', avatarBg: '#fee2e2', avatarColor: '#b91c1c', assessmentsCompleted: 8, attendance: '95%' },
    { id: 's402', roll: '05', name: 'Bikash Murmu', class: 'Class 4', motherTongue: 'Santhali', comprehensionIndex: 82, engagement: 'Active in group', confidence: 'Steady', avatarBg: '#fed7aa', avatarColor: '#c2410c', assessmentsCompleted: 7, attendance: '90%' },
    { id: 's403', roll: '08', name: 'Dipika Karmakar', class: 'Class 4', motherTongue: 'Bengali', comprehensionIndex: 87, engagement: 'Very Active', confidence: 'Strong', avatarBg: '#e0f2fe', avatarColor: '#0369a1', assessmentsCompleted: 8, attendance: '94%' },
    { id: 's404', roll: '14', name: 'Somnath Soren', class: 'Class 4', motherTongue: 'Santhali', comprehensionIndex: 78, engagement: 'Needs Prompting', confidence: 'Moderate', avatarBg: '#f3e8ff', avatarColor: '#7e22ce', assessmentsCompleted: 6, attendance: '89%' },

    // Class 5 Students
    { id: 's501', roll: '03', name: 'Manoj Marandi', class: 'Class 5', motherTongue: 'Santhali', comprehensionIndex: 91, engagement: 'Class Leader', confidence: 'Fluent English & Santhali', avatarBg: '#dbeafe', avatarColor: '#1e40af', assessmentsCompleted: 9, attendance: '98%' },
    { id: 's502', roll: '07', name: 'Sneha Mondal', class: 'Class 5', motherTongue: 'Bengali', comprehensionIndex: 86, engagement: 'High', confidence: 'Confident', avatarBg: '#ffedd5', avatarColor: '#c2410c', assessmentsCompleted: 8, attendance: '96%' },
    { id: 's503', roll: '11', name: 'Arjun Baskey', class: 'Class 5', motherTongue: 'Santhali', comprehensionIndex: 80, engagement: 'Curious', confidence: 'Growing fast', avatarBg: '#dcfce7', avatarColor: '#166534', assessmentsCompleted: 8, attendance: '91%' },
    { id: 's504', roll: '16', name: 'Mamata Soren', class: 'Class 5', motherTongue: 'Santhali', comprehensionIndex: 76, engagement: 'Consistent', confidence: 'Needs Science Bridge', avatarBg: '#fae8ff', avatarColor: '#86198f', assessmentsCompleted: 7, attendance: '88%' }
];

export const mockVocabularyByClass = {
    'Class 3': [
        { id: 'v1', theme: 'Environment / Science', target: 'सूरज (Sun)', vernacular: 'चांदो (Chando)', script: 'ᱪᱟᱸᱫᱚ', english: 'Sun', frequency: 'High', context: 'Used in sunrise & morning lesson' },
        { id: 'v2', theme: 'Environment / Science', target: 'पानी (Water)', vernacular: 'दाः (Dah)', script: 'ᱫᱟᱜ', english: 'Water', frequency: 'Very High', context: 'Rivers, rains and drinking water' },
        { id: 'v3', theme: 'Biology', target: 'पेड़ (Tree)', vernacular: 'दारे (Dare)', script: 'ᱫᱟᱨᱮ', english: 'Tree', frequency: 'High', context: 'Trees give shelter and oxygen' },
        { id: 'v4', theme: 'Mathematics', target: 'गिनती / संख्या (Count)', vernacular: 'लेखा (Lekha)', script: 'ᱞᱮᱠᱷᱟ', english: 'Count / Number', frequency: 'High', context: 'Math addition and counting objects' },
        { id: 'v5', theme: 'Mathematics', target: 'घटाना (Subtract)', vernacular: 'भेगार (Bhegar)', script: 'ᱵᱷᱮᱜᱟᱨ', english: 'Subtract / Separate', frequency: 'High', context: 'Taking away quantities' },
        { id: 'v6', theme: 'Environment', target: 'पत्ते (Leaves)', vernacular: 'साकाम (Sakam)', script: 'ᱥᱟᱠᱟᱢ', english: 'Leaf / Leaves', frequency: 'Medium', context: 'Green color in trees' }
    ],
    'Class 4': [
        { id: 'v7', theme: 'General Science', target: 'प्रकाश संश्लेषण (Photosynthesis)', vernacular: 'marsal te jomak toiri (ᱢᱟᱨᱥᱟᱞ ᱛᱮ ᱡᱚᱢᱟᱜ)', script: 'ᱢᱟᱨᱥᱟᱞ ᱛᱮ ᱡᱚᱢᱟᱜ', english: 'Photosynthesis', frequency: 'Very High', context: 'Food making process by leaves' },
        { id: 'v8', theme: 'EVS / Water', target: 'भाप / वाष्प (Steam)', vernacular: 'धुका / वाष्प (Dhuka)', script: 'ᱫᱷᱩᱠᱟ', english: 'Water Vapor / Steam', frequency: 'High', context: 'Water boiling and cloud formation' },
        { id: 'v9', theme: 'Mathematics', target: 'आधा / भिन्न (Half / Fraction)', vernacular: 'ताला / हात (Tala)', script: 'ᱛᱟᱞᱟ', english: 'Fraction / Half part', frequency: 'High', context: 'Dividing rotis and fields' },
        { id: 'v10', theme: 'Environment', target: 'जड़ें (Roots)', vernacular: 'रेहेत (Rehet)', script: 'ᱨᱮᱦᱮᱫ', english: 'Roots', frequency: 'Medium', context: 'Drinking water from soil' }
    ],
    'Class 5': [
        { id: 'v11', theme: 'Astronomy / Science', target: 'सौरमंडल (Solar System)', vernacular: 'चांदो मोंडोल (Chando Mondol)', script: 'ᱪᱟᱸᱫᱚ ᱢᱚᱱᱰᱚᱞ', english: 'Solar System', frequency: 'High', context: 'Sun and orbiting 8 planets' },
        { id: 'v12', theme: 'Science', target: 'ग्रह (Planet)', vernacular: 'ग्राहा (Graho)', script: 'ᱜᱽᱨᱟᱦᱚ', english: 'Planet', frequency: 'High', context: 'Earth and neighboring planets' },
        { id: 'v13', theme: 'Mathematics', target: 'क्षेत्रफल (Area)', vernacular: 'जायगा लेखा / ओसार (Jayga Lekha)', script: 'ᱡᱟᱭᱜᱟ ᱞᱮᱠᱷᱟ', english: 'Area', frequency: 'Very High', context: 'Size of school ground or field' },
        { id: 'v14', theme: 'EVS', target: 'पारिस्थितिकी (Ecosystem)', vernacular: 'बिर आर जिब-जियली संसार', script: 'ᱵᱤᱨ ᱟᱨ ᱡᱤᱵ', english: 'Ecosystem / Habitat', frequency: 'Medium', context: 'Interdependence of animals & trees' }
    ]
};

export const initialAssessments = [
    {
        id: 'asm-301',
        title: 'Class 3 Subtraction with Vernacular Word Stories',
        class: 'Class 3',
        subject: 'Mathematics',
        topic: 'Subtraction (1 to 50)',
        language: 'Santhali & Hindi Bridge',
        questionCount: 5,
        difficulty: 'Easy',
        type: 'Bilingual Story Quiz',
        assignedDate: '07 Sep 2026',
        dueDate: '12 Sep 2026',
        assignedTo: 'All 28 students',
        totalStudents: 28,
        submissionsCount: 24,
        averageScore: 84,
        status: 'Active',
        questions: [
            {
                qText: 'If Somu has 15 mangoes and gives 6 mangoes to his sister, how many mangoes are left?',
                vernacularText: 'Somu theñ 15 ul tahekana. Uni 6 ul ajin buhin e emadeya. Uni theñ tinak ul saréj-ena? (सोमु के पास 15 आम थे, उसने 6 अपनी बहन को दिए। अब कितने बचे?)',
                options: ['8', '9', '11', '7'],
                correctIndex: 1,
                explanation: '15 - 6 = 9. 15 mangoes minus 6 leaves 9 mangoes.'
            },
            {
                qText: 'What does "Bhegar" (भेगार) mean in daily mathematics?',
                vernacularText: '"Bhegar" reak mane chet leka? ("भेगार" का अर्थ क्या होता है?)',
                options: ['Jor (Addition)', 'Bhegar (Subtraction / Taking away)', 'Lekha (Counting)', 'Guna (Multiplication)'],
                correctIndex: 1,
                explanation: 'Bhegar signifies separating or subtracting.'
            },
            {
                qText: 'A tree had 24 birds. 8 birds flew away to the river. How many birds remain on the tree?',
                vernacularText: 'Mit dare re 24 chene ko tahekana. 8 chene gaada seć ko ud ena. Dare re tinak chene menak kowa?',
                options: ['16 birds', '14 birds', '18 birds', '12 birds'],
                correctIndex: 0,
                explanation: '24 - 8 = 16 birds remaining.'
            }
        ]
    },
    {
        id: 'asm-302',
        title: 'Our Forest & Animal Habitat Comprehension',
        class: 'Class 3',
        subject: 'Environmental Studies',
        topic: 'Forests, Trees & Clean Water',
        language: 'Santhali & Hindi',
        questionCount: 4,
        difficulty: 'Medium',
        type: 'Pictorial & Concept Check',
        assignedDate: '05 Sep 2026',
        dueDate: '10 Sep 2026',
        assignedTo: 'All 28 students',
        totalStudents: 28,
        submissionsCount: 27,
        averageScore: 91,
        status: 'Graded',
        questions: [
            {
                qText: 'Why do forest trees (Dare) need water (Dah)?',
                vernacularText: 'Dare do dah chedak jarurog-a? (पेड़ों को पानी की आवश्यकता क्यों होती है?)',
                options: ['To grow and make food', 'To sleep', 'To talk to birds', 'To change color'],
                correctIndex: 0,
                explanation: 'Trees absorb water to produce their nutrients with sunlight.'
            },
            {
                qText: 'Which animal in our local forest gives an alert call when predators approach?',
                vernacularText: 'Aleak bir re oka jantu saade aalae katha em-a?',
                options: ['Deer / Jhil (ঝিল)', 'Monkey / Gari (ᱜᱟᱹᱲᱤ)', 'Fox / Tuñki', 'Pigeon'],
                correctIndex: 1,
                explanation: 'Monkeys chitter loudly from high tree branches to warn the forest.'
            }
        ]
    },
    {
        id: 'asm-401',
        title: 'Class 4 Plant Food & Water Cycle Assessment',
        class: 'Class 4',
        subject: 'General Science',
        topic: 'Photosynthesis & Water States',
        language: 'Santhali & Bengali Bridge',
        questionCount: 5,
        difficulty: 'Medium',
        type: 'Bilingual Concept Quiz',
        assignedDate: '08 Sep 2026',
        dueDate: '15 Sep 2026',
        assignedTo: 'All 30 students',
        totalStudents: 30,
        submissionsCount: 19,
        averageScore: 82,
        status: 'Active',
        questions: [
            {
                qText: 'Where do plants make their food using sunlight?',
                vernacularText: 'Dare do aakowak jomak chando marsal te oka re ko toiri-a? (पौधे धूप में अपना भोजन कहाँ बनाते हैं?)',
                options: ['Leaves / Sakam (ᱥᱟᱠᱟᱢ)', 'Roots / Rehet (ᱨᱮᱦᱮᱫ)', 'Branches / Dar', 'Bark / Chhal'],
                correctIndex: 0,
                explanation: 'Leaves absorb sunlight and contain chlorophyll to synthesize food.'
            },
            {
                qText: 'When puddle water disappears in hot sun, it transforms into:',
                vernacularText: 'Seton din re garak dah añjed kate chet re badla-a?',
                options: ['Ice (Barf)', 'Water vapor / Dhuka (ᱫᱷᱩᱠᱟ)', 'Mud (Loso)', 'Smoke'],
                correctIndex: 1,
                explanation: 'Water evaporates into water vapor under sunlight heat.'
            }
        ]
    },
    {
        id: 'asm-501',
        title: 'Class 5 Solar System & Planets Bilingual Check',
        class: 'Class 5',
        subject: 'General Science',
        topic: 'Planetary Order & Earth Orbit',
        language: 'Santhali, Hindi & English',
        questionCount: 5,
        difficulty: 'Medium',
        type: 'Bilingual Concept Quiz',
        assignedDate: '06 Sep 2026',
        dueDate: '14 Sep 2026',
        assignedTo: 'All 26 students',
        totalStudents: 26,
        submissionsCount: 22,
        averageScore: 87,
        status: 'Active',
        questions: [
            {
                qText: 'What is at the center of our Solar System (Chando Mondol)?',
                vernacularText: 'Chando Mondol reak tala re chet menak-a? (हमारे सौरमंडल के केंद्र में क्या है?)',
                options: ['The Sun (Chando)', 'Earth (Dharti)', 'Moon (Ñindurchando)', 'Jupiter'],
                correctIndex: 0,
                explanation: 'The Sun is at the center, providing light and gravitational pull to all planets.'
            },
            {
                qText: 'How many planets orbit around the Sun?',
                vernacularText: 'Chando gondo re tinak graho ko achurog kana?',
                options: ['7', '8', '9', '12'],
                correctIndex: 1,
                explanation: 'There are 8 recognized planets in our solar system.'
            }
        ]
    },
    {
        id: 'asm-502',
        title: 'Field Measurement & Practical Perimeter Quiz',
        class: 'Class 5',
        subject: 'Mathematics',
        topic: 'Perimeter and Practical Land Units',
        language: 'Hindi & Santhali Bridge',
        questionCount: 4,
        difficulty: 'Challenging',
        type: 'Applied Math Quiz',
        assignedDate: '01 Sep 2026',
        dueDate: '06 Sep 2026',
        assignedTo: 'All 26 students',
        totalStudents: 26,
        submissionsCount: 26,
        averageScore: 85,
        status: 'Graded',
        questions: [
            {
                qText: 'A school garden is 10 meters long and 6 meters wide. What is its total fence boundary (perimeter)?',
                vernacularText: 'Aleak school baagan 10 meter jhiling ar 6 meter oosar menak-a. Ghiraw reak joto map tinak?',
                options: ['32 meters', '60 meters', '16 meters', '28 meters'],
                correctIndex: 0,
                explanation: 'Perimeter = 2 * (10 + 6) = 32 meters.'
            }
        ]
    }
];

export const quickClassroomPhrases = [
    {
        category: 'Instructions',
        english: 'Open your notebooks to page 12',
        hindi: 'अपनी कॉपी का पृष्ठ 12 खोलें',
        vernacular: 'Aapeyak khata 12 nombor saakám jhij pe',
        dialect: 'Santhali'
    },
    {
        category: 'Instructions',
        english: 'Please listen carefully to the explanation',
        hindi: 'कृपया ध्यान से व्याख्या सुनें',
        vernacular: 'Dayakháti ror do mone lagaw kate añjom pe',
        dialect: 'Santhali'
    },
    {
        category: 'Encouragement',
        english: 'Very well done! Keep it up!',
        hindi: 'बहुत बढ़िया! ऐसे ही सीखते रहें!',
        vernacular: 'Aadi bes! Noka ge chedaay pe!',
        dialect: 'Santhali'
    },
    {
        category: 'Understanding',
        english: 'Did everyone understand this concept?',
        hindi: 'क्या सभी को यह समझ में आया?',
        vernacular: 'Joto hor chet am bujhaw keda?',
        dialect: 'Santhali'
    },
    {
        category: 'Classroom',
        english: 'Who wants to answer on the blackboard?',
        hindi: 'ब्लैकबोर्ड पर उत्तर कौन लिखेगा?',
        vernacular: 'Board re laleay lai koy e sahaw a?',
        dialect: 'Santhali'
    },
    {
        category: 'Bengali Bridge',
        english: 'Write the question in your notebook',
        hindi: 'प्रश्न को अपनी कॉपी में लिखें',
        vernacular: 'Proshno-ta nijer khatay lekho',
        dialect: 'Bengali'
    }
];

export const lessonPlansByClass = {
    'Class 3': [
        {
            id: 'lp-301',
            title: 'Subtraction through Forest Fruit Stories',
            subject: 'Mathematics',
            duration: '45 mins',
            dialectBridge: 'Santhali / Ol Chiki',
            summary: 'Using physical tamarind seeds (teteng) and mango counting to bridge subtraction concepts into everyday tribal village life.',
            steps: [
                'Warmup: Count 1 to 20 in Santhali and Hindi using seed counters.',
                'Story introduction: Somu goes to forest market with 15 mangos.',
                'Concept bridge: Explain "Bhegar" (separate) as Subtraction.',
                'Student practice on mini slates in pairs.'
            ]
        },
        {
            id: 'lp-302',
            title: 'Water Cycle & Rain Songs',
            subject: 'Environmental Studies',
            duration: '40 mins',
            dialectBridge: 'Santhali / Bengali',
            summary: 'Singing traditional monsoon harvest songs while learning how river water evaporates into clouds (Remil).',
            steps: [
                'Sing traditional rain greeting chant together.',
                'Demonstrate hot water steam in a steel glass.',
                'Draw the water cycle with Santhali labels (Dah -> Dhuka -> Remil -> Dah).'
            ]
        }
    ],
    'Class 4': [
        {
            id: 'lp-401',
            title: 'Fractions via Village Bread and Land Partitioning',
            subject: 'Mathematics',
            duration: '50 mins',
            dialectBridge: 'Santhali / Hindi',
            summary: 'Connecting halves (Tala) and quarters to sharing rotis and vegetable farming patches.',
            steps: [
                'Paper folding activity: 1/2, 1/4, and 3/4.',
                'Bridge terms: "Tala" = Half, "Pon Hat" = Quarter.',
                'Solve 4 bilingual word problems together.'
            ]
        }
    ],
    'Class 5': [
        {
            id: 'lp-501',
            title: 'Chando Mondol (Our Solar System) Scale Model',
            subject: 'General Science',
            duration: '50 mins',
            dialectBridge: 'Santhali / Hindi / English',
            summary: 'Students play roles of Sun and 8 revolving planets on the school playground.',
            steps: [
                'Assign student roles: Sun at center, Mercury, Venus, Earth etc.',
                'Chant planetary order names in English, Hindi and vernacular.',
                'Explain day & night caused by Earth spinning.'
            ]
        }
    ]
};

export const worksheetsByClass = {
    'Class 3': [
        { id: 'ws-301', title: 'Fruit Basket Subtraction Bilingual Worksheet', questions: 10, pages: 2, level: 'Class 3', subject: 'Mathematics' },
        { id: 'ws-302', title: 'Tree Parts & Forest Friends Activity Sheet', questions: 8, pages: 1, level: 'Class 3', subject: 'EVS' }
    ],
    'Class 4': [
        { id: 'ws-401', title: 'Fraction Matching with Santhali Folk Patterns', questions: 12, pages: 2, level: 'Class 4', subject: 'Mathematics' },
        { id: 'ws-402', title: 'Photosynthesis Leaf Diagram & Vocabulary', questions: 8, pages: 2, level: 'Class 4', subject: 'Science' }
    ],
    'Class 5': [
        { id: 'ws-501', title: 'Planets Orbit Time & Solar System Crossword', questions: 15, pages: 3, level: 'Class 5', subject: 'Science' },
        { id: 'ws-502', title: 'Playground Perimeter & Area Measurement Lab', questions: 10, pages: 2, level: 'Class 5', subject: 'Mathematics' }
    ]
};
