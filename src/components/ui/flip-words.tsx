'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlipWordsProps {
    words: string[];
    duration?: number;
    className?: string;
}

export function FlipWords({ words, duration = 3000, className }: FlipWordsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const startAnimation = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
            setIsAnimating(false);
        }, 500);
    }, [words.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            startAnimation();
        }, duration);

        return () => clearInterval(interval);
    }, [duration, startAnimation]);

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={currentIndex}
                initial={{
                    opacity: 0,
                    y: 10,
                    filter: 'blur(8px)',
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                }}
                exit={{
                    opacity: 0,
                    y: -10,
                    filter: 'blur(8px)',
                }}
                transition={{
                    duration: 0.4,
                    ease: 'easeInOut',
                }}
                className={cn(
                    'inline-block bg-gradient-to-r from-primary-400 via-accent to-primary-300 bg-clip-text text-transparent',
                    className
                )}
            >
                {words[currentIndex]}
            </motion.span>
        </AnimatePresence>
    );
}

export default FlipWords;
