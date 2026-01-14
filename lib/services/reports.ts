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

  exportCsv: async (config: any = {}) => {
    const url = apiEndpoints.reports.export;
    // Important: responseType: 'blob' is needed for file downloads
    return apiClient.get(url, { responseType: 'blob' }, config);
  },

  getStudentReportUrl: async (studentId: number | string, config: any = {}) => {
    const url = apiEndpoints.teacher.studentReport(studentId);
    return apiClient.get<{ url: string; expiresAt?: string }>(url, undefined, config);
  },

  getBulkReportsUrl: async (config: any = {}) => {
    const url = apiEndpoints.teacher.bulkReports;
    return apiClient.get<{ url: string; expiresAt?: string }>(url, undefined, config);
  }
};

export default reportsApi;
