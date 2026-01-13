import { apiClient, apiEndpoints } from '@/lib/http';
// Import User type from types/index.ts or auth.ts if available, or define here
// Assuming User type is available in lib/types based on other files

export const userApi = {
  getProfile: async (): Promise<any> => {
    return apiClient.get<any>(apiEndpoints.user.profile);
  },
  getMyReportDetails: async (): Promise<any> => {
    return apiClient.get<any>(apiEndpoints.user.myReportDetails);
  },
  getMyReportUrl: async (): Promise<{ url: string; expiresAt?: string }> => {
    return apiClient.get<{ url: string; expiresAt?: string }>(apiEndpoints.user.myReportUrl);
  },
};

export default userApi;
