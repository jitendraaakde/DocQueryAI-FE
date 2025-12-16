'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

/**
 * Lightweight header component for auth pages (login, register, verify, etc.)
 * Replaces the heavy Navbar component to improve performance on auth pages.
 */
const AuthHeader = memo(function AuthHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/30">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <div className="h-12 transition-transform group-hover:scale-105">
                        <Image
                            src="/DocQueryAI_logo.png"
                            alt="DocQuery AI"
                            width={200}
                            height={48}
                            className="h-full w-auto object-contain"
                            priority
                        />
                    </div>
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
