'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

/**
 * Lightweight header component for auth pages (login, register, verify, etc.)
 * Replaces the heavy Navbar component to improve performance on auth pages.
 */
const AuthHeader = memo(function AuthHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent flex items-center justify-center overflow-hidden transition-transform hover:scale-105 active:scale-95">
                        <FileText className="w-5 h-5 text-white relative z-10" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white via-white to-primary-200 bg-clip-text text-transparent">
                        DocQuery AI
                    </span>
                </Link>

                {/* Back to Home */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Home</span>
                </Link>
            </div>
        </header>
    );
});

AuthHeader.displayName = "AuthHeader";

export { AuthHeader };
export default AuthHeader;
