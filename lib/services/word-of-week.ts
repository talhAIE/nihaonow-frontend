import { apiClient, apiEndpoints } from '@/lib/http';
import type {
  WordOfTheWeek,
  WordTopic,
  WordScenario,
  WordOfWeekStatusResponse,
} from '@/lib/types';

export const wordOfWeekApi = {
  /**
   * Get the currently active Word of the Week
   */
  getActiveWord: async (config: any = {}): Promise<WordOfTheWeek | null> => {
    try {
      const url = apiEndpoints.wordOfWeek.active;
      return await apiClient.get<WordOfTheWeek>(url, undefined, config);
    } catch (error) {
      console.error('Failed to fetch active word:', error);
      return null;
    }
  },

  /**
   * Get user's status for the active Word of the Week
   */
  getUserWordStatus: async (config: any = {}): Promise<WordOfWeekStatusResponse> => {
    const url = apiEndpoints.wordOfWeek.status;
    return apiClient.get<WordOfWeekStatusResponse>(url, undefined, config);
  },

  /**
   * Get all topics for the active Word of the Week
   */
  getWordTopics: async (config: any = {}): Promise<WordTopic[]> => {
    const url = apiEndpoints.wordOfWeek.topics;
    return apiClient.get<WordTopic[]>(url, undefined, config);
  },

  /**
   * Get a specific Word topic by ID with its scenarios
   */
  getWordTopicById: async (topicId: number, config: any = {}): Promise<WordTopic> => {
    const url = apiEndpoints.wordOfWeek.topicById(topicId);
    return apiClient.get<WordTopic>(url, undefined, config);
  },

  /**
   * Get a specific Word scenario by ID
   */
  getWordScenarioById: async (scenarioId: number, config: any = {}): Promise<WordScenario> => {
    const url = apiEndpoints.wordOfWeek.scenarioById(scenarioId);
    return apiClient.get<WordScenario>(url, undefined, config);
  },

  /**
   * Mark the active Word of the Week as completed
   */
  markWordAsCompleted: async (config: any = {}): Promise<WordOfWeekStatusResponse> => {
    const url = apiEndpoints.wordOfWeek.complete;
    return apiClient.post<WordOfWeekStatusResponse>(url, {}, config);
  },

  /**
   * Get feedback for the active Word of the Week
   */
  getFeedback: async (config: any = {}): Promise<any> => {
    const url = apiEndpoints.wordOfWeek.feedback;
    return apiClient.get<any>(url, undefined, config);
  },

  /**
   * Submit or update feedback for the active Word of the Week
   */
  submitFeedback: async (feedbackData: any, config: any = {}): Promise<any> => {
    const url = apiEndpoints.wordOfWeek.feedback;
    return apiClient.post<any>(url, feedbackData, config);
  },
};

export default wordOfWeekApi;
