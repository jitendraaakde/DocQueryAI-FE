'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileType, File, Plus } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const supportedFormats = [
    {
        icon: <FileText className="w-8 h-8 text-red-400" />,
        name: 'PDF Documents',
        extension: '.pdf',
        color: 'from-red-500/10 to-red-600/5',
        delay: 0,
    },
    {
        icon: <FileType className="w-8 h-8 text-blue-400" />,
        name: 'Word Documents',
        extension: '.docx',
        color: 'from-blue-500/10 to-blue-600/5',
        delay: 0.1,
    },
    {
        icon: <File className="w-8 h-8 text-green-400" />,
        name: 'Text Files',
        extension: '.txt',
        color: 'from-green-500/10 to-green-600/5',
        delay: 0.2,
    },
];

export function ToolsShowcase() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-dark-950" />
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Works with Your
                        <span className="bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent"> Documents</span>
                    </h2>
                    <p className="text-lg text-dark-400 max-w-2xl mx-auto">
                        Upload any supported document format and start querying immediately
                    </p>
                </motion.div>

                {/* Format Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                    {supportedFormats.map((format, i) => (
                        <motion.div
                            key={format.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: format.delay }}
                        >
                            <SpotlightCard className="p-6 text-center">
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${format.color} flex items-center justify-center mb-4`}>
                                    {format.icon}
                                </div>
                                <h3 className="text-white font-semibold mb-1">{format.name}</h3>
                                <span className="text-dark-500 text-sm">{format.extension}</span>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                {/* Upload Demo Card */}
                <motion.div
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <SpotlightCard className="p-8" spotlightColor="rgba(99, 102, 241, 0.1)">
                        <div className="border-2 border-dashed border-dark-700 rounded-xl p-8 text-center hover:border-primary-500/50 transition-colors">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-primary-400" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Drop your documents here</h3>
                            <p className="text-dark-400 text-sm mb-4">or click to browse from your computer</p>
                            <span className="inline-block px-4 py-2 bg-primary-600/20 text-primary-300 rounded-lg text-sm">
                                Supports PDF, DOCX, TXT up to 50MB
                            </span>
                        </div>
                    </SpotlightCard>
                </motion.div>
            </div>
        </section>
    );
}

export default ToolsShowcase;
