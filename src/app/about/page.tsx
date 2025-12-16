'use client';

import { ArrowLeft, Users, Target, Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-dark-950 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 rounded-full filter blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden">
                        <Image
                            src="/DocQueryAI_logo.png"
                            alt="DocQuery AI"
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">About DocQuery AI</h1>
                        <p className="text-dark-400">Transforming how you interact with documents</p>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                    <p className="text-dark-300 leading-relaxed text-lg">
                        We believe that knowledge should be accessible and actionable. DocQuery AI transforms
                        your documents into an intelligent knowledge base, allowing you to ask questions and
                        get accurate, AI-powered answers with source citations.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-primary-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Intelligence</h3>
                        <p className="text-dark-400">
                            Advanced language models understand your documents and provide accurate,
                            contextual answers to your questions.
                        </p>
                    </div>

                    <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                            <Target className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Semantic Search</h3>
                        <p className="text-dark-400">
                            Find information by meaning, not just keywords. Our vector search technology
                            understands context and delivers precise results.
                        </p>
                    </div>

                    <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
                        <p className="text-dark-400">
                            Your documents are encrypted and stored securely. We follow industry best
                            practices to protect your sensitive information.
                        </p>
                    </div>

                    <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">User-Centric Design</h3>
                        <p className="text-dark-400">
                            Built with simplicity in mind. Upload your documents and start asking
                            questions in seconds.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary-500/10 to-accent/10 border border-primary-500/20 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Ready to get started?</h3>
                    <p className="text-dark-300 mb-6">
                        Join thousands of users who are already transforming their document workflows.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                    >
                        Start for Free
                    </Link>
                </div>
            </div>
        </main>
    );
}
