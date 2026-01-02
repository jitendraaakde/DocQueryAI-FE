'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Upload Documents",
        description: "Drag and drop your PDFs, Word docs, CSVs, or text files. Our AI processes them in seconds.",
        icon: Upload,
        gradient: "from-blue-500 to-cyan-400",
        iconBg: "bg-blue-500",
    },
    {
        number: "02",
        title: "Ask Questions",
        description: "Type your questions in plain English. No special syntax needed—just ask naturally.",
        icon: MessageSquare,
        gradient: "from-purple-500 to-pink-400",
        iconBg: "bg-purple-500",
    },
    {
        number: "03",
        title: "Get AI Answers",
        description: "Receive accurate, sourced answers instantly. Every response includes citations you can verify.",
        icon: Sparkles,
        gradient: "from-primary-500 to-accent",
        iconBg: "bg-primary-500",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-8 md:px-12 lg:px-16 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-dark-950" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-morphism mb-8">
                        <ArrowRight className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-dark-200 font-medium">
                            Simple Process
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                        How It{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent">
                            Works
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto leading-relaxed">
                        Three simple steps to unlock the knowledge hidden in your documents.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-dark-700 to-transparent hidden lg:block -translate-y-1/2" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="relative"
                            >
                                {/* Card */}
                                <div className="group relative h-full">
                                    {/* Glow */}
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.gradient} rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500`} />

                                    <div className="relative h-full glass-morphism rounded-2xl p-8 text-center transition-all duration-300 group-hover:border-white/20 group-hover:translate-y-[-8px]">
                                        {/* Step Number */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-20 h-20 rounded-2xl ${step.iconBg} bg-opacity-20 flex items-center justify-center mx-auto mt-4 mb-6 group-hover:scale-110 transition-transform`}>
                                            <step.icon className="w-10 h-10 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-bold text-white mb-5">
                                            {step.title}
                                        </h3>
                                        <p className="text-dark-400 leading-relaxed text-base">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow between cards (hidden on mobile) */}
                                {index < steps.length - 1 && (
                                    <div className="absolute top-1/2 -right-6 lg:-right-8 hidden lg:flex items-center justify-center w-12 h-12 z-10 -translate-y-1/2">
                                        <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
                                            <ArrowRight className="w-5 h-5 text-primary-400" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
