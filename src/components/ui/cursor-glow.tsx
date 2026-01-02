'use client';

import React, { useEffect, useState } from 'react';

interface MousePosition {
    x: number;
    y: number;
}

export function CursorGlow() {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            {/* Main glow */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    left: mousePosition.x - 300,
                    top: mousePosition.y - 300,
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 40%, transparent 70%)',
                    transition: 'left 0.15s ease-out, top 0.15s ease-out',
                }}
            />
            {/* Inner bright spot */}
            <div
                className="absolute w-[200px] h-[200px] rounded-full"
                style={{
                    left: mousePosition.x - 100,
                    top: mousePosition.y - 100,
                    background: 'radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, transparent 70%)',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out',
                }}
            />
        </div>
    );
}

export default CursorGlow;
