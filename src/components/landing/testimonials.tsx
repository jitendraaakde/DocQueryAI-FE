'use client';

import React from 'react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        quote: "DocQuery AI has transformed how our legal team handles discovery. What used to take days now takes minutes. The accuracy is remarkable.",
        name: "Sarah Mitchell",
        title: "General Counsel, TechCorp Industries",
    },
    {
        quote: "We process hundreds of research papers monthly. This tool has become indispensable. It's like having a research assistant who never sleeps.",
        name: "Dr. James Chen",
        title: "Research Director, BioGenesis Labs",
    },
    {
        quote: "The security features gave us confidence to use it for sensitive financial documents. Fast, accurate, and secure—exactly what we needed.",
        name: "Maria Rodriguez",
        title: "CFO, FinanceFlow Inc",
    },
    {
        quote: "Finally, a tool that understands context! It finds exactly what I'm looking for without endless keyword searching. Game changer for our team.",
        name: "Alex Thompson",
        title: "Product Manager, StartupXYZ",
    },
    {
        quote: "The source citations are brilliant. I can verify every answer and build trust with stakeholders by showing exactly where information comes from.",
        name: "Jennifer Park",
        title: "Senior Analyst, ConsultCo",
    },
];

export function Testimonials() {
    return (
        <section className="py-24 px-8 md:px-12 lg:px-16 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-dark-950" />
            <div className="absolute inset-0">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-morphism mb-6">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-dark-200 font-medium">
                            Trusted by Teams Worldwide
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                        Loved by{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent">
                            Thousands
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto leading-relaxed">
                        See why professionals trust DocQuery AI for their document intelligence needs.
                    </p>
                </motion.div>

                {/* Infinite Moving Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <InfiniteMovingCards
                        items={testimonials}
                        direction="right"
                        speed="slow"
                        pauseOnHover={true}
                        className="py-4"
                    />
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
                >
                    {[
                        { value: "10K+", label: "Active Users" },
                        { value: "1M+", label: "Documents Processed" },
                        { value: "99.9%", label: "Uptime" },
                        { value: "4.9/5", label: "User Rating" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-6 glass-morphism rounded-2xl hover:border-primary-500/30 transition-colors"
                        >
                            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </p>
                            <p className="text-dark-400 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Testimonials;
