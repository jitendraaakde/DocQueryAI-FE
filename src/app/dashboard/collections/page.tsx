'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Folders, Plus, Trash2, Edit3, Share2, FileText,
    Loader2, Search, MoreHorizontal, X, Check,
    Sparkles, Lock, Users, Zap, Upload, ChevronDown, Eye
} from 'lucide-react';
import {
    getCollections,
    createCollection,
    deleteCollection,
    updateCollection,
    getCollection,
    Collection,
    CollectionList,
    CollectionWithDocuments
} from '@/lib/collections-api';
import api from '@/lib/api';
import { Document } from '@/types';
import toast from 'react-hot-toast';

const COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'
];

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getCollections();
            setCollections(data.collections);
        } catch (error) {
            console.error('Failed to load collections:', error);
            toast.error('Failed to load collections');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCreate = useCallback(async (name: string, description: string, color: string) => {
        try {
            const collection = await createCollection({ name, description, color });
            setCollections(prev => [collection, ...prev]);
            setShowCreateModal(false);
            toast.success('Collection created!');
        } catch (error) {
            console.error('Failed to create collection:', error);
            toast.error('Failed to create collection');
        }
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            await deleteCollection(id);
            setCollections(prev => prev.filter(c => c.id !== id));
            toast.success('Collection deleted');
        } catch (error) {
            console.error('Failed to delete collection:', error);
            toast.error('Failed to delete collection');
        }
    }, []);

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const closeModal = useCallback(() => setShowCreateModal(false), []);
    const openModal = useCallback(() => setShowCreateModal(true), []);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Folders className="w-6 h-6 text-primary-400" />
                        Collections
                    </h1>
                    <p className="text-dark-400 text-sm mt-1">
                        Group related documents together for focused AI conversations
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    New Collection
                </button>
            </div>

            {/* What are Collections - Info Section */}
            {collections.length === 0 && !isLoading && (
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent/10 border border-primary-500/20">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-400" />
                        What are Collections?
                    </h2>
                    <p className="text-dark-300 mb-4">
                        Collections help you organize documents by project, topic, or purpose. When you chat with AI,
                        you can select a specific collection to get more relevant and focused answers.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-4 h-4 text-primary-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Focused Search</p>
                                <p className="text-xs text-dark-400">AI searches only relevant docs</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                <Lock className="w-4 h-4 text-primary-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Private by Default</p>
                                <p className="text-xs text-dark-400">Only you can access them</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                <Users className="w-4 h-4 text-primary-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Share Optionally</p>
                                <p className="text-xs text-dark-400">Collaborate with your team</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                        type="text"
                        placeholder="Search collections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
                    />
                </div>
            </div>

            {/* Collections Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                </div>
            ) : filteredCollections.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                        <Folders className="w-10 h-10 text-dark-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                        {searchQuery ? 'No matching collections' : 'No collections yet'}
                    </h3>
                    <p className="text-dark-400 mb-6 max-w-md mx-auto">
                        {searchQuery
                            ? 'Try a different search term'
                            : 'Create your first collection to start organizing your documents'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={openModal}
                            className="btn-primary"
                        >
                            Create Collection
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCollections.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            onDelete={() => handleDelete(collection.id)}
                            onEdit={() => setEditingId(collection.id)}
                        />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <CreateCollectionModal
                isOpen={showCreateModal}
                onClose={closeModal}
                onCreate={handleCreate}
            />
        </div>
    );
}

const CollectionCard = memo(function CollectionCard({ collection, onDelete, onEdit }: {
    collection: Collection;
    onDelete: () => void;
    onEdit: () => void;
}) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    const loadDocuments = useCallback(async () => {
        if (documents.length > 0 || loadingDocs) return;

        setLoadingDocs(true);
        try {
            const collectionData = await getCollection(collection.id);
            if (collectionData.document_ids.length > 0) {
                const response = await api.get<{ documents: Document[] }>('/documents', {
                    params: { page: 1, page_size: 100 }
                });
                const filteredDocs = response.data.documents.filter(
                    doc => collectionData.document_ids.includes(doc.id)
                );
                setDocuments(filteredDocs);
            }
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setLoadingDocs(false);
        }
    }, [collection.id, documents.length, loadingDocs]);

    const handleExpand = useCallback(() => {
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        if (newExpanded) loadDocuments();
    }, [isExpanded, loadDocuments]);

    const handleUploadDocuments = useCallback(() => {
        router.push(`/dashboard/documents?collection=${collection.id}`);
    }, [router, collection.id]);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const toggleMenu = useCallback(() => setShowMenu(prev => !prev), []);
    const closeMenu = useCallback(() => setShowMenu(false), []);

    return (
        <div
            className={`group relative rounded-2xl bg-dark-800/50 border border-dark-700/50 hover:border-dark-600 transition-all duration-200 ${isExpanded ? 'col-span-full' : ''}`}
        >
            {/* Main Card Content */}
            <div className="p-5">
                {/* Color indicator */}
                <div
                    className="w-full h-1.5 rounded-full mb-4"
                    style={{ backgroundColor: collection.color }}
                />

                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">{collection.name}</h3>
                        {collection.description && (
                            <p className="text-sm text-dark-400 mb-3 line-clamp-2">{collection.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-dark-500">
                            <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {collection.document_count} docs
                            </span>
                            {collection.is_public && (
                                <span className="flex items-center gap-1 text-green-400">
                                    <Share2 className="w-4 h-4" />
                                    Public
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleExpand}
                            className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-primary-500/20 text-primary-400' : 'text-dark-500 hover:text-white hover:bg-dark-700'}`}
                            title={isExpanded ? 'Collapse' : 'View Documents'}
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-lg text-dark-500 hover:text-white hover:bg-dark-700 transition-all"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Documents Section - CSS transition instead of framer-motion */}
            <div className={`border-t border-dark-700 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5">
                    {/* Header with Upload button */}
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-dark-300">Documents in Collection</h4>
                        <button
                            onClick={handleUploadDocuments}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Documents
                        </button>
                    </div>

                    {/* Documents List */}
                    {loadingDocs ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-8 text-dark-500">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No documents in this collection yet</p>
                            <button
                                onClick={handleUploadDocuments}
                                className="mt-3 text-primary-400 hover:text-primary-300 text-sm"
                            >
                                Upload your first document
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {documents.map(doc => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-dark-900/50 border border-dark-700/50"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-dark-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{doc.original_filename}</p>
                                        <p className="text-xs text-dark-500">{formatFileSize(doc.file_size)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown menu - CSS transition instead of framer-motion */}
            {showMenu && (
                <>
                    <div className="fixed inset-0 z-10" onClick={closeMenu} />
                    <div className="absolute top-12 right-4 w-40 py-1 rounded-lg bg-dark-700 border border-dark-600 shadow-xl z-20">
                        <button
                            onClick={() => { handleExpand(); closeMenu(); }}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" /> View Documents
                        </button>
                        <button
                            onClick={() => { handleUploadDocuments(); closeMenu(); }}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" /> Upload Docs
                        </button>
                        <div className="border-t border-dark-600 my-1" />
                        <button
                            onClick={() => { onEdit(); closeMenu(); }}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 flex items-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" /> Edit
                        </button>
                        <button
                            onClick={() => { onDelete(); closeMenu(); }}
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-dark-600 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
});

CollectionCard.displayName = "CollectionCard";

const CreateCollectionModal = memo(function CreateCollectionModal({ isOpen, onClose, onCreate }: {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string, color: string) => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        await onCreate(name, description, color);
        setIsSubmitting(false);
        setName('');
        setDescription('');
        setColor(COLORS[0]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Create Collection</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1.5">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Project Alpha Docs"
                            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What documents will this collection contain?"
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${color === c ? 'scale-110 ring-2 ring-white/50' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && <Check className="w-4 h-4 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-dark-600 text-dark-300 hover:bg-dark-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

CreateCollectionModal.displayName = "CreateCollectionModal";
