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
    // Backend only supports CSV export via /user/students/export currently
    // PDF export is via /user/students/:id/report (single) or /user/students/reports/bulk (zip)
    // We map to the CSV export endpoint if format is csv, otherwise mock/warn or try bulk
    if (format === 'csv') {
        const url = apiEndpoints.reports.export; // mapped to /user/students/export
        return apiClient.get(url, { responseType: 'blob' }, config);
    }
    // For now, return null or handle PDF unimplemented in backend bulk export
    return null; 
  }
};

export default reportsApi;
