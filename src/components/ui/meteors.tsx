'use client';

import React, { useMemo, memo } from 'react';
import { cn } from '@/lib/utils';

interface MeteorsProps {
    number?: number;
    className?: string;
}

// Memoized Meteors component
const Meteors = memo(function Meteors({ number = 8, className }: MeteorsProps) {
    // Memoize meteor positions to prevent recalculation on re-renders
    const meteors = useMemo(() => {
        return Array.from({ length: number }, (_, idx) => ({
            id: idx,
            left: Math.floor(Math.random() * 800 - 400),
            animationDelay: (Math.random() * 0.6 + 0.2).toFixed(2),
            animationDuration: Math.floor(Math.random() * 8 + 2),
        }));
    }, [number]);

    return (
        <>
            {meteors.map((meteor) => (
                <span
                    key={meteor.id}
                    className={cn(
                        'animate-meteor absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] pointer-events-none',
                        "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
                        className
                    )}
                    style={{
                        top: 0,
                        left: `${meteor.left}px`,
                        animationDelay: `${meteor.animationDelay}s`,
                        animationDuration: `${meteor.animationDuration}s`,
                    }}
                />
            ))}
        </>
    );
});

Meteors.displayName = "Meteors";

export { Meteors };
export default Meteors;
