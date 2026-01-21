// Re-export new modularized services and types for backwards compatibility
export * from './types';
export { apiClient, apiEndpoints, API_BASE_URL } from './http';
export { authApi } from './services/auth';
export { chaptersApi, topicsApi, scenariosApi } from './services/content';
export { sessionsApi } from './services/sessions';
export { dashboardApi } from './services/dashboard';
export { leaderboardApi } from './services/leaderboard';
export { achievementsApi } from './services/achievements';
export { levelsApi } from './services/levels';
export { teacherApi } from './services/teacher';
export { reportsApi } from './services/reports';
export { healthApi } from './services/health';
export { userApi } from './services/user';
export { rewardsApi } from './services/rewards';
