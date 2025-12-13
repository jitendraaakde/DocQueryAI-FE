'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { FileText, Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verified = searchParams.get('verified');
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Show success message if just verified
    if (verified === 'true') {
        toast.success('Email verified! You can now log in.', { id: 'verified' });
    }

    // Redirect if already authenticated
    if (!authLoading && isAuthenticated) {
        router.push('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            await login({
                email: formData.email,
                password: formData.password,
            });

            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-dark-950 flex relative overflow-hidden pt-16">
                {/* Background decorations - all with pointer-events-none */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full filter blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full filter blur-[120px]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />
                </div>

                {/* Left Side - Branding (Desktop) */}
                <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative z-10">
                    <div className="max-w-lg">
                        <Link href="/" className="inline-flex items-center gap-3 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-white via-white to-primary-200 bg-clip-text text-transparent">
                                DocQuery AI
                            </span>
                        </Link>

                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                            Welcome back to your
                            <span className="block bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
                                Knowledge Base
                            </span>
                        </h1>

                        <p className="text-dark-400 text-lg mb-8">
                            Sign in to access your documents, search semantically, and get AI-powered answers.
                        </p>

                        {/* Feature highlights */}
                        <div className="space-y-4">
                            {[
                                { icon: Sparkles, text: 'Semantic search across all your documents' },
                                { icon: Zap, text: 'AI-powered answers with source citations' },
                                { icon: Shield, text: 'Secure and private document storage' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-dark-300">
                                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                        <feature.icon className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <Link href="/" className="lg:hidden flex items-center justify-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                                DocQuery AI
                            </span>
                        </Link>

                        {/* Card */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-accent/30 to-primary-500/30 rounded-2xl blur-lg opacity-50" />
                            <div className="relative bg-dark-900/95 backdrop-blur-xl rounded-2xl p-8 border border-dark-700/50">
                                <h2 className="text-2xl font-bold text-white text-center mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-dark-400 text-center mb-8">
                                    Sign in to continue to your dashboard
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="you@example.com"
                                                className="w-full pl-12 pr-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                disabled={isLoading}
                                                required
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-12 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                disabled={isLoading}
                                                required
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Forgot Password Link */}
                                    <div className="text-right">
                                        <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-primary-500 hover:to-primary-400 hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Register Link */}
                                <p className="text-center text-dark-400 mt-6">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                        Create one
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Back to Home */}
                        <p className="text-center text-dark-500 mt-6">
                            <Link href="/" className="hover:text-dark-300 flex items-center justify-center gap-2 transition-colors">
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Back to Home
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
