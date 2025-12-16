'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin } from 'lucide-react';

// Move data outside component to prevent recreation
const footerLinks = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Pricing', href: '/pricing' },
    ],
    company: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
};

const socialLinks = [
    { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { Icon: Github, href: 'https://github.com', label: 'GitHub' },
    { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

const Footer = memo(function Footer() {
    return (
        <footer className="relative py-16 px-6 border-t border-dark-800/50">
            <div className="absolute inset-0 bg-dark-950" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center mb-4">
                            <div className="h-12">
                                <Image
                                    src="/DocQueryAI_logo.png"
                                    alt="DocQuery AI"
                                    width={200}
                                    height={48}
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-dark-400 text-sm max-w-xs mb-6">
                            Transform your documents into an intelligent knowledge base. Upload, search, and get AI-powered answers.
                        </p>
                        {/* Social Links - using CSS instead of framer-motion */}
                        <div className="flex gap-4">
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

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-dark-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-dark-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-dark-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-dark-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-dark-500 text-sm">
                        © {new Date().getFullYear()} DocQuery AI. All rights reserved.
                    </p>
                    <p className="text-dark-600 text-xs">
                        Powered by AI • Built with ♥
                    </p>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = "Footer";

export { Footer };
export default Footer;
