/**
 * Google Drive Picker helper
 * Uses Google Picker API to select files from Google Drive
 */

// Types for Google Picker
declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

interface PickerDocument {
    id: string;
    name: string;
    mimeType: string;
    url: string;
}

interface GoogleDriveConfig {
    clientId: string;
    apiKey: string;
    appId: string;
}

let pickerApiLoaded = false;
let oauthToken: string | null = null;

// Get config from environment
export function getGoogleDriveConfig(): GoogleDriveConfig {
    return {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID || '',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    };
}

// Load the Google API script
export function loadGoogleApiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Window not available'));
            return;
        }

        if (window.gapi) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google API'));
        document.head.appendChild(script);
    });
}

// Load the Google Identity Services script
export function loadGoogleGsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Window not available'));
            return;
        }

        if (window.google?.accounts) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google GSI'));
        document.head.appendChild(script);
    });
}

// Initialize the picker API
export function loadPickerApi(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (pickerApiLoaded) {
            resolve();
            return;
        }

        window.gapi.load('picker', {
            callback: () => {
                pickerApiLoaded = true;
                resolve();
            },
            onerror: () => reject(new Error('Failed to load Picker API')),
        });
    });
}

// Get OAuth token using Google Identity Services
export function getOAuthToken(clientId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (oauthToken) {
            resolve(oauthToken);
            return;
        }

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/drive.file',
            callback: (response: any) => {
                if (response.error) {
                    reject(new Error(response.error));
                    return;
                }
                oauthToken = response.access_token;
                resolve(response.access_token);
            },
        });

        tokenClient.requestAccessToken({ prompt: 'consent' });
    });
}

// Create and show the picker
export function showPicker(
    config: GoogleDriveConfig,
    accessToken: string,
    onPick: (docs: PickerDocument[]) => void,
    onCancel: () => void
): void {
    // Supported MIME types
    const mimeTypes = [
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].join(',');

    const docsView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
        .setMimeTypes(mimeTypes)
        .setMode(window.google.picker.DocsViewMode.LIST);

    const picker = new window.google.picker.PickerBuilder()
        .addView(docsView)
        .setOAuthToken(accessToken)
        .setDeveloperKey(config.apiKey)
        .setAppId(config.appId)
        .setCallback((data: any) => {
            if (data.action === window.google.picker.Action.PICKED) {
                const docs: PickerDocument[] = data.docs.map((doc: any) => ({
                    id: doc.id,
                    name: doc.name,
                    mimeType: doc.mimeType,
                    url: doc.url,
                }));
                onPick(docs);
            } else if (data.action === window.google.picker.Action.CANCEL) {
                onCancel();
            }
        })
        .build();

    picker.setVisible(true);
}

// Download file from Google Drive
export async function downloadDriveFile(fileId: string, accessToken: string): Promise<Blob> {
    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to download file from Google Drive');
    }

    return response.blob();
}
