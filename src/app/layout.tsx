import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/theme-context';
import { SettingsProvider } from '@/contexts/settings-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DocQuery AI - Intelligent Document Search',
    description: 'Upload documents, search semantically, and get AI-powered answers from your knowledge base.',
    keywords: ['document search', 'AI', 'semantic search', 'RAG', 'vector database'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <AuthProvider>
                        <SettingsProvider>
                            {children}
                            <Toaster
                                position="top-right"
                                containerStyle={{
                                    top: 80,
                                }}
                                toastOptions={{
                                    duration: 4000,
                                    style: {
                                        background: '#1e293b',
                                        color: '#f8fafc',
                                        border: '1px solid #334155',
                                    },
                                    success: {
                                        iconTheme: {
                                            primary: '#10b981',
                                            secondary: '#f8fafc',
                                        },
                                    },
                                    error: {
                                        iconTheme: {
                                            primary: '#ef4444',
                                            secondary: '#f8fafc',
                                        },
                                    },
                                }}
                            />
                        </SettingsProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}