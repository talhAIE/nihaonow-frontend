/**
 * Utility to manage guide completion flags in localStorage.
 * Keys are format: guide_{userId}_{guideType}_completed
 */

export type GuideType = 'dashboard' | 'leaderboard' | 'achievements' | 'session';

export const guidePersistence = {
  getStorageKey: (userId: string | undefined, guideType: GuideType) => {
    if (!userId) return null;
    return `guide_${userId}_${guideType}_completed`;
  },

  isCompleted: (userId: string | undefined, guideType: GuideType): boolean => {
    if (typeof window === 'undefined' || !userId) return false;
    const key = guidePersistence.getStorageKey(userId, guideType);
    return key ? localStorage.getItem(key) === 'true' : false;
  },

  setCompleted: (userId: string | undefined, guideType: GuideType) => {
    if (typeof window === 'undefined' || !userId) return;
    const key = guidePersistence.getStorageKey(userId, guideType);
    if (key) {
      localStorage.setItem(key, 'true');
    }
  },

  clearAll: (userId: string | undefined) => {
    if (typeof window === 'undefined' || !userId) return;
    const types: GuideType[] = ['dashboard', 'leaderboard', 'achievements', 'session'];
    types.forEach(type => {
      const key = guidePersistence.getStorageKey(userId, type);
      if (key) localStorage.removeItem(key);
    });
  }
};
