'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Plus,
    Pin,
    Trash2,
    MoreHorizontal,
    Search,
    ChevronDown,
    Loader2
} from 'lucide-react';
import {
    getChatSessions,
    createChatSession,
    deleteChatSession,
    updateChatSession,
    ChatSession
} from '@/lib/chat-api';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
    currentSessionId?: number;
    onSelectSession: (session: ChatSession) => void;
    onNewChat: () => void;
}

export function ChatSidebar({ currentSessionId, onSelectSession, onNewChat }: ChatSidebarProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPinnedOnly, setShowPinnedOnly] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setIsLoading(true);
            const data = await getChatSessions(1, 50);
            setSessions(data.sessions);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = async () => {
        try {
            const session = await createChatSession({});
            setSessions(prev => [session, ...prev]);
            onSelectSession(session);
            onNewChat();
        } catch (error) {
            console.error('Failed to create session:', error);
        }
    };

    const handleDeleteSession = async (sessionId: number) => {
        try {
            await deleteChatSession(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            setMenuOpenId(null);
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const handleTogglePin = async (session: ChatSession) => {
        try {
            const updated = await updateChatSession(session.id, { is_pinned: !session.is_pinned });
            setSessions(prev => prev.map(s => s.id === session.id ? updated : s));
            setMenuOpenId(null);
        } catch (error) {
            console.error('Failed to update session:', error);
        }
    };

    const filteredSessions = sessions.filter(session => {
        if (showPinnedOnly && !session.is_pinned) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return session.title?.toLowerCase().includes(query);
        }
        return true;
    });

    const pinnedSessions = filteredSessions.filter(s => s.is_pinned);
    const recentSessions = filteredSessions.filter(s => !s.is_pinned);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="h-full flex flex-col bg-dark-900/50 border-r border-dark-700/50">
            {/* Header */}
            <div className="p-4 border-b border-dark-700/50">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-400 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Chat
                </button>
            </div>

            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-dark-800/50 border border-dark-700/50 text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                    />
                </div>
            </div>

            {/* Filter toggle */}
            <div className="px-3 pb-2">
                <button
                    onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                        showPinnedOnly
                            ? "bg-primary-500/20 text-primary-400"
                            : "text-dark-400 hover:bg-dark-800/50"
                    )}
                >
                    <Pin className="w-4 h-4" />
                    Pinned only
                </button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto px-2">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Pinned Sessions */}
                        {pinnedSessions.length > 0 && (
                            <div className="mb-4">
                                <div className="px-2 py-1 text-xs font-medium text-dark-500 uppercase tracking-wide">
                                    Pinned
                                </div>
                                {pinnedSessions.map((session) => (
                                    <SessionItem
                                        key={session.id}
                                        session={session}
                                        isActive={session.id === currentSessionId}
                                        menuOpen={menuOpenId === session.id}
                                        onSelect={() => onSelectSession(session)}
                                        onMenuToggle={() => setMenuOpenId(menuOpenId === session.id ? null : session.id)}
                                        onDelete={() => handleDeleteSession(session.id)}
                                        onTogglePin={() => handleTogglePin(session)}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Recent Sessions */}
                        {recentSessions.length > 0 && (
                            <div>
                                <div className="px-2 py-1 text-xs font-medium text-dark-500 uppercase tracking-wide">
                                    Recent
                                </div>
                                {recentSessions.map((session) => (
                                    <SessionItem
                                        key={session.id}
                                        session={session}
                                        isActive={session.id === currentSessionId}
                                        menuOpen={menuOpenId === session.id}
                                        onSelect={() => onSelectSession(session)}
                                        onMenuToggle={() => setMenuOpenId(menuOpenId === session.id ? null : session.id)}
                                        onDelete={() => handleDeleteSession(session.id)}
                                        onTogglePin={() => handleTogglePin(session)}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        )}

                        {filteredSessions.length === 0 && (
                            <div className="text-center py-8 text-dark-500">
                                {searchQuery ? 'No matching chats' : 'No chats yet'}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

interface SessionItemProps {
    session: ChatSession;
    isActive: boolean;
    menuOpen: boolean;
    onSelect: () => void;
    onMenuToggle: () => void;
    onDelete: () => void;
    onTogglePin: () => void;
    formatDate: (date: string | null) => string;
}

function SessionItem({
    session,
    isActive,
    menuOpen,
    onSelect,
    onMenuToggle,
    onDelete,
    onTogglePin,
    formatDate
}: SessionItemProps) {
    return (
        <motion.div
            layout
            className={cn(
                "relative group rounded-lg mb-1 transition-colors",
                isActive
                    ? "bg-primary-500/20 border border-primary-500/30"
                    : "hover:bg-dark-800/50"
            )}
        >
            <button
                onClick={onSelect}
                className="w-full p-3 text-left"
            >
                <div className="flex items-start gap-3">
                    <MessageSquare className={cn(
                        "w-4 h-4 mt-0.5 flex-shrink-0",
                        isActive ? "text-primary-400" : "text-dark-500"
                    )} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "font-medium truncate text-sm",
                                isActive ? "text-white" : "text-dark-200"
                            )}>
                                {session.title || 'New Chat'}
                            </span>
                            {session.is_pinned && (
                                <Pin className="w-3 h-3 text-primary-400 flex-shrink-0" />
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-dark-500">
                                {session.message_count} messages
                            </span>
                            <span className="text-xs text-dark-600">•</span>
                            <span className="text-xs text-dark-500">
                                {formatDate(session.last_message_at || session.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </button>

            {/* Menu button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMenuToggle();
                }}
                className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-opacity",
                    menuOpen ? "opacity-100 bg-dark-700" : "opacity-0 group-hover:opacity-100 hover:bg-dark-700"
                )}
            >
                <MoreHorizontal className="w-4 h-4 text-dark-400" />
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-2 top-full mt-1 w-36 py-1 rounded-lg bg-dark-800 border border-dark-700 shadow-xl z-50"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onTogglePin();
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-700 flex items-center gap-2"
                        >
                            <Pin className="w-4 h-4" />
                            {session.is_pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-dark-700 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default ChatSidebar;
