'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    FileText,
    MessageSquare,
    Clock,
    TrendingUp,
    Loader2,
    Calendar
} from 'lucide-react';
import api from '@/lib/api';

interface Stats {
    period_days: number;
    documents: {
        total: number;
        total_size_bytes: number;
        avg_word_count: number;
    };
    queries: {
        total: number;
        avg_response_time_ms: number;
        avg_confidence: number;
    };
    chat: {
        sessions: number;
        messages: number;
    };
}

interface TimelineEntry {
    date: string;
    queries: number;
}

export function AnalyticsDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState(30);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, timelineRes] = await Promise.all([
                api.get(`/analytics/stats?days=${period}`),
                api.get(`/analytics/timeline?days=${period}`)
            ]);
            setStats(statsRes.data);
            setTimeline(timelineRes.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    };

    const maxQueries = Math.max(...timeline.map(t => t.queries), 1);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-400" />
                    Usage Analytics
                </h2>
                <select
                    value={period}
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                    <option value={365}>Last year</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<FileText className="w-5 h-5" />}
                    label="Documents"
                    value={stats?.documents.total || 0}
                    subtext={formatBytes(stats?.documents.total_size_bytes || 0)}
                    color="from-blue-500 to-blue-600"
                />
                <StatCard
                    icon={<MessageSquare className="w-5 h-5" />}
                    label="Queries"
                    value={stats?.queries.total || 0}
                    subtext={`${stats?.queries.avg_confidence ? Math.round(stats.queries.avg_confidence * 100) : 0}% avg confidence`}
                    color="from-purple-500 to-purple-600"
                />
                <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Avg Response"
                    value={`${stats?.queries.avg_response_time_ms || 0}ms`}
                    subtext="Response time"
                    color="from-green-500 to-green-600"
                />
                <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Chat Sessions"
                    value={stats?.chat.sessions || 0}
                    subtext={`${stats?.chat.messages || 0} messages`}
                    color="from-orange-500 to-orange-600"
                />
            </div>

            {/* Activity Timeline */}
            <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700/50">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    Query Activity
                </h3>

                {timeline.length > 0 ? (
                    <div className="h-40 flex items-end gap-1">
                        {timeline.map((entry, index) => (
                            <motion.div
                                key={entry.date || index}
                                initial={{ height: 0 }}
                                animate={{ height: `${(entry.queries / maxQueries) * 100}%` }}
                                transition={{ delay: index * 0.02, duration: 0.3 }}
                                className="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t min-h-[4px] group relative cursor-pointer"
                                style={{ minHeight: entry.queries > 0 ? '8px' : '4px' }}
                            >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-dark-700 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {entry.date}: {entry.queries} queries
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-dark-500">
                        No activity data for this period
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/30 text-center">
                        <div className="text-2xl font-bold text-white">
                            {Math.round(stats.documents.avg_word_count).toLocaleString()}
                        </div>
                        <div className="text-xs text-dark-500">Avg words/doc</div>
                    </div>
                    <div className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/30 text-center">
                        <div className="text-2xl font-bold text-white">
                            {stats.chat.sessions > 0
                                ? Math.round(stats.chat.messages / stats.chat.sessions)
                                : 0}
                        </div>
                        <div className="text-xs text-dark-500">Avg msgs/session</div>
                    </div>
                    <div className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/30 text-center">
                        <div className="text-2xl font-bold text-white">
                            {Math.round((stats.queries.avg_confidence || 0) * 100)}%
                        </div>
                        <div className="text-xs text-dark-500">Avg confidence</div>
                    </div>
                    <div className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/30 text-center">
                        <div className="text-2xl font-bold text-white">
                            {period}
                        </div>
                        <div className="text-xs text-dark-500">Days analyzed</div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, subtext, color }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    subtext: string;
    color: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-dark-800/50 border border-dark-700/50 relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-bl-full`} />

            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
                {icon}
            </div>

            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-dark-400">{label}</div>
            <div className="text-xs text-dark-500 mt-1">{subtext}</div>
        </motion.div>
    );
}

export default AnalyticsDashboard;
