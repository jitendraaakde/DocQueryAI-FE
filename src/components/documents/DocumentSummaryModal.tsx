'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, BookOpen, Clock, BarChart3, List, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface DocumentSummary {
    id: number;
    original_filename: string;
    summary_brief: string | null;
    summary_detailed: string | null;
    key_points: string[] | null;
    word_count: number | null;
    reading_time_minutes: number | null;
    complexity_score: number | null;
}

interface DocumentSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentId: number;
    documentName: string;
}

export function DocumentSummaryModal({ isOpen, onClose, documentId, documentName }: DocumentSummaryModalProps) {
    const [summary, setSummary] = useState<DocumentSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'brief' | 'detailed' | 'keypoints'>('brief');

    useEffect(() => {
        if (isOpen && documentId) {
            fetchSummary();
        }
    }, [isOpen, documentId]);

    const fetchSummary = async () => {
        setIsLoading(true);
        try {
            const response = await api.get<DocumentSummary>(`/documents/${documentId}/summary`);
            setSummary(response.data);
        } catch (error) {
            toast.error('Failed to load summary');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        try {
            await api.post(`/documents/${documentId}/summary/regenerate`);
            toast.success('Summary regenerated!');
            await fetchSummary();
        } catch (error) {
            toast.error('Failed to regenerate summary');
        } finally {
            setIsRegenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-primary-400" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-white font-semibold truncate">AI Summary</h3>
                            <p className="text-xs text-dark-500 truncate">{documentName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating || isLoading}
                            className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Regenerate Summary"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
                            <p className="text-dark-400 text-sm">Loading summary...</p>
                        </div>
                    ) : !summary?.summary_brief && !summary?.summary_detailed ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-dark-500" />
                            </div>
                            <h4 className="text-white font-medium mb-2">No Summary Available</h4>
                            <p className="text-dark-400 text-sm text-center mb-4">
                                This document hasn't been summarized yet.
                            </p>
                            <button
                                onClick={handleRegenerate}
                                disabled={isRegenerating}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {isRegenerating ? 'Generating...' : 'Generate Summary'}
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Stats Bar */}
                            <div className="flex flex-wrap gap-4 mb-4 p-3 rounded-xl bg-dark-900/50 border border-dark-700/50">
                                {summary?.word_count && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <BookOpen className="w-4 h-4 text-dark-500" />
                                        <span className="text-dark-400">{summary.word_count.toLocaleString()} words</span>
                                    </div>
                                )}
                                {summary?.reading_time_minutes && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <Clock className="w-4 h-4 text-dark-500" />
                                        <span className="text-dark-400">{summary.reading_time_minutes} min read</span>
                                    </div>
                                )}
                                {summary?.complexity_score && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <BarChart3 className="w-4 h-4 text-dark-500" />
                                        <span className="text-dark-400">Complexity: {Math.round(summary.complexity_score)}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 mb-4 p-1 rounded-lg bg-dark-900/50">
                                <button
                                    onClick={() => setActiveTab('brief')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'brief'
                                            ? 'bg-primary-500/20 text-primary-400'
                                            : 'text-dark-400 hover:text-white'
                                        }`}
                                >
                                    Brief
                                </button>
                                <button
                                    onClick={() => setActiveTab('detailed')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'detailed'
                                            ? 'bg-primary-500/20 text-primary-400'
                                            : 'text-dark-400 hover:text-white'
                                        }`}
                                >
                                    Detailed
                                </button>
                                <button
                                    onClick={() => setActiveTab('keypoints')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'keypoints'
                                            ? 'bg-primary-500/20 text-primary-400'
                                            : 'text-dark-400 hover:text-white'
                                        }`}
                                >
                                    Key Points
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="prose prose-invert max-w-none">
                                {activeTab === 'brief' && (
                                    <div className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">
                                        {summary?.summary_brief || 'No brief summary available.'}
                                    </div>
                                )}
                                {activeTab === 'detailed' && (
                                    <div className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">
                                        {summary?.summary_detailed || 'No detailed summary available.'}
                                    </div>
                                )}
                                {activeTab === 'keypoints' && (
                                    <div className="space-y-2">
                                        {summary?.key_points && summary.key_points.length > 0 ? (
                                            summary.key_points.map((point, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-3 rounded-lg bg-dark-900/30 border border-dark-700/30"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-xs text-primary-400 font-medium">{index + 1}</span>
                                                    </div>
                                                    <p className="text-dark-200 text-sm">{point}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-dark-400 text-sm">No key points extracted.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-dark-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
