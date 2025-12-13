/**
 * Chat API functions for session and message management
 */

import api from './api';

// Types
export interface ChatSession {
    id: number;
    user_id: number;
    title: string | null;
    description: string | null;
    document_ids: number[];
    collection_id: number | null;
    is_active: boolean;
    is_pinned: boolean;
    message_count: number;
    created_at: string;
    updated_at: string;
    last_message_at: string | null;
}

export interface ChatMessage {
    id: number;
    session_id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    sources: Source[] | null;
    feedback: 'thumbs_up' | 'thumbs_down' | 'reported' | null;
    feedback_text: string | null;
    generation_time_ms: number | null;
    tokens_used: number | null;
    model_used: string | null;
    created_at: string;
}

export interface Source {
    document_id: number;
    document_name: string;
    chunk_id: number;
    content: string;
    relevance_score: number;
    page: number | null;
}

export interface ChatSessionWithMessages extends ChatSession {
    messages: ChatMessage[];
}

export interface ChatSessionList {
    sessions: ChatSession[];
    total: number;
    page: number;
    per_page: number;
}

// API Functions

/**
 * Create a new chat session
 */
export const createChatSession = async (data: {
    title?: string;
    description?: string;
    document_ids?: number[];
    collection_id?: number;
}): Promise<ChatSession> => {
    const response = await api.post<ChatSession>('/chat/sessions', data);
    return response.data;
};

/**
 * Get all chat sessions for current user
 */
export const getChatSessions = async (
    page: number = 1,
    perPage: number = 20
): Promise<ChatSessionList> => {
    const response = await api.get<ChatSessionList>('/chat/sessions', {
        params: { page, per_page: perPage }
    });
    return response.data;
};

/**
 * Get a single chat session with messages
 */
export const getChatSession = async (sessionId: number): Promise<ChatSessionWithMessages> => {
    const response = await api.get<ChatSessionWithMessages>(`/chat/sessions/${sessionId}`);
    return response.data;
};

/**
 * Update a chat session
 */
export const updateChatSession = async (
    sessionId: number,
    data: {
        title?: string;
        description?: string;
        is_pinned?: boolean;
        document_ids?: number[];
        collection_id?: number;
    }
): Promise<ChatSession> => {
    const response = await api.patch<ChatSession>(`/chat/sessions/${sessionId}`, data);
    return response.data;
};

/**
 * Delete a chat session
 */
export const deleteChatSession = async (
    sessionId: number,
    permanent: boolean = false
): Promise<void> => {
    await api.delete(`/chat/sessions/${sessionId}`, {
        params: { permanent }
    });
};

/**
 * Send a message in a session and get AI response
 */
export const sendMessage = async (
    sessionId: number,
    message: string,
    documentIds?: number[],
    stream: boolean = false
): Promise<{
    message: ChatMessage;
    session: ChatSession;
}> => {
    const response = await api.post(`/chat/sessions/${sessionId}/messages`, {
        message,
        document_ids: documentIds,
        stream
    });
    return response.data;
};

/**
 * Get messages for a session
 */
export const getChatMessages = async (
    sessionId: number,
    limit?: number
): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`, {
        params: { limit }
    });
    return response.data;
};

/**
 * Submit feedback for a message
 */
export const submitMessageFeedback = async (
    messageId: number,
    feedback: 'thumbs_up' | 'thumbs_down' | 'reported',
    feedbackText?: string
): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>(`/chat/messages/${messageId}/feedback`, {
        feedback,
        feedback_text: feedbackText
    });
    return response.data;
};

/**
 * Export chat session
 */
export const exportChatSession = async (
    sessionId: number,
    format: 'pdf' | 'markdown' | 'json',
    includeSources: boolean = true
): Promise<{
    download_url: string;
    filename: string;
    format: string;
    expires_at: string;
}> => {
    const response = await api.post(`/chat/sessions/${sessionId}/export`, {
        format,
        include_sources: includeSources
    });
    return response.data;
};
