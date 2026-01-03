'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastData, ToastType, ToastIcons } from '@/components/ui/custom-toast';

interface ToastContextType {
    showToast: (options: Omit<ToastData, 'id'>) => string;
    dismissToast: (id: string) => void;
    dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Error code to user-friendly message mapping
const errorMessages: Record<string, { title: string; message: string }> = {
    // Authentication errors
    AUTH_GOOGLE_ONLY: {
        title: 'Google Sign-In Required',
        message: 'This account was created with Google. Please use "Continue with Google" to log in.',
    },
    AUTH_PASSWORD_ONLY: {
        title: 'Email Sign-In Required',
        message: 'This account uses email/password login. Please enter your password.',
    },
    AUTH_INVALID_CREDENTIALS: {
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please try again.',
    },
    AUTH_EMAIL_NOT_FOUND: {
        title: 'Account Not Found',
        message: 'No account exists with this email address. Would you like to create one?',
    },
    AUTH_EMAIL_NOT_VERIFIED: {
        title: 'Email Not Verified',
        message: 'Please check your inbox and verify your email before logging in.',
    },
    AUTH_ACCOUNT_INACTIVE: {
        title: 'Account Inactive',
        message: 'Your account has been deactivated. Please contact support for assistance.',
    },
    AUTH_TOKEN_EXPIRED: {
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again to continue.',
    },

    // Registration errors
    REGISTER_EMAIL_EXISTS: {
        title: 'Email Already Registered',
        message: 'An account with this email already exists. Try logging in instead.',
    },
    REGISTER_USERNAME_TAKEN: {
        title: 'Username Unavailable',
        message: 'This username is already taken. Please choose a different one.',
    },
    REGISTER_PASSWORD_MISMATCH: {
        title: 'Passwords Don\'t Match',
        message: 'The passwords you entered don\'t match. Please try again.',
    },
    REGISTER_WEAK_PASSWORD: {
        title: 'Password Too Weak',
        message: 'Please use a stronger password with at least 8 characters, including numbers and symbols.',
    },

    // Document errors
    DOC_UPLOAD_FAILED: {
        title: 'Upload Failed',
        message: 'There was a problem uploading your document. Please try again.',
    },
    DOC_TOO_LARGE: {
        title: 'File Too Large',
        message: 'This file exceeds the maximum size limit. Please upload a smaller file.',
    },
    DOC_UNSUPPORTED_FORMAT: {
        title: 'Unsupported Format',
        message: 'This file type is not supported. Please upload PDF, DOCX, TXT, or MD files.',
    },
    DOC_PROCESSING_FAILED: {
        title: 'Processing Failed',
        message: 'We couldn\'t process this document. Please check the file and try again.',
    },

    // Collection errors
    COLLECTION_NOT_FOUND: {
        title: 'Collection Not Found',
        message: 'The collection you\'re looking for doesn\'t exist or has been deleted.',
    },
    COLLECTION_ACCESS_DENIED: {
        title: 'Access Denied',
        message: 'You don\'t have permission to access this collection.',
    },

    // Chat errors
    CHAT_LIMIT_REACHED: {
        title: 'Query Limit Reached',
        message: 'You\'ve reached your daily query limit. Upgrade your plan for unlimited queries.',
    },
    CHAT_NO_DOCUMENTS: {
        title: 'No Documents Found',
        message: 'Upload some documents first to start chatting with your knowledge base.',
    },

    // Network errors
    NETWORK_ERROR: {
        title: 'Connection Error',
        message: 'Please check your internet connection and try again.',
    },
    SERVER_ERROR: {
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
    },

    // Default
    UNKNOWN_ERROR: {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred. Please try again.',
    },
};

// Success messages
const successMessages: Record<string, { title: string; message?: string }> = {
    // Auth
    LOGIN_SUCCESS: { title: 'Welcome Back!', message: 'You\'ve successfully logged in.' },
    REGISTER_SUCCESS: { title: 'Account Created!', message: 'Welcome to DocQuery AI.' },
    LOGOUT_SUCCESS: { title: 'Goodbye!', message: 'You\'ve been logged out successfully.' },
    EMAIL_VERIFIED: { title: 'Email Verified!', message: 'Your email has been verified successfully.' },
    PASSWORD_RESET: { title: 'Password Reset', message: 'Your password has been updated successfully.' },

    // Documents
    DOC_UPLOADED: { title: 'Document Uploaded!', message: 'Your document is being processed.' },
    DOC_DELETED: { title: 'Document Deleted', message: 'The document has been removed.' },
    DOC_REPROCESSED: { title: 'Reprocessing Started', message: 'Your document is being reprocessed.' },

    // Collections
    COLLECTION_CREATED: { title: 'Collection Created!', message: 'Your new collection is ready.' },
    COLLECTION_DELETED: { title: 'Collection Deleted', message: 'The collection has been removed.' },
    COLLECTION_UPDATED: { title: 'Collection Updated', message: 'Changes saved successfully.' },

    // Settings
    SETTINGS_SAVED: { title: 'Settings Saved!', message: 'Your preferences have been updated.' },
    PROFILE_UPDATED: { title: 'Profile Updated!', message: 'Your profile changes have been saved.' },
    API_KEY_DELETED: { title: 'API Key Deleted', message: 'The API key has been removed.' },

    // Chat
    CHAT_SESSION_CREATED: { title: 'New Chat Started', message: 'What would you like to know?' },
    CHAT_DELETED: { title: 'Chat Deleted', message: 'The chat history has been removed.' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((options: Omit<ToastData, 'id'>): string => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newToast: ToastData = { id, ...options };

        setToasts((prev) => [...prev, newToast]);
        return id;
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value= {{ showToast, dismissToast, dismissAll }
}>
    { children }
    < ToastContainer toasts = { toasts } onDismiss = { dismissToast } />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Convenience toast functions
export function createToastHelpers(showToast: ToastContextType['showToast']) {
    return {
        success: (title: string, message?: string, icon?: React.ReactNode) =>
            showToast({ type: 'success', title, message, icon, duration: 4000 }),

        error: (title: string, message?: string, icon?: React.ReactNode) =>
            showToast({ type: 'error', title, message, icon, duration: 6000 }),

        warning: (title: string, message?: string, icon?: React.ReactNode) =>
            showToast({ type: 'warning', title, message, icon, duration: 5000 }),

        info: (title: string, message?: string, icon?: React.ReactNode) =>
            showToast({ type: 'info', title, message, icon, duration: 4000 }),

        loading: (title: string, message?: string) =>
            showToast({ type: 'loading', title, message }),

        // Pre-configured success messages
        successCode: (code: keyof typeof successMessages, customMessage?: string) => {
            const msg = successMessages[code] || successMessages.SETTINGS_SAVED;
            return showToast({
                type: 'success',
                title: msg.title,
                message: customMessage || msg.message,
                duration: 4000,
            });
        },

        // Error handling with code
        errorCode: (code: string, fallbackMessage?: string) => {
            const msg = errorMessages[code] || {
                title: 'Error',
                message: fallbackMessage || 'An unexpected error occurred.',
            };
            return showToast({
                type: 'error',
                title: msg.title,
                message: msg.message,
                duration: 6000,
            });
        },

        // Parse API error and show appropriate toast
        apiError: (error: unknown) => {
            const { code, message } = parseApiError(error);
            const msg = errorMessages[code] || {
                title: 'Error',
                message: message || 'An unexpected error occurred.',
            };
            return showToast({
                type: 'error',
                title: msg.title,
                message: msg.message,
                duration: 6000,
            });
        },
    };
}

// Parse API error to extract code and message
export function parseApiError(error: unknown): { code: string; message: string } {
    // Handle axios errors
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; error_code?: string } } };
        const detail = axiosError.response?.data?.detail;
        const errorCode = axiosError.response?.data?.error_code;

        if (errorCode) {
            return { code: errorCode, message: detail || '' };
        }

        // Try to parse detail for known patterns
        if (detail) {
            if (detail.toLowerCase().includes('google')) {
                return { code: 'AUTH_GOOGLE_ONLY', message: detail };
            }
            if (detail.toLowerCase().includes('incorrect email or password')) {
                return { code: 'AUTH_INVALID_CREDENTIALS', message: detail };
            }
            if (detail.toLowerCase().includes('email already')) {
                return { code: 'REGISTER_EMAIL_EXISTS', message: detail };
            }
            if (detail.toLowerCase().includes('username already')) {
                return { code: 'REGISTER_USERNAME_TAKEN', message: detail };
            }
            if (detail.toLowerCase().includes('inactive')) {
                return { code: 'AUTH_ACCOUNT_INACTIVE', message: detail };
            }
            if (detail.toLowerCase().includes('not verified')) {
                return { code: 'AUTH_EMAIL_NOT_VERIFIED', message: detail };
            }

            return { code: 'UNKNOWN_ERROR', message: detail };
        }
    }

    // Handle network errors
    if (error && typeof error === 'object' && 'message' in error) {
        const msg = (error as Error).message;
        if (msg.toLowerCase().includes('network')) {
            return { code: 'NETWORK_ERROR', message: msg };
        }
        return { code: 'UNKNOWN_ERROR', message: msg };
    }

    return { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' };
}

// Re-export icons for convenience
export { ToastIcons };
