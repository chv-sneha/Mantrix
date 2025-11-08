export interface Course {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  levels: Level[];
}

export interface Level {
  id: string;
  courseId: string;
  title: string;
  description: string;
  story: string;
  xpReward: number;
  challengeType: 'coding' | 'quiz' | 'interactive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  unlocked: boolean;
  completed: boolean;
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  level: number;
  badges: Badge[];
  completedLevels: string[];
  currentCourse: string | null;
  currentLevel: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Challenge {
  id: string;
  levelId: string;
  type: 'coding' | 'quiz' | 'interactive';
  question: string;
  hints: string[];
  solution?: string;
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AICompanionState {
  isActive: boolean;
  messages: AIMessage[];
  currentHint: string | null;
  adaptiveDifficulty: number;
}
