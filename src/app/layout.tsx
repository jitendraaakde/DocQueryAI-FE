import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/theme-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { ToastProvider } from '@/lib/toast-utils';

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
                            <ToastProvider>
                                {children}
                            </ToastProvider>
                        </SettingsProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}