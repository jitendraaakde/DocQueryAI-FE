'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import api, { getErrorMessage } from '@/lib/api';
import { Document, DocumentListResponse } from '@/types';
import { getCollections, updateCollectionDocuments, Collection } from '@/lib/collections-api';
import {
    Upload, FileText, Trash2, RefreshCw, Search,
    Loader2, X, CheckCircle, AlertCircle, Clock,
    Link as LinkIcon, ChevronDown, Folders
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const preSelectedCollectionId = searchParams.get('collection');

    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Collection state
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(
        preSelectedCollectionId ? parseInt(preSelectedCollectionId) : null
    );
    const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

    // Load collections on mount
    useEffect(() => {
        const loadCollections = async () => {
            try {
                const data = await getCollections();
                setCollections(data.collections);
            } catch (error) {
                console.error('Failed to load collections:', error);
            }
        };
        loadCollections();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get<DocumentListResponse>('/documents', {
                params: { page, page_size: 10 }
            });
            setDocuments(response.data.documents);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            toast.error('Failed to load documents');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [page]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        const uploadedDocIds: number[] = [];

        for (const file of acceptedFiles) {
            setUploadProgress(`Uploading ${file.name}...`);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await api.post<Document>('/documents', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedDocIds.push(response.data.id);
                toast.success(`${file.name} uploaded successfully!`);
            } catch (error) {
                toast.error(`Failed to upload ${file.name}: ${getErrorMessage(error)}`);
            }
        }

        // Add to collection if one is selected
        if (selectedCollectionId && uploadedDocIds.length > 0) {
            try {
                setUploadProgress('Adding to collection...');
                await updateCollectionDocuments(selectedCollectionId, uploadedDocIds, 'add');
                const collection = collections.find(c => c.id === selectedCollectionId);
                toast.success(`Added to ${collection?.name || 'collection'}`);
            } catch (error) {
                toast.error('Failed to add documents to collection');
            }
        }

        setIsUploading(false);
        setUploadProgress(null);
        fetchDocuments();
    }, [selectedCollectionId, collections]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 50 * 1024 * 1024,
        disabled: isUploading,
        noClick: true,
        noKeyboard: true
    });

    const handleGoogleDrive = () => {
        toast('Google Drive integration coming soon!', { icon: '🔜' });
    };

    const handleUrlImport = () => {
        const url = prompt('Enter URL to import:');
        if (url) {
            toast('URL import coming soon!', { icon: '🔜' });
        }
    };

    const handleDelete = async (docId: number, filename: string) => {
        if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;

        try {
            await api.delete(`/documents/${docId}`);
            toast.success('Document deleted');
            fetchDocuments();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReprocess = async (docId: number) => {
        try {
            await api.post(`/documents/${docId}/reprocess`);
            toast.success('Reprocessing started');
            fetchDocuments();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'processing':
                return <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-dark-400" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Documents</h1>
                    <p className="text-dark-400 text-sm mt-1">
                        Upload and manage your documents for AI-powered search
                    </p>
                </div>

                {/* Collection Dropdown - moved to top right */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedCollectionId
                            ? 'bg-primary-500/10 border-primary-500/30 text-primary-400'
                            : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                            }`}
                    >
                        <Folders className="w-4 h-4" />
                        <span className="text-sm">
                            {selectedCollectionId
                                ? collections.find(c => c.id === selectedCollectionId)?.name || 'Collection'
                                : 'Add to Collection'
                            }
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showCollectionDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showCollectionDropdown && (
                        <div
                            className="absolute top-full right-0 mt-2 w-56 py-1 rounded-lg bg-dark-800 border border-dark-600 shadow-xl z-20"
                        >
                            <button
                                onClick={() => { setSelectedCollectionId(null); setShowCollectionDropdown(false); }}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-dark-700 ${!selectedCollectionId ? 'text-primary-400' : 'text-dark-300'
                                    }`}
                            >
                                <X className="w-4 h-4" />
                                No collection
                            </button>
                            <div className="border-t border-dark-700 my-1" />
                            {collections.length === 0 ? (
                                <p className="px-4 py-2 text-sm text-dark-500">No collections yet</p>
                            ) : (
                                collections.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => { setSelectedCollectionId(c.id); setShowCollectionDropdown(false); }}
                                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-dark-700 ${selectedCollectionId === c.id ? 'text-primary-400 bg-primary-500/10' : 'text-dark-300'
                                            }`}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: c.color }}
                                        />
                                        <span className="truncate">{c.name}</span>
                                        <span className="text-dark-500 text-xs ml-auto">{c.document_count}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Zone with 3 Options */}
            <div
                {...getRootProps()}
                className={`
                    rounded-2xl border-2 border-dashed transition-all duration-300 p-8
                    ${isDragActive
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 hover:border-dark-600 bg-dark-800/30'}
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />

                {isUploading ? (
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 text-primary-400 mx-auto mb-3 animate-spin" />
                        <p className="text-white font-medium">{uploadProgress}</p>
                    </div>
                ) : isDragActive ? (
                    <div className="text-center">
                        <Upload className="w-10 h-10 mx-auto mb-3 text-primary-400 animate-bounce" />
                        <p className="text-white font-medium">Drop files here...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        {/* Upload Options - 3 Stacked Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
                            {/* Upload from Computer */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); open(); }}
                                className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:scale-[1.02] group"
                            >
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </div>
                                <div className="text-left min-w-0">
                                    <p className="font-semibold text-sm">Upload from Computer</p>
                                    <p className="text-[11px] text-white/70 truncate">PDF, TXT, DOCX, MD • Max 50MB</p>
                                </div>
                            </button>

                            {/* Upload from Google Drive */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleGoogleDrive(); }}
                                className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700/80 border border-dark-600 text-dark-200 hover:text-white hover:bg-dark-700 hover:border-dark-500 transition-all group min-w-0"
                            >
                                <div className="w-9 h-9 rounded-full bg-dark-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.71 3.5L1.15 15l3.43 5.93h13.14l3.43-5.93L14.59 3.5H7.71zM14 14.5H6.5l3.75-6.5H14l3.75 6.5H14z" />
                                    </svg>
                                </div>
                                <div className="text-left min-w-0 flex-1 overflow-hidden">
                                    <p className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                        <span className="whitespace-nowrap">Upload from Drive</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-500/50 text-dark-400">Soon</span>
                                    </p>
                                    <p className="text-[11px] text-dark-400 truncate">Connect your Google Drive</p>
                                </div>
                            </button>

                            {/* Upload from URL */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleUrlImport(); }}
                                className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700/80 border border-dark-600 text-dark-200 hover:text-white hover:bg-dark-700 hover:border-dark-500 transition-all group min-w-0"
                            >
                                <div className="w-9 h-9 rounded-full bg-dark-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <LinkIcon className="w-4 h-4" />
                                </div>
                                <div className="text-left min-w-0 flex-1 overflow-hidden">
                                    <p className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                        <span className="whitespace-nowrap">Upload from URL</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-500/50 text-dark-400">Soon</span>
                                    </p>
                                    <p className="text-[11px] text-dark-400 truncate">Import from web link</p>
                                </div>
                            </button>
                        </div>

                        {/* Drag & drop hint */}
                        <p className="text-dark-500 text-sm mt-4">
                            or drag & drop files anywhere in this area
                        </p>
                    </div>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-dark-800/50 border border-dark-700/50 text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Document List */}
            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            ) : filteredDocs.length > 0 ? (
                <div className="space-y-3">
                    {filteredDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 hover:border-dark-600 transition-colors"
                        >
                            <div className="w-11 h-11 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-dark-400" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">{doc.original_filename}</h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dark-500">
                                    <span>{formatFileSize(doc.file_size)}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">{doc.chunk_count} chunks</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">{new Date(doc.created_at).toLocaleDateString()}</span>
                                </div>
                                {doc.error_message && (
                                    <p className="text-red-400 text-xs mt-1 truncate">{doc.error_message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5">
                                {getStatusIcon(doc.status)}

                                {doc.status === 'failed' && (
                                    <button
                                        onClick={() => handleReprocess(doc.id)}
                                        className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors"
                                        title="Reprocess"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(doc.id, doc.original_filename)}
                                    className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg bg-dark-800 text-dark-300 hover:text-white disabled:opacity-50 disabled:hover:text-dark-300 transition-colors text-sm"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-dark-400 text-sm">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-lg bg-dark-800 text-dark-300 hover:text-white disabled:opacity-50 disabled:hover:text-dark-300 transition-colors text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-16 rounded-2xl bg-dark-800/30 border border-dark-700/50">
                    <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-dark-500" />
                    </div>
                    <h3 className="text-white font-medium mb-2">
                        {searchQuery ? 'No matching documents' : 'No documents yet'}
                    </h3>
                    <p className="text-dark-400 text-sm">
                        {searchQuery ? 'Try a different search term' : 'Upload your first document to get started'}
                    </p>
                </div>
            )}
        </div>
    );
}
