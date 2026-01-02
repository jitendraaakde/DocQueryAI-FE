'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TextGenerateEffectProps {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
}

export function TextGenerateEffect({
    words,
    className,
    filter = true,
    duration = 0.5,
}: TextGenerateEffectProps) {
    const wordsArray = words.split(' ');

    return (
        <div className={cn("font-bold", className)}>
            <div className="mt-4">
                <div className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl leading-snug tracking-wide">
                    {wordsArray.map((word, idx) => (
                        <span
                            key={word + idx}
                            className="text-white opacity-0 animate-text-reveal"
                            style={{
                                animationDelay: `${idx * 0.1}s`,
                                animationFillMode: 'forwards',
                            }}
                        >
                            {word}{' '}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TextGenerateEffect;
