'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MorphingBlob({ className }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {/* Primary blob */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px]"
                style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(129, 140, 248, 0.3) 50%, rgba(168, 85, 247, 0.2) 100%)',
                    filter: 'blur(80px)',
                }}
                animate={{
                    borderRadius: [
                        '60% 40% 30% 70% / 60% 30% 70% 40%',
                        '30% 60% 70% 40% / 50% 60% 30% 60%',
                        '60% 40% 30% 70% / 60% 30% 70% 40%',
                    ],
                    x: [0, 50, -30, 0],
                    y: [0, -40, 30, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Secondary blob */}
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px]"
                style={{
                    background: 'linear-gradient(225deg, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(99, 102, 241, 0.2) 100%)',
                    filter: 'blur(70px)',
                }}
                animate={{
                    borderRadius: [
                        '40% 60% 70% 30% / 40% 50% 60% 50%',
                        '70% 30% 50% 50% / 30% 30% 70% 70%',
                        '40% 60% 70% 30% / 40% 50% 60% 50%',
                    ],
                    x: [0, -60, 40, 0],
                    y: [0, 50, -40, 0],
                    scale: [1, 0.9, 1.15, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Tertiary blob */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"
                style={{
                    background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)',
                    filter: 'blur(60px)',
                }}
                animate={{
                    borderRadius: [
                        '50% 50% 50% 50% / 50% 50% 50% 50%',
                        '60% 40% 60% 40% / 40% 60% 40% 60%',
                        '50% 50% 50% 50% / 50% 50% 50% 50%',
                    ],
                    scale: [1, 1.2, 0.85, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
            />
        </div>
    );
}

export default MorphingBlob;
