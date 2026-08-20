const fs = require('fs');

const subjectsMeta = {
  english: {
    name: 'English',
    icon: 'english_illustration.png',
    introFormat: (classNum, isYoung, isSenior) => {
      if (isYoung) return `The NTI Class ${classNum} English Olympiad is designed to help young learners strengthen their grammar, vocabulary, and reading comprehension skills.`;
      if (isSenior) return `The NTI Class ${classNum} English Olympiad is designed for students to master advanced grammar, analytical reading, and complex verbal reasoning for higher academic success.`;
      return `The NTI Class ${classNum} English Olympiad focuses on enhancing language proficiency, critical reading, and comprehensive grammar application.`;
    }
  },
  science: {
    name: 'Science',
    icon: 'science_illustration.png',
    introFormat: (classNum, isYoung, isSenior) => {
      if (isYoung) return `The NTI Class ${classNum} Science Olympiad is designed to ignite curiosity about the natural world, focusing on basic environmental science and life science concepts.`;
      if (isSenior) return `The NTI Class ${classNum} Science Olympiad challenges students with advanced physics, chemistry, and biology concepts, laying a strong foundation for competitive exams like NEET and JEE.`;
      return `The NTI Class ${classNum} Science Olympiad emphasizes empirical observation, scientific reasoning, and foundational concepts across physics, chemistry, and biology.`;
    }
  },
  'information-technology': {
    name: 'Information Technology',
    icon: 'it_illustration.png',
    introFormat: (classNum, isYoung, isSenior) => {
      if (isYoung) return `The NTI Class ${classNum} IT Olympiad introduces young students to the basics of computers, digital literacy, and simple logic puzzles.`;
      if (isSenior) return `The NTI Class ${classNum} IT Olympiad dives into advanced programming concepts, networking, database management, and emerging technologies.`;
      return `The NTI Class ${classNum} IT Olympiad bridges the gap between basic computer knowledge and advanced programming logic, focusing on software and hardware fundamentals.`;
    }
  },
  finance: {
    name: 'Finance',
    icon: 'finance_illustration.png',
    introFormat: (classNum, isYoung, isSenior) => {
      if (isYoung) return `The NTI Class ${classNum} Finance Olympiad introduces early learners to basic money concepts, the value of saving, and simple financial literacy.`;
      if (isSenior) return `The NTI Class ${classNum} Finance Olympiad explores macroeconomics, investment strategies, taxation, and advanced financial modeling.`;
      return `The NTI Class ${classNum} Finance Olympiad develops critical financial literacy, focusing on budgeting, banking, and understanding the economy.`;
    }
  }
};

