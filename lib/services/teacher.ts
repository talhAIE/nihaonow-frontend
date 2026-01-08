import { apiClient, apiEndpoints } from '@/lib/http';

export const teacherApi = {
  getAnalytics: async (config: any = {}) => {
    try {
      return await apiClient.get(apiEndpoints.teacher.analytics, undefined, config);
    } catch (err) {
      // Mock data for development if backend is not ready
      return {
        totalStudents: 128,
        activeStudents: 42,
        totalUsageHours: 1240,
        topicsCompleted: 856,
        engagementRate: '32%'
      };
    }
  },

  getStudents: async (config: any = {}) => {
    try {
      return await apiClient.get(apiEndpoints.teacher.students, undefined, config);
    } catch (err) {
      // Mock data
      return [
        { id: 1, name: 'أحمد علي', level: 4, points: 1250, usage: '12h', progress: '85%', status: 'active' },
        { id: 2, name: 'سارة محمد', level: 3, points: 980, usage: '8h', progress: '60%', status: 'active' },
        { id: 3, name: 'محمد حسن', level: 5, points: 2100, usage: '24h', progress: '95%', status: 'inactive' },
      ];
    }
  },

  getStudentDetails: async (userId: number | string, config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.studentDetails(userId), undefined, config);
  },

  getUsageMetrics: async (config: any = {}) => {
    return apiClient.get(apiEndpoints.teacher.usage, undefined, config);
  },
};

export default teacherApi;
