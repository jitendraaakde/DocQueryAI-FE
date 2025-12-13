/**
 * Collections API functions for folder/project management
 */

import api from './api';

// Types
export interface Collection {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    color: string;
    icon: string;
    is_public: boolean;
    document_count: number;
    created_at: string;
    updated_at: string;
}

export interface CollectionWithDocuments extends Collection {
    document_ids: number[];
}

export interface CollectionList {
    collections: Collection[];
    total: number;
}

export interface CollectionShare {
    id: number;
    collection_id: number;
    shared_with_user_id: number;
    shared_with_email: string;
    shared_with_username: string;
    permission: 'view' | 'edit' | 'admin';
    created_at: string;
}

// API Functions

/**
 * Create a new collection
 */
export const createCollection = async (data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    document_ids?: number[];
}): Promise<Collection> => {
    const response = await api.post<Collection>('/collections', data);
    return response.data;
};

/**
 * Get all collections for current user
 */
export const getCollections = async (includeShared: boolean = true): Promise<CollectionList> => {
    const response = await api.get<CollectionList>('/collections', {
        params: { include_shared: includeShared }
    });
    return response.data;
};

/**
 * Get a single collection with documents
 */
export const getCollection = async (collectionId: number): Promise<CollectionWithDocuments> => {
    const response = await api.get<CollectionWithDocuments>(`/collections/${collectionId}`);
    return response.data;
};

/**
 * Update a collection
 */
export const updateCollection = async (
    collectionId: number,
    data: {
        name?: string;
        description?: string;
        color?: string;
        icon?: string;
        is_public?: boolean;
    }
): Promise<Collection> => {
    const response = await api.patch<Collection>(`/collections/${collectionId}`, data);
    return response.data;
};

/**
 * Delete a collection
 */
export const deleteCollection = async (collectionId: number): Promise<void> => {
    await api.delete(`/collections/${collectionId}`);
};

/**
 * Add or remove documents from collection
 */
export const updateCollectionDocuments = async (
    collectionId: number,
    documentIds: number[],
    action: 'add' | 'remove'
): Promise<void> => {
    await api.post(`/collections/${collectionId}/documents`, {
        document_ids: documentIds,
        action
    });
};

/**
 * Get document IDs in a collection
 */
export const getCollectionDocumentIds = async (collectionId: number): Promise<number[]> => {
    const response = await api.get<number[]>(`/collections/${collectionId}/documents`);
    return response.data;
};

/**
 * Share a collection with another user
 */
export const shareCollection = async (
    collectionId: number,
    userEmail: string,
    permission: 'view' | 'edit' | 'admin' = 'view'
): Promise<CollectionShare> => {
    const response = await api.post<CollectionShare>(`/collections/${collectionId}/shares`, {
        user_email: userEmail,
        permission
    });
    return response.data;
};

/**
 * Get all shares for a collection
 */
export const getCollectionShares = async (collectionId: number): Promise<CollectionShare[]> => {
    const response = await api.get<CollectionShare[]>(`/collections/${collectionId}/shares`);
    return response.data;
};

/**
 * Update share permission
 */
export const updateSharePermission = async (
    shareId: number,
    permission: 'view' | 'edit' | 'admin'
): Promise<CollectionShare> => {
    const response = await api.patch<CollectionShare>(`/collections/shares/${shareId}`, {
        permission
    });
    return response.data;
};

/**
 * Remove a share
 */
export const removeShare = async (shareId: number): Promise<void> => {
    await api.delete(`/collections/shares/${shareId}`);
};
