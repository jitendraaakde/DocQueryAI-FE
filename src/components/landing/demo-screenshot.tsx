'use client';

import React, { useEffect, useRef } from 'react';
import { Search, Send, FileText, Zap } from 'lucide-react';

export function DemoScreenshot() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const elements = entry.target.querySelectorAll('.animate-fade-in-up, .animate-scale-in');
                        elements.forEach((el) => el.classList.add('visible'));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-24 px-8 md:px-12 lg:px-16 relative overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-950" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary-500/5 rounded-full blur-[200px]" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                        See It In Action
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Intelligent Document{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent">
                            Search
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto">
                        Experience the power of AI-driven document intelligence with our intuitive interface.
                    </p>
                </div>

                {/* Demo Screenshot Container */}
                <div className="animate-scale-in delay-200">
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-accent/20 to-primary-500/20 rounded-3xl blur-2xl" />

                        {/* Browser Frame */}
                        <div className="relative bg-dark-900/90 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden screen-glow">
                            {/* Browser Header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-dark-800/80 border-b border-dark-700/50">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1.5 bg-dark-900/80 rounded-lg text-dark-400 text-sm flex items-center gap-2">
                                        <Search className="w-3.5 h-3.5" />
                                        <span>app.docquery.ai</span>
                                    </div>
                                </div>
                            </div>

                            {/* App Content */}
                            <div className="p-6 md:p-8">
                                {/* App Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-white font-semibold text-lg">DocQuery AI</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                                            3 Documents Indexed
                                        </div>
                                    </div>
                                </div>

                                {/* Document List */}
                                <div className="grid md:grid-cols-3 gap-4 mb-8">
                                    {['Q4_Report.pdf', 'Research_2024.pdf', 'Strategy_Doc.docx'].map((doc, i) => (
                                        <div
                                            key={doc}
                                            className="flex items-center gap-3 p-4 bg-dark-800/60 rounded-xl border border-dark-700/50"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-red-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{doc}</p>
                                                <p className="text-dark-500 text-xs">Ready</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                        </div>
                                    ))}
                                </div>

                                {/* Search/Query Box with Pulse Animation */}
                                <div className="relative mb-6">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 to-accent/30 rounded-2xl blur-md animate-pulse-subtle" />
                                    <div className="relative flex items-center gap-3 p-4 bg-dark-800 rounded-xl border-2 border-primary-500/50 animate-ring-pulse">
                                        <Search className="w-5 h-5 text-dark-400" />
                                        <span className="text-dark-300 flex-1">What are the key revenue targets for Q4?</span>
                                        <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                                            <Send className="w-4 h-4" />
                                            Ask
                                        </button>
                                    </div>
                                </div>

                                {/* AI Response Preview */}
                                <div className="bg-dark-800/60 rounded-xl border border-dark-700/50 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center flex-shrink-0">
                                            <Zap className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white mb-3">Based on the Q4 Financial Report, the key revenue targets are:</p>
                                            <ul className="space-y-2 text-dark-300 text-sm">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    <span>Total revenue target: <strong className="text-white">$12.5M</strong></span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    <span>Growth rate: <strong className="text-white">23% YoY</strong></span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    <span>New customer acquisition: <strong className="text-white">150+ accounts</strong></span>
                                                </li>
                                            </ul>
                                            <p className="text-dark-500 text-xs mt-4 pt-3 border-t border-dark-700/50">
                                                📄 Sources: Q4_Report.pdf (Pages 4, 8, 12)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DemoScreenshot;
