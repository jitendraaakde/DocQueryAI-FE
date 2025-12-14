"use client";
import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
    text: string;
    className?: string;
    encryptedClassName?: string;
    revealedClassName?: string;
    revealDelayMs?: number;
    encryptedCharacters?: string;
}

const EncryptedText = memo(function EncryptedText({
    text,
    className,
    encryptedClassName = "text-neutral-500",
    revealedClassName = "text-white",
    revealDelayMs = 50,
    encryptedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*",
}: EncryptedTextProps) {
    const [displayText, setDisplayText] = useState<string[]>([]);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const intervalsRef = useRef<NodeJS.Timeout[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const getRandomChar = useCallback(() => {
        return encryptedCharacters[Math.floor(Math.random() * encryptedCharacters.length)];
    }, [encryptedCharacters]);

    useEffect(() => {
        // Clear any existing timers on effect re-run
        intervalsRef.current.forEach(clearInterval);
        timeoutsRef.current.forEach(clearTimeout);
        intervalsRef.current = [];
        timeoutsRef.current = [];

        // Initialize with encrypted characters
        setDisplayText(text.split("").map((char) => (char === " " ? " " : getRandomChar())));
        setRevealedIndices(new Set());

        // Reveal characters one by one
        const revealCharacter = (index: number) => {
            if (index >= text.length) return;

            // Scramble effect before revealing
            let scrambleCount = 0;
            const scrambleInterval = setInterval(() => {
                setDisplayText((prev) => {
                    const newText = [...prev];
                    if (text[index] !== " ") {
                        newText[index] = getRandomChar();
                    }
                    return newText;
                });
                scrambleCount++;
                if (scrambleCount >= 3) {
                    clearInterval(scrambleInterval);
                    // Reveal the actual character
                    setDisplayText((prev) => {
                        const newText = [...prev];
                        newText[index] = text[index];
                        return newText;
                    });
                    setRevealedIndices((prev) => new Set([...Array.from(prev), index]));
                }
            }, 30);
            intervalsRef.current.push(scrambleInterval);
        };

        // Start revealing with delays
        text.split("").forEach((_, index) => {
            const timeout = setTimeout(() => revealCharacter(index), index * revealDelayMs);
            timeoutsRef.current.push(timeout);
        });

        // Cleanup function
        return () => {
            intervalsRef.current.forEach(clearInterval);
            timeoutsRef.current.forEach(clearTimeout);
            intervalsRef.current = [];
            timeoutsRef.current = [];
        };
    }, [text, revealDelayMs, getRandomChar]);

    return (
        <span className={cn("font-mono", className)}>
            {displayText.map((char, index) => (
                <span
                    key={index}
                    className={cn(
                        revealedIndices.has(index) ? revealedClassName : encryptedClassName,
                        "transition-colors duration-100"
                    )}
                >
                    {char}
                </span>
            ))}
        </span>
    );
});

EncryptedText.displayName = "EncryptedText";

export { EncryptedText };
export default EncryptedText;
