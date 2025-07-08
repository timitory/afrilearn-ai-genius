
export class AIService {
  private static readonly STEM_KNOWLEDGE = {
    mathematics: {
      topics: ['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry'],
      examples: {
        'what is algebra': 'Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations.',
        'explain quadratic equation': 'A quadratic equation is a polynomial equation of degree 2, written in the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0.'
      }
    },
    physics: {
      topics: ['mechanics', 'thermodynamics', 'electricity', 'magnetism', 'optics'],
      examples: {
        'what is force': 'Force is a push or pull that can change the motion, shape, or direction of an object. It is measured in Newtons (N).',
        'explain gravity': 'Gravity is a fundamental force that attracts objects with mass toward each other. On Earth, it gives objects weight.'
      }
    },
    chemistry: {
      topics: ['atoms', 'molecules', 'reactions', 'periodic table', 'bonds'],
      examples: {
        'what is an atom': 'An atom is the smallest unit of matter that retains the properties of an element. It consists of protons, neutrons, and electrons.',
        'explain photosynthesis': 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.'
      }
    },
    biology: {
      topics: ['cells', 'genetics', 'evolution', 'ecology', 'anatomy'],
      examples: {
        'what is a cell': 'A cell is the basic structural and functional unit of all living organisms. It can exist as a single-celled organism or as part of a multicellular organism.',
        'explain DNA': 'DNA (Deoxyribonucleic Acid) is the hereditary material that contains genetic instructions for the development and function of living things.'
      }
    },
    coding: {
      topics: ['programming', 'algorithms', 'data structures', 'web development', 'software'],
      examples: {
        'what is programming': 'Programming is the process of creating instructions for computers to execute. It involves writing code using programming languages.',
        'explain algorithm': 'An algorithm is a step-by-step procedure or set of rules designed to solve a specific problem or perform a particular task.'
      }
    }
  };

  static async processQuestion(question: string, language: string): Promise<string> {
    console.log('Processing question:', question, 'in language:', language);
    
    // Normalize the question
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Try to find a direct match first
    for (const subject of Object.values(this.STEM_KNOWLEDGE)) {
      for (const [key, answer] of Object.entries(subject.examples)) {
        if (normalizedQuestion.includes(key) || key.includes(normalizedQuestion)) {
          return this.translateResponse(answer, language);
        }
      }
    }

    // Try to match by keywords and topics
    const response = this.findBestMatch(normalizedQuestion);
    return this.translateResponse(response, language);
  }

  private static findBestMatch(question: string): string {
    // Check for math-related keywords
    if (this.containsKeywords(question, ['math', 'calculate', 'equation', 'number', 'solve', 'algebra', 'geometry'])) {
      return 'Mathematics is the study of numbers, shapes, and patterns. It helps us solve problems and understand the world around us. What specific math topic would you like to learn about?';
    }

    // Check for physics-related keywords
    if (this.containsKeywords(question, ['physics', 'force', 'energy', 'motion', 'gravity', 'electricity', 'light'])) {
      return 'Physics is the science that studies matter, energy, and their interactions. It explains how things move and why they behave the way they do. What physics concept interests you?';
    }

    // Check for chemistry-related keywords
    if (this.containsKeywords(question, ['chemistry', 'chemical', 'reaction', 'atom', 'molecule', 'element', 'compound'])) {
      return 'Chemistry is the science that studies the composition, structure, and properties of matter. It explains how substances interact and change. What would you like to know about chemistry?';
    }

    // Check for biology-related keywords
    if (this.containsKeywords(question, ['biology', 'life', 'living', 'cell', 'organism', 'plant', 'animal', 'human'])) {
      return 'Biology is the study of living organisms and life processes. It covers everything from tiny cells to complex ecosystems. What aspect of biology are you curious about?';
    }

    // Check for coding-related keywords
    if (this.containsKeywords(question, ['coding', 'programming', 'computer', 'software', 'algorithm', 'code', 'website'])) {
      return 'Coding is the process of creating instructions for computers. It involves problem-solving and logical thinking. What programming concept would you like to understand better?';
    }

    // Default response for unclear questions
    return 'I\'m here to help you with STEM subjects including Mathematics, Physics, Chemistry, Biology, and Coding. Could you please ask a more specific question about any of these topics?';
  }

  private static containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private static translateResponse(response: string, language: string): string {
    // Basic translation mapping - in a real app, you'd use a translation service
    if (language === 'English') return response;
    
    const translations: { [key: string]: { [key: string]: string } } = {
      'Yoruba': {
        'Mathematics is the study of numbers': 'Matematiki ni eko nipa awon nọmba',
        'Physics is the science that studies matter': 'Fisiksi ni imọ-jinlẹ ti o kọ nipa ohun',
        'Chemistry is the science that studies': 'Kemistri ni imọ-jinlẹ ti o kọ nipa',
        'Biology is the study of living organisms': 'Baiolọji ni eko nipa awon ohun alaye',
        'I\'m here to help you with STEM': 'Mo wa nibi lati ran ọ lọwọ pẹlu awon kọkọ STEM'
      },
      'Igbo': {
        'Mathematics is the study of numbers': 'Mgbakọ na mwepụ bụ ọmụmụ banyere ọnụọgụgụ',
        'Physics is the science that studies matter': 'Physics bụ sayensị na-amụ banyere ihe',
        'Chemistry is the science that studies': 'Chemistry bụ sayensị na-amụ banyere',
        'Biology is the study of living organisms': 'Biology bụ ọmụmụ banyere ihe ndị dị ndụ',
        'I\'m here to help you with STEM': 'Anọ m ebe a inyere gị aka na STEM'
      },
      'Hausa': {
        'Mathematics is the study of numbers': 'Ilimin lissafi shine nazarin lambobi',
        'Physics is the science that studies matter': 'Kimiyyar Physics shine nazarin abubuwa',
        'Chemistry is the science that studies': 'Kimiyyar Chemistry shine nazarin',
        'Biology is the study of living organisms': 'Ilimin Biology shine nazarin halittu masu rai',
        'I\'m here to help you with STEM': 'Ina nan don taimaka muku da batutuwan STEM'
      }
    };

    // Simple translation - find matching phrases
    const langTranslations = translations[language];
    if (langTranslations) {
      for (const [english, translated] of Object.entries(langTranslations)) {
        if (response.includes(english)) {
          return response.replace(english, translated);
        }
      }
    }

    return response; // Return original if no translation found
  }
}
