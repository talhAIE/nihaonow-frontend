import { apiClient, apiEndpoints } from '@/lib/http';

export const healthApi = {
  check: async (): Promise<{ status: string }> => {
    return apiClient.get<{ status: string }>(apiEndpoints.health);
  },
};

export default healthApi;
