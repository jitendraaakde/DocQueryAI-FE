'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundBeamsProps {
    className?: string;
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
    return (
        <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
            {/* Gradient orbs */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-500/30 rounded-full filter blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/30 rounded-full filter blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full filter blur-[150px]" />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Beams */}
            <svg
                className="absolute w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                        <stop offset="50%" stopColor="rgba(99, 102, 241, 0.3)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                    </linearGradient>
                </defs>
                <line
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="0"
                    stroke="url(#beam-gradient)"
                    strokeWidth="1"
                    className="animate-beam"
                />
                <line
                    x1="20%"
                    y1="100%"
                    x2="100%"
                    y2="20%"
                    stroke="url(#beam-gradient)"
                    strokeWidth="1"
                    className="animate-beam"
                    style={{ animationDelay: '0.5s' }}
                />
            </svg>
        </div>
    );
}

export default BackgroundBeams;