const syllabusTopics = {
  english: {
    'class-1': ['Alphabet Test', 'Vowels and Consonants', 'Nouns (Naming Words)', 'Pronouns', 'Action Words (Verbs)', 'Adjectives', 'Reading Comprehension'],
    'class-2': ['Nouns (Common & Proper)', 'Singular and Plural', 'Pronouns', 'Verbs and Tenses (Simple)', 'Adjectives and Adverbs', 'Prepositions', 'Reading Comprehension'],
    'class-3': ['Nouns, Pronouns, Verbs, Adjectives, Adverbs', 'Prepositions and Conjunctions', 'Tenses (Simple and Continuous)', 'Synonyms and Antonyms', 'Spelling and Vocabulary', 'Reading Comprehension'],
    'class-4': ['Parts of Speech', 'Tenses', 'Subject-Verb Agreement', 'Punctuation', 'Synonyms, Antonyms, Idioms', 'Reading Comprehension', 'Spoken and Written Expression'],
    'class-5': ['Advanced Parts of Speech', 'Tenses and Modals', 'Active and Passive Voice', 'Direct and Indirect Speech', 'Vocabulary and Idioms', 'Reading Comprehension'],
    'class-6': ['Nouns, Pronouns, Verbs, Adverbs, Adjectives', 'Prepositions, Conjunctions, Interjections', 'Tenses, Voices, and Narration', 'Phrases and Clauses', 'Vocabulary, Synonyms, Antonyms', 'Reading Comprehension'],
    'class-7': ['Advanced Grammar Usage', 'Tenses and Modals', 'Active/Passive Voice & Reported Speech', 'Phrases, Clauses, and Sentence Structure', 'Vocabulary, Idioms, Proverbs', 'Reading Comprehension'],
    'class-8': ['Comprehensive Grammar', 'Tenses, Modals, Conditionals', 'Voices and Narration', 'Complex and Compound Sentences', 'Vocabulary, Idioms, Phrasal Verbs', 'Reading Comprehension'],
    'class-9': ['Advanced Grammar and Usage', 'Tenses, Modals, Conditionals', 'Voices, Narration, Clauses', 'Sentence Transformation', 'Vocabulary, Word Power, Idioms', 'Reading Comprehension'],
    'class-10': ['Mastery of English Grammar', 'Complex Sentence Transformations', 'Advanced Vocabulary and Usage', 'Reading Comprehension (Advanced)', 'Spoken and Written Expression (Advanced)']
  },
  science: {
    'class-1': ['Me and My Body', 'Plants and Animals around us', 'Food and Water', 'Our Universe', 'Safety Rules', 'Logical Reasoning'],
    'class-2': ['Human Body', 'Plants and Animals', 'Food, Water and Air', 'Earth and Universe', 'Matter and Materials', 'Logical Reasoning'],
    'class-3': ['Human Body and Health', 'Plants and Animals', 'Birds and Insects', 'Matter and Materials', 'Earth and Universe', 'Light, Sound and Force', 'Logical Reasoning'],
    'class-4': ['Human Body and Health', 'Plants and Animals', 'Matter and Materials', 'Earth and Universe', 'Force, Work and Energy', 'Logical Reasoning'],
    'class-5': ['Human Body and Health', 'Plants and Animals', 'Matter and Materials', 'Earth and Universe', 'Force, Work and Energy', 'Natural Resources and Calamities', 'Logical Reasoning'],
    'class-6': ['Food and its Components', 'Sorting Materials into Groups', 'Separation of Substances', 'Getting to Know Plants', 'Body Movements', 'The Living Organisms', 'Motion and Measurement of Distances', 'Light, Shadows and Reflections', 'Electricity and Circuits', 'Magnets', 'Logical Reasoning'],
    'class-7': ['Nutrition in Plants and Animals', 'Heat', 'Acids, Bases and Salts', 'Physical and Chemical Changes', 'Respiration in Organisms', 'Transportation in Animals and Plants', 'Reproduction in Plants', 'Motion and Time', 'Electric Current and its Effects', 'Light', 'Logical Reasoning'],
    'class-8': ['Crop Production and Management', 'Microorganisms', 'Synthetic Fibres and Plastics', 'Materials: Metals and Non-Metals', 'Coal and Petroleum', 'Combustion and Flame', 'Conservation of Plants and Animals', 'Cell - Structure and Functions', 'Reproduction in Animals', 'Reaching the Age of Adolescence', 'Force and Pressure', 'Friction', 'Sound', 'Chemical Effects of Electric Current', 'Some Natural Phenomena', 'Light', 'Stars and the Solar System', 'Logical Reasoning'],
    'class-9': ['Matter in Our Surroundings', 'Is Matter Around Us Pure', 'Atoms and Molecules', 'Structure of the Atom', 'The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms', 'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound', 'Why Do We Fall Ill', 'Natural Resources', 'Improvement in Food Resources', 'Logical Reasoning'],
    'class-10': ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Periodic Classification of Elements', 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce?', 'Heredity and Evolution', 'Light - Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Sources of Energy', 'Our Environment', 'Management of Natural Resources', 'Logical Reasoning']
  },
  'information-technology': {
    'class-1': ['Introduction to Computers', 'Parts of Computer', 'Uses of Computer', 'Keyboard and Mouse', 'Paint', 'Logical Reasoning'],
    'class-2': ['Computer-A Smart Machine', 'Parts of Computer', 'Uses of Computer', 'Keyboard and Mouse', 'MS Paint', 'Logical Reasoning'],
    'class-3': ['Fundamentals of Computer', 'Hardware and Software', 'Operating System', 'MS Word', 'MS Paint', 'Internet', 'Logical Reasoning'],
    'class-4': ['Computer Memory', 'Hardware and Software', 'Windows Operating System', 'MS Word', 'MS PowerPoint', 'Internet', 'Logical Reasoning'],
    'class-5': ['Evolution of Computers', 'Software and its Types', 'Windows Operating System', 'MS Word', 'MS PowerPoint', 'MS Excel', 'Internet and E-mail', 'Logical Reasoning'],
    'class-6': ['Fundamentals of Computer', 'Memory & Storage Devices', 'Windows Operating System', 'MS Word', 'MS PowerPoint', 'MS Excel', 'Internet and E-mail', 'Introduction to QBasic', 'Logical Reasoning'],
    'class-7': ['Fundamentals of Computer', 'Hardware and Software', 'Windows Operating System', 'MS Word', 'MS PowerPoint', 'MS Excel', 'Internet and Viruses', 'HTML', 'Logical Reasoning'],
    'class-8': ['Fundamentals of Computer', 'Networking', 'Windows Operating System', 'MS Word', 'MS PowerPoint', 'MS Excel', 'MS Access', 'Internet and Viruses', 'HTML', 'Logical Reasoning'],
    'class-9': ['Computer Systems', 'Networking', 'Windows Operating System', 'MS Word', 'MS PowerPoint', 'MS Excel', 'MS Access', 'HTML/XML', 'Programming in C++', 'Logical Reasoning'],
    'class-10': ['Computer Systems', 'Networking', 'Windows Operating System', 'MS Word', 'MS PowerPoint', 'MS Excel', 'MS Access', 'HTML/XML', 'Programming in C++/Java', 'IT Applications', 'Logical Reasoning']
  },
  finance: {
    'class-1': ['What is Money?', 'Coins and Notes', 'Needs vs Wants', 'Piggy Bank and Savings', 'Buying and Selling Basics', 'Logical Reasoning'],
    'class-2': ['History of Money', 'Identifying Currency', 'Needs, Wants and Savings', 'Banks and ATM', 'Earning Money', 'Logical Reasoning'],
    'class-3': ['Currency of Different Countries', 'Needs, Wants, and Budgeting', 'Banks, ATM, and Cheques', 'Earning and Spending', 'Digital Payments', 'Logical Reasoning'],
    'class-4': ['Currencies of the World', 'Budgeting and Planning', 'Banks and their Functions', 'Earning, Spending, and Donating', 'Digital Money', 'Logical Reasoning'],
    'class-5': ['Evolution of Money', 'Personal Budgeting', 'Banking System', 'Digital and Plastic Money', 'Introduction to Taxes', 'Logical Reasoning'],
    'class-6': ['History and Evolution of Money', 'Banking System in India', 'Budgeting and Financial Planning', 'Digital Payments and Security', 'Taxes and Economy', 'Logical Reasoning'],
    'class-7': ['Evolution of Money', 'Banking System and RBI', 'Financial Planning and Budgeting', 'Digital Payments', 'Taxes and Economy', 'Introduction to Investments', 'Logical Reasoning'],
    'class-8': ['Money and Banking', 'Financial Planning', 'Digital Payments and Cybersecurity', 'Taxes and Economy', 'Investments (Shares, Mutual Funds)', 'Insurance', 'Logical Reasoning'],
    'class-9': ['Money and Banking', 'Financial Planning and Budgeting', 'Digital Payments and Cybersecurity', 'Taxes and Economy', 'Investments and Stock Market', 'Insurance and Risk Management', 'Logical Reasoning'],
    'class-10': ['Money, Banking and RBI', 'Financial Planning and Budgeting', 'Digital Payments and Cybersecurity', 'Taxes, Economy, and Inflation', 'Investments, Stock Market, and Mutual Funds', 'Insurance and Risk Management', 'Logical Reasoning']
  }
};

