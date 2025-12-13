'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api, { getErrorMessage } from '@/lib/api';
import { QueryResponse, Document } from '@/types';
import {
    Send, Loader2, FileText,
    Sparkles, ThumbsUp, ThumbsDown,
    PanelRight, PanelRightClose,
    CheckCircle2, Circle, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import {
    createChatSession,
    sendMessage as sendChatMessage,
    getChatSession,
    submitMessageFeedback,
    ChatSession,
} from '@/lib/chat-api';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    displayedContent?: string;
    sources?: QueryResponse['sources'];
    timestamp: Date;
    isLoading?: boolean;
    isStreaming?: boolean;
    feedback?: 'thumbs_up' | 'thumbs_down' | null;
}

export default function ChatPage() {
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
    const [docSearchQuery, setDocSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const streamingRef = useRef<NodeJS.Timeout | null>(null);

    // Load session from URL query parameter
    useEffect(() => {
        const sessionId = searchParams.get('session');
        if (sessionId) {
            const loadSession = async () => {
                try {
                    const fullSession = await getChatSession(parseInt(sessionId));
                    setCurrentSession(fullSession);
                    setMessages(fullSession.messages.map(m => ({
                        id: m.id.toString(),
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                        displayedContent: m.content,
                        sources: m.sources || undefined,
                        timestamp: new Date(m.created_at),
                        feedback: m.feedback as 'thumbs_up' | 'thumbs_down' | null
                    })));
                    if (fullSession.document_ids) {
                        setSelectedDocs(fullSession.document_ids);
                    }
                } catch (error) {
                    console.error('Failed to load session:', error);
                    toast.error('Failed to load chat session');
                }
            };
            loadSession();
        } else {
            // Reset to new chat
            setCurrentSession(null);
            setMessages([]);
            setSelectedDocs([]);
        }
    }, [searchParams]);

    // Fetch available documents
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const response = await api.get('/documents', { params: { page: 1, page_size: 100 } });
                setDocuments(response.data.documents.filter((d: Document) => d.status === 'completed'));
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        };
        fetchDocs();
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup streaming on unmount
    useEffect(() => {
        return () => {
            if (streamingRef.current) clearInterval(streamingRef.current);
        };
    }, []);

    // Streaming text effect
    const streamText = useCallback((messageId: string, fullText: string) => {
        let index = 0;
        const charsPerTick = 3;
        const tickInterval = 15;

        streamingRef.current = setInterval(() => {
            index += charsPerTick;
            if (index >= fullText.length) {
                if (streamingRef.current) clearInterval(streamingRef.current);
                setMessages(prev => prev.map(m =>
                    m.id === messageId
                        ? { ...m, displayedContent: fullText, isStreaming: false }
                        : m
                ));
            } else {
                setMessages(prev => prev.map(m =>
                    m.id === messageId
                        ? { ...m, displayedContent: fullText.slice(0, index) }
                        : m
                ));
            }
        }, tickInterval);
    }, []);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!input.trim() || isLoading) return;

        let sessionId = currentSession?.id;
        if (!sessionId) {
            try {
                const session = await createChatSession({
                    document_ids: selectedDocs.length > 0 ? selectedDocs : undefined
                });
                setCurrentSession(session);
                sessionId = session.id;
            } catch (error) {
                toast.error('Failed to create chat session');
                return;
            }
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            displayedContent: input.trim(),
            timestamp: new Date(),
        };

        const loadingMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            displayedContent: '',
            timestamp: new Date(),
            isLoading: true,
        };

        setMessages(prev => [...prev, userMessage, loadingMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(
                sessionId,
                userMessage.content,
                selectedDocs.length > 0 ? selectedDocs : undefined
            );

            const assistantMessage: ChatMessage = {
                id: response.message.id.toString(),
                role: 'assistant',
                content: response.message.content,
                displayedContent: '',
                sources: response.message.sources || undefined,
                timestamp: new Date(response.message.created_at),
                isStreaming: true,
            };

            setMessages(prev =>
                prev.filter(m => !m.isLoading).concat(assistantMessage)
            );
            setCurrentSession(response.session);

            streamText(assistantMessage.id, response.message.content);
        } catch (error) {
            toast.error(getErrorMessage(error));
            setMessages(prev => prev.filter(m => !m.isLoading));
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleFeedback = async (messageId: string, feedback: 'thumbs_up' | 'thumbs_down') => {
        try {
            await submitMessageFeedback(parseInt(messageId), feedback);
            setMessages(prev => prev.map(m =>
                m.id === messageId ? { ...m, feedback } : m
            ));
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }
    };

    const toggleDocument = (docId: number) => {
        setSelectedDocs(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const toggleAllDocuments = () => {
        if (selectedDocs.length === documents.length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs(documents.map(d => d.id));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const filteredDocs = documents.filter(d =>
        d.original_filename.toLowerCase().includes(docSearchQuery.toLowerCase())
    );

    return (
        <div className="absolute inset-0 flex">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                    <div className={`max-w-3xl mx-auto p-4 w-full ${messages.length === 0 ? 'flex-1 flex flex-col justify-center' : 'space-y-6'}`}>
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center px-4 relative py-8">
                                {/* Floating Particles */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="chat-floating-particle absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary-400/30" style={{ animationDelay: '0s' }} />
                                    <div className="chat-floating-particle absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-accent/40" style={{ animationDelay: '1s' }} />
                                    <div className="chat-floating-particle absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-primary-300/50" style={{ animationDelay: '2s' }} />
                                    <div className="chat-floating-particle absolute top-1/2 right-1/3 w-2.5 h-2.5 rounded-full bg-primary-500/20" style={{ animationDelay: '3s' }} />
                                    <div className="chat-floating-particle absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-accent/30" style={{ animationDelay: '4s' }} />
                                </div>

                                {/* Animated Gradient Orb */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 w-24 h-24 -left-4 -top-4 chat-gradient-orb rounded-full opacity-60" />
                                    <div className="relative w-16 h-16 rounded-2xl bg-dark-800/80 backdrop-blur-sm border border-primary-500/30 flex items-center justify-center chat-icon-glow">
                                        <Sparkles className="w-8 h-8 text-primary-400" />
                                    </div>
                                </div>

                                {/* Title with Gradient Animation */}
                                <h2 className="text-2xl font-bold chat-gradient-title mb-3">
                                    How can I help you today?
                                </h2>
                                <p className="text-dark-400 max-w-md mb-8 text-sm leading-relaxed">
                                    Ask questions about your documents. I'll analyze them and provide intelligent answers with source citations.
                                </p>

                                {/* Enhanced Suggestion Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                                    {[
                                        { icon: "✨", text: "Summarize key insights", query: "Summarize the key insights from my documents" },
                                        { icon: "🔍", text: "Find specific information", query: "Find information about..." },
                                        { icon: "📊", text: "Analyze trends & patterns", query: "Analyze the trends and patterns in" },
                                        { icon: "💡", text: "Explain complex topics", query: "Explain in simple terms:" }
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(item.query)}
                                            className="chat-suggestion-card group flex items-center gap-3 p-4 rounded-xl text-left"
                                        >
                                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors">
                                                {item.text}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Bottom Hint */}
                                <p className="mt-8 text-xs text-dark-500 flex items-center gap-2">
                                    <span className="inline-block w-1 h-1 rounded-full bg-primary-400 animate-pulse" />
                                    Select documents from Context panel to focus your queries
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {/* Avatar */}
                                    <div className={`
                                    w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                                    ${message.role === 'assistant'
                                            ? 'bg-gradient-to-br from-primary-500 to-accent'
                                            : 'bg-dark-700'}
                                `}>
                                        {message.role === 'assistant' ? (
                                            <Sparkles className="w-4 h-4 text-white" />
                                        ) : (
                                            <span className="text-[10px] font-semibold text-dark-300">You</span>
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : ''}`}>
                                        <div className={`
                                        inline-block rounded-2xl px-4 py-3 text-left
                                        ${message.role === 'user'
                                                ? 'bg-primary-600 text-white rounded-tr-sm'
                                                : 'bg-dark-800 border border-dark-700 text-dark-100 rounded-tl-sm'}
                                    `}>
                                            {message.isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                    <span className="text-dark-400 text-sm">Analyzing...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="prose prose-invert prose-sm max-w-none">
                                                        <ReactMarkdown>
                                                            {message.displayedContent || message.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                    {message.isStreaming && (
                                                        <span className="inline-block w-2 h-4 bg-primary-400 ml-0.5 animate-pulse" />
                                                    )}

                                                    {/* Sources */}
                                                    {!message.isStreaming && message.sources && message.sources.length > 0 && (
                                                        <div className="mt-3 pt-2 border-t border-dark-700/50">
                                                            <p className="text-xs font-medium text-dark-500 mb-1.5">Sources</p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {message.sources.map((source: { document_name: string }, i: number) => (
                                                                    <span
                                                                        key={i}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-dark-900/50 border border-dark-700/50 text-xs text-dark-300"
                                                                    >
                                                                        <FileText className="w-3 h-3" />
                                                                        {source.document_name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Feedback */}
                                                    {message.role === 'assistant' && !message.isLoading && !message.isStreaming && (
                                                        <div className="mt-2 flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleFeedback(message.id, 'thumbs_up')}
                                                                className={`p-1 rounded-lg transition-colors ${message.feedback === 'thumbs_up'
                                                                    ? 'bg-green-500/10 text-green-400'
                                                                    : 'text-dark-500 hover:text-green-400 hover:bg-green-500/10'
                                                                    }`}
                                                            >
                                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleFeedback(message.id, 'thumbs_down')}
                                                                className={`p-1 rounded-lg transition-colors ${message.feedback === 'thumbs_down'
                                                                    ? 'bg-red-500/10 text-red-400'
                                                                    : 'text-dark-500 hover:text-red-400 hover:bg-red-500/10'
                                                                    }`}
                                                            >
                                                                <ThumbsDown className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Enhanced Input Area */}
                <div className="border-t border-dark-800 bg-gradient-to-t from-dark-900 to-dark-900/50">
                    <div className="max-w-3xl mx-auto p-4">
                        <form onSubmit={handleSubmit} className="flex gap-3">
                            <div className="flex-1 relative group">
                                {/* Gradient backdrop on focus */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent rounded-xl opacity-0 group-focus-within:opacity-30 blur transition-opacity duration-300" />
                                <div className="relative flex items-center">
                                    <Sparkles className="absolute left-4 w-4 h-4 text-dark-500 group-focus-within:text-primary-400 transition-colors" />
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask anything about your documents..."
                                        rows={1}
                                        className="w-full bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 chat-input-enhanced resize-none min-h-[48px] max-h-32"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`
                                    chat-send-button h-[48px] px-5 rounded-xl font-medium flex items-center gap-2 transition-all
                                    ${!input.trim() || isLoading
                                        ? 'bg-dark-800 text-dark-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105'}
                                `}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                        <p className="mt-2 text-center text-[10px] text-dark-600">
                            Press Enter to send • Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Show Sidebar Button - appears when sidebar is hidden */}
            {!showRightSidebar && (
                <button
                    onClick={() => setShowRightSidebar(true)}
                    className="absolute right-4 top-16 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors shadow-lg"
                    title="Show Context"
                >
                    <FileText className="w-4 h-4" />
                    {selectedDocs.length > 0 && (
                        <span className="bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {selectedDocs.length}
                        </span>
                    )}
                    <PanelRight className="w-4 h-4" />
                </button>
            )}

            {/* Right Sidebar - Document Context */}
            <div className={`
                ${showRightSidebar ? 'w-72' : 'w-0'} 
                transition-all duration-300 overflow-hidden h-full border-l border-dark-800 bg-dark-900/50 flex-shrink-0
            `}>
                <div className="w-72 h-full flex flex-col">
                    {/* Header with Hide Button */}
                    <div className="p-4 border-b border-dark-800">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-white">Context</h3>
                            <button
                                onClick={() => setShowRightSidebar(false)}
                                className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                                title="Hide sidebar"
                            >
                                <PanelRightClose className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-dark-400">Select documents for AI context</p>
                    </div>

                    {/* Search */}
                    <div className="p-4 pb-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={docSearchQuery}
                                onChange={(e) => setDocSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Stats & Select All */}
                    <div className="px-4 pb-2 flex items-center justify-between">
                        <span className="text-xs text-dark-400">{selectedDocs.length} selected</span>
                        <button
                            onClick={toggleAllDocuments}
                            className="text-xs text-primary-400 hover:text-primary-300"
                        >
                            {selectedDocs.length === documents.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>

                    {/* Document List */}
                    <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5">
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map(doc => {
                                const isSelected = selectedDocs.includes(doc.id);
                                return (
                                    <div
                                        key={doc.id}
                                        onClick={() => toggleDocument(doc.id)}
                                        className={`
                                            group flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border
                                            ${isSelected
                                                ? 'bg-primary-500/10 border-primary-500/30'
                                                : 'bg-dark-800/50 border-dark-700/50 hover:bg-dark-800 hover:border-dark-600'}
                                        `}
                                    >
                                        <div className={`
                                            flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                                            ${isSelected ? 'bg-primary-500 text-white' : 'bg-dark-700 text-dark-400'}
                                        `}>
                                            <FileText className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary-100' : 'text-dark-200'}`}>
                                                {doc.original_filename}
                                            </p>
                                            <p className="text-[10px] text-dark-500">
                                                {(doc.file_size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                        <div className="text-primary-500">
                                            {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 opacity-30" />}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-dark-500 text-sm">
                                <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                No documents found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
