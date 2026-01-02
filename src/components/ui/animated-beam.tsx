"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBeamProps {
    containerRef: React.RefObject<HTMLElement | null>;
    fromRef: React.RefObject<HTMLElement | null>;
    toRef: React.RefObject<HTMLElement | null>;
    curvature?: number;
    reverse?: boolean;
    duration?: number;
    delay?: number;
    pathColor?: string;
    pathWidth?: number;
    pathOpacity?: number;
    gradientStartColor?: string;
    gradientStopColor?: string;
    startXOffset?: number;
    startYOffset?: number;
    endXOffset?: number;
    endYOffset?: number;
}

export function AnimatedBeam({
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false,
    duration = 2,
    delay = 0,
    pathColor = "gray",
    pathWidth = 2,
    pathOpacity = 0.2,
    gradientStartColor = "#6366f1",
    gradientStopColor = "#818cf8",
    startXOffset = 0,
    startYOffset = 0,
    endXOffset = 0,
    endYOffset = 0,
}: AnimatedBeamProps) {
    const id = useRef(`beam-${Math.random().toString(36).substr(2, 9)}`);
    const [pathD, setPathD] = useState("");
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updatePath = () => {
            if (containerRef.current && fromRef.current && toRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const fromRect = fromRef.current.getBoundingClientRect();
                const toRect = toRef.current.getBoundingClientRect();

                const svgWidth = containerRect.width;
                const svgHeight = containerRect.height;
                setSvgDimensions({ width: svgWidth, height: svgHeight });

                const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
                const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
                const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
                const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

                const controlY = startY - curvature;
                const d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
                setPathD(d);
            }
        };

        // Initial update
        updatePath();

        // Update on resize
        const resizeObserver = new ResizeObserver(() => {
            updatePath();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

    return (
        <svg
            fill="none"
            width={svgDimensions.width}
            height={svgDimensions.height}
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute left-0 top-0 transform-gpu stroke-2"
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        >
            <path
                d={pathD}
                stroke={pathColor}
                strokeWidth={pathWidth}
                strokeOpacity={pathOpacity}
                strokeLinecap="round"
            />
            <path
                d={pathD}
                strokeWidth={pathWidth}
                stroke={`url(#${id.current})`}
                strokeOpacity="1"
                strokeLinecap="round"
            />
            <defs>
                <linearGradient
                    className="transform-gpu"
                    id={id.current}
                    gradientUnits="userSpaceOnUse"
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="0%"
                >
                    <stop stopColor={gradientStartColor} stopOpacity="0" offset="0%" />
                    <stop stopColor={gradientStartColor} offset="10%" />
                    <stop stopColor={gradientStopColor} offset="50%" />
                    <stop stopColor={gradientStopColor} stopOpacity="0" offset="100%">
                        <animate
                            attributeName="offset"
                            values={reverse ? "1;0" : "0;1"}
                            dur={`${duration}s`}
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop stopColor={gradientStopColor} stopOpacity="0" offset="100%" />
                    <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        from={reverse ? "1 0" : "-1 0"}
                        to={reverse ? "-1 0" : "1 0"}
                        dur={`${duration}s`}
                        begin={`${delay}s`}
                        repeatCount="indefinite"
                    />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default AnimatedBeam;
