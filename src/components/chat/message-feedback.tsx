'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Flag, X, Loader2 } from 'lucide-react';
import { submitMessageFeedback, ChatMessage } from '@/lib/chat-api';
import { cn } from '@/lib/utils';

interface MessageFeedbackProps {
    message: ChatMessage;
    onFeedbackSubmit?: (updatedMessage: ChatMessage) => void;
}

export function MessageFeedback({ message, onFeedbackSubmit }: MessageFeedbackProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportText, setReportText] = useState('');
    const [currentFeedback, setCurrentFeedback] = useState(message.feedback);

    const handleFeedback = async (type: 'thumbs_up' | 'thumbs_down') => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const updated = await submitMessageFeedback(message.id, type);
            setCurrentFeedback(type);
            onFeedbackSubmit?.(updated);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReport = async () => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const updated = await submitMessageFeedback(message.id, 'reported', reportText);
            setCurrentFeedback('reported');
            setShowReportModal(false);
            setReportText('');
            onFeedbackSubmit?.(updated);
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Only show for assistant messages
    if (message.role !== 'assistant') return null;

    return (
        <>
            <div className="flex items-center gap-1 mt-2">
                <button
                    onClick={() => handleFeedback('thumbs_up')}
                    disabled={isSubmitting}
                    className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        currentFeedback === 'thumbs_up'
                            ? "bg-green-500/20 text-green-400"
                            : "text-dark-500 hover:text-green-400 hover:bg-green-500/10"
                    )}
                    title="Good response"
                >
                    <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleFeedback('thumbs_down')}
                    disabled={isSubmitting}
                    className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        currentFeedback === 'thumbs_down'
                            ? "bg-red-500/20 text-red-400"
                            : "text-dark-500 hover:text-red-400 hover:bg-red-500/10"
                    )}
                    title="Bad response"
                >
                    <ThumbsDown className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setShowReportModal(true)}
                    disabled={isSubmitting}
                    className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        currentFeedback === 'reported'
                            ? "bg-orange-500/20 text-orange-400"
                            : "text-dark-500 hover:text-orange-400 hover:bg-orange-500/10"
                    )}
                    title="Report issue"
                >
                    <Flag className="w-4 h-4" />
                </button>
            </div>

            {/* Report Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowReportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Report Issue</h3>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-dark-400 mb-4">
                                Please describe what was wrong with this response:
                            </p>

                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="The response was incorrect because..."
                                className="w-full h-32 px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                            />

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-dark-600 text-dark-300 hover:bg-dark-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReport}
                                    disabled={isSubmitting || !reportText.trim()}
                                    className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Submit Report'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default MessageFeedback;
