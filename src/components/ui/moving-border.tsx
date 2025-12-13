'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MovingBorderProps {
    children: React.ReactNode;
    duration?: number;
    className?: string;
    containerClassName?: string;
    borderClassName?: string;
    as?: React.ElementType;
}

export function MovingBorder({
    children,
    duration = 2000,
    className,
    containerClassName,
    borderClassName,
    as: Component = 'button',
}: MovingBorderProps) {
    return (
        <Component
            className={cn(
                'relative p-[1px] overflow-hidden bg-transparent',
                containerClassName
            )}
        >
            <div
                className={cn(
                    'absolute inset-0',
                    borderClassName
                )}
                style={{
                    background: 'linear-gradient(90deg, #818cf8, #6366f1, #4f46e5, #818cf8)',
                    backgroundSize: '200% 100%',
                    animation: `shimmer ${duration}ms linear infinite`,
                }}
            />
            <div
                className={cn(
                    'relative bg-dark-900 rounded-xl z-10',
                    className
                )}
            >
                {children}
            </div>
        </Component>
    );
}

interface GlowButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function GlowButton({ children, className, onClick }: GlowButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                'relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium transition-all bg-primary-600 rounded-xl group',
                className
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-400 via-primary-600 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition-all duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-white/10 opacity-30 group-hover:rotate-90 ease" />
            <span className="relative text-white font-semibold">{children}</span>
        </motion.button>
    );
}

export default MovingBorder;
