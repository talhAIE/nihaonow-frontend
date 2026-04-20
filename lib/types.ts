// Centralized shared types used across services

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Chapter {
  id: number;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  difficulty: string;
  orderIndex: number;
}

export interface ChapterUI extends Chapter {
  title: string;
  subtitle: string;
  color: string;
  status: 'active' | 'locked';
  progress?: number;
}

export interface Topic {
  id: number;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  subtitle: string;
  subtitleAr?: string | null;
  subtitleEn?: string | null;
  difficulty: string;
  orderIndex: number;
}

export interface TopicUI extends Topic {
  title: string;
  subtitle: string;
  color: string;
  status: 'active' | 'locked';
  progress?: number;
}

// Session interfaces
export interface SessionStartRequest {
  username?: string;
  topicId?: number;
}

export interface WordSessionStartRequest {
  wordTopicId: number;
}

export interface Scenario {
  id: number;
  scenarioNumber: number;
  isIntroduction: boolean;
  arabicAudioUrl: string;
  targetPhraseChinese: string;
  targetPhrasePinyin: string;
  targetPhrasePinyinAr?: string | null;
  targetPhrasePinyinEn?: string | null;
  chineseAudioUrl: string;
  scenarioImageUrl: string;
  orderIndex: number;
}

export interface SessionTopic {
  id: number;
  chapterId: number;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  subtitle: string;
  subtitleAr?: string | null;
  subtitleEn?: string | null;
  difficulty: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  chapter: Chapter;
}

export interface SessionStartResponse {
  sessionId: string;
  topic: SessionTopic;
  scenarios: Scenario[];
  totalScenarios: number;
}

// Auth related types
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  access_token?: string;
  token?: string;
  user?: {
    id: string | number;
    email: string;
    username?: string;
    role?: string;
    createdAt?: string;
    isFirstLogin?: boolean;
  };
}

// Dashboard / analytics related types
export interface DailyMetricPoint {
  hour: number;
  time: string; // '00:00'
  pronunciationScore: number | null;
  accuracyScore: number | null;
  fluencyScore: number | null;
  completenessScore: number | null;
  attemptCount: number;
}

export interface DailyMetricsResponse {
  date: string; // YYYY-MM-DD
  graphData: DailyMetricPoint[];
  averages: {
    pronunciationScore: number | null;
    accuracyScore: number | null;
    fluencyScore: number | null;
    completenessScore: number | null;
    attemptCount: number;
  };
}

export interface PeriodMetricPoint {
  date: string; // YYYY-MM-DD
  day: number; // day index for month
  pronunciationScore: number | null;
  accuracyScore: number | null;
  fluencyScore: number | null;
  completenessScore: number | null;
  attemptCount: number;
}

export interface MonthlyMetricsResponse {
  month: string; // YYYY-MM
  monthStart: string;
  monthEnd: string;
  graphData: PeriodMetricPoint[];
  averages: {
    pronunciationScore: number | null;
    accuracyScore: number | null;
    fluencyScore: number | null;
    completenessScore: number | null;
    attemptCount: number;
  };
}

export interface WeeklyMetricsResponse {
  weekStart: string;
  weekEnd: string;
  graphData: PeriodMetricPoint[]; // one per day of week
  averages: MonthlyMetricsResponse['averages'];
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  day: number;
  dayOfWeek: number;
  hasLogin: boolean;
  isToday?: boolean;
}

export interface CalendarResponse {
  year: number;
  month: number; // 1-12
  totalLogins: number;
  calendarData: CalendarDay[];
}

// Overview / summary for the student dashboard
export interface WordOfTheWeek {
  id: number;
  topicId?: number | null;
  chinese: string;
  pinyin?: string | null;
  english?: string | null;
  englishAr?: string | null;
  englishEn?: string | null;
  audioUrl?: string | null;
  exampleSentence?: string | null;
  exampleSentenceAr?: string | null;
  exampleSentenceEn?: string | null;
  weekStartDate?: string;
  isActive?: boolean;
}

export interface WordTopic {
  id: number;
  wordId: number;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  subtitle?: string;
  subtitleAr?: string | null;
  subtitleEn?: string | null;
  difficulty?: string; // Added for unification
  mode?: string; // Added for unification
  orderIndex: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  scenarios?: WordScenario[];
  word?: WordOfTheWeek;
}

