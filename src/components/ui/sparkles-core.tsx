"use client";
import React, { useId, useMemo, memo } from "react";
import { cn } from "@/lib/utils";

type SparklesCoreProps = {
    id?: string;
    background?: string;
    minSize?: number;
    maxSize?: number;
    speed?: number;
    particleColor?: string;
    particleDensity?: number;
    className?: string;
};

// Memoized sparkle component to prevent re-renders
const SparklesCore = memo(function SparklesCore({
    id,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    speed = 1,
    particleColor = "#FFFFFF",
    particleDensity = 50, // Reduced from 800 to 50 for performance
    className,
}: SparklesCoreProps) {
    const generatedId = useId();
    const actualId = id || generatedId;

    // Memoize particle generation - only regenerate when props change
    const particles = useMemo(() => {
        return Array.from({ length: particleDensity }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * (maxSize - minSize) + minSize,
            duration: (Math.random() * 2 + 1) / speed,
            delay: Math.random() * 2,
        }));
    }, [particleDensity, maxSize, minSize, speed]);

    return (
        <div
            className={cn("relative w-full h-full pointer-events-none", className)}
            style={{ background }}
        >
            <style jsx>{`
                @keyframes sparkle {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
            {particles.map((particle) => (
                <span
                    key={particle.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particleColor,
                        animation: `sparkle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
});

SparklesCore.displayName = "SparklesCore";

export { SparklesCore };
export default SparklesCore;
