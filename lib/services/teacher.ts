import { apiClient, apiEndpoints } from '@/lib/http';

export const teacherApi = {
  getAnalytics: async (config: any = {}) => {
    try {
      // The students endpoint returns both analytics and the list
      const response = await apiClient.get(apiEndpoints.teacher.students, { limit: 1 }, config);
      return response.analytics;
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      // Fallback or rethrow
      throw err;
    }
  },

  getStudents: async (params: any = {}, config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.students, params, config);
  },

  getStudentDetails: async (userId: number | string, config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.studentDetails(userId), undefined, config);
  },

  getUsageMetrics: async (config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.usage, undefined, config);
  },

  exportStudents: async (config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.exportStudents, undefined, { ...config, responseType: 'blob' });
  },

  getStudentReport: async (userId: number | string, config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.studentReport(userId), undefined, config);
  },

  getStudentReportDetails: async (userId: number | string, config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.studentReportDetails(userId), undefined, config);
  },

  getBulkReports: async (config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.bulkReports, undefined, config);
  },
};

export default teacherApi;
