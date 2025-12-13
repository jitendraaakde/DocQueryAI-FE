'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { UserStats, DocumentListResponse } from '@/types';
import { FileText, MessageSquare, Clock, Plus, ChevronRight, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [recentDocs, setRecentDocs] = useState<DocumentListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, docsRes] = await Promise.all([
                    api.get<UserStats>('/users/me/stats'),
                    api.get<DocumentListResponse>('/documents', { params: { page: 1, page_size: 5 } }),
                ]);
                setStats(statsRes.data);
                setRecentDocs(docsRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.full_name?.split(' ')[0] || user?.username}! 👋
                </h1>
                <p className="text-dark-400">
                    Here's an overview of your document intelligence workspace.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card group hover:border-primary-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary-400" />
                        </div>
                        <span className="text-3xl font-bold text-white">{stats?.document_count || 0}</span>
                    </div>
                    <h3 className="text-dark-400 font-medium">Documents Uploaded</h3>
                </div>

                <div className="card group hover:border-accent/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-3xl font-bold text-white">{stats?.query_count || 0}</span>
                    </div>
                    <h3 className="text-dark-400 font-medium">Questions Asked</h3>
                </div>

                <div className="card group hover:border-green-500/30 transition-colors sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-400" />
                        </div>
                        <span className="text-sm text-dark-400">Last active</span>
                    </div>
                    <h3 className="text-dark-400 font-medium">Today</h3>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-6">
                <Link href="/dashboard/documents" className="card-hover flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <Plus className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                            Upload Document
                        </h3>
                        <p className="text-dark-400 text-sm">Add PDFs, docs, or text files</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-600 group-hover:text-primary-400 transition-colors" />
                </Link>

                <Link href="/dashboard/chat" className="card-hover flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
                            Ask a Question
                        </h3>
                        <p className="text-dark-400 text-sm">Get AI-powered answers</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-600 group-hover:text-accent transition-colors" />
                </Link>
            </div>

            {/* Recent Documents */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
                    <Link href="/dashboard/documents" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                        View All →
                    </Link>
                </div>

                {recentDocs && recentDocs.documents.length > 0 ? (
                    <div className="card divide-y divide-dark-700">
                        {recentDocs.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-dark-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium truncate">{doc.original_filename}</h4>
                                    <p className="text-dark-500 text-sm">
                                        {doc.chunk_count} chunks • {new Date(doc.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${doc.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                        doc.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                                            doc.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                'bg-dark-700 text-dark-400'}
                `}>
                                    {doc.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <FileText className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No documents yet</h3>
                        <p className="text-dark-400 mb-4">Upload your first document to get started</p>
                        <Link href="/dashboard/documents" className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Upload Document
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
