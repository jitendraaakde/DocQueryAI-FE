// User types
export interface User {
    id: number;
    email: string;
    username: string;
    full_name: string | null;
    is_active: boolean;
    is_verified: boolean;
    totp_enabled: boolean;
    avatar_url: string | null;
    created_at: string;
}

export interface UserCreate {
    email: string;
    username: string;
    full_name?: string;
    password: string;
    confirm_password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

// Auth types
export interface Token {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

// Document types
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Document {
    id: number;
    filename: string;
    original_filename: string;
    file_type: string;
    file_size: number;
    title: string | null;
    description: string | null;
    status: DocumentStatus;
    error_message: string | null;
    chunk_count: number;
    created_at: string;
    updated_at: string;
    processed_at: string | null;
}

export interface DocumentChunk {
    id: number;
    chunk_index: number;
    content: string;
    start_page: number | null;
    end_page: number | null;
}

export interface DocumentListResponse {
    documents: Document[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

// Query types
export interface SourceChunk {
    document_id: number;
    document_name: string;
    chunk_id: number;
    content: string;
    relevance_score: number;
    page: number | null;
}

export interface QueryCreate {
    query_text: string;
    document_ids?: number[];
}

export interface QueryResponse {
    id: number;
    query_text: string;
    response_text: string;
    sources: SourceChunk[];
    confidence_score: number | null;
    search_time_ms: number | null;
    generation_time_ms: number | null;
    total_time_ms: number | null;
    created_at: string;
}

export interface QueryHistoryResponse {
    queries: QueryResponse[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

// API Response types
export interface ApiError {
    detail: string;
}

// Stats types
export interface UserStats {
    document_count: number;
    query_count: number;
}
