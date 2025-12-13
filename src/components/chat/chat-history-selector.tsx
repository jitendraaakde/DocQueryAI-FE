'use client';

import { useState, useEffect } from 'react';
import {
    MessageSquare, Loader2, Clock,
    Sparkles, ChevronRight
} from 'lucide-react';
import {
    getChatSessions,
    ChatSession,
} from '@/lib/chat-api';

// Simple relative time formatter
function formatRelativeTime(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

interface ChatHistorySelectorProps {
    onSelectChat: (session: ChatSession) => void;
    onStartNewChat: () => void;
}

export default function ChatHistorySelector({ onSelectChat, onStartNewChat }: ChatHistorySelectorProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const data = await getChatSessions();
                setSessions(data.sessions.slice(0, 6)); // Show max 6 recent chats
            } catch (error) {
                console.error('Failed to load sessions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSessions();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-7 h-7 text-dark-500" />
                </div>
                <p className="text-dark-400 text-sm mb-4">No previous chats found</p>
                <button
                    onClick={onStartNewChat}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    Start a New Chat
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Recent Chats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {sessions.map((session) => (
                    <button
                        key={session.id}
                        onClick={() => onSelectChat(session)}
                        className="group flex flex-col items-start gap-2 p-4 rounded-xl bg-dark-800/60 border border-dark-700/50 hover:border-primary-500/40 hover:bg-dark-800 transition-all text-left"
                    >
                        <div className="flex items-center gap-2 w-full">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm font-medium text-white truncate flex-1">
                                {session.title || 'Untitled Chat'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-dark-500 w-full">
                            <Clock className="w-3 h-3" />
                            <span>
                                {formatRelativeTime(new Date(session.updated_at))}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-primary-400 group-hover:text-primary-300 transition-colors mt-1">
                            <span>Continue this chat</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>

            {/* View all link if more chats exist */}
            {sessions.length >= 6 && (
                <p className="text-center text-xs text-dark-500 mt-4">
                    View all chats in the sidebar →
                </p>
            )}
        </div>
    );
}
