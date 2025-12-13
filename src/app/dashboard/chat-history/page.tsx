'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    MessageSquare, Loader2, Clock, Search,
    Trash2, ChevronRight, Sparkles, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    getChatSessions,
    deleteChatSession,
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

export default function ChatHistoryPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const data = await getChatSessions();
                setSessions(data.sessions);
            } catch (error) {
                console.error('Failed to load sessions:', error);
                toast.error('Failed to load chat history');
            } finally {
                setIsLoading(false);
            }
        };
        loadSessions();
    }, []);

    const handleDeleteSession = async (sessionId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingId(sessionId);
        try {
            await deleteChatSession(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            toast.success('Chat deleted');
        } catch (error) {
            toast.error('Failed to delete chat');
        } finally {
            setDeletingId(null);
        }
    };

    const handleContinueChat = (sessionId: number) => {
        router.push(`/dashboard/chat?session=${sessionId}`);
    };

    const handleNewChat = () => {
        router.push('/dashboard/chat');
    };

    const filteredSessions = sessions.filter(s =>
        (s.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    Chat History
                </h1>
                <p className="text-dark-400">
                    View and continue your previous conversations with the AI assistant.
                </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                    />
                </div>

                {/* New Chat Button */}
                <button
                    onClick={handleNewChat}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5" />
                    New Chat
                </button>
            </div>

            {/* Chat Sessions List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-4" />
                    <p className="text-dark-400">Loading chat history...</p>
                </div>
            ) : filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-dark-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {searchQuery ? 'No chats found' : 'No chat history yet'}
                    </h3>
                    <p className="text-dark-400 max-w-md mb-6">
                        {searchQuery
                            ? 'Try a different search term'
                            : 'Start a new conversation with the AI to see it appear here.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={handleNewChat}
                            className="flex items-center gap-2 px-6 py-3 bg-primary-500/10 text-primary-400 font-medium rounded-xl hover:bg-primary-500/20 transition-colors"
                        >
                            <Sparkles className="w-5 h-5" />
                            Start Your First Chat
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredSessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => handleContinueChat(session.id)}
                            className="group bg-dark-800/50 hover:bg-dark-800 border border-dark-700/50 hover:border-dark-600 rounded-xl p-4 cursor-pointer transition-all"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/20 to-accent/20 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-6 h-6 text-primary-400" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium mb-1 truncate group-hover:text-primary-300 transition-colors">
                                        {session.title || 'Untitled Chat'}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-dark-400">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {formatRelativeTime(new Date(session.updated_at))}
                                        </span>
                                        {session.message_count && (
                                            <span>{session.message_count} messages</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => handleDeleteSession(session.id, e)}
                                        disabled={deletingId === session.id}
                                        className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        {deletingId === session.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg text-sm font-medium group-hover:bg-primary-500/20 transition-colors">
                                        Continue
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            {!isLoading && sessions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-dark-800">
                    <p className="text-center text-sm text-dark-500">
                        {sessions.length} total conversation{sessions.length !== 1 ? 's' : ''}
                        {searchQuery && filteredSessions.length !== sessions.length && (
                            <span> • {filteredSessions.length} matching search</span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
