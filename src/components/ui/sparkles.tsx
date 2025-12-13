'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SparklesProps {
    className?: string;
    size?: number;
    count?: number;
}

interface Sparkle {
    id: string;
    createdAt: number;
    color: string;
    size: number;
    style: {
        top: string;
        left: string;
    };
}

const generateSparkle = (): Sparkle => {
    return {
        id: String(Math.random()),
        createdAt: Date.now(),
        color: `hsl(${Math.random() * 60 + 220}, 100%, 75%)`,
        size: Math.random() * 10 + 10,
        style: {
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
        },
    };
};

export function Sparkles({ className, count = 3 }: SparklesProps) {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        const initialSparkles = Array.from({ length: count }, generateSparkle);
        setSparkles(initialSparkles);

        const interval = setInterval(() => {
            setSparkles((current) => {
                const now = Date.now();
                const filtered = current.filter((s) => now - s.createdAt < 1500);
                if (filtered.length < count) {
                    return [...filtered, generateSparkle()];
                }
                return filtered;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [count]);

    return (
        <span className={cn('relative inline-block', className)}>
            {sparkles.map((sparkle) => (
                <motion.span
                    key={sparkle.id}
                    className="absolute block pointer-events-none"
                    style={sparkle.style}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <svg
                        width={sparkle.size}
                        height={sparkle.size}
                        viewBox="0 0 160 160"
                        fill="none"
                    >
                        <path
                            d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                            fill={sparkle.color}
                        />
                    </svg>
                </motion.span>
            ))}
        </span>
    );
}

export default Sparkles;
