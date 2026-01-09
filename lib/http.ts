import axios, { AxiosInstance, AxiosError } from 'axios';
import { getAuthToken } from '@/lib/authUtils';
import type { InternalAxiosRequestConfig } from 'axios';
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const axiosInstance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: API_BASE_URL,
    // innhrok its not work fix that
    headers: {
        "ngrok-skip-browser-warning": "true",
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        try {
            const token: string | null = getCookie('authToken') as string | null;
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (err: unknown) {
            // ignore
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

// Response interceptor: normalize axios errors
interface NormalizedAxiosError extends Error {
    status?: number;
    data?: any;
}

axiosInstance.interceptors.response.use(
    (res) => res,
    (error: AxiosError): Promise<never> => {
        if (error.response) {
            if (error.response.status === 401) {
                // If we get a 401, the token is likely invalid or user doesn't exist.
                // Clear the token and redirect to login.
                deleteCookie('authToken');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }

            const err: NormalizedAxiosError = new Error(
                (error.response.data as { message?: string })?.message ||
                `HTTP error! status: ${error.response.status}`
            );
            err.status = error.response.status;
            err.data = error.response.data;
            return Promise.reject(err);
        }
        return Promise.reject(error);
    }
);

export const apiClient = {
    axiosInstance,
    // accept an optional third `config` param so callers can pass axios options (eg. signal)
    async get<T = any>(endpoint: string, params?: any, config: any = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const resp = await axiosInstance.get<T>(url, { params, ...config });
        return resp.data as unknown as T;
    },
    async post<T = any>(endpoint: string, data?: any, config: any = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const resp = await axiosInstance.post<T>(url, data, config);
        return resp.data as unknown as T;
    },
    async put<T = any>(endpoint: string, data?: any): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const resp = await axiosInstance.put<T>(url, data);
        return resp.data as unknown as T;
    },
    async delete<T = any>(endpoint: string): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const resp = await axiosInstance.delete<T>(url);
        return resp.data as unknown as T;
    },
};

export const apiEndpoints = {
    chapters: '/chapters',
    chapterById: (id: number) => `/chapters/${id}`,
    chapterTopics: (id: number) => `/chapters/${id}/topics`,
    topics: '/topics',
    topicById: (id: number) => `/topics/${id}`,
    topicScenarios: (topicId: number) => `/topics/${topicId}/scenarios`,
    sessions: {
        start: '/sessions/start',
        byId: (sessionId: string) => `/sessions/${sessionId}`,
        attempts: (sessionId: string) => `/sessions/${sessionId}/attempts`,
    },
    dashboard: {
        overview: '/dashboard',
        daily: (date?: string) => `/dashboard/metrics/daily${date ? `?date=${encodeURIComponent(date)}` : ''}`,
        weekly: (weekStart?: string) => `/dashboard/metrics/weekly${weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : ''}`,
        monthly: (month?: string) => `/dashboard/metrics/monthly${month ? `?month=${encodeURIComponent(month)}` : ''}`,
        topicProgress: '/dashboard/topics/progress',
        chapterProgress: '/dashboard/chapters/progress',
    },
    levels: {
        list: '/levels',
        me: '/levels/me',
        evaluate: '/levels/evaluate',
        sync: '/levels/sync',
    },
    calendar: (year: number, month: number) => `/dashboard/calendar?year=${year}&month=${month}`,
    leaderboard: {
        // Unified leaderboard listing endpoint
        list: (limit = 100, offset = 0, userId?: number | string) =>
            `/leaderboard?limit=${limit}&offset=${offset}${typeof userId !== 'undefined' ? `&userId=${userId}` : ''}`,
        // Map all specific sorts to the unified one as backend doesn't support them individually yet
        xp: (limit = 100, offset = 0) => `/leaderboard?limit=${limit}&offset=${offset}`,
        level: (limit = 100, offset = 0) => `/leaderboard?limit=${limit}&offset=${offset}`,
        streak: (limit = 100, offset = 0) => `/leaderboard?limit=${limit}&offset=${offset}`,
        longestStreak: (limit = 100, offset = 0) => `/leaderboard?limit=${limit}&offset=${offset}`,
        levels: '/leaderboard/levels',
        levelByNumber: (level: number) => `/leaderboard/levels/${level}`,
        studentLevel: '/leaderboard/student-level',
        studentLevelById: (userId: number | string) => `/leaderboard/student-level/${userId}`,
    },
    achievements: {
        list: (userId: string | number) => `/v1/users/${userId}/achievements`,
        certificates: (userId: string | number) => `/v1/users/${userId}/achievements/certificates`,
        progress: (userId: string | number) => `/v1/users/${userId}/achievements/progress`,
        check: (userId: string | number) => `/v1/users/${userId}/achievements/check`,
        sync: (userId: string | number) => `/v1/users/${userId}/achievements/sync`,
        claim: (userId: string | number, key: string) => `/v1/users/${userId}/achievements/${key}/claim`,
        downloadCertificate: (userId: string | number, achievementId: string | number) => `/v1/users/${userId}/achievements/certificates/download/${achievementId}`,
    },
    teacher: {
        // Map to existing User controller endpoints
        analytics: '/user/analytics', // Doesn't exist, will mock in service or return 404
        students: '/user/students',
        studentDetails: (userId: number | string) => `/user/students/${userId}`, // Doesn't exist, check mapping
        usage: '/user/usage',
        completions: '/user/completions',
    },
    reports: {
        // Map to existing User/Dashboard endpoints where possible
        summary: '/dashboard', // Fallback to dashboard overview
        export: '/user/students/export', // CSV Export from UserController
        metrics: '/dashboard/metrics/daily', // Fallback to daily metrics
    },
};