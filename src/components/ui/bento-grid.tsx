'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BentoGridProps {
    className?: string;
    children?: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
    return (
        <div
            className={cn(
                'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
                className
            )}
        >
            {children}
        </div>
    );
}

interface BentoGridItemProps {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}

export function BentoGridItem({
    className,
    title,
    description,
    header,
    icon,
}: BentoGridItemProps) {
    return (
        <div
            className={cn(
                'row-span-1 rounded-2xl group/bento hover:shadow-xl transition-all duration-300 shadow-none p-6 bg-dark-800/50 border border-dark-700/50 backdrop-blur-sm justify-between flex flex-col space-y-4 overflow-hidden relative',
                className
            )}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent/10 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />

            {header}
            <div className="relative z-10 group-hover/bento:translate-x-2 transition-transform duration-300">
                {icon}
                <div className="font-bold text-white mb-2 mt-2 text-lg">
                    {title}
                </div>
                <div className="text-dark-400 text-sm">
                    {description}
                </div>
            </div>
        </div>
    );
}

export default BentoGrid;
