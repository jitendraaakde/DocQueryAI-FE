import axios, { AxiosInstance, AxiosError } from 'axios';
import { Token } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token management
export const tokenManager = {
    getAccessToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setTokens: (tokens: Token) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    },

    clearTokens: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    isAuthenticated: (): boolean => {
        return !!tokenManager.getAccessToken();
    },
};

// Request interceptor to add auth header
api.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = tokenManager.getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await axios.post<Token>(`${API_URL}/auth/refresh`, null, {
                        params: { refresh_token: refreshToken },
                    });

                    tokenManager.setTokens(response.data);

                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    tokenManager.clearTokens();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// Error response type from backend
export interface ApiErrorDetail {
    error_code?: string;
    message?: string;
}

// Helper to get error message (returns the message for display)
export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail: string | ApiErrorDetail }>;
        const detail = axiosError.response?.data?.detail;

        // Handle structured error response
        if (detail && typeof detail === 'object') {
            return detail.message || 'An unexpected error occurred';
        }

        // Handle string error response (legacy)
        if (typeof detail === 'string') {
            return detail;
        }

        return axiosError.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// Helper to get error code (for specific handling)
export const getErrorCode = (error: unknown): string | null => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail: string | ApiErrorDetail }>;
        const detail = axiosError.response?.data?.detail;

        // Handle structured error response
        if (detail && typeof detail === 'object' && detail.error_code) {
            return detail.error_code;
        }
    }
    return null;
};

// Helper to get full error info
export const getErrorInfo = (error: unknown): { code: string | null; message: string } => {
    return {
        code: getErrorCode(error),
        message: getErrorMessage(error)
    };
};
