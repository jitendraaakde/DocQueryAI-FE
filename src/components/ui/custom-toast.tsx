'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    Loader2,
    X,
    Sparkles,
    Zap,
    Shield,
    Upload,
    Trash2,
    LogIn,
    UserPlus,
    Settings,
    MessageSquare,
    FolderPlus,
    FileText,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface CustomToastProps {
    toast: ToastData;
    onDismiss: (id: string) => void;
}

const toastConfig = {
    success: {
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        bgGradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
        borderColor: 'border-emerald-500/30',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-400',
        glowColor: 'shadow-emerald-500/20',
        Icon: CheckCircle2,
    },
    error: {
        gradient: 'from-rose-500 via-red-500 to-pink-500',
        bgGradient: 'from-rose-500/10 via-red-500/10 to-pink-500/10',
        borderColor: 'border-rose-500/30',
        iconBg: 'bg-rose-500/20',
        iconColor: 'text-rose-400',
        glowColor: 'shadow-rose-500/20',
        Icon: XCircle,
    },
    warning: {
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        bgGradient: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10',
        borderColor: 'border-amber-500/30',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        glowColor: 'shadow-amber-500/20',
        Icon: AlertTriangle,
    },
    info: {
        gradient: 'from-blue-500 via-indigo-500 to-violet-500',
        bgGradient: 'from-blue-500/10 via-indigo-500/10 to-violet-500/10',
        borderColor: 'border-blue-500/30',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        glowColor: 'shadow-blue-500/20',
        Icon: Info,
    },
    loading: {
        gradient: 'from-purple-500 via-pink-500 to-fuchsia-500',
        bgGradient: 'from-purple-500/10 via-pink-500/10 to-fuchsia-500/10',
        borderColor: 'border-purple-500/30',
        iconBg: 'bg-purple-500/20',
        iconColor: 'text-purple-400',
        glowColor: 'shadow-purple-500/20',
        Icon: Loader2,
    },
};

export function CustomToast({ toast, onDismiss }: CustomToastProps) {
    const [progress, setProgress] = useState(100);
    const config = toastConfig[toast.type];
    const duration = toast.duration || 5000;
    const Icon = config.Icon;

    useEffect(() => {
        if (toast.type === 'loading') return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    onDismiss(toast.id);
                    return 0;
                }
                return prev - (100 / (duration / 50));
            });
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onDismiss, toast.id, toast.type]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
            }}
            className={`
                relative overflow-hidden rounded-xl backdrop-blur-xl
                ${toast.type === 'error' ? 'animate-shake' : ''}
            `}
        >
            {/* Animated gradient border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-30 animate-gradient-x bg-[length:200%_auto]`} />

            {/* Glass container */}
            <div className={`
                relative m-[1px] rounded-xl bg-dark-900/95 backdrop-blur-xl
                shadow-2xl ${config.glowColor}
            `}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${config.bgGradient} rounded-xl opacity-50`} />

                <div className="relative p-4 pr-12">
                    <div className="flex items-start gap-3">
                        {/* Icon with glow */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
                            className={`
                                flex-shrink-0 w-10 h-10 rounded-xl ${config.iconBg}
                                flex items-center justify-center
                                shadow-lg ${config.glowColor}
                            `}
                        >
                            {toast.icon || (
                                <Icon
                                    className={`
                                        w-5 h-5 ${config.iconColor}
                                        ${toast.type === 'loading' ? 'animate-spin' : ''}
                                        ${toast.type === 'success' ? 'animate-pulse' : ''}
                                    `}
                                />
                            )}
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <motion.h4
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-sm font-semibold text-white"
                            >
                                {toast.title}
                            </motion.h4>
                            {toast.message && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-1 text-sm text-dark-300 leading-relaxed"
                                >
                                    {toast.message}
                                </motion.p>
                            )}

                            {/* Action button */}
                            {toast.action && (
                                <motion.button
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    onClick={toast.action.onClick}
                                    className={`
                                        mt-2 text-xs font-medium ${config.iconColor}
                                        hover:underline focus:outline-none
                                    `}
                                >
                                    {toast.action.label}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                {toast.type !== 'loading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-800/50 overflow-hidden rounded-b-xl">
                        <motion.div
                            className={`h-full bg-gradient-to-r ${config.gradient}`}
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.05 }}
                        />
                    </div>
                )}

                {/* Dismiss button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => onDismiss(toast.id)}
                    className="
                        absolute top-3 right-3 w-7 h-7 rounded-lg
                        bg-dark-800/50 hover:bg-dark-700/50
                        flex items-center justify-center
                        text-dark-400 hover:text-white
                        transition-all duration-200
                    "
                >
                    <X className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}

// Toast container component
interface ToastContainerProps {
    toasts: ToastData[];
    onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <CustomToast toast={toast} onDismiss={onDismiss} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// Context icons for different actions
export const ToastIcons = {
    login: <LogIn className="w-5 h-5" />,
    register: <UserPlus className="w-5 h-5" />,
    upload: <Upload className="w-5 h-5" />,
    delete: <Trash2 className="w-5 h-5" />,
    settings: <Settings className="w-5 h-5" />,
    chat: <MessageSquare className="w-5 h-5" />,
    folder: <FolderPlus className="w-5 h-5" />,
    document: <FileText className="w-5 h-5" />,
    sparkles: <Sparkles className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    shield: <Shield className="w-5 h-5" />,
};
