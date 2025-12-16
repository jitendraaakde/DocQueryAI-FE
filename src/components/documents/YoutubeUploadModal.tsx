'use client';

import { useState } from 'react';
import { X, Youtube, Loader2, AlertCircle } from 'lucide-react';
import api, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface YoutubeUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedCollectionId?: number | null;
}

export function YoutubeUploadModal({ isOpen, onClose, onSuccess, selectedCollectionId }: YoutubeUploadModalProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateYoutubeUrl = (url: string): boolean => {
        const patterns = [
            /youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
            /youtu\.be\/[a-zA-Z0-9_-]{11}/,
            /youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/,
            /^[a-zA-Z0-9_-]{11}$/  // Direct video ID
        ];
        return patterns.some(pattern => pattern.test(url.trim()));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!url.trim()) {
            setError('Please enter a YouTube URL');
            return;
        }

        if (!validateYoutubeUrl(url)) {
            setError('Invalid YouTube URL. Please enter a valid video link.');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/documents/from-youtube', {
                url: url.trim(),
                title: title.trim() || undefined
            });

            toast.success('YouTube transcript imported successfully!');

            // Reset form
            setUrl('');
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-dark-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">YouTube Video</h2>
                            <p className="text-xs text-dark-400">Import transcript from a video</p>
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
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* URL Input */}
                    <div>
                        <label htmlFor="youtube-url" className="block text-sm font-medium text-dark-300 mb-2">
                            YouTube URL *
                        </label>
                        <input
                            id="youtube-url"
                            type="text"
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); setError(null); }}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-dark-500 mt-1.5">
                            Enter a YouTube video URL. Must have captions/subtitles enabled.
                        </p>
                    </div>

                    {/* Title Input (Optional) */}
                    <div>
                        <label htmlFor="youtube-title" className="block text-sm font-medium text-dark-300 mb-2">
                            Title (optional)
                        </label>
                        <input
                            id="youtube-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Custom document title"
                            className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Info */}
                    <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
                        <p className="text-xs text-dark-400">
                            💡 The video must have captions or auto-generated subtitles available. Private videos are not supported.
                        </p>
                    </div>

                    {/* Collection Info */}
                    {selectedCollectionId && (
                        <p className="text-xs text-dark-400">
                            Document will be added to the selected collection after import.
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !url.trim()}
                        className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Fetching Transcript...
                            </>
                        ) : (
                            <>
                                <Youtube className="w-5 h-5" />
                                Import Transcript
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
