'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AuthHeader } from '@/components/landing/auth-header';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/api';

// Separate component to handle search params (needs Suspense boundary)
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Show success message if just verified - only once on mount
    useEffect(() => {
        const verified = searchParams.get('verified');
        if (verified === 'true') {
            toast.success('Email verified! You can now log in.', { id: 'verified' });
        }
    }, [searchParams]);

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [authLoading, isAuthenticated, router]);

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

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Welcome!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsGoogleLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <>
            <AuthHeader />
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
                        <Link href="/" className="inline-flex items-center mb-8">
                            <div className="h-14 rounded-2xl overflow-hidden shadow-lg shadow-primary-500/30">
                                <Image
                                    src="/DocQueryAI_logo.png"
                                    alt="DocQuery AI"
                                    width={200}
                                    height={56}
                                    className="h-full w-auto object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                            Welcome back to your
                            <span className="block mt-2 bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
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
                        <Link href="/" className="lg:hidden flex items-center justify-center mb-8">
                            <div className="h-12 rounded-xl overflow-hidden">
                                <Image
                                    src="/DocQueryAI_logo.png"
                                    alt="DocQuery AI"
                                    width={160}
                                    height={48}
                                    className="h-full w-auto object-contain"
                                    priority
                                />
                            </div>
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

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-dark-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-dark-900 text-dark-400">Or continue with</span>
                                    </div>
                                </div>

                                {/* Google Sign-In Button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading || isGoogleLoading}
                                    className="w-full py-3.5 rounded-xl bg-white text-gray-800 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                                >
                                    {isGoogleLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                    )}
                                    {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                                </button>

                                {/* Register Link */}
                                <p className="text-center text-dark-400 mt-6">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                        Create one
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

// Main export with Suspense boundary for useSearchParams
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
