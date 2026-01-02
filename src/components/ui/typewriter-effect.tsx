'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypewriterEffectProps {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}

export function TypewriterEffect({
    words,
    className,
    cursorClassName,
}: TypewriterEffectProps) {
    const wordsArray = words.map((word) => ({
        ...word,
        text: word.text.split(''),
    }));

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const word = wordsArray[currentWordIndex];

        let timeout: NodeJS.Timeout;

        if (!isDeleting && currentCharIndex < word.text.length) {
            timeout = setTimeout(() => {
                setCurrentCharIndex(c => c + 1);
            }, 100);
        } else if (!isDeleting && currentCharIndex === word.text.length) {
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
        } else if (isDeleting && currentCharIndex > 0) {
            timeout = setTimeout(() => {
                setCurrentCharIndex(c => c - 1);
            }, 50);
        } else if (isDeleting && currentCharIndex === 0) {
            setIsDeleting(false);
            setCurrentWordIndex((w) => (w + 1) % wordsArray.length);
        }

        return () => clearTimeout(timeout);
    }, [currentCharIndex, isDeleting, currentWordIndex, wordsArray]);

    return (
        <span className={cn("inline-flex items-center", className)}>
            {wordsArray[currentWordIndex].text.slice(0, currentCharIndex).map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={wordsArray[currentWordIndex].className}
                >
                    {char}
                </motion.span>
            ))}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={cn(
                    "inline-block rounded-sm w-[4px] h-[1em] ml-1 bg-primary-500",
                    cursorClassName
                )}
            />
        </span>
    );
}

interface TypewriterEffectSmoothProps {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}

export function TypewriterEffectSmooth({
    words,
    className,
    cursorClassName,
}: TypewriterEffectSmoothProps) {
    const renderWords = () => {
        return (
            <div>
                {words.map((word, idx) => (
                    <div key={`word-${idx}`} className="inline-block">
                        {word.text.split('').map((char, index) => (
                            <span
                                key={`char-${index}`}
                                className={cn("text-white", word.className)}
                            >
                                {char}
                            </span>
                        ))}
                        &nbsp;
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={cn("flex space-x-1 my-6", className)}>
            <motion.div
                className="overflow-hidden pb-2"
                initial={{ width: "0%" }}
                whileInView={{ width: "fit-content" }}
                transition={{
                    duration: 2,
                    ease: "linear",
                    delay: 0.5,
                }}
            >
                <div
                    className="text-base sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-bold"
                    style={{ whiteSpace: "nowrap" }}
                >
                    {renderWords()}
                </div>
            </motion.div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={cn(
                    "block rounded-sm w-[4px] h-6 sm:h-8 md:h-12 lg:h-14 xl:h-16 bg-primary-500",
                    cursorClassName
                )}
            />
        </div>
    );
}

export default TypewriterEffect;
