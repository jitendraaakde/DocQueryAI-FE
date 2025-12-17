'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = memo(function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const rafRef = useRef<number | null>(null);
    const lastScrolled = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            // Cancel any pending animation frame
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            // Throttle using requestAnimationFrame
            rafRef.current = requestAnimationFrame(() => {
                const isScrolled = window.scrollY > 20;
                // Only update state if changed
                if (isScrolled !== lastScrolled.current) {
                    lastScrolled.current = isScrolled;
                    setScrolled(isScrolled);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen(prev => !prev);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled
                        ? 'bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/50'
                        : 'bg-transparent'
                )}
                style={{ transform: 'translateY(0)' }}
            >
                <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="h-12 transition-transform hover:scale-105 active:scale-95">
                            <Image
                                src="/DocQueryAI_logo.png"
                                alt="DocQuery AI"
                                width={200}
                                height={48}
                                className="h-full w-auto object-contain"
                                priority
                            />
                        </div>
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
                            <button className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold overflow-hidden group transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-dark-300 hover:text-white"
                        onClick={toggleMobileMenu}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-dark-950/95 backdrop-blur-xl md:hidden pt-20 animate-in fade-in duration-200"
                >
                    <div className="flex flex-col items-center gap-6 p-8">
                        <Link
                            href="#features"
                            className="text-lg text-dark-200 hover:text-white"
                            onClick={closeMobileMenu}
                        >
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="text-lg text-dark-200 hover:text-white"
                            onClick={closeMobileMenu}
                        >
                            How it Works
                        </Link>
                        <div className="h-px w-full bg-dark-700 my-4" />
                        <Link
                            href="/login"
                            className="text-lg text-dark-200 hover:text-white"
                            onClick={closeMobileMenu}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="w-full"
                            onClick={closeMobileMenu}
                        >
                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
});

Navbar.displayName = "Navbar";

export { Navbar };
export default Navbar;
