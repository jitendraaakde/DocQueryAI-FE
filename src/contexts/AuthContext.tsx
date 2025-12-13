'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Token, UserLogin, UserCreate } from '@/types';
import api, { tokenManager, getErrorMessage } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: UserLogin) => Promise<void>;
    register: (data: UserCreate) => Promise<void>;
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

    const login = async (credentials: UserLogin) => {
        const response = await api.post<Token>('/auth/login', credentials);
        tokenManager.setTokens(response.data);
        await refreshUser();
    };

    const register = async (data: UserCreate) => {
        await api.post('/auth/register', data);
        // Auto-login after registration
        await login({ email: data.email, password: data.password });
    };

    const logout = () => {
        tokenManager.clearTokens();
        setUser(null);
        // Redirect handled by component
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
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
