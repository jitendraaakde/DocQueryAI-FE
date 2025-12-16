'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfServicePage() {
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
                        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                        <p className="text-dark-400">Last updated: December 2024</p>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                    <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-8 space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-dark-300 leading-relaxed">
                                By accessing or using DocQuery AI, you agree to be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                            <p className="text-dark-300 leading-relaxed">
                                DocQuery AI provides an AI-powered document intelligence platform that allows users to
                                upload documents, search semantically, and get AI-generated answers with citations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
                            <p className="text-dark-300 leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account credentials
                                and for all activities that occur under your account. You must provide accurate and
                                complete information when creating an account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                            <p className="text-dark-300 leading-relaxed">
                                You agree not to use our service to:
                            </p>
                            <ul className="list-disc list-inside text-dark-300 mt-4 space-y-2">
                                <li>Upload illegal, harmful, or offensive content</li>
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights of others</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                            <p className="text-dark-300 leading-relaxed">
                                You retain ownership of all documents you upload. By using our service, you grant us
                                a limited license to process your documents solely for the purpose of providing our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                            <p className="text-dark-300 leading-relaxed">
                                DocQuery AI is provided &quot;as is&quot; without warranties of any kind. We are not liable for
                                any indirect, incidental, or consequential damages arising from your use of our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
                            <p className="text-dark-300 leading-relaxed">
                                We may update these terms from time to time. We will notify you of any material changes
                                by posting the new terms on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">8. Contact</h2>
                            <p className="text-dark-300 leading-relaxed">
                                For questions about these Terms, contact us at{' '}
                                <a href="mailto:legal@docquery.ai" className="text-primary-400 hover:text-primary-300">
                                    legal@docquery.ai
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
