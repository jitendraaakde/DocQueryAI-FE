'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AuthHeader } from '@/components/landing/auth-header';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useToast, createToastHelpers } from '@/lib/toast-utils';
import { getErrorMessage, getErrorCode } from '@/lib/api';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { GradientMesh } from '@/components/ui/gradient-mesh';
import { TiltCard } from '@/components/ui/tilt-card';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();
    const { showToast } = useToast();
    const toast = createToastHelpers(showToast);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        const verified = searchParams.get('verified');
        if (verified === 'true') {
            toast.success('Email Verified!', 'You can now log in to your account.');
        }
    }, [searchParams]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.warning('Missing Information', 'Please fill in all fields to continue.');
            return;
        }

        setIsLoading(true);

        try {
            await login({
                email: formData.email,
                password: formData.password,
            });

            toast.success('Welcome Back!', 'You have successfully logged in.');
            router.push('/dashboard');
        } catch (error) {
            const errorCode = getErrorCode(error);
            const errorMessage = getErrorMessage(error);

            // Handle specific error codes with custom messages
            if (errorCode === 'AUTH_GOOGLE_ONLY') {
                toast.error(
                    'Google Sign-In Required',
                    'This account was created with Google. Please click "Continue with Google" below.'
                );
            } else if (errorCode === 'AUTH_EMAIL_NOT_FOUND') {
                toast.error(
                    'Account Not Found',
                    'No account exists with this email. Would you like to create one?'
                );
            } else if (errorCode === 'AUTH_INVALID_PASSWORD') {
                toast.error(
                    'Incorrect Password',
                    'The password you entered is incorrect. Please try again.'
                );
            } else if (errorCode === 'AUTH_EMAIL_NOT_VERIFIED') {
                toast.warning(
                    'Email Not Verified',
                    'Please check your inbox and verify your email before logging in.'
                );
            } else if (errorCode === 'AUTH_ACCOUNT_INACTIVE') {
                toast.error(
                    'Account Deactivated',
                    'Your account has been deactivated. Please contact support.'
                );
            } else {
                toast.error('Login Failed', errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Welcome!', 'You have successfully logged in with Google.');
            router.push('/dashboard');
        } catch (error) {
            const errorCode = getErrorCode(error);
            const errorMessage = getErrorMessage(error);

            if (errorCode === 'AUTH_ACCOUNT_INACTIVE') {
                toast.error('Account Deactivated', 'Your account has been deactivated. Please contact support.');
            } else {
                toast.error('Google Login Failed', errorMessage);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-8 h-8 text-primary-500" />
                </motion.div>
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
                {/* Animated background */}
                <div className="absolute inset-0">
                    <GradientMesh />
                    <FloatingShapes className="opacity-40" />
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

                {/* Left Side - Branding (Desktop) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden lg:flex flex-1 items-center justify-center pl-16 pr-8 py-12 relative z-10"
                >
                    <div className="max-w-lg ml-8">
                        <Link href="/" className="inline-flex items-center mb-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="h-14 rounded-2xl overflow-hidden shadow-lg shadow-primary-500/30"
                            >
                                <Image
                                    src="/DocQueryAI_logo.png"
                                    alt="DocQuery AI"
                                    width={200}
                                    height={56}
                                    className="h-full w-auto object-contain"
                                    priority
                                />
                            </motion.div>
                        </Link>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                        >
                            Welcome back to your
                            <span className="block mt-2 bg-gradient-to-r from-primary-400 via-accent to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                                Knowledge Base
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-dark-400 text-lg mb-10 leading-relaxed"
                        >
                            Sign in to access your documents, search semantically, and get AI-powered answers.
                        </motion.p>

                        {/* Feature highlights with hover */}
                        <div className="space-y-4">
                            {[
                                { icon: Sparkles, text: 'Semantic search across all your documents', color: 'text-purple-400' },
                                { icon: Zap, text: 'AI-powered answers with source citations', color: 'text-yellow-400' },
                                { icon: Shield, text: 'Secure and private document storage', color: 'text-green-400' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-3 text-dark-300 group cursor-default"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-dark-800/50 border border-dark-700/50 flex items-center justify-center group-hover:border-primary-500/30 group-hover:bg-primary-500/10 transition-all">
                                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Form with 3D Tilt */}
                <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-md"
                    >
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

                        {/* Card with 3D Tilt */}
                        <TiltCard tiltAmount={8} className="w-full">
                            <div className="relative">
                                {/* Animated border glow */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500 via-accent to-pink-500 rounded-2xl opacity-30 blur-sm animate-gradient-x bg-[length:200%_auto]" />

                                <div className="relative bg-dark-900/95 backdrop-blur-xl rounded-2xl p-8 border border-dark-700/50 shadow-2xl">
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.3 }}
                                            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg shadow-primary-500/30"
                                        >
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Welcome Back
                                        </h2>
                                        <p className="text-dark-400">
                                            Sign in to continue to your dashboard
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Email */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                                                Email Address
                                            </label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-primary-400' : 'text-dark-500'}`} />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="you@example.com"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-dark-800 transition-all duration-300"
                                                    disabled={isLoading}
                                                    required
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Password */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                                                Password
                                            </label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-primary-400' : 'text-dark-500'}`} />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="••••••••"
                                                    className="w-full pl-12 pr-12 py-3.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-dark-800 transition-all duration-300"
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
                                        </motion.div>

                                        {/* Forgot Password Link */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="text-right"
                                        >
                                            <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                                                Forgot password?
                                            </Link>
                                        </motion.div>

                                        {/* Submit Button */}
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                                    <span className="relative z-10">Signing In...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Sign In</span>
                                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </motion.button>
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
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading || isGoogleLoading}
                                        className="w-full py-3.5 rounded-xl bg-white text-gray-800 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 shadow-lg"
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
                                    </motion.button>

                                    {/* Register Link */}
                                    <p className="text-center text-dark-400 mt-6">
                                        Don&apos;t have an account?{' '}
                                        <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                            Create one
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            </main>
        </>
    );
}

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
