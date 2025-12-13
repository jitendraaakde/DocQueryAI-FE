'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Search,
    Quote,
    Lock,
    Rocket,
    FileStack,
    Clock,
    MousePointerClick,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const benefits = [
    {
        icon: <Zap className="w-5 h-5" />,
        title: 'AI-Powered Answers',
        description: 'Get intelligent responses from your documents instantly',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
    },
    {
        icon: <Search className="w-5 h-5" />,
        title: 'Semantic Search',
        description: 'Find by meaning, not just keywords',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
    },
    {
        icon: <Quote className="w-5 h-5" />,
        title: 'Source Citations',
        description: 'Every answer includes page references',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
    },
    {
        icon: <Lock className="w-5 h-5" />,
        title: 'Secure Storage',
        description: 'Your documents are encrypted and private',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
    },
    {
        icon: <Rocket className="w-5 h-5" />,
        title: 'Fast Processing',
        description: 'Documents indexed in seconds',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
    },
    {
        icon: <FileStack className="w-5 h-5" />,
        title: 'Multiple Formats',
        description: 'PDF, Word, and text files supported',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
    },
    {
        icon: <Clock className="w-5 h-5" />,
        title: '24/7 Available',
        description: 'Access your knowledge base anytime',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/10',
    },
    {
        icon: <MousePointerClick className="w-5 h-5" />,
        title: 'Easy Upload',
        description: 'Drag and drop your files to start',
        color: 'text-pink-400',
        bgColor: 'bg-pink-400/10',
    },
];

export function Benefits() {
    return (
        <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Built for Knowledge
                        <span className="bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent"> Workers</span>
                    </h2>
                    <p className="text-lg text-dark-400 max-w-2xl mx-auto">
                        Everything you need to extract insights from your documents
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <SpotlightCard
                                className="p-5 h-full"
                                spotlightColor="rgba(99, 102, 241, 0.08)"
                            >
                                <div className={`w-10 h-10 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-3`}>
                                    <span className={benefit.color}>{benefit.icon}</span>
                                </div>
                                <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                                <p className="text-dark-400 text-sm">{benefit.description}</p>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Benefits;
