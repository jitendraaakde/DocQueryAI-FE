'use client';

import Link from 'next/link';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { FileQuestion, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden pt-20 pb-12">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full filter blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full filter blur-[120px]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />
                </div>

                <div className="w-full max-w-lg px-6 relative z-10 text-center">
                    {/* 404 Illustration */}
                    <div className="relative mb-8">
                        <div className="text-[150px] font-bold bg-gradient-to-b from-dark-600 to-dark-800 bg-clip-text text-transparent leading-none">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                                <FileQuestion className="w-12 h-12 text-primary-400" />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-dark-400 text-lg mb-8 max-w-md mx-auto">
                        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-primary-500 hover:to-primary-400 hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Go to Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-dark-700 transition-all"
                        >
                            Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="text-dark-500 text-sm mt-8">
                        Need help?{' '}
                        <Link href="/contact" className="text-primary-400 hover:text-primary-300 transition-colors">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
