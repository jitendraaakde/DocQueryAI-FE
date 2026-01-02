'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function ShootingStars({ className }: { className?: string }) {
    const stars = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: Math.random() * 5,
        duration: 1 + Math.random() * 2,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
    }));

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="shooting-star absolute"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}

export function StarsBackground({ className }: { className?: string }) {
    const stars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
    }));

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-twinkle"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default ShootingStars;
