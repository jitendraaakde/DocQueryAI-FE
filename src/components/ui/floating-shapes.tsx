'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingShape {
    id: number;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
    type: 'circle' | 'square' | 'triangle' | 'hexagon';
    color: string;
    blur: number;
    opacity: number;
}

const generateShapes = (): FloatingShape[] => {
    const shapes: FloatingShape[] = [];
    const types: FloatingShape['type'][] = ['circle', 'square', 'triangle', 'hexagon'];
    const colors = [
        'rgba(99, 102, 241, 0.3)',   // primary
        'rgba(129, 140, 248, 0.25)', // accent
        'rgba(168, 85, 247, 0.2)',   // purple
        'rgba(59, 130, 246, 0.2)',   // blue
        'rgba(236, 72, 153, 0.15)',  // pink
    ];

    for (let i = 0; i < 12; i++) {
        shapes.push({
            id: i,
            size: 40 + Math.random() * 120,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 5,
            type: types[Math.floor(Math.random() * types.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            blur: 20 + Math.random() * 40,
            opacity: 0.3 + Math.random() * 0.4,
        });
    }
    return shapes;
};

const shapes = generateShapes();

function Shape({ shape }: { shape: FloatingShape }) {
    const baseClasses = "absolute";

    const getShapeStyle = () => {
        switch (shape.type) {
            case 'circle':
                return {
                    borderRadius: '50%',
                    background: shape.color,
                };
            case 'square':
                return {
                    borderRadius: '20%',
                    background: shape.color,
                    transform: 'rotate(45deg)',
                };
            case 'triangle':
                return {
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    background: shape.color,
                };
            case 'hexagon':
                return {
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    background: shape.color,
                };
            default:
                return { background: shape.color };
        }
    };

    return (
        <motion.div
            className={cn(baseClasses)}
            style={{
                width: shape.size,
                height: shape.size,
                left: `${shape.x}%`,
                top: `${shape.y}%`,
                filter: `blur(${shape.blur}px)`,
                opacity: shape.opacity,
                ...getShapeStyle(),
            }}
            animate={{
                x: [0, 30, -20, 40, 0],
                y: [0, -40, 20, -30, 0],
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.2, 0.9, 1.1, 1],
            }}
            transition={{
                duration: shape.duration,
                delay: shape.delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

export function FloatingShapes({ className }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {shapes.map((shape) => (
                <Shape key={shape.id} shape={shape} />
            ))}
        </div>
    );
}

export default FloatingShapes;
