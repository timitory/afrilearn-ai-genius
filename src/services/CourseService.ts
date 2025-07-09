
export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
  videoUrl?: string;
  content: string;
}

export interface Course {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessons: Lesson[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserProgress {
  totalLessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  classRank: number;
  totalStudents: number;
  points: number;
  lastActiveDate: string;
}

export class CourseService {
  private static courses: Course[] = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '📊',
      color: 'bg-blue-500',
      description: 'Master fundamental and advanced mathematical concepts',
      totalLessons: 45,
      completedLessons: 12,
      progress: 27,
      difficulty: 'Intermediate',
      lessons: [
        {
          id: 'math-1',
          title: 'Introduction to Algebra',
          description: 'Learn the basics of algebraic expressions and equations',
          duration: 25,
          completed: true,
          content: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.'
        },
        {
          id: 'math-2',
          title: 'Linear Equations',
          description: 'Solve linear equations with one and two variables',
          duration: 30,
          completed: true,
          content: 'Linear equations are algebraic equations where each term is either a constant or the product of a constant and a single variable.'
        },
        {
          id: 'math-3',
          title: 'Quadratic Functions',
          description: 'Understanding parabolas and quadratic equations',
          duration: 35,
          completed: false,
          content: 'A quadratic function is a polynomial function of degree 2, typically written as f(x) = ax² + bx + c.'
        }
      ]
    },
    {
      id: 'physics',
      name: 'Physics',
      icon: '⚡',
      color: 'bg-purple-500',
      description: 'Explore the fundamental laws governing our universe',
      totalLessons: 38,
      completedLessons: 8,
      progress: 21,
      difficulty: 'Advanced',
      lessons: [
        {
          id: 'physics-1',
          title: 'Newton\'s Laws of Motion',
          description: 'Understand the three fundamental laws of motion',
          duration: 40,
          completed: true,
          content: 'Newton\'s laws of motion are three basic laws of classical mechanics that describe the relationship between forces and motion.'
        },
        {
          id: 'physics-2',
          title: 'Energy and Work',
          description: 'Learn about kinetic and potential energy',
          duration: 35,
          completed: false,
          content: 'Energy is the capacity to do work. Work is done when a force causes displacement of an object.'
        }
      ]
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: '🧪',
      color: 'bg-green-500',
      description: 'Discover the composition and behavior of matter',
      totalLessons: 42,
      completedLessons: 15,
      progress: 36,
      difficulty: 'Intermediate',
      lessons: [
        {
          id: 'chem-1',
          title: 'Atomic Structure',
          description: 'Understanding atoms, electrons, protons, and neutrons',
          duration: 30,
          completed: true,
          content: 'An atom consists of a nucleus containing protons and neutrons, surrounded by electrons in orbitals.'
        },
        {
          id: 'chem-2',
          title: 'Chemical Bonding',
          description: 'Learn about ionic and covalent bonds',
          duration: 45,
          completed: true,
          content: 'Chemical bonds are forces that hold atoms together in compounds. The main types are ionic, covalent, and metallic bonds.'
        }
      ]
    },
    {
      id: 'biology',
      name: 'Biology',
      icon: '🧬',
      color: 'bg-red-500',
      description: 'Study living organisms and life processes',
      totalLessons: 36,
      completedLessons: 6,
      progress: 17,
      difficulty: 'Beginner',
      lessons: [
        {
          id: 'bio-1',
          title: 'Cell Biology Basics',
          description: 'Introduction to cellular structure and function',
          duration: 35,
          completed: true,
          content: 'Cells are the basic structural and functional units of all living organisms.'
        },
        {
          id: 'bio-2',
          title: 'DNA and Genetics',
          description: 'Understanding heredity and genetic information',
          duration: 40,
          completed: false,
          content: 'DNA contains the genetic instructions for the development and function of living things.'
        }
      ]
    },
    {
      id: 'coding',
      name: 'Coding',
      icon: '💻',
      color: 'bg-orange-500',
      description: 'Learn programming fundamentals and problem-solving',
      totalLessons: 28,
      completedLessons: 3,
      progress: 11,
      difficulty: 'Beginner',
      lessons: [
        {
          id: 'code-1',
          title: 'Introduction to Programming',
          description: 'Basic concepts and logic of programming',
          duration: 45,
          completed: true,
          content: 'Programming is the process of creating instructions for computers to execute.'
        },
        {
          id: 'code-2',
          title: 'Variables and Data Types',
          description: 'Understanding how to store and manipulate data',
          duration: 30,
          completed: false,
          content: 'Variables are containers for storing data values. Data types specify what kind of data can be stored.'
        }
      ]
    }
  ];

  private static userProgress: UserProgress = {
    totalLessonsCompleted: 24,
    currentStreak: 7,
    longestStreak: 12,
    classRank: 3,
    totalStudents: 45,
    points: 1250,
    lastActiveDate: new Date().toISOString()
  };

  static getCourses(): Course[] {
    return this.courses;
  }

  static getCourse(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  static getUserProgress(): UserProgress {
    return this.userProgress;
  }

  static completeLesson(courseId: string, lessonId: string): void {
    const course = this.getCourse(courseId);
    if (course) {
      const lesson = course.lessons.find(l => l.id === lessonId);
      if (lesson && !lesson.completed) {
        lesson.completed = true;
        course.completedLessons++;
        course.progress = Math.round((course.completedLessons / course.totalLessons) * 100);
        
        // Update user progress
        this.userProgress.totalLessonsCompleted++;
        this.userProgress.points += 50; // 50 points per lesson
        
        // Update streak
        const today = new Date().toDateString();
        const lastActive = new Date(this.userProgress.lastActiveDate).toDateString();
        
        if (today !== lastActive) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastActive === yesterday.toDateString()) {
            this.userProgress.currentStreak++;
          } else {
            this.userProgress.currentStreak = 1;
          }
          
          if (this.userProgress.currentStreak > this.userProgress.longestStreak) {
            this.userProgress.longestStreak = this.userProgress.currentStreak;
          }
          
          this.userProgress.lastActiveDate = new Date().toISOString();
        }
      }
    }
  }

  static getLeaderboard(): Array<{name: string, points: number, rank: number}> {
    return [
      { name: 'Adebayo', points: 1450, rank: 1 },
      { name: 'Chinwe', points: 1320, rank: 2 },
      { name: 'Kemi', points: this.userProgress.points, rank: 3 },
      { name: 'Ibrahim', points: 1180, rank: 4 },
      { name: 'Folake', points: 1050, rank: 5 }
    ];
  }
}
