'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
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
                        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                        <p className="text-dark-400">Last updated: December 2024</p>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                    <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-8 space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                            <p className="text-dark-300 leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account,
                                upload documents, use our services, or contact us for support. This includes:
                            </p>
                            <ul className="list-disc list-inside text-dark-300 mt-4 space-y-2">
                                <li>Account information (email, username, password)</li>
                                <li>Documents you upload to our platform</li>
                                <li>Queries and interactions with our AI assistant</li>
                                <li>Usage data and analytics</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                            <p className="text-dark-300 leading-relaxed">
                                We use the information we collect to provide, maintain, and improve our services,
                                including to process your documents, respond to your queries, and personalize your experience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">3. Data Security</h2>
                            <p className="text-dark-300 leading-relaxed">
                                We implement industry-standard security measures to protect your data. Your documents
                                are encrypted at rest and in transit. We regularly review and update our security practices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">4. Data Retention</h2>
                            <p className="text-dark-300 leading-relaxed">
                                We retain your information for as long as your account is active or as needed to provide
                                you services. You can request deletion of your data at any time by contacting us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
                            <p className="text-dark-300 leading-relaxed">
                                You have the right to access, correct, or delete your personal information.
                                You can also export your data or request a copy of all information we hold about you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">6. Contact Us</h2>
                            <p className="text-dark-300 leading-relaxed">
                                If you have questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:privacy@docquery.ai" className="text-primary-400 hover:text-primary-300">
                                    privacy@docquery.ai
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
