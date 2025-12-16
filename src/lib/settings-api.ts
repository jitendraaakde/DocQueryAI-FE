/**
 * Settings API client for user settings management.
 */

import api from './api';

export interface LLMProvider {
    value: string;
    label: string;
    description: string;
    requires_key: boolean;
}

export interface LLMModel {
    value: string;
    label: string;
}

export interface UserSettings {
    id: number;
    user_id: number;
    llm_provider: string;
    llm_model: string;
    temperature: number;
    max_tokens: number;
    has_openai_key: boolean;
    has_anthropic_key: boolean;
    has_gemini_key: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SettingsWithModels {
    settings: UserSettings | null;
    providers: LLMProvider[];
    models: Record<string, LLMModel[]>;
    defaults: {
        llm_provider: string;
        llm_model: string;
        temperature: number;
        max_tokens: number;
    };
}

export interface SettingsUpdatePayload {
    llm_provider?: string;
    llm_model?: string;
    temperature?: number;
    max_tokens?: number;
    openai_api_key?: string;
    anthropic_api_key?: string;
    gemini_api_key?: string;
}

/**
 * Get user settings with available providers and models.
 */
export async function getSettings(): Promise<SettingsWithModels> {
    const response = await api.get('/settings');
    return response.data;
}

/**
 * Update user settings.
 */
export async function updateSettings(data: SettingsUpdatePayload): Promise<UserSettings> {
    const response = await api.put('/settings', data);
    return response.data;
}

/**
 * Delete a specific API key.
 */
export async function deleteApiKey(provider: 'openai' | 'anthropic' | 'gemini'): Promise<void> {
    await api.delete(`/settings/api-key/${provider}`);
}

/**
 * Get available providers and models (no auth required).
 */
export async function getProviders(): Promise<{
    providers: LLMProvider[];
    models: Record<string, LLMModel[]>;
}> {
    const response = await api.get('/settings/providers');
    return response.data;
}
