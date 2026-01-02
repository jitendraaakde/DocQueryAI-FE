'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    glareEnabled?: boolean;
    tiltAmount?: number;
    perspective?: number;
}

export function TiltCard({
    children,
    className,
    glareEnabled = true,
    tiltAmount = 15,
    perspective = 1000,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const glareX = useMotionValue(50);
    const glareY = useMotionValue(50);

    const springConfig = { stiffness: 150, damping: 15 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateXValue = (mouseY / (rect.height / 2)) * -tiltAmount;
        const rotateYValue = (mouseX / (rect.width / 2)) * tiltAmount;

        rotateX.set(rotateXValue);
        rotateY.set(rotateYValue);

        // Update glare position
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;
        glareX.set(percentX);
        glareY.set(percentY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className={cn("relative", className)}
            style={{
                perspective,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX: rotateXSpring,
                    rotateY: rotateYSpring,
                    transformStyle: 'preserve-3d',
                }}
                className="relative w-full h-full"
            >
                {children}

                {/* Glare effect */}
                {glareEnabled && isHovered && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
                        style={{
                            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
                        }}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}

export default TiltCard;
