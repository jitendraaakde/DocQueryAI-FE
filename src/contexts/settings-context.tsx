'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LLMSettings {
  provider: 'groq' | 'openai' | 'anthropic' | 'gemini';
  model: string;
  temperature: number;
  maxTokens: number;
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
  updateLLMSettings: (settings: Partial<LLMSettings>) => void;
  updateDocumentSettings: (settings: Partial<DocumentSettings>) => void;
  updateSearchSettings: (settings: Partial<SearchSettings>) => void;
  updateUISettings: (settings: Partial<UISettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = 'docquery-settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
    setMounted(true);
  }, []);

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
        updateLLMSettings,
        updateDocumentSettings,
        updateSearchSettings,
        updateUISettings,
        resetSettings,
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
