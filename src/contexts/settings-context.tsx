'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getSettings, updateSettings, deleteApiKey, SettingsWithModels, LLMProvider, LLMModel } from '@/lib/settings-api';
import { useAuth } from '@/contexts/AuthContext';

export interface LLMSettings {
  provider: 'groq' | 'openai' | 'anthropic' | 'gemini';
  model: string;
  temperature: number;
  maxTokens: number;
  // API key flags (not actual keys)
  hasOpenaiKey?: boolean;
  hasAnthropicKey?: boolean;
  hasGeminiKey?: boolean;
}

export interface DocumentSettings {
  chunkSize: number;
  chunkOverlap: number;
  allowedExtensions: string[];
}

export interface SearchSettings {
  numberOfResults: number;
  similarityThreshold: number;
  searchScope: 'all' | 'collection' | 'document';
}

export interface UISettings {
  theme: 'dark' | 'light';
}

export interface AppSettings {
  llm: LLMSettings;
  document: DocumentSettings;
  search: SearchSettings;
  ui: UISettings;
}

const defaultSettings: AppSettings = {
  llm: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    maxTokens: 4096,
  },
  document: {
    chunkSize: 1000,
    chunkOverlap: 200,
    allowedExtensions: ['pdf', 'txt', 'doc', 'docx', 'md'],
  },
  search: {
    numberOfResults: 5,
    similarityThreshold: 0.7,
    searchScope: 'all',
  },
  ui: {
    theme: 'dark',
  },
};

interface SettingsContextType {
  settings: AppSettings;
  providers: LLMProvider[];
  models: Record<string, LLMModel[]>;
  isLoading: boolean;
  isSaving: boolean;
  updateLLMSettings: (settings: Partial<LLMSettings>) => void;
  updateDocumentSettings: (settings: Partial<DocumentSettings>) => void;
  updateSearchSettings: (settings: Partial<SearchSettings>) => void;
  updateUISettings: (settings: Partial<UISettings>) => void;
  saveSettingsToServer: (apiKeys?: { openai?: string; anthropic?: string; gemini?: string }) => Promise<boolean>;
  deleteApiKeyFromServer: (provider: 'openai' | 'anthropic' | 'gemini') => Promise<boolean>;
  resetSettings: () => void;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = 'docquery-settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [models, setModels] = useState<Record<string, LLMModel[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasFetchedRef = useRef(false);

  // Fetch settings from server
  const refreshSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSettings();

      // Update providers and models
      setProviders(data.providers);
      setModels(data.models);

      // If user has saved settings, use them
      if (data.settings) {
        setSettings(prev => ({
          ...prev,
          llm: {
            provider: data.settings!.llm_provider as LLMSettings['provider'],
            model: data.settings!.llm_model,
            temperature: data.settings!.temperature,
            maxTokens: data.settings!.max_tokens,
            hasOpenaiKey: data.settings!.has_openai_key,
            hasAnthropicKey: data.settings!.has_anthropic_key,
            hasGeminiKey: data.settings!.has_gemini_key,
          },
        }));
      }
      hasFetchedRef.current = true;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Fall back to localStorage
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        } catch {
          // Ignore parse errors
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch settings when authentication state becomes ready and user is authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasFetchedRef.current) {
      refreshSettings();
    } else if (!authLoading && !isAuthenticated) {
      // User not authenticated, just use defaults
      setIsLoading(false);
      hasFetchedRef.current = false; // Reset so we fetch on next login
    }
  }, [authLoading, isAuthenticated, refreshSettings]);

  // Save to localStorage as backup
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateLLMSettings = (newSettings: Partial<LLMSettings>) => {
    setSettings(prev => ({
      ...prev,
      llm: { ...prev.llm, ...newSettings },
    }));
  };

  const updateDocumentSettings = (newSettings: Partial<DocumentSettings>) => {
    setSettings(prev => ({
      ...prev,
      document: { ...prev.document, ...newSettings },
    }));
  };

  const updateSearchSettings = (newSettings: Partial<SearchSettings>) => {
    setSettings(prev => ({
      ...prev,
      search: { ...prev.search, ...newSettings },
    }));
  };

  const updateUISettings = (newSettings: Partial<UISettings>) => {
    setSettings(prev => ({
      ...prev,
      ui: { ...prev.ui, ...newSettings },
    }));
  };

  const saveSettingsToServer = async (apiKeys?: { openai?: string; anthropic?: string; gemini?: string }): Promise<boolean> => {
    setIsSaving(true);
    try {
      const payload: Record<string, unknown> = {
        llm_provider: settings.llm.provider,
        llm_model: settings.llm.model,
        temperature: settings.llm.temperature,
        max_tokens: settings.llm.maxTokens,
      };

      // Include API keys if provided
      if (apiKeys?.openai) payload.openai_api_key = apiKeys.openai;
      if (apiKeys?.anthropic) payload.anthropic_api_key = apiKeys.anthropic;
      if (apiKeys?.gemini) payload.gemini_api_key = apiKeys.gemini;

      const result = await updateSettings(payload);

      // Update local state with result
      setSettings(prev => ({
        ...prev,
        llm: {
          ...prev.llm,
          hasOpenaiKey: result.has_openai_key,
          hasAnthropicKey: result.has_anthropic_key,
          hasGeminiKey: result.has_gemini_key,
        },
      }));

      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteApiKeyFromServer = async (provider: 'openai' | 'anthropic' | 'gemini'): Promise<boolean> => {
    try {
      await deleteApiKey(provider);

      // Update local state
      const keyField = `has${provider.charAt(0).toUpperCase() + provider.slice(1)}Key` as keyof LLMSettings;
      setSettings(prev => ({
        ...prev,
        llm: { ...prev.llm, [keyField]: false },
      }));

      return true;
    } catch (error) {
      console.error('Failed to delete API key:', error);
      return false;
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  if (!mounted) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        providers,
        models,
        isLoading,
        isSaving,
        updateLLMSettings,
        updateDocumentSettings,
        updateSearchSettings,
        updateUISettings,
        saveSettingsToServer,
        deleteApiKeyFromServer,
        resetSettings,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
