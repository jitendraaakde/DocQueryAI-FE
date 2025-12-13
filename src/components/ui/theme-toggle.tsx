'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-dark-800/50 hover:bg-dark-700/50 border border-dark-700/50 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : 180,
                    scale: theme === 'dark' ? 1 : 0.8,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-primary-400" />
                ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                )}
            </motion.div>
        </button>
    );
}

export default ThemeToggle;
