'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled
                        ? 'bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/50'
                        : 'bg-transparent'
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent flex items-center justify-center overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FileText className="w-5 h-5 text-white relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white via-white to-primary-200 bg-clip-text text-transparent">
                            DocQuery AI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="#features"
                            className="text-dark-300 hover:text-white transition-colors text-sm font-medium"
                        >
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="text-dark-300 hover:text-white transition-colors text-sm font-medium"
                        >
                            How it Works
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-dark-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link href="/register">
                            <motion.button
                                className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold overflow-hidden group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-dark-300 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-dark-950/95 backdrop-blur-xl md:hidden pt-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex flex-col items-center gap-6 p-8">
                            <Link
                                href="#features"
                                className="text-lg text-dark-200 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-lg text-dark-200 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                How it Works
                            </Link>
                            <div className="h-px w-full bg-dark-700 my-4" />
                            <Link
                                href="/login"
                                className="text-lg text-dark-200 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="w-full"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navbar;
