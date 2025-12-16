'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, Cloud } from 'lucide-react';
import api, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import {
    loadGoogleApiScript,
    loadGoogleGsiScript,
    loadPickerApi,
    getOAuthToken,
    showPicker,
    downloadDriveFile,
    getGoogleDriveConfig,
} from '@/lib/google-drive';

interface GoogleDrivePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedCollectionId?: number | null;
}

type LoadingState = 'idle' | 'loading-scripts' | 'authenticating' | 'picking' | 'downloading' | 'uploading';

export function GoogleDrivePickerModal({ isOpen, onClose, onSuccess, selectedCollectionId }: GoogleDrivePickerModalProps) {
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const config = getGoogleDriveConfig();

    useEffect(() => {
        if (isOpen && loadingState === 'idle') {
            initializePicker();
        }
    }, [isOpen]);

    const initializePicker = async () => {
        setError(null);
        setLoadingState('loading-scripts');

        try {
            // Load Google API scripts
            await Promise.all([
                loadGoogleApiScript(),
                loadGoogleGsiScript(),
            ]);

            // Load Picker API
            await loadPickerApi();

            setLoadingState('authenticating');

            // Get OAuth token
            const token = await getOAuthToken(config.clientId);
            setAccessToken(token);

            setLoadingState('picking');

            // Show the picker
            showPicker(
                config,
                token,
                handlePick,
                handleCancel
            );

        } catch (err: any) {
            console.error('Drive picker error:', err);
            setError(err.message || 'Failed to initialize Google Drive picker');
            setLoadingState('idle');
        }
    };

    const handlePick = async (docs: Array<{ id: string; name: string; mimeType: string }>) => {
        if (docs.length === 0) {
            onClose();
            return;
        }

        const doc = docs[0]; // Handle single file for now
        setLoadingState('downloading');

        try {
            // Download file from Google Drive
            const blob = await downloadDriveFile(doc.id, accessToken!);

            setLoadingState('uploading');

            // Create FormData and upload
            const formData = new FormData();
            formData.append('file', blob, doc.name);

            await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(`${doc.name} uploaded successfully!`);
            onSuccess();
            onClose();

        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            toast.error(message);
            setLoadingState('idle');
        }
    };

    const handleCancel = () => {
        setLoadingState('idle');
        onClose();
    };

    const handleRetry = () => {
        initializePicker();
    };

    if (!isOpen) return null;

    const getLoadingMessage = () => {
        switch (loadingState) {
            case 'loading-scripts':
                return 'Loading Google Drive...';
            case 'authenticating':
                return 'Connecting to Google...';
            case 'picking':
                return 'Opening file picker...';
            case 'downloading':
                return 'Downloading from Drive...';
            case 'uploading':
                return 'Uploading document...';
            default:
                return '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={loadingState === 'idle' ? onClose : undefined} />

            <div className="relative bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-dark-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.71 3.5L1.15 15l3.43 5.93h13.14l3.43-5.93L14.59 3.5H7.71zM14 14.5H6.5l3.75-6.5H14l3.75 6.5H14z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Google Drive</h2>
                            <p className="text-xs text-dark-400">Select a document from your Drive</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loadingState !== 'idle'}
                        className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {error ? (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <p className="text-red-400 mb-4">{error}</p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : loadingState !== 'idle' ? (
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
                            <p className="text-white font-medium">{getLoadingMessage()}</p>
                            <p className="text-dark-400 text-sm mt-2">Please wait...</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Cloud className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                            <p className="text-dark-400">Click to select a file from Google Drive</p>
                            <button
                                onClick={initializePicker}
                                className="mt-4 px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors"
                            >
                                Open Google Drive
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="px-5 pb-5">
                    <p className="text-xs text-dark-500 text-center">
                        Supported: PDF, TXT, MD, DOC, DOCX
                    </p>
                </div>
            </div>
        </div>
    );
}
