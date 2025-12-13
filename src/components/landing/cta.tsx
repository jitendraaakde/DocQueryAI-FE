'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';

export function CTA() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-dark-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 via-dark-950 to-accent/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px]" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    className="relative rounded-3xl p-[1px] bg-gradient-to-r from-primary-500/50 via-accent/50 to-primary-500/50 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="relative bg-dark-900/95 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-center">
                        <BackgroundBeams className="opacity-30" />

                        <motion.h2
                            className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Ready to
                            <span className="bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent"> Unlock</span>
                            <br />Your Documents?
                        </motion.h2>

                        <motion.p
                            className="text-lg text-dark-400 mb-8 max-w-xl mx-auto relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Join thousands who are already using AI to extract insights from their documents.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link href="/register">
                                <motion.button
                                    className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        </motion.div>

                        <motion.p
                            className="text-sm text-dark-500 mt-6 relative z-10"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
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
