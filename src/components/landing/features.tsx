'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Shield, Zap, FileText, MessageSquare, Database, Lock } from 'lucide-react';

// Feature highlights - key benefits
const features = [
    {
        icon: <Search className="w-8 h-8" />,
        title: 'Semantic AI Search',
        description: 'Find information by meaning, not keywords. Our AI understands context and intent to deliver exactly what you need.',
        gradient: 'from-blue-500 to-cyan-400',
        bgGradient: 'from-blue-500/10 to-cyan-400/10',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
    },
    {
        icon: <Upload className="w-8 h-8" />,
        title: 'Multi-Format Support',
        description: 'Upload PDFs, Word docs, text files, CSVs and more. Drag & drop—we handle all the heavy lifting automatically.',
        gradient: 'from-purple-500 to-pink-400',
        bgGradient: 'from-purple-500/10 to-pink-400/10',
        iconBg: 'bg-purple-500/20',
        iconColor: 'text-purple-400',
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: 'Enterprise Security',
        description: 'End-to-end encryption. We never train on your data. SOC 2 compliant with enterprise-grade protection.',
        gradient: 'from-green-500 to-emerald-400',
        bgGradient: 'from-green-500/10 to-emerald-400/10',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Instant Answers',
        description: 'Get precise responses in under a second. Complete with source citations so you can verify every answer.',
        gradient: 'from-yellow-500 to-orange-400',
        bgGradient: 'from-yellow-500/10 to-orange-400/10',
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-400',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] as const,
        },
    },
};

export function Features() {
    return (
        <section
            id="features"
            className="py-24 px-8 md:px-12 lg:px-16 relative overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-morphism mb-8">
                        <Database className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-dark-200 font-medium">
                            Powerful Features
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-snug">
                        Everything You Need to{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent">
                            Master
                        </span>
                        <br />
                        Your Documents
                    </h2>
                    <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto leading-relaxed">
                        Powerful features designed to transform how you interact with your knowledge base.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="group relative"
                        >
                            {/* Glow Effect on Hover */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`} />

                            {/* Card */}
                            <div className="relative h-full glass-morphism rounded-2xl p-8 transition-all duration-500 group-hover:border-white/20 group-hover:translate-y-[-4px] overflow-hidden">
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                        <span className={feature.iconColor}>{feature.icon}</span>
                                    </div>

                                    {/* Text */}
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-dark-400 leading-relaxed group-hover:text-dark-300 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Corner Accent */}
                                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-tl-full`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Additional Features Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
                >
                    {[
                        { icon: FileText, label: "50+ File Types" },
                        { icon: MessageSquare, label: "Chat Interface" },
                        { icon: Database, label: "Smart Indexing" },
                        { icon: Lock, label: "Private & Secure" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-4 glass-morphism rounded-xl hover:border-primary-500/30 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-primary-400" />
                            </div>
                            <span className="text-sm text-dark-200 font-medium">{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Features;
