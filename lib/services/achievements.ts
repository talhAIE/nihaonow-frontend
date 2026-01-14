import { apiClient, apiEndpoints } from '@/lib/http';

export const achievementsApi = {
  getAchievements: async (userId: string | number, config: any = {}) => {
    const url = apiEndpoints.achievements.list(userId);
    return apiClient.get(url, undefined, config);
  },

  getCertificates: async (userId: string | number, config: any = {}) => {
    const url = apiEndpoints.achievements.certificates(userId);
    return apiClient.get(url, undefined, config);
  },

  getProgress: async (userId: string | number, config: any = {}) => {
    const url = apiEndpoints.achievements.progress(userId);
    return apiClient.get(url, undefined, config);
  },

  checkAchievements: async (userId: string | number, config: any = {}) => {
    const url = apiEndpoints.achievements.check(userId);
    return apiClient.post(url, undefined, config);
  },

  syncAchievements: async (userId: string | number, config: any = {}) => {
    const url = apiEndpoints.achievements.sync(userId);
    return apiClient.post(url, undefined, config);
  },

  claimBadge: async (userId: string | number, key: string, config: any = {}) => {
    const url = apiEndpoints.achievements.claim(userId, key);
    return apiClient.post(url, undefined, config);
  },

  downloadCertificate: async (userId: string | number, achievementId: string | number, config: any = {}) => {
    const url = apiEndpoints.achievements.downloadCertificate(userId, achievementId);
    return apiClient.get(url, undefined, { ...config, responseType: 'blob' });
  },

  getAnalytics: async (userId: string | number, config: any = {}) => {
    return apiClient.get(apiEndpoints.achievements.analytics(userId), undefined, config);
  },

  getLeaderboard: async (userId: string | number, config: any = {}) => {
    return apiClient.get(apiEndpoints.achievements.leaderboard(userId), undefined, config);
  },
};

export default achievementsApi;
