'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { User, Token, UserLogin, UserCreate } from '@/types';
import api, { tokenManager, getErrorMessage } from '@/lib/api';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: UserLogin) => Promise<void>;
    register: (data: UserCreate) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        if (!tokenManager.isAuthenticated()) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get<User>('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            tokenManager.clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = useCallback(async (credentials: UserLogin) => {
        const response = await api.post<Token>('/auth/login', credentials);
        tokenManager.setTokens(response.data);
        await refreshUser();
    }, [refreshUser]);

    const register = useCallback(async (data: UserCreate) => {
        await api.post('/auth/register', data);
        // Auto-login after registration
        await login({ email: data.email, password: data.password });
    }, [login]);

    const loginWithGoogle = useCallback(async () => {
        try {
            // Sign in with Google using Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // Send the ID token to our backend
            const response = await api.post<Token>('/auth/google', { id_token: idToken });
            tokenManager.setTokens(response.data);
            await refreshUser();
        } catch (error: unknown) {
            console.error('Google login error:', error);
            // Sign out from Firebase if backend auth fails
            await firebaseSignOut(auth);
            throw error;
        }
    }, [refreshUser]);

    const logout = useCallback(() => {
        tokenManager.clearTokens();
        setUser(null);
        // Sign out from Firebase as well
        firebaseSignOut(auth).catch(console.error);
        // Redirect handled by component
    }, []);

    // Memoize the context value to prevent unnecessary re-renders of consumers
    const contextValue = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
    }), [user, isLoading, login, register, loginWithGoogle, logout, refreshUser]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

