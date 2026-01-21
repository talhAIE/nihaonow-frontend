import { apiClient, apiEndpoints } from '@/lib/http';
import { Chapter, Topic } from '@/lib/types';

export const chaptersApi = {
  getAll: async (): Promise<Chapter[]> => {
    return apiClient.get<Chapter[]>(apiEndpoints.chapters);
  },
  getById: async (id: number): Promise<Chapter> => {
    return apiClient.get<Chapter>(apiEndpoints.chapterById(id));
  },
  getTopics: async (id: number): Promise<any[]> => {
    return apiClient.get<any[]>(apiEndpoints.chapterTopics(id));
  },
  getNextStep: async (): Promise<any> => {
    return apiClient.get(apiEndpoints.content.nextStep);
  },
  getIntroduction: async (): Promise<any> => {
    return apiClient.get(apiEndpoints.content.introduction);
  },
};

export const topicsApi = {
  // Simulate getAll by fetching all chapters and then their topics
  // This avoids bricking functionality since GET /topics doesn't exist
  getAll: async (): Promise<Topic[]> => {
    try {
      const chapters = await chaptersApi.getAll();
      const allTopicsPromise = chapters.map(chapter => chaptersApi.getTopics(chapter.id));
      const nestedTopics = await Promise.all(allTopicsPromise);
      return nestedTopics.flat(); 
    } catch (error) {
        console.error("Failed to fetch all topics:", error);
        return [];
    }
  },
  getById: async (id: number): Promise<Topic> => {
    return apiClient.get<Topic>(apiEndpoints.topicById(id));
  },
  getScenarios: async (topicId: number): Promise<any[]> => {
    return apiClient.get<any[]>(apiEndpoints.topicScenarios(topicId));
  },
};

export const scenariosApi = {
  getById: async (id: number): Promise<any> => {
    return apiClient.get<any>(apiEndpoints.content.scenarioById(id));
  },
};
