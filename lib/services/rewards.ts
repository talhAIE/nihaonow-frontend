import { apiClient, apiEndpoints } from '@/lib/http';

export const rewardsApi = {
  getAll: async (userId: string | number, filters: { category?: string; claimed?: boolean } = {}) => {
    return apiClient.get(apiEndpoints.rewards.list(userId), filters);
  },

  calculate: async (userId: string | number, weights?: { usage?: number; topic?: number; analytics?: number }) => {
    return apiClient.get(apiEndpoints.rewards.calculate(userId), {
      usageWeight: weights?.usage,
      topicWeight: weights?.topic,
      analyticsWeight: weights?.analytics,
    });
  },

  getDashboard: async (userId: string | number) => {
    return apiClient.get(apiEndpoints.rewards.dashboard(userId));
  },

  getSummary: async (userId: string | number) => {
    return apiClient.get(apiEndpoints.rewards.summary(userId));
  },

  getAnalytics: async (userId: string | number) => {
    return apiClient.get(apiEndpoints.rewards.analytics(userId));
  },

  getNext: async (userId: string | number) => {
    return apiClient.get(apiEndpoints.rewards.next(userId));
  },

  getRecommendations: async (userId: string | number) => {
    return apiClient.get(apiEndpoints.rewards.recommendations(userId));
  },

  claimAll: async (userId: string | number) => {
    return apiClient.post(apiEndpoints.rewards.claimAll(userId));
  },

  getPending: async (userId: string | number) => {
    return apiClient.get(apiEndpoints.rewards.pending(userId));
  },
  
  getByCategory: async (userId: string | number, category: string) => {
    return apiClient.get(apiEndpoints.rewards.byCategory(userId, category));
  },
};

export default rewardsApi;
