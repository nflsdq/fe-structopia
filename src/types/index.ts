// User & Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
  xp: number;
  current_level: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
}

// Level Types
export type LevelStatus = 'unlocked' | 'ongoing' | 'locked';

export interface Level {
  id: number;
  name: string;
  order: number;
  description: string;
  status: LevelStatus;
  keterangan?: string;
}

// Material Types
export type MaterialType = 'visual' | 'auditory' | 'kinesthetic' | 'media';

export interface Material {
  id: number;
  level_id: number;
  title: string;
  type: MaterialType;
  content: string;
  media_url?: string;
  meta?: Record<string, any>;
  is_completed?: boolean;
  xp_value?: number;
  status?: 'unlocked' | 'ongoing' | 'locked';
  keterangan?: string;
  level?: Level;
}

// Quiz Types
export interface Quiz {
  id: number;
  levelId: number;
  question: string;
  choices: string[];
  correct_answer?: string;
}

export interface QuizAnswer {
  quizId: number;
  answer: string;
}

export interface QuizResult {
  score: number;
  total_questions: number;
  passed: boolean;
  xp_gained: number;
  new_badges?: Badge[];
  duration?: number;
}

export interface QuizHistory {
  id: number;
  level_id: number;
  score: number;
  total_questions: number;
  passed: boolean;
  completedAt: string;
  level?: Level;
}

// Badge Types
export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirements: string;
  xpReward: number;
  isEarned?: boolean;
  earnedAt?: string;
}

// Progress Types
export interface Progress {
  id: number;
  userId: number;
  level_id: number;
  status: 'not-started' | 'in-progress' | 'completed';
  completedAt?: string;
  level?: Level;
}

// Tipe untuk respons checkAutomaticBadges
export interface CheckBadgesResponse {
  message: string;
  new_badges_assigned: { id: number; name: string; icon: string }[];
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: number;
  name: string;
  xp: number;
  level: number;
  avatarUrl?: string;
  rank: number;
}

// Animation Types
export interface PageTransition {
  initial: { opacity: number; x?: number; y?: number };
  animate: { opacity: number; x?: number; y?: number };
  exit: { opacity: number; x?: number; y?: number };
  transition: { duration: number; ease?: string; delay?: number };
}

// Ditambahkan untuk response completeMaterial
export interface CompleteMaterialResponse {
  message: string;
  xp_gained: number;
  new_badges: Badge[]; // Asumsi new_badges adalah array of Badge
}

// Test Types
export interface TestQuestion {
  id: number;
  question: string;
  choices: Record<string, string> | string[];
}

export interface TestHistory {
  id: number;
  user_id: number;
  type: 'pretest' | 'posttest';
  correct_count: number;
  wrong_count: number;
  duration: number;
  created_at: string;
  updated_at: string;
}