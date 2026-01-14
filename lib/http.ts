import axios, { AxiosInstance, AxiosError } from 'axios';
import { getAuthToken } from '@/lib/authUtils';
import type { InternalAxiosRequestConfig } from 'axios';
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

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
    health: '/health',
    user: {
        profile: '/user/profile',
        myReportDetails: '/user/my-report/details',
        myReportUrl: '/user/my-report/url',
    },
    chapters: '/chapters',
    chapterById: (id: number) => `/chapters/${id}`,
    chapterTopics: (id: number) => `/chapters/${id}/topics`,
    topics: '/topics',
    topicById: (id: number) => `/topics/${id}`,
    topicScenarios: (topicId: number) => `/topics/${topicId}/scenarios`,
    content: {
        nextStep: '/next-step',
        introduction: '/introduction',
        scenarioById: (id: number) => `/scenarios/${id}`,
    },
    sessions: {
        start: '/sessions/start',
        startWord: '/sessions/start-word',
        byId: (sessionId: string) => `/sessions/${sessionId}`,
        attempts: (sessionId: string) => `/sessions/${sessionId}/attempts`,
        complete: (sessionId: string) => `/sessions/${sessionId}/complete`,
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
        analytics: (userId: string | number) => `/v1/users/${userId}/achievements/analytics`,
        leaderboard: (userId: string | number) => `/v1/users/${userId}/achievements/leaderboard`,
    },
    rewards: {
        list: (userId: string | number) => `/v1/users/${userId}/rewards`,
        calculate: (userId: string | number) => `/v1/users/${userId}/rewards/calculate`,
        dashboard: (userId: string | number) => `/v1/users/${userId}/rewards/dashboard`,
        summary: (userId: string | number) => `/v1/users/${userId}/rewards/summary`,
        analytics: (userId: string | number) => `/v1/users/${userId}/rewards/analytics`,
        next: (userId: string | number) => `/v1/users/${userId}/rewards/next`,
        recommendations: (userId: string | number) => `/v1/users/${userId}/rewards/recommendations`,
        claimAll: (userId: string | number) => `/v1/users/${userId}/rewards/claim-all`,
        pending: (userId: string | number) => `/v1/users/${userId}/rewards/pending`,
        byCategory: (userId: string | number, category: string) => `/v1/users/${userId}/rewards/by-category/${category}`,
    },
    wordOfWeek: {
        active: '/word-of-week',
        status: '/word-of-week/status',
        topics: '/word-of-week/topics',
        topicById: (id: number) => `/word-of-week/topics/${id}`,
        scenarioById: (id: number) => `/word-of-week/scenarios/${id}`,
        complete: '/word-of-week/complete',
        feedback: '/word-of-week/feedback',
    },
    teacher: {
        // Map to existing User controller endpoints
        analytics: '/user/analytics',
        students: '/user/students', // GET with query params
        studentDetails: (userId: number | string) => `/user/students/${userId}`,
        usage: '/user/usage',
        completions: '/user/completions',
        exportStudents: '/user/students/export',
        studentReport: (userId: number | string) => `/user/students/${userId}/report`,
        studentReportDetails: (userId: number | string) => `/user/students/${userId}/report/details`,
        bulkReports: '/user/students/reports/bulk',
    },
    reports: {
        // Map to existing User/Dashboard endpoints where possible
        summary: '/dashboard', // Fallback to dashboard overview
        export: '/user/students/export', // CSV Export from UserController
        metrics: '/dashboard/metrics/daily', // Fallback to daily metrics
    },
};