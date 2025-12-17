'use client';

import { useCallback, useState, useEffect, Suspense, memo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import api, { getErrorMessage } from '@/lib/api';
import { Document, DocumentListResponse } from '@/types';
import { getCollections, updateCollectionDocuments, Collection } from '@/lib/collections-api';
import {
    Upload, FileText, Trash2, RefreshCw, Search,
    Loader2, X, CheckCircle, AlertCircle, Clock,
    Link as LinkIcon, ChevronDown, Folders, Eye, Youtube, Globe, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { UrlUploadModal } from '@/components/documents/UrlUploadModal';
import { TextInputModal } from '@/components/documents/TextInputModal';
import { YoutubeUploadModal } from '@/components/documents/YoutubeUploadModal';
import { WebsiteCrawlModal } from '@/components/documents/WebsiteCrawlModal';
import { DocumentSummaryModal } from '@/components/documents/DocumentSummaryModal';
// import { GoogleDrivePickerModal } from '@/components/documents/GoogleDrivePickerModal';

// Wrap with Suspense because useSearchParams needs it in Next.js App Router
export default function DocumentsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        }>
            <DocumentsContent />
        </Suspense>
    );
}

function DocumentsContent() {
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

    // Document preview state
    const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
    const [viewContent, setViewContent] = useState<string | null>(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [isLoadingView, setIsLoadingView] = useState(false);

    // Delete loading state
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Modal states
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [showTextModal, setShowTextModal] = useState(false);
    const [showYoutubeModal, setShowYoutubeModal] = useState(false);
    const [showWebsiteModal, setShowWebsiteModal] = useState(false);
    // const [showDriveModal, setShowDriveModal] = useState(false);

    // Summary modal state
    const [summaryDoc, setSummaryDoc] = useState<{ id: number; name: string } | null>(null);

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

    /* const handleGoogleDrive = () => {
        setShowDriveModal(true);
    }; */

    const handleUrlImport = () => {
        setShowUrlModal(true);
    };

    const handleDelete = async (docId: number, filename: string) => {
        if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;

        setDeletingId(docId);
        try {
            await api.delete(`/documents/${docId}`);
            toast.success('Document deleted');
            fetchDocuments();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setDeletingId(null);
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

    const handleView = async (doc: Document) => {
        setViewingDoc(doc);
        setIsLoadingView(true);
        setViewContent(null);
        setPdfBlobUrl(null);

        try {
            if (doc.file_type === 'pdf') {
                // Fetch PDF as blob with authentication
                const response = await api.get(`/documents/${doc.id}/download`, {
                    responseType: 'blob'
                });
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfBlobUrl(url);
            } else {
                // For text files, load content as text
                const response = await api.get(`/documents/${doc.id}/download`, {
                    responseType: 'text'
                });
                setViewContent(response.data);
            }
        } catch (error) {
            toast.error('Failed to load document');
            setViewingDoc(null);
        } finally {
            setIsLoadingView(false);
        }
    };

    const closeViewer = () => {
        // Revoke blob URL to free memory
        if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
        }
        setViewingDoc(null);
        setViewContent(null);
        setPdfBlobUrl(null);
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

            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={`
                    relative overflow-hidden rounded-2xl border transition-all duration-300
                    ${isDragActive
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'}
                    ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}
                `}
            >
                {/* Subtle glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary-500/5 blur-3xl rounded-full pointer-events-none" />

                <input {...getInputProps()} />

                <div className="relative p-8">
                    {isUploading ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                            </div>
                            <p className="text-white font-medium">{uploadProgress}</p>
                            <p className="text-dark-400 text-sm mt-1">Please wait...</p>
                        </div>
                    ) : isDragActive ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-500/20 border-2 border-dashed border-primary-500 flex items-center justify-center">
                                <Upload className="w-10 h-10 text-primary-400 animate-bounce" />
                            </div>
                            <p className="text-white font-semibold text-xl">Drop files here</p>
                            <p className="text-dark-400 text-sm mt-1">Release to upload</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Main Upload Button */}
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); open(); }}
                                    className="group flex items-center gap-4 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:scale-[1.02]"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-semibold">Upload from Computer</span>
                                        <span className="text-sm text-white/70">PDF, TXT, DOCX, MD • Max 50MB</span>
                                    </div>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 px-4">
                                <div className="flex-1 h-px bg-dark-700" />
                                <span className="text-dark-500 text-xs uppercase tracking-wider font-medium">or import from</span>
                                <div className="flex-1 h-px bg-dark-700" />
                            </div>

                            {/* Import Options */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* URL */}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleUrlImport(); }}
                                    className="group p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 hover:bg-dark-750 transition-all duration-200"
                                >
                                    <div className="flex flex-col items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:scale-105 transition-all">
                                            <LinkIcon className="w-5 h-5 text-primary-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-medium text-sm">URL</p>
                                            <p className="text-dark-500 text-xs">Web link</p>
                                        </div>
                                    </div>
                                </button>

                                {/* Paste Text */}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setShowTextModal(true); }}
                                    className="group p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 hover:bg-dark-750 transition-all duration-200"
                                >
                                    <div className="flex flex-col items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:scale-105 transition-all">
                                            <FileText className="w-5 h-5 text-primary-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-medium text-sm">Paste</p>
                                            <p className="text-dark-500 text-xs">Direct text</p>
                                        </div>
                                    </div>
                                </button>

                                {/* YouTube */}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setShowYoutubeModal(true); }}
                                    className="group p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-red-500/50 hover:bg-dark-750 transition-all duration-200"
                                >
                                    <div className="flex flex-col items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-105 transition-all">
                                            <Youtube className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-medium text-sm">YouTube</p>
                                            <p className="text-dark-500 text-xs">Transcript</p>
                                        </div>
                                    </div>
                                </button>

                                {/* Website */}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setShowWebsiteModal(true); }}
                                    className="group p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 hover:bg-dark-750 transition-all duration-200"
                                >
                                    <div className="flex flex-col items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:scale-105 transition-all">
                                            <Globe className="w-5 h-5 text-primary-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-medium text-sm">Website</p>
                                            <p className="text-dark-500 text-xs">Scrape page</p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Drag & Drop Hint */}
                            <p className="text-center text-dark-500 text-sm flex items-center justify-center gap-2">
                                <Upload className="w-4 h-4" />
                                or drag & drop files here
                            </p>
                        </div>
                    )}
                </div>
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

                                {doc.status === 'completed' && (
                                    <>
                                        <button
                                            onClick={() => handleView(doc)}
                                            className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors"
                                            title="View Document"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setSummaryDoc({ id: doc.id, name: doc.original_filename })}
                                            className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors"
                                            title="View AI Summary"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                    </>
                                )}

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
                                    disabled={deletingId === doc.id}
                                    className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete"
                                >
                                    {deletingId === doc.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
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

            {/* Document Preview Modal */}
            {viewingDoc && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-dark-700">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-dark-400" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-semibold truncate">{viewingDoc.original_filename}</h3>
                                    <p className="text-xs text-dark-500">{formatFileSize(viewingDoc.file_size)} • {viewingDoc.file_type.toUpperCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeViewer}
                                className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-hidden p-4" style={{ minHeight: '500px' }}>
                            {isLoadingView ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                                </div>
                            ) : pdfBlobUrl ? (
                                <iframe
                                    src={pdfBlobUrl}
                                    className="w-full h-full rounded-lg border border-dark-700"
                                    style={{ minHeight: '500px' }}
                                    title={viewingDoc.original_filename}
                                />
                            ) : viewContent ? (
                                <pre className="text-dark-200 text-sm whitespace-pre-wrap font-mono bg-dark-900 rounded-xl p-4 overflow-auto h-full">
                                    {viewContent}
                                </pre>
                            ) : (
                                <div className="text-center text-dark-500 py-8">
                                    Unable to load document content
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-dark-700">
                            <button
                                onClick={closeViewer}
                                className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* URL Upload Modal */}
            <UrlUploadModal
                isOpen={showUrlModal}
                onClose={() => setShowUrlModal(false)}
                onSuccess={fetchDocuments}
                selectedCollectionId={selectedCollectionId}
            />

            {/* Text Input Modal */}
            <TextInputModal
                isOpen={showTextModal}
                onClose={() => setShowTextModal(false)}
                onSuccess={fetchDocuments}
                selectedCollectionId={selectedCollectionId}
            />

            {/* YouTube Upload Modal */}
            <YoutubeUploadModal
                isOpen={showYoutubeModal}
                onClose={() => setShowYoutubeModal(false)}
                onSuccess={fetchDocuments}
                selectedCollectionId={selectedCollectionId}
            />

            {/* Website Crawl Modal */}
            <WebsiteCrawlModal
                isOpen={showWebsiteModal}
                onClose={() => setShowWebsiteModal(false)}
                onSuccess={fetchDocuments}
                selectedCollectionId={selectedCollectionId}
            />

            {/* Google Drive Picker Modal */}
            {/* <GoogleDrivePickerModal
                isOpen={showDriveModal}
                onClose={() => setShowDriveModal(false)}
                onSuccess={fetchDocuments}
                selectedCollectionId={selectedCollectionId}
            /> */}

            {/* Document Summary Modal */}
            {summaryDoc && (
                <DocumentSummaryModal
                    isOpen={!!summaryDoc}
                    onClose={() => setSummaryDoc(null)}
                    documentId={summaryDoc.id}
                    documentName={summaryDoc.name}
                />
            )}
        </div>
    );
}
