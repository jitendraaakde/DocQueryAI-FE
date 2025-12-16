'use client';

import { useState } from 'react';
import { X, FileText, Loader2, AlertCircle } from 'lucide-react';
import api, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface TextInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedCollectionId?: number | null;
}

export function TextInputModal({ isOpen, onClose, onSuccess, selectedCollectionId }: TextInputModalProps) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!content.trim()) {
            setError('Please enter some text content');
            return;
        }

        if (content.length < 50) {
            setError('Content too short. Please enter at least 50 characters.');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/documents/from-text', {
                content: content.trim(),
                title: title.trim() || undefined
            });

            toast.success('Document created successfully!');

            // Reset form
            setContent('');
            setTitle('');

            onSuccess();
            onClose();
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const charCount = content.length;
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-dark-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Paste Text</h2>
                            <p className="text-xs text-dark-400">Create a document from text content</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1 overflow-auto">
                    {/* Title Input (Optional) */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-dark-300 mb-2">
                            Title (optional)
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Document title"
                            className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Text Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-dark-300 mb-2">
                            Text Content *
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => { setContent(e.target.value); setError(null); }}
                            placeholder="Paste your text content here..."
                            rows={12}
                            className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none font-mono text-sm"
                            disabled={isLoading}
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-1.5">
                            <span>{wordCount} words</span>
                            <span>{charCount.toLocaleString()} characters</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Collection Info */}
                    {selectedCollectionId && (
                        <p className="text-xs text-dark-400">
                            Document will be added to the selected collection after creation.
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FileText className="w-5 h-5" />
                                Create Document
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
