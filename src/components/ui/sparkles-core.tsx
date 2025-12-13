"use client";
import React, { useId, useMemo } from "react";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
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

export function SparklesCore({
    id,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    speed = 1,
    particleColor = "#FFFFFF",
    particleDensity = 100,
    className,
}: SparklesCoreProps) {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    }>>([]);
    const generatedId = useId();
    const actualId = id || generatedId;

    useEffect(() => {
        const generateParticles = () => {
            const newParticles = Array.from({ length: particleDensity }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * (maxSize - minSize) + minSize,
                duration: (Math.random() * 2 + 1) / speed,
                delay: Math.random() * 2,
            }));
            setParticles(newParticles);
        };
        generateParticles();
    }, [particleDensity, maxSize, minSize, speed]);

    return (
        <div
            className={cn("relative w-full h-full pointer-events-none", className)}
            style={{ background }}
        >
            {particles.map((particle) => (
                <motion.span
                    key={particle.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particleColor,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

export default SparklesCore;
