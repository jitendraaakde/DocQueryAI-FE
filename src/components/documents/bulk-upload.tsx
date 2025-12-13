'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    X,
    FileText,
    CheckCircle,
    AlertCircle,
    Loader2,
    Cloud
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface FileUploadProgress {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
    documentId?: number;
}

interface BulkUploadProps {
    onUploadComplete?: (documentIds: number[]) => void;
    maxFiles?: number;
    acceptedTypes?: string[];
}

export function BulkUpload({
    onUploadComplete,
    maxFiles = 10,
    acceptedTypes = ['.pdf', '.txt', '.doc', '.docx', '.md']
}: BulkUploadProps) {
    const [files, setFiles] = useState<FileUploadProgress[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const addFiles = (newFiles: File[]) => {
        const remaining = maxFiles - files.length;
        const filesToAdd = newFiles.slice(0, remaining);

        const newProgress: FileUploadProgress[] = filesToAdd.map(file => ({
            file,
            progress: 0,
            status: 'pending'
        }));

        setFiles(prev => [...prev, ...newProgress]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFile = async (fileProgress: FileUploadProgress, index: number) => {
        const formData = new FormData();
        formData.append('file', fileProgress.file);

        try {
            setFiles(prev => prev.map((f, i) =>
                i === index ? { ...f, status: 'uploading', progress: 0 } : f
            ));

            const response = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;

                    setFiles(prev => prev.map((f, i) =>
                        i === index ? { ...f, progress } : f
                    ));
                }
            });

            setFiles(prev => prev.map((f, i) =>
                i === index ? {
                    ...f,
                    status: 'success',
                    progress: 100,
                    documentId: response.data.id
                } : f
            ));

            return response.data.id;
        } catch (error: any) {
            setFiles(prev => prev.map((f, i) =>
                i === index ? {
                    ...f,
                    status: 'error',
                    error: error.response?.data?.detail || 'Upload failed'
                } : f
            ));
            return null;
        }
    };

    const uploadAll = async () => {
        setIsUploading(true);

        const pendingFiles = files.filter(f => f.status === 'pending');
        const uploadPromises = pendingFiles.map((file, i) => {
            const originalIndex = files.findIndex(f => f === file);
            return uploadFile(file, originalIndex);
        });

        const results = await Promise.all(uploadPromises);
        const successIds = results.filter((id): id is number => id !== null);

        setIsUploading(false);

        if (successIds.length > 0 && onUploadComplete) {
            onUploadComplete(successIds);
        }
    };

    const pendingCount = files.filter(f => f.status === 'pending').length;
    const successCount = files.filter(f => f.status === 'success').length;
    const errorCount = files.filter(f => f.status === 'error').length;

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-2xl p-8 text-center transition-all",
                    isDragging
                        ? "border-primary-500 bg-primary-500/10"
                        : "border-dark-700 hover:border-dark-600",
                    files.length >= maxFiles && "opacity-50 pointer-events-none"
                )}
            >
                <Cloud className={cn(
                    "w-12 h-12 mx-auto mb-4",
                    isDragging ? "text-primary-400" : "text-dark-500"
                )} />

                <p className="text-white font-medium mb-2">
                    {isDragging ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-dark-500 text-sm mb-4">
                    or click to browse ({maxFiles - files.length} remaining)
                </p>

                <input
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="bulk-upload-input"
                    disabled={files.length >= maxFiles}
                />
                <label
                    htmlFor="bulk-upload-input"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 cursor-pointer transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    Browse Files
                </label>

                <p className="text-dark-600 text-xs mt-4">
                    Supported: PDF, TXT, DOC, DOCX, MD • Max 50MB per file
                </p>
            </div>

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        {files.map((fileProgress, index) => (
                            <motion.div
                                key={`${fileProgress.file.name}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/50"
                            >
                                <FileText className="w-5 h-5 text-primary-400 flex-shrink-0" />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-white truncate">
                                            {fileProgress.file.name}
                                        </span>
                                        <span className="text-xs text-dark-500 ml-2 flex-shrink-0">
                                            {formatFileSize(fileProgress.file.size)}
                                        </span>
                                    </div>

                                    {fileProgress.status === 'uploading' && (
                                        <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${fileProgress.progress}%` }}
                                            />
                                        </div>
                                    )}

                                    {fileProgress.status === 'error' && (
                                        <p className="text-xs text-red-400">{fileProgress.error}</p>
                                    )}
                                </div>

                                <div className="flex-shrink-0">
                                    {fileProgress.status === 'pending' && (
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-1 text-dark-500 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                    {fileProgress.status === 'uploading' && (
                                        <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                                    )}
                                    {fileProgress.status === 'success' && (
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    )}
                                    {fileProgress.status === 'error' && (
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            {files.length > 0 && (
                <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-dark-500">
                        {successCount > 0 && (
                            <span className="text-green-400 mr-4">✓ {successCount} uploaded</span>
                        )}
                        {errorCount > 0 && (
                            <span className="text-red-400 mr-4">✗ {errorCount} failed</span>
                        )}
                        {pendingCount > 0 && (
                            <span>{pendingCount} pending</span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFiles([])}
                            className="px-4 py-2 rounded-lg border border-dark-600 text-dark-300 hover:bg-dark-800 transition-colors"
                        >
                            Clear All
                        </button>
                        {pendingCount > 0 && (
                            <button
                                onClick={uploadAll}
                                disabled={isUploading}
                                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload {pendingCount} Files
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BulkUpload;
