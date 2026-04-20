import { apiClient, apiEndpoints } from '@/lib/http';
import type {
  DailyMetricsResponse,
  WeeklyMetricsResponse,
  MonthlyMetricsResponse,
  CalendarResponse,
  DashboardOverview,
  TopicProgressResponse,
  ChapterProgressResponse,
  ConsolidatedDashboardResponse,
} from '@/lib/types';

export const dashboardApi = {
  // Single consolidated endpoint - use this instead of multiple calls
  getDashboard: async (config: any = {}): Promise<ConsolidatedDashboardResponse> => {
    const url = apiEndpoints.dashboard.overview; // /dashboard endpoint
    // Add cache-busting parameter to ensure fresh data
    const cacheBustingConfig = {
      ...config,
      params: {
        ...config.params,
        _t: Date.now(), // Add timestamp to prevent caching
      },
    };
    return await apiClient.get<ConsolidatedDashboardResponse>(url, undefined, cacheBustingConfig);
  },

  // Legacy individual endpoints (kept for backward compatibility)
  getDaily: async (date?: string, config: any = {}): Promise<DailyMetricsResponse> => {
    const url = apiEndpoints.dashboard.daily(date);
    return apiClient.get<DailyMetricsResponse>(url, undefined, config);
  },

  getWeekly: async (weekStart?: string, config: any = {}): Promise<WeeklyMetricsResponse> => {
    const url = apiEndpoints.dashboard.weekly(weekStart);
    return apiClient.get<WeeklyMetricsResponse>(url, undefined, config);
  },

  getMonthly: async (month?: string, config: any = {}): Promise<MonthlyMetricsResponse> => {
    const url = apiEndpoints.dashboard.monthly(month);
    return apiClient.get<MonthlyMetricsResponse>(url, undefined, config);
  },

  getCalendar: async (year: number, month: number, config: any = {}): Promise<CalendarResponse> => {
    const url = apiEndpoints.calendar(year, month);
    return apiClient.get<CalendarResponse>(url, undefined, config);
  },

  getOverview: async (config: any = {}): Promise<DashboardOverview> => {
    const url = apiEndpoints.dashboard.overview;
    return await apiClient.get<DashboardOverview>(url, undefined, config);
  },

  getTopicProgress: async (config: any = {}): Promise<TopicProgressResponse> => {
    const url = apiEndpoints.dashboard.topicProgress;
    return await apiClient.get<TopicProgressResponse>(url, undefined, config);
  },

  getChapterProgress: async (config: any = {}): Promise<ChapterProgressResponse> => {
    const url = apiEndpoints.dashboard.chapterProgress;
    return await apiClient.get<ChapterProgressResponse>(url, undefined, config);
  },
};

export default dashboardApi;
