'use client';

import React, { forwardRef, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { FileText, FileSpreadsheet, File, Zap, Search, Quote, Lightbulb } from 'lucide-react';

// Circle component for the nodes
const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-14 items-center justify-center rounded-2xl border-2 border-dark-700/50 bg-dark-800 p-3 shadow-lg shadow-black/20 transition-all hover:border-primary-500/50 hover:shadow-primary-500/10",
                className
            )}
        >
            {children}
        </div>
    );
});
Circle.displayName = "Circle";

export function DocumentFlowBeam() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Input document refs (left side)
    const pdfRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLDivElement>(null);
    const csvRef = useRef<HTMLDivElement>(null);

    // Center AI ref
    const aiRef = useRef<HTMLDivElement>(null);

    // Output refs (right side)
    const answersRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const insightsRef = useRef<HTMLDivElement>(null);

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
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-[150px]" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
                        Intelligent Processing
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Documents In,{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent">
                            Answers Out
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto">
                        Upload any document format. Our AI processes, indexes, and delivers precise answers instantly.
                    </p>
                </div>

                {/* Animated Beam Container */}
                <div
                    ref={containerRef}
                    className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-3xl bg-dark-900/40 border border-dark-700/50 p-8 animate-scale-in delay-200"
                >
                    <div className="flex size-full max-w-3xl flex-row items-stretch justify-between gap-8">
                        {/* Left Column - Document Types */}
                        <div className="flex flex-col items-center justify-between py-4">
                            <div className="flex flex-col items-center gap-1">
                                <Circle ref={pdfRef} className="hover:scale-110">
                                    <FileText className="w-7 h-7 text-red-400" />
                                </Circle>
                                <span className="text-xs text-dark-500 mt-2">PDFs</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Circle ref={wordRef} className="hover:scale-110">
                                    <File className="w-7 h-7 text-blue-400" />
                                </Circle>
                                <span className="text-xs text-dark-500 mt-2">Word</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Circle ref={csvRef} className="hover:scale-110">
                                    <FileSpreadsheet className="w-7 h-7 text-green-400" />
                                </Circle>
                                <span className="text-xs text-dark-500 mt-2">CSV</span>
                            </div>
                        </div>

                        {/* Center - AI Engine */}
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Circle
                                    ref={aiRef}
                                    className="size-20 bg-gradient-to-br from-primary-600 to-accent border-primary-500/50 shadow-lg shadow-primary-500/30 hover:scale-110"
                                >
                                    <Zap className="w-10 h-10 text-white" />
                                </Circle>
                                <span className="text-sm font-medium text-primary-300 mt-2">DocQuery AI</span>
                            </div>
                        </div>

                        {/* Right Column - Outputs */}
                        <div className="flex flex-col items-center justify-between py-4">
                            <div className="flex flex-col items-center gap-1">
                                <Circle ref={answersRef} className="hover:scale-110">
                                    <Quote className="w-7 h-7 text-yellow-400" />
                                </Circle>
                                <span className="text-xs text-dark-500 mt-2">Answers</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Circle ref={searchRef} className="hover:scale-110">
                                    <Search className="w-7 h-7 text-purple-400" />
                                </Circle>
                                <span className="text-xs text-dark-500 mt-2">Search</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Circle ref={insightsRef} className="hover:scale-110">
                                    <Lightbulb className="w-7 h-7 text-orange-400" />
                                </Circle>
                                <span className="text-xs text-dark-500 mt-2">Insights</span>
                            </div>
                        </div>
                    </div>

                    {/* Animated Beams - Documents to AI */}
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={pdfRef}
                        toRef={aiRef}
                        curvature={-60}
                        duration={3}
                        delay={0}
                        gradientStartColor="#ef4444"
                        gradientStopColor="#6366f1"
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={wordRef}
                        toRef={aiRef}
                        duration={3}
                        delay={0.3}
                        gradientStartColor="#3b82f6"
                        gradientStopColor="#6366f1"
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={csvRef}
                        toRef={aiRef}
                        curvature={60}
                        duration={3}
                        delay={0.6}
                        gradientStartColor="#22c55e"
                        gradientStopColor="#6366f1"
                    />

                    {/* Animated Beams - AI to Outputs (reverse) */}
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={aiRef}
                        toRef={answersRef}
                        curvature={-60}
                        reverse
                        duration={3}
                        delay={0.2}
                        gradientStartColor="#6366f1"
                        gradientStopColor="#facc15"
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={aiRef}
                        toRef={searchRef}
                        reverse
                        duration={3}
                        delay={0.5}
                        gradientStartColor="#6366f1"
                        gradientStopColor="#a855f7"
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={aiRef}
                        toRef={insightsRef}
                        curvature={60}
                        reverse
                        duration={3}
                        delay={0.8}
                        gradientStartColor="#6366f1"
                        gradientStopColor="#f97316"
                    />
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-in-up delay-400">
                    <div className="text-center p-6 bg-dark-900/40 rounded-2xl border border-dark-700/50">
                        <p className="text-3xl font-bold text-white mb-1">50+</p>
                        <p className="text-dark-400 text-sm">File Formats</p>
                    </div>
                    <div className="text-center p-6 bg-dark-900/40 rounded-2xl border border-dark-700/50">
                        <p className="text-3xl font-bold text-white mb-1">&lt;1s</p>
                        <p className="text-dark-400 text-sm">Response Time</p>
                    </div>
                    <div className="text-center p-6 bg-dark-900/40 rounded-2xl border border-dark-700/50">
                        <p className="text-3xl font-bold text-white mb-1">99.9%</p>
                        <p className="text-dark-400 text-sm">Accuracy</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DocumentFlowBeam;
