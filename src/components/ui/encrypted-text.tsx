"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
    text: string;
    className?: string;
    encryptedClassName?: string;
    revealedClassName?: string;
    revealDelayMs?: number;
    encryptedCharacters?: string;
}

export function EncryptedText({
    text,
    className,
    encryptedClassName = "text-neutral-500",
    revealedClassName = "text-white",
    revealDelayMs = 50,
    encryptedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*",
}: EncryptedTextProps) {
    const [displayText, setDisplayText] = useState<string[]>([]);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

    const getRandomChar = useCallback(() => {
        return encryptedCharacters[Math.floor(Math.random() * encryptedCharacters.length)];
    }, [encryptedCharacters]);

    useEffect(() => {
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
        };

        // Start revealing with delays
        text.split("").forEach((_, index) => {
            setTimeout(() => revealCharacter(index), index * revealDelayMs);
        });

        return () => {
            // Cleanup
        };
    }, [text, revealDelayMs, getRandomChar]);

    return (
        <span className={cn("font-mono", className)}>
            {displayText.map((char, index) => (
                <motion.span
                    key={index}
                    className={cn(
                        revealedIndices.has(index) ? revealedClassName : encryptedClassName,
                        "transition-colors duration-100"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

export default EncryptedText;