function generateClassData(subjectSlug, classNum) {
  const classSlug = `class-${classNum}`;
  const topics = syllabusTopics[subjectSlug][classSlug] || ['Syllabus to be updated soon.'];
  const isYoung = classNum <= 5;
  const isSenior = classNum >= 9;
  const meta = subjectsMeta[subjectSlug];
  const aboutIntro = meta.introFormat(classNum, isYoung, isSenior);
  const subjName = meta.name;

  return {
    published: true,
    title: `${subjName} Olympiad for Class ${classNum}`,
    metaTitle: `${subjName} Class ${classNum} Olympiad Syllabus – NTI`,
    metaDescription: `Detailed syllabus and guidelines for the NTI ${subjName} Class ${classNum} Olympiad exam.`,
    navLinks: [
      { label: 'Olympiad Details', id: 'olympiad-details' },
      { label: 'Eligibility', id: 'eligibility' },
      { label: 'Benefits', id: 'benefits' },
      { label: 'How to apply', id: 'how-to-apply' },
      { label: 'Syllabus', id: 'syllabus' },
      { label: 'Exam Dates and Fees', id: 'exam-dates-and-fees' },
      { label: 'How to Prepare', id: 'how-to-prepare' },
      { label: 'Cut-off & Answer Keys', id: 'cut-off-and-answer-keys' },
      { label: 'Results', id: 'results' },
      { label: 'Awards and Recognition', id: 'awards-and-recognition' },
      { label: 'Frequently Asked Questions', id: 'frequently-asked-questions' },
    ],
    sections: {
      'olympiad-details': {
        heading: 'About the Olympiad',
        type: 'paragraphs',
        image: {
          src: `/${meta.icon}`,
          alt: `Class ${classNum} ${subjName} Olympiad`,
        },
        content: [
          `${aboutIntro} Based on the Class ${classNum} curriculum, the Olympiad encourages students to apply ${subjName.toLowerCase()} concepts in different situations rather than simply memorizing them.`,
          `The examination includes carefully designed questions that assess how well students understand key concepts and their ability to use these concepts to solve problems. Through participation, students gain exposure to national-level academic competition and have the opportunity to benchmark their performance against peers from different schools.`,
          `NTI follows a structured examination and evaluation process that provides detailed performance insights. Students, parents, and teachers receive a clear understanding of a student's strengths and areas for improvement.`,
        ],
      },
      benefits: {
        heading: 'Benefits of Participating',
        type: 'list',
        content: [
          `Strengthens understanding of Class ${classNum} ${subjName.toLowerCase()} concepts`,
          'Develops logical thinking and problem-solving skills',
          'Encourages analytical and critical thinking abilities',
          'Builds confidence through academic achievement',
          'Provides exposure to national-level academic competition',
          'Offers certificates, medals, and recognition for outstanding performance',
          isSenior
            ? 'Strengthens preparation for board exams and competitive entrance tests'
            : 'Creates a strong foundation for future Olympiads and competitive examinations',
        ],
      },
      'why-participate': {
        heading: `Why Participate in the NTI Class ${classNum} ${subjName} Olympiad?`,
        type: 'paragraphs',
        content: [
          `The Olympiad provides an excellent platform for students to challenge themselves beyond routine classroom learning. It encourages curiosity, independent thinking, and confidence while helping students develop essential ${subjName.toLowerCase()} skills${isYoung ? ' at an early age' : ''}.`,
          `Whether a student already enjoys ${subjName.toLowerCase()} or needs additional encouragement to explore the subject, the NTI Class ${classNum} ${subjName} Olympiad offers a rewarding learning experience that supports both academic growth and personal development.`,
        ],
      },
      'key-highlights': {
        heading: 'Key Highlights',
        type: 'list',
        content: [
          `Based on the Class ${classNum} school curriculum`,
          'Focus on conceptual understanding and application-based learning',
          'National-level participation opportunity',
          'Detailed performance analysis and ranking',
          'Certificates and awards for deserving participants',
          'Student-friendly examination pattern',
        ],
      },
      eligibility: {
        heading: `Eligibility Criteria for ${subjName} Olympiad`,
        type: 'ordered-list',
        content: [
          `Students interested in taking the ${subjName} Olympiad test for class ${classNum} can do the registration either through their schools or on their own.`,
          'Candidates from all around the world are welcome to apply for the exam.',
          `The test for class ${classNum} is performed in 1 level.`,
          `Only class ${classNum} students can apply to it.`,
        ],
      },
      'how-to-apply': {
        heading: 'How to Apply',
        type: 'paragraphs',
        image: {
          src: '/nti_register_banner.png',
          alt: 'Register for NTI Olympiad Exams - Mathematics, Science, English, IT, Finance - 1st to 10th',
        },
        content: [
          'Schools can register their students by filling out the school registration form available on the NTI Olympiad website. Individual students can also register directly through the website with the help of their parents or guardians.',
          'After successful registration, students will receive their admit cards and examination details via email. Schools will be provided with bulk registration options and dedicated support.',
        ],
      },
      syllabus: {
        heading: 'Syllabus',
        type: 'list',
        content: topics,
      },
      'exam-dates-and-fees': {
        heading: 'Exam Dates and Fees',
        type: 'table-with-notes',
        intro: `The exam dates for NTI ${subjName} Olympiad for Class ${classNum} for the Academic year 2026-27 are as given below:`,
        rows: [
          { label: 'Level 1 Exam Dates', value: '1st December 2026\n5th December 2026' },
          { label: 'Level 2 Exam Date', value: '30th January 2027\n1st February 2027' },
          { label: 'Last Date for Registration', value: 'It is advisable to register for the exam before November.' },
          { label: 'Level 1 Answer Key Dates', value: '9th - 10th December 2026' },
          { label: 'Level 2 Answer Key Dates', value: '3rd - 4th February 2027' },
          { label: 'Level 1 Result Date', value: 'Generally, the results are announced within 10 days after the last answer key date' },
          { label: 'Level 2 Result Date', value: 'Typically, the results are announced within a month after the final answer key is released.' },
        ],
        notes: [
          'Note: Check the NTI Olympiad website for other NTI Olympiad subjects as well.',
          'The exam fee is INR 275 for students studying and enrolling from India. For students studying and residing outside of India, the fee is country specific.',
        ],
      },
      'how-to-prepare': {
        heading: 'How to Prepare',
        type: 'prep-with-links',
        intro: [
          `To be a top performer in the ${subjName} Olympiad exam then the Class ${classNum} ${subjName} Olympiad sample papers are a key requirement. To get a competitive edge, one must analyze previous years' ${subjName} Olympiad questions for class ${classNum} and at the same time understand the syllabus. After this, proceed to the next steps of your preparation.`,
          `List down all the important topics in the ${subjName} Olympiad syllabus and start preparing for them first. Learning to be focused and utilizing time efficiently is a key to success in preparation. Students can follow above tips to do well in the NTI ${subjName} Olympiad exam for class ${classNum}.`,
        ],
        materials: [
          { label: `Class ${classNum} ${subjName} Olympiad Sample Paper`, link: '#', linkText: 'Check here' },
          { label: `Class ${classNum} ${subjName} Olympiad Previous Year Paper`, link: '#', linkText: 'Check here' },
          { label: `Class ${classNum} ${subjName} Olympiad Workbook`, link: '#', linkText: 'Check here' },
          { label: `Class ${classNum} NTI Fundamentals`, link: '#', linkText: 'Check Topics' },
        ],
      },
      'cut-off-and-answer-keys': {
        heading: 'Cut-off & Answer Keys',
        type: 'paragraphs',
        content: [
          'Cut-off marks and answer keys will be published after the examination. Students can check their performance against the official answer keys on the NTI website.',
        ],
      },
      results: {
        heading: 'Results',
        type: 'paragraphs',
        content: [
          'Results will be declared within 4-6 weeks after the examination. Students and schools can access detailed performance reports through the NTI portal.',
        ],
      },
      'awards-and-recognition': {
        heading: 'Awards and Recognition',
        type: 'list',
        content: [
          'Gold, Silver, and Bronze medals for top performers',
          'Merit certificates for qualifying students',
          'Participation certificates for all registered students',
          'Special scholarships for outstanding achievers',
          'School-level recognition and trophies',
        ],
      },
      'frequently-asked-questions': {
        heading: 'Frequently Asked Questions',
        type: 'faq',
        content: [
          {
            question: `Who can participate in the NTI Class ${classNum} ${subjName} Olympiad?`,
            answer: `The NTI Class ${classNum} ${subjName} Olympiad is open to all students currently enrolled in Grade ${classNum} across various recognized educational boards (CBSE, ICSE, State Boards, etc.). There are no minimum marks required in regular school exams to be eligible for this Olympiad.`,
          },
          {
            question: 'Is there any negative marking?',
            answer: `No, there is absolutely no negative marking in the NTI Class ${classNum} ${subjName} Olympiad. Students are encouraged to attempt all questions without the fear of losing marks for incorrect answers.`,
          },
          {
            question: 'Can students register individually?',
            answer: 'Yes, students have the flexibility to register individually for the examination. While we highly encourage schools to participate and register their students in bulk, parents or guardians can directly enroll their children if their respective schools are not participating.',
          },
          {
            question: 'What is the medium of the examination?',
            answer: `The NTI Class ${classNum} ${subjName} Olympiad is conducted entirely in the English language. All question papers, instructions, and communication related to the examination will be provided in English.`,
          },
        ],
      },
    },
  };
}

