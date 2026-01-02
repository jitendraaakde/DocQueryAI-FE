'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Upload, MessageCircle, CheckCircle, FileText, Zap } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import { FlipWords } from '@/components/ui/flip-words';
import { ShootingStars, StarsBackground } from '@/components/ui/shooting-stars';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { MorphingBlob } from '@/components/ui/morphing-blob';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { useServiceWakeUp } from '@/hooks/useServiceWakeUp';

export function Hero() {
    useServiceWakeUp();

    const flipWords = ["Seconds", "Instantly", "Effortlessly", "Intelligently"];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Multi-layer animated background */}
            <div className="absolute inset-0 bg-dark-950" />

            {/* Morphing blobs */}
            <MorphingBlob />

            {/* Floating geometric shapes */}
            <FloatingShapes />

            {/* Stars background */}
            <StarsBackground className="opacity-50" />
            <ShootingStars className="z-0" />

            {/* Cursor following glow */}
            <CursorGlow />

            {/* Spotlights */}
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />
            <Spotlight
                className="top-10 left-full -translate-x-[50%] md:top-0"
                fill="rgba(99, 102, 241, 0.5)"
            />

            {/* Animated grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />

            {/* Noise overlay */}
            <div className="absolute inset-0 noise-overlay pointer-events-none opacity-30" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-16">
                <div className="text-center">
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-morphism mb-8 group hover:border-primary-500/30 transition-all cursor-default"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-primary-400" />
                        </motion.div>
                        <span className="text-sm text-primary-200 font-medium">
                            AI-Powered Document Intelligence
                        </span>
                        <span className="px-2 py-0.5 bg-gradient-to-r from-primary-500/30 to-accent/30 rounded-full text-xs text-primary-300 font-semibold animate-pulse">
                            New
                        </span>
                    </motion.div>

                    {/* Main Headline with animation */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.15] tracking-tight"
                    >
                        <span className="text-white inline-block">
                            Ask Questions. Get Answers in
                        </span>
                        <br />
                        <span className="inline-block mt-2">
                            <FlipWords words={flipWords} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold" />
                        </span>
                    </motion.h1>

                    {/* Animated line separator */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="w-48 h-1 mx-auto mb-8 rounded-full overflow-hidden"
                    >
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-shimmer" />
                    </motion.div>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg md:text-xl lg:text-2xl text-dark-300 max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        Upload PDFs, Word docs, or CSVs and unlock instant AI-powered answers with source citations.
                        <span className="text-white font-medium"> Save hours</span> of manual searching.
                    </motion.p>

                    {/* CTA Buttons with hover effects */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                    >
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/25"
                            >
                                {/* Animated gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent bg-[length:200%_100%] animate-gradient-x" />
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>
                                <span className="relative z-10">Try It Free</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                        <Link href="#how-it-works">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group px-8 py-4 text-lg font-semibold text-white rounded-2xl glass-morphism hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
                            >
                                <span>See How It Works</span>
                                <motion.span
                                    className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center"
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-3 h-3" />
                                </motion.span>
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Trust Indicators with stagger */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap justify-center items-center gap-8 mb-16"
                    >
                        {[
                            { icon: Upload, text: "Drop any document" },
                            { icon: MessageCircle, text: "Ask in plain English" },
                            { icon: CheckCircle, text: "Get sourced answers" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className="flex items-center gap-2 text-dark-400 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                                    <item.icon className="w-4 h-4 text-primary-400" />
                                </div>
                                <span className="text-sm group-hover:text-dark-300 transition-colors">{item.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Demo Preview Card with 3D effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="relative max-w-4xl mx-auto perspective-1000"
                    >
                        {/* Glow layers */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/30 via-accent/40 to-primary-500/30 rounded-3xl blur-2xl animate-pulse-slow" />
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-600/20 via-accent/30 to-primary-600/20 rounded-3xl blur-xl" />

                        {/* Card container */}
                        <motion.div
                            whileHover={{ y: -5, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative glass-morphism rounded-2xl p-1 overflow-hidden group"
                        >
                            {/* Rainbow border animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-accent to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                            <div className="relative bg-dark-900/95 rounded-xl p-6 md:p-8">
                                {/* Browser bar */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-dark-800 rounded-lg px-4 py-1.5 text-xs text-dark-400 flex items-center gap-2">
                                            <span className="text-green-400">🔒</span>
                                            docquery.ai
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Chat Interface */}
                                <div className="space-y-4">
                                    {/* User message */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 }}
                                        className="flex justify-end"
                                    >
                                        <div className="relative group/msg">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent rounded-2xl rounded-br-md blur-sm opacity-50 group-hover/msg:opacity-70 transition-opacity" />
                                            <div className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-3 rounded-2xl rounded-br-md max-w-md text-left">
                                                <div className="flex items-center gap-2 mb-1 opacity-80">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="text-xs">Q4_Financial_Report.pdf</span>
                                                </div>
                                                What are the key findings from the Q4 financial report?
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* AI response */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.3 }}
                                        className="flex justify-start"
                                    >
                                        <div className="glass-morphism text-dark-100 px-5 py-4 rounded-2xl rounded-bl-md max-w-lg text-left">
                                            <div className="flex items-center gap-2 mb-3">
                                                <motion.div
                                                    className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center"
                                                    animate={{ boxShadow: ['0 0 0 0 rgba(99, 102, 241, 0.4)', '0 0 0 10px rgba(99, 102, 241, 0)', '0 0 0 0 rgba(99, 102, 241, 0)'] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Zap className="w-4 h-4 text-white" />
                                                </motion.div>
                                                <span className="text-sm font-medium text-primary-300">DocQuery AI</span>
                                                <span className="text-xs text-dark-500">• Just now</span>
                                            </div>
                                            <p className="mb-3 text-dark-100">Based on your Q4 Financial Report:</p>
                                            <ul className="space-y-2 text-sm text-dark-300">
                                                <motion.li
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.5 }}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    Revenue increased by <span className="text-white font-medium">23% YoY</span>
                                                </motion.li>
                                                <motion.li
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.7 }}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    Net profit margin: <span className="text-white font-medium">18.5%</span>
                                                </motion.li>
                                                <motion.li
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.9 }}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    CAC decreased by <span className="text-white font-medium">15%</span>
                                                </motion.li>
                                            </ul>
                                            <p className="text-xs text-dark-500 mt-4 pt-3 border-t border-dark-700/50">
                                                📄 Sources: Q4_Report.pdf (Pages 4, 12, 15)
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
