import { apiClient, apiEndpoints } from '@/lib/http';
import type {
  LeaderboardEntry,
  LevelInfo,
  StudentLevelInfo,
  UnifiedLeaderboardResponse,
} from '@/lib/types';

/**
 * Simple in-memory cache for leaderboard data
 * TTL-based caching to avoid re-fetching on every navigation
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheEntry<any>> = new Map();

// Cache TTL in milliseconds (5 minutes default)
const CACHE_TTL = 5 * 60 * 1000;

function getCached<T>(key: string): { found: boolean; data: T | null } {
  const entry = cache.get(key);
  if (!entry) return { found: false, data: null };
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return { found: false, data: null };
  }
  
  return { found: true, data: entry.data as T };
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function clearCache(keyPrefix?: string): void {
  if (keyPrefix) {
    Array.from(cache.keys()).forEach(key => {
      if (key.startsWith(keyPrefix)) {
        cache.delete(key);
      }
    });
  } else {
    cache.clear();
  }
}

/**
 * Leaderboard service
 *
 * - Follows existing apiClient conventions used across the project
 * - Methods are small wrappers returning typed data
 * - Built-in caching to avoid unnecessary re-fetches on navigation
 */
export const leaderboardApi = {
  /**
   * Get cached leaderboard data synchronously (for instant UI display)
   */
  getCachedLeaderboard: (
    limit = 100,
    offset = 0,
    userId?: number | string
  ): UnifiedLeaderboardResponse | null => {
    const cacheKey = `leaderboard_${limit}_${offset}_${userId ?? 'all'}`;
    const { found, data } = getCached<UnifiedLeaderboardResponse>(cacheKey);
    return found ? data : null;
  },

  /**
   * Get cached student level synchronously
   */
  getCachedStudentLevel: (): StudentLevelInfo | null => {
    const { found, data } = getCached<StudentLevelInfo | null>('student_level');
    return found ? data : null;
  },

  getByXp: async (limit = 100, offset = 0): Promise<LeaderboardEntry[]> => {
    const url = apiEndpoints.leaderboard.xp(limit, offset);
    return apiClient.get<LeaderboardEntry[]>(url);
  },

  getByLevel: async (limit = 100, offset = 0): Promise<LeaderboardEntry[]> => {
    const url = apiEndpoints.leaderboard.level(limit, offset);
    return apiClient.get<LeaderboardEntry[]>(url);
  },

  getByStreak: async (limit = 100, offset = 0): Promise<LeaderboardEntry[]> => {
    const url = apiEndpoints.leaderboard.streak(limit, offset);
    return apiClient.get<LeaderboardEntry[]>(url);
  },

  getByLongestStreak: async (limit = 100, offset = 0): Promise<LeaderboardEntry[]> => {
    const url = apiEndpoints.leaderboard.longestStreak(limit, offset);
    return apiClient.get<LeaderboardEntry[]>(url);
  },

  /**
   * Unified leaderboard endpoint with caching
   * Returns cached data immediately if available, otherwise fetches from API
   */
  getLeaderboard: async (
    limit = 100,
    offset = 0,
    userId?: number | string,
    config: { signal?: AbortSignal; forceRefresh?: boolean } = {}
  ): Promise<UnifiedLeaderboardResponse> => {
    const { signal, forceRefresh = false } = config;
    const cacheKey = `leaderboard_${limit}_${offset}_${userId ?? 'all'}`;
    
    // Return cached data if available and not forcing refresh
    if (!forceRefresh) {
      const { found, data } = getCached<UnifiedLeaderboardResponse>(cacheKey);
      if (found && data) {
        return data;
      }
    }
    
    const url = apiEndpoints.leaderboard.list(limit, offset, userId);
    const data = await apiClient.get<UnifiedLeaderboardResponse>(url, undefined, { signal });
    
    // Cache the response
    setCache(cacheKey, data);
    
    return data;
  },

  getLevels: async (): Promise<LevelInfo[]> => {
    const cacheKey = 'leaderboard_levels';
    const { found, data } = getCached<LevelInfo[]>(cacheKey);
    if (found && data) return data;
    
    const url = apiEndpoints.leaderboard.levels;
    const result = await apiClient.get<LevelInfo[]>(url);
    setCache(cacheKey, result);
    return result;
  },

  getLevel: async (level: number): Promise<LevelInfo | null> => {
    const url = apiEndpoints.leaderboard.levelByNumber(level);
    return apiClient.get<LevelInfo | null>(url);
  },

  /**
   * Get student level with caching
   */
  getStudentLevel: async (config: { signal?: AbortSignal; forceRefresh?: boolean } = {}): Promise<StudentLevelInfo | null> => {
    const { signal, forceRefresh = false } = config;
    const cacheKey = 'student_level';
    
    if (!forceRefresh) {
      const { found, data } = getCached<StudentLevelInfo | null>(cacheKey);
      if (found) {
        return data;
      }
    }
    
    const url = apiEndpoints.leaderboard.studentLevel;
    const data = await apiClient.get<StudentLevelInfo | null>(url, undefined, { signal });
    setCache(cacheKey, data);
    return data;
  },

  getStudentLevelById: async (userId: number | string): Promise<StudentLevelInfo | null> => {
    const url = apiEndpoints.leaderboard.studentLevelById(userId);
    return apiClient.get<StudentLevelInfo | null>(url);
  },

  /**
   * Invalidate all leaderboard cache entries
   * Call this after actions that would change leaderboard data
   */
  invalidateCache: () => {
    clearCache('leaderboard');
    clearCache('student_level');
  },

  /**
   * Force refresh leaderboard data (bypasses cache)
   */
  refreshLeaderboard: async (
    limit = 100,
    offset = 0,
    userId?: number | string,
    config: { signal?: AbortSignal } = {}
  ): Promise<UnifiedLeaderboardResponse> => {
    return leaderboardApi.getLeaderboard(limit, offset, userId, { ...config, forceRefresh: true });
  },
};

export default leaderboardApi;
