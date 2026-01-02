'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTA() {
    return (
        <section className="py-24 px-8 md:px-12 lg:px-16 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 moving-gradient-bg opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950" />

            {/* Floating Orbs */}
            <div className="hero-orb w-[400px] h-[400px] bg-primary-500/30 top-0 left-1/4" />
            <div className="hero-orb w-[300px] h-[300px] bg-accent/20 bottom-0 right-1/4" style={{ animationDelay: '-7s' }} />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-accent/30 to-primary-500/20 rounded-3xl blur-2xl" />

                    {/* Card */}
                    <div className="relative glass-morphism rounded-3xl p-12 md:p-16 text-center overflow-hidden">
                        {/* Noise Overlay */}
                        <div className="absolute inset-0 noise-overlay pointer-events-none opacity-50" />

                        {/* Gradient Lines */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
                            <span className="text-sm text-primary-300 font-medium">Start Free Today</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-snug"
                        >
                            Ready to{' '}
                            <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent">
                                Unlock
                            </span>
                            <br />
                            Your Documents?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-xl text-dark-300 mb-10 max-w-xl mx-auto leading-relaxed"
                        >
                            Join thousands of professionals who are already using AI to extract insights from their documents.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/register">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent animate-gradient-x" />
                                    <span className="relative z-10">Get Started Free</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="text-sm text-dark-500 mt-6"
                        >
                            No credit card required • Free forever plan available
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default CTA;
