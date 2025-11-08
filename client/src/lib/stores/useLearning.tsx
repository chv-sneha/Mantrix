import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, Level, UserProgress, Badge, AICompanionState } from "@shared/types";

interface LearningState {
  courses: Course[];
  userProgress: UserProgress;
  aiCompanion: AICompanionState;
  
  setCourses: (courses: Course[]) => void;
  selectCourse: (courseId: string) => void;
  selectLevel: (levelId: string) => void;
  completeLevel: (levelId: string, xpEarned: number) => void;
  addBadge: (badge: Badge) => void;
  updateAIMessages: (message: { role: 'user' | 'assistant'; content: string }) => void;
  toggleAICompanion: () => void;
  setCurrentHint: (hint: string | null) => void;
}

const initialCourses: Course[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    description: 'Master the fundamentals of computer science',
    icon: '🧠',
    color: '#6366f1',
    levels: [
      {
        id: 'dsa-1',
        courseId: 'dsa',
        title: 'Introduction to Programming',
        description: 'Learn the basics of loops and variables',
        story: 'Welcome, young coder! Your journey begins in the Valley of Variables, where you must master the ancient art of loops to unlock the next realm.',
        xpReward: 100,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
      },
      {
        id: 'dsa-2',
        courseId: 'dsa',
        title: 'Arrays & Lists',
        description: 'Understanding data collections',
        story: 'The Array Temple awaits. Master the power of indexed collections to continue your quest.',
        xpReward: 150,
        challengeType: 'coding',
        difficulty: 'beginner',
        unlocked: false,
        completed: false,
      },
      {
        id: 'dsa-3',
        courseId: 'dsa',
        title: 'Searching Algorithms',
        description: 'Binary search and linear search',
        story: 'In the Forest of Search, you must find the hidden treasures using the most efficient paths.',
        xpReward: 200,
        challengeType: 'coding',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
      }
    ]
  },
  {
    id: 'webdev',
    name: 'Web Development',
    description: 'Build modern web applications',
    icon: '🌐',
    color: '#8b5cf6',
    levels: [
      {
        id: 'web-1',
        courseId: 'webdev',
        title: 'HTML Basics',
        description: 'Structure your first webpage',
        story: 'Welcome to the HTML Kingdom! Learn to build the foundation of all web pages.',
        xpReward: 100,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
      },
      {
        id: 'web-2',
        courseId: 'webdev',
        title: 'CSS Styling',
        description: 'Make your pages beautiful',
        story: 'Enter the CSS Castle where colors and styles bring life to your creations.',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: false,
        completed: false,
      },
      {
        id: 'web-3',
        courseId: 'webdev',
        title: 'JavaScript Fundamentals',
        description: 'Add interactivity to your sites',
        story: 'The JavaScript Jungle holds the key to dynamic and interactive web experiences.',
        xpReward: 200,
        challengeType: 'coding',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
      }
    ]
  },
  {
    id: 'aiml',
    name: 'AI & Machine Learning',
    description: 'Explore artificial intelligence',
    icon: '🤖',
    color: '#ec4899',
    levels: [
      {
        id: 'ai-1',
        courseId: 'aiml',
        title: 'Introduction to AI',
        description: 'What is artificial intelligence?',
        story: 'Welcome to the AI Realm, where machines learn and evolve!',
        xpReward: 100,
        challengeType: 'quiz',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
      },
      {
        id: 'ai-2',
        courseId: 'aiml',
        title: 'Neural Networks',
        description: 'Understanding brain-inspired computing',
        story: 'Dive into the Neural Network Nexus and unlock the secrets of machine cognition.',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
      }
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    description: 'Deploy and scale applications',
    icon: '☁️',
    color: '#10b981',
    levels: [
      {
        id: 'cloud-1',
        courseId: 'cloud',
        title: 'Cloud Computing Basics',
        description: 'Introduction to cloud platforms',
        story: 'Ascend to the Cloud City and learn to deploy your applications to the sky!',
        xpReward: 100,
        challengeType: 'quiz',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
      },
      {
        id: 'cloud-2',
        courseId: 'cloud',
        title: 'Docker Containers',
        description: 'Containerize your applications',
        story: 'Master the art of containerization in the Docker Docks.',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
      }
    ]
  }
];

export const useLearning = create<LearningState>()(
  persist(
    (set) => ({
      courses: initialCourses,
      userProgress: {
        userId: 'guest',
        totalXP: 0,
        level: 1,
        badges: [],
        completedLevels: [],
        currentCourse: null,
        currentLevel: null,
      },
      aiCompanion: {
        isActive: false,
        messages: [],
        currentHint: null,
        adaptiveDifficulty: 1,
      },
      
      setCourses: (courses) => set({ courses }),
      
      selectCourse: (courseId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          currentCourse: courseId,
          currentLevel: null,
        }
      })),
      
      selectLevel: (levelId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          currentLevel: levelId,
        }
      })),
      
      completeLevel: (levelId, xpEarned) => set((state) => {
        const newTotalXP = state.userProgress.totalXP + xpEarned;
        const newLevel = Math.floor(newTotalXP / 500) + 1;
        
        const updatedCourses = state.courses.map(course => ({
          ...course,
          levels: course.levels.map((level, index) => {
            if (level.id === levelId) {
              return { ...level, completed: true };
            }
            if (course.levels[index - 1]?.id === levelId) {
              return { ...level, unlocked: true };
            }
            return level;
          })
        }));
        
        return {
          courses: updatedCourses,
          userProgress: {
            ...state.userProgress,
            totalXP: newTotalXP,
            level: newLevel,
            completedLevels: [...state.userProgress.completedLevels, levelId],
          }
        };
      }),
      
      addBadge: (badge) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          badges: [...state.userProgress.badges, badge],
        }
      })),
      
      updateAIMessages: (message) => set((state) => ({
        aiCompanion: {
          ...state.aiCompanion,
          messages: [
            ...state.aiCompanion.messages,
            { ...message, timestamp: new Date() }
          ]
        }
      })),
      
      toggleAICompanion: () => set((state) => ({
        aiCompanion: {
          ...state.aiCompanion,
          isActive: !state.aiCompanion.isActive,
        }
      })),
      
      setCurrentHint: (hint) => set((state) => ({
        aiCompanion: {
          ...state.aiCompanion,
          currentHint: hint,
        }
      })),
    }),
    {
      name: 'skillquest-learning',
    }
  )
);
