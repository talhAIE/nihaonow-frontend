import { apiClient, apiEndpoints } from '@/lib/http';
import type { LevelDefinition, UserLevelResponse } from '@/lib/types';

export const levelsApi = {
  getDefinitions: async (config: any = {}): Promise<LevelDefinition[]> => {
    const url = apiEndpoints.levels.list;
    return apiClient.get<LevelDefinition[]>(url, undefined, config);
  },

  getMyLevel: async (config: any = {}): Promise<UserLevelResponse> => {
    const url = apiEndpoints.levels.me;
    return apiClient.get<UserLevelResponse>(url, undefined, config);
  },

  evaluateMe: async (config: any = {}): Promise<UserLevelResponse> => {
    const url = apiEndpoints.levels.evaluate;
    return apiClient.post<UserLevelResponse>(url, {}, config);
  },

  syncAll: async (config: any = {}): Promise<any> => {
    const url = apiEndpoints.levels.sync;
    return apiClient.post<any>(url, {}, config);
  },
};

export default levelsApi;
