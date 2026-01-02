'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin } from 'lucide-react';

// Simplified footer links per requirements
const footerLinks = {
    main: [
        { name: 'About', href: '/about' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Contact', href: '/contact' },
    ],
};

const socialLinks = [
    { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { Icon: Github, href: 'https://github.com', label: 'GitHub' },
    { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

const Footer = memo(function Footer() {
    return (
        <footer className="relative py-12 px-8 md:px-12 lg:px-16 border-t border-dark-800/50">
            <div className="absolute inset-0 bg-dark-950" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Brand & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <Link href="/" className="flex items-center">
                            <div className="h-10">
                                <Image
                                    src="/DocQueryAI_logo.png"
                                    alt="DocQuery AI"
                                    width={160}
                                    height={40}
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-dark-500 text-sm">
                            © {new Date().getFullYear()} DocQuery AI. All rights reserved.
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
                        {footerLinks.main.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-dark-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Social Links */}
                    <div className="flex gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-dark-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                                aria-label={social.label}
                            >
                                <social.Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = "Footer";

export { Footer };
export default Footer;
