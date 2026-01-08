import { apiClient, apiEndpoints } from '@/lib/http';

export const reportsApi = {
  getSummary: async (config: any = {}) => {
    try {
      return await apiClient.get(apiEndpoints.reports.summary, undefined, config);
    } catch (err) {
      // Mock data
      return {
        overallProgress: 75,
        totalTopics: 12,
        completedTopics: 9,
        averageScore: 88,
        totalXP: 5400
      };
    }
  },

  getMetrics: async (config: any = {}) => {
    return apiClient.get(apiEndpoints.reports.metrics, undefined, config);
  },

  exportReport: async (format: 'pdf' | 'csv' = 'pdf', config: any = {}) => {
    // This would typically return a blob or a download URL
    return apiClient.get(apiEndpoints.reports.export, { format }, config);
  }
};

export default reportsApi;