export interface WordScenario {
  id: number;
  wordTopicId: number;
  scenarioNumber: number;
  isIntroduction?: boolean; // Added for unification
  targetPhraseChinese: string;
  targetPhrasePinyin?: string | null;
  targetPhrasePinyinAr?: string | null;
  targetPhrasePinyinEn?: string | null;
  chineseAudioUrl?: string | null;
  arabicAudioUrl?: string | null; // Renamed from scenarioAudioUrl
  scenarioImageUrl?: string | null;
  expectedPhonemes?: any; // Added for unification
  orderIndex: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserWordStatus {
  id: number;
  userId: number;
  wordId: number;
  completed: boolean;
  completedAt?: string | null;
}

export interface WordOfWeekStatusResponse {
  word: WordOfTheWeek | null;
  status: UserWordStatus | null;
}

export interface LevelDefinition {
  key: string;
  level: number;
  name: string;
  minUsageHours: number;
  minTopics: number;
}

export interface UserLevelStats {
  usageHours: number;
  usageHoursFloor: number;
  topicsCompleted: number;
  sessionsCompleted: number;
  totalPoints: number;
  currentStreak: number;
}

export interface UserLevelResponse {
  level: LevelDefinition;
  stats: UserLevelStats;
  storedLevel: number;
}

export interface TopicModeSummary {
  mode: string; // e.g. 'listening'
  name: string; // display name
  completed: number;
  total?: number;
}

export interface DashboardOverview {
  userName?: string;
  userEmail?: string | null;
  topicsCompleted: number;
  totalTopics: number;
  currentStreak: number;
  longestStreak: number;
  averageScore?: number | null;
  totalSessions?: number;
  level?: number;
  xp?: number;
  xpToNextLevel?: number;
  xpProgress?: number; // 0 - 100
  wordOfTheWeek?: WordOfTheWeek | null;
  topicModes?: TopicModeSummary[];
  levelInfo?: LevelDefinition; // New named levels system
}

// Topic Progress types
export interface TopicProgress {
  id: number;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  subtitle: string;
  subtitleAr?: string | null;
  subtitleEn?: string | null;
  mode: string;
  difficulty: string;
  chapterId: number;
  chapterName: string;
  chapterNameAr?: string | null;
  chapterNameEn?: string | null;
  totalScenarios: number;
  completedScenarios: number;
  percentage: number;
  averageScore: number | null;
  lastAttemptDate: string | null;
}

export interface TopicProgressResponse {
  topics: TopicProgress[];
}

// Chapter Progress types
export interface ChapterProgress {
  id: number;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  difficulty: string;
  totalTopics: number;
  completedTopics: number;
  percentage: number;
  totalScenarios: number;
  completedScenarios: number;
  topics: TopicProgress[];
}

export interface ChapterProgressResponse {
  chapters: ChapterProgress[];
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
}

// Unified leaderboard types (new)
export interface LeaderboardMetrics {
  topicsCompleted: number;
  totalSessions: number;
  avgAttemptsPerTopic: number;
  avgCompletionTime: number; // in minutes
}

export interface UnifiedLeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  score: number;
  metrics: LeaderboardMetrics;
  positionChange?: number;
  school?: string;
  avatarUrl?: string;
}

export interface UnifiedLeaderboardResponse {
  leaderboard: UnifiedLeaderboardEntry[];
  userRank?: UnifiedLeaderboardEntry | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage?: number;
    totalPages?: number;
    hasMore?: boolean;
    hasPrevious?: boolean;
  };
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  xpForNextLevel: number;
  xpDifference: number;
  isMaxLevel: boolean;
}

export interface StudentLevelInfo {
  userId: number;
  username: string;
  level: number; // XP level
  xp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpToNextLevel: number;
  xpProgress: number; // percentage 0-100
  isMaxLevel: boolean;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  totalStudents: number;
  percentile: number;
  completedTopics: number;
  levelDefinition?: LevelDefinition; // Named level
  levelStats?: UserLevelStats;
}

// Consolidated Dashboard API Response
export interface DashboardMetrics {
  daily: {
    date: string;
    sessionsCompleted: number;
    timeSpent: number;
    averageScore: number | null;
    pronunciationScore: number | null;
    accuracyScore: number | null;
    fluencyScore: number | null;
  };
  weekly: {
    week: string;
    sessionsCompleted: number;
    timeSpent: number;
    averageScore: number | null;
    pronunciationScore: number | null;
    accuracyScore: number | null;
    fluencyScore: number | null;
  };
  monthly: {
    month: string;
    sessionsCompleted: number;
    timeSpent: number;
    averageScore: number | null;
    pronunciationScore: number | null;
    accuracyScore: number | null;
    fluencyScore: number | null;
  };
}

export interface DashboardCalendar {
  year: number;
  month: number;
  loginDays: number[];
  currentStreak: number;
  longestStreak: number;
  calendarDays: CalendarDay[];
}

export interface ConsolidatedDashboardResponse {
  overview: DashboardOverview;
  progress: {
    topics: TopicProgress[];
    chapters: ChapterProgress[];
  };
  metrics: DashboardMetrics;
  calendar: DashboardCalendar;
}

// Achievements Types
export interface Badge {
  nameText?: { ar: string; en: string };
  descriptionText?: { ar: string; en: string };
  id: number;
  key: string;
  name: string;
  description: string;
  awardedAt?: string | null;
  rewardClaimed?: boolean;
  iconUrl: string;
  pointValue: number;
  threshold?: number;
}

export interface CategorizedAchievements {
  category: string;
  earned: Badge[];
  available: Badge[];
}

export interface AchievementsResponse {
  achievements: CategorizedAchievements[];
  userStats: any;
}

export interface Certificate {
  nameText?: { ar: string; en: string };
  descriptionText?: { ar: string; en: string };
  id: number;
  key: string;
  name: string;
  description: string;
  awardedAt: string | null;
  rewardClaimed: boolean;
  iconUrl: string;
  pointValue: number;
  threshold?: number;
  unlocked?: boolean;
}

export interface CertificatesResponse {
  certificates: {
    earned: Certificate[];
    locked: (Certificate & { unlocked?: boolean })[];
  };
  userStats: any;
  user: {
    username: string;
    email: string;
  };
}
