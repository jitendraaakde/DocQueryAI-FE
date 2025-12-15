'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { useTheme } from '@/contexts/theme-context';
import {
    Bot, FileText, Search, Palette, Sliders, Save, RotateCcw,
    Moon, Sun, ChevronRight, Loader2, Sparkles, Database, Target
} from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
    { id: 'llm', label: 'LLM & AI', icon: Bot },
    { id: 'document', label: 'Document Processing', icon: FileText },
    { id: 'search', label: 'Search & Retrieval', icon: Search },
    { id: 'ui', label: 'UI/UX Preferences', icon: Palette },
];

const providers = [
    { value: 'groq', label: 'Groq', description: 'Fast inference with Llama models' },
    { value: 'openai', label: 'OpenAI', description: 'GPT-4 and GPT-3.5 models' },
    { value: 'anthropic', label: 'Anthropic', description: 'Claude models' },
    { value: 'gemini', label: 'Google Gemini', description: 'Gemini Pro models' },
];

const modelOptions: Record<string, { value: string; label: string }[]> = {
    groq: [
        { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
        { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
        { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    ],
    openai: [
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    ],
    anthropic: [
        { value: 'claude-3-opus', label: 'Claude 3 Opus' },
        { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
        { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    ],
    gemini: [
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
        { value: 'gemini-pro', label: 'Gemini Pro' },
    ],
};

const searchScopes = [
    { value: 'all', label: 'All Documents', description: 'Search across all uploaded documents' },
    { value: 'collection', label: 'Current Collection', description: 'Search within selected collection only' },
    { value: 'document', label: 'Single Document', description: 'Search within a specific document' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('llm');
    const [isSaving, setIsSaving] = useState(false);
    const { settings, updateLLMSettings, updateDocumentSettings, updateSearchSettings, updateUISettings, resetSettings } = useSettings();
    const { theme, setTheme } = useTheme();

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Settings saved successfully');
        setIsSaving(false);
    };

    const handleReset = () => {
        resetSettings();
        toast.success('Settings reset to defaults');
    };

    const handleExtensionToggle = (ext: string) => {
        const current = settings.document.allowedExtensions;
        if (current.includes(ext)) {
            updateDocumentSettings({ allowedExtensions: current.filter(e => e !== ext) });
        } else {
            updateDocumentSettings({ allowedExtensions: [...current, ext] });
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Sliders className="w-8 h-8 text-primary-400" />
                    Settings
                </h1>
                <p className="text-dark-400">Configure your AI assistant and document processing preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="card p-2 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-primary-500/10 text-primary-400'
                                            : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-dark-500'}`} />
                                    <span className="flex-1 text-left">{tab.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2.5 rounded-xl border border-dark-700 text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 card">
                    {activeTab === 'llm' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">LLM & AI Settings</h2>
                                    <p className="text-dark-400 text-sm">Configure your AI model preferences</p>
                                </div>
                            </div>

                            <div>
                                <label className="label">LLM Provider</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {providers.map((provider) => (
                                        <button
                                            key={provider.value}
                                            onClick={() => {
                                                updateLLMSettings({ provider: provider.value as any });
                                                const firstModel = modelOptions[provider.value]?.[0]?.value;
                                                if (firstModel) updateLLMSettings({ model: firstModel });
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                settings.llm.provider === provider.value
                                                    ? 'border-primary-500 bg-primary-500/10'
                                                    : 'border-dark-700 hover:border-dark-600 bg-dark-800/50'
                                            }`}
                                        >
                                            <p className={`font-medium ${settings.llm.provider === provider.value ? 'text-primary-400' : 'text-white'}`}>
                                                {provider.label}
                                            </p>
                                            <p className="text-dark-400 text-sm mt-1">{provider.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="label">Model Selection</label>
                                <select
                                    value={settings.llm.model}
                                    onChange={(e) => updateLLMSettings({ model: e.target.value })}
                                    className="input"
                                >
                                    {modelOptions[settings.llm.provider]?.map((model) => (
                                        <option key={model.value} value={model.value}>
                                            {model.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label mb-0">Temperature</label>
                                    <span className="text-primary-400 font-mono text-sm">{settings.llm.temperature.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={settings.llm.temperature}
                                    onChange={(e) => updateLLMSettings({ temperature: parseFloat(e.target.value) })}
                                    className="w-full accent-primary-500"
                                />
                                <div className="flex justify-between text-xs text-dark-500 mt-1">
                                    <span>Precise (0)</span>
                                    <span>Creative (2)</span>
                                </div>
                            </div>

                            <div>
                                <label className="label">Max Tokens</label>
                                <input
                                    type="number"
                                    value={settings.llm.maxTokens}
                                    onChange={(e) => updateLLMSettings({ maxTokens: parseInt(e.target.value) || 0 })}
                                    min={256}
                                    max={32768}
                                    className="input"
                                />
                                <p className="text-dark-500 text-xs mt-1">Maximum number of tokens in the response (256-32768)</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'document' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <Database className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Document Processing</h2>
                                    <p className="text-dark-400 text-sm">Configure how documents are processed and chunked</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label mb-0">Chunk Size</label>
                                    <span className="text-emerald-400 font-mono text-sm">{settings.document.chunkSize} chars</span>
                                </div>
                                <input
                                    type="range"
                                    min="256"
                                    max="4096"
                                    step="128"
                                    value={settings.document.chunkSize}
                                    onChange={(e) => updateDocumentSettings({ chunkSize: parseInt(e.target.value) })}
                                    className="w-full accent-emerald-500"
                                />
                                <div className="flex justify-between text-xs text-dark-500 mt-1">
                                    <span>Smaller (256)</span>
                                    <span>Larger (4096)</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label mb-0">Chunk Overlap</label>
                                    <span className="text-emerald-400 font-mono text-sm">{settings.document.chunkOverlap} chars</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="512"
                                    step="32"
                                    value={settings.document.chunkOverlap}
                                    onChange={(e) => updateDocumentSettings({ chunkOverlap: parseInt(e.target.value) })}
                                    className="w-full accent-emerald-500"
                                />
                                <div className="flex justify-between text-xs text-dark-500 mt-1">
                                    <span>No overlap (0)</span>
                                    <span>High overlap (512)</span>
                                </div>
                            </div>

                            <div>
                                <label className="label">Allowed Extensions</label>
                                <div className="flex flex-wrap gap-2">
                                    {['pdf', 'txt', 'doc', 'docx', 'md', 'csv', 'json', 'html'].map((ext) => (
                                        <button
                                            key={ext}
                                            onClick={() => handleExtensionToggle(ext)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                settings.document.allowedExtensions.includes(ext)
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-600'
                                            }`}
                                        >
                                            .{ext}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Search & Retrieval</h2>
                                    <p className="text-dark-400 text-sm">Configure search behavior and relevance</p>
                                </div>
                            </div>

                            <div>
                                <label className="label">Number of Results</label>
                                <input
                                    type="number"
                                    value={settings.search.numberOfResults}
                                    onChange={(e) => updateSearchSettings({ numberOfResults: parseInt(e.target.value) || 1 })}
                                    min={1}
                                    max={20}
                                    className="input"
                                />
                                <p className="text-dark-500 text-xs mt-1">Number of document chunks to retrieve (1-20)</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label mb-0">Similarity Threshold</label>
                                    <span className="text-amber-400 font-mono text-sm">{(settings.search.similarityThreshold * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={settings.search.similarityThreshold}
                                    onChange={(e) => updateSearchSettings({ similarityThreshold: parseFloat(e.target.value) })}
                                    className="w-full accent-amber-500"
                                />
                                <div className="flex justify-between text-xs text-dark-500 mt-1">
                                    <span>Loose (0%)</span>
                                    <span>Strict (100%)</span>
                                </div>
                            </div>

                            <div>
                                <label className="label">Search Scope</label>
                                <div className="space-y-3">
                                    {searchScopes.map((scope) => (
                                        <button
                                            key={scope.value}
                                            onClick={() => updateSearchSettings({ searchScope: scope.value as any })}
                                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                                                settings.search.searchScope === scope.value
                                                    ? 'border-amber-500 bg-amber-500/10'
                                                    : 'border-dark-700 hover:border-dark-600 bg-dark-800/50'
                                            }`}
                                        >
                                            <p className={`font-medium ${settings.search.searchScope === scope.value ? 'text-amber-400' : 'text-white'}`}>
                                                {scope.label}
                                            </p>
                                            <p className="text-dark-400 text-sm mt-1">{scope.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ui' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">UI/UX Preferences</h2>
                                    <p className="text-dark-400 text-sm">Customize your visual experience</p>
                                </div>
                            </div>

                            <div>
                                <label className="label">Theme</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setTheme('dark');
                                            updateUISettings({ theme: 'dark' });
                                        }}
                                        className={`p-6 rounded-xl border transition-all ${
                                            theme === 'dark'
                                                ? 'border-violet-500 bg-violet-500/10'
                                                : 'border-dark-700 hover:border-dark-600 bg-dark-800/50'
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-dark-900 border border-dark-600 flex items-center justify-center mx-auto mb-3">
                                            <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-violet-400' : 'text-dark-400'}`} />
                                        </div>
                                        <p className={`font-medium text-center ${theme === 'dark' ? 'text-violet-400' : 'text-white'}`}>
                                            Dark Mode
                                        </p>
                                        <p className="text-dark-400 text-sm text-center mt-1">Easier on the eyes</p>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTheme('light');
                                            updateUISettings({ theme: 'light' });
                                        }}
                                        className={`p-6 rounded-xl border transition-all ${
                                            theme === 'light'
                                                ? 'border-violet-500 bg-violet-500/10'
                                                : 'border-dark-700 hover:border-dark-600 bg-dark-800/50'
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mx-auto mb-3">
                                            <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-amber-500' : 'text-dark-400'}`} />
                                        </div>
                                        <p className={`font-medium text-center ${theme === 'light' ? 'text-violet-400' : 'text-white'}`}>
                                            Light Mode
                                        </p>
                                        <p className="text-dark-400 text-sm text-center mt-1">Clean and bright</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
