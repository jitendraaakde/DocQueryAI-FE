'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GradientMeshProps {
    className?: string;
}

export function GradientMesh({ className }: GradientMeshProps) {
    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 opacity-60">
                <svg
                    className="absolute w-full h-full"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        {/* Gradient definitions */}
                        <radialGradient id="mesh-gradient-1" cx="30%" cy="30%" r="50%">
                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <radialGradient id="mesh-gradient-2" cx="70%" cy="60%" r="50%">
                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <radialGradient id="mesh-gradient-3" cx="50%" cy="80%" r="40%">
                            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.25)" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <radialGradient id="mesh-gradient-4" cx="80%" cy="20%" r="35%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>

                        <filter id="mesh-blur">
                            <feGaussianBlur stdDeviation="40" />
                        </filter>
                    </defs>

                    {/* Animated circles */}
                    <g filter="url(#mesh-blur)">
                        <circle cx="300" cy="300" r="300" fill="url(#mesh-gradient-1)">
                            <animate
                                attributeName="cx"
                                values="300;350;280;300"
                                dur="20s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="cy"
                                values="300;250;350;300"
                                dur="25s"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle cx="700" cy="600" r="280" fill="url(#mesh-gradient-2)">
                            <animate
                                attributeName="cx"
                                values="700;750;650;700"
                                dur="18s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="cy"
                                values="600;550;650;600"
                                dur="22s"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle cx="500" cy="800" r="250" fill="url(#mesh-gradient-3)">
                            <animate
                                attributeName="cx"
                                values="500;550;450;500"
                                dur="24s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="cy"
                                values="800;750;850;800"
                                dur="20s"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle cx="800" cy="200" r="220" fill="url(#mesh-gradient-4)">
                            <animate
                                attributeName="cx"
                                values="800;850;750;800"
                                dur="22s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="cy"
                                values="200;250;150;200"
                                dur="18s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </g>
                </svg>
            </div>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]">
                <svg width="100%" height="100%">
                    <filter id="noise">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>
        </div>
    );
}

export default GradientMesh;
