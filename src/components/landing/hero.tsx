'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Meteors } from '@/components/ui/meteors';
import { SparklesCore } from '@/components/ui/sparkles-core';
import { EncryptedText } from '@/components/ui/encrypted-text';

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background */}
            <BackgroundBeams />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/95 to-dark-900 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
                <div className="text-center">
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-accent/10 border border-primary-500/20 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-primary-300 font-medium">
                            AI-Powered Document Intelligence
                        </span>
                    </motion.div>

                    {/* Headline with Sparkles */}
                    <div className="relative">
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <span className="text-white">Query Documents with </span>
                            <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent relative">
                                AI
                            </span>
                        </motion.h1>

                        {/* Sparkles under headline */}
                        <div className="w-full md:w-[40rem] h-20 mx-auto relative">
                            {/* Gradient lines */}
                            <div className="absolute inset-x-10 md:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                            <div className="absolute inset-x-10 md:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                            <div className="absolute inset-x-40 md:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                            <div className="absolute inset-x-40 md:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

                            {/* Sparkles particles */}
                            <SparklesCore
                                background="transparent"
                                minSize={0.4}
                                maxSize={1}
                                particleDensity={800}
                                className="w-full h-full"
                                particleColor="#FFFFFF"
                            />

                            {/* Fade mask */}
                            <div className="absolute inset-0 w-full h-full bg-dark-950 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
                        </div>
                    </div>

                    {/* Subheadline with Encrypted Text */}
                    <motion.div
                        className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <EncryptedText
                            text="Upload documents, ask questions, get AI-powered answers with citations."
                            encryptedClassName="text-dark-600"
                            revealedClassName="text-dark-300"
                            revealDelayMs={30}
                        />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link href="/register">
                            <motion.button
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10">Start for Free</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        </Link>
                        <Link href="#features">
                            <motion.button
                                className="px-8 py-4 text-lg font-semibold text-dark-200 rounded-2xl border border-dark-700 hover:border-dark-500 hover:text-white transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                See How It Works
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Demo Card */}
                    <motion.div
                        className="relative max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-accent/20 to-primary-500/20 rounded-3xl blur-2xl" />

                        {/* Card */}
                        <div className="relative bg-dark-900/80 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6 md:p-8 overflow-hidden">
                            <Meteors number={15} />

                            {/* Mock Chat Interface */}
                            <div className="space-y-4">
                                {/* User message */}
                                <div className="flex justify-end">
                                    <motion.div
                                        className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-3 rounded-2xl rounded-br-md max-w-md text-left shadow-lg shadow-primary-500/20"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.6 }}
                                    >
                                        What are the key findings from the Q4 financial report?
                                    </motion.div>
                                </div>

                                {/* AI response */}
                                <div className="flex justify-start">
                                    <motion.div
                                        className="bg-dark-800/90 border border-dark-700/50 text-dark-100 px-5 py-4 rounded-2xl rounded-bl-md max-w-lg text-left"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.8 }}
                                    >
                                        <p className="mb-3 text-dark-100">Based on your Q4 Financial Report, here are the key findings:</p>
                                        <ul className="space-y-2 text-sm text-dark-300">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-400 mt-1">✓</span>
                                                Revenue increased by 23% year-over-year
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-400 mt-1">✓</span>
                                                Net profit margin improved to 18.5%
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-400 mt-1">✓</span>
                                                Customer acquisition cost decreased by 15%
                                            </li>
                                        </ul>
                                        <p className="text-xs text-dark-500 mt-3 pt-3 border-t border-dark-700">
                                            📄 Sources: Q4_Report.pdf (Pages 4, 12, 15)
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