function processSyllabusFile() {
  const filePath = './src/data/syllabusData.js';
  let content = fs.readFileSync(filePath, 'utf8');

  const subjects = ['english', 'science', 'information-technology', 'finance'];

  subjects.forEach((subject) => {
    const subjectEntries = {};
    for (let i = 1; i <= 10; i++) {
      subjectEntries[`class-${i}`] = generateClassData(subject, i);
    }
    
    let subjectObjectString = `  '${subject}': {\n`;
    if (subject === 'english' || subject === 'science' || subject === 'finance') {
        subjectObjectString = `  ${subject}: {\n`;
    }
    
    for (let i = 1; i <= 10; i++) {
      subjectObjectString += `    'class-${i}': ${JSON.stringify(subjectEntries[`class-${i}`], null, 6).replace(/\n/g, '\n    ')},\n`;
    }
    subjectObjectString += `  },\n`;

    let regexPattern;
    if (subject === 'english' || subject === 'science' || subject === 'finance') {
        regexPattern = new RegExp(`  ${subject}: \\{\\s*(?:'class-\\d+': \\{ published: false \\},?\\s*)+\\},\\s*`, 'g');
    } else {
        regexPattern = new RegExp(`  '${subject}': \\{\\s*(?:'class-\\d+': \\{ published: false \\},?\\s*)+\\},\\s*`, 'g');
    }

    content = content.replace(regexPattern, subjectObjectString);
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated syllabusData.js with English, Science, IT, and Finance content!');
}

processSyllabusFile();
