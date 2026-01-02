'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AuthHeader } from '@/components/landing/auth-header';
import { File, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle, ArrowRight, Sparkles, Shield, Zap, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '@/lib/api';
import { requestOTP } from '@/lib/otp-api';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { GradientMesh } from '@/components/ui/gradient-mesh';
import { TiltCard } from '@/components/ui/tilt-card';

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading, loginWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        full_name: '',
        password: '',
        confirm_password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Account created successfully!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const passwordChecks = {
        length: formData.password.length >= 8,
        hasNumber: /\d/.test(formData.password),
        hasLetter: /[a-zA-Z]/.test(formData.password),
        matches: formData.password === formData.confirm_password && formData.confirm_password.length > 0,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.username || !formData.password || !formData.confirm_password) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!passwordChecks.length || !passwordChecks.hasNumber || !passwordChecks.hasLetter) {
            toast.error('Password does not meet requirements');
            return;
        }

        if (!passwordChecks.matches) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const configResponse = await api.get<{ email_verification_required: boolean }>('/auth/config');
            const emailVerificationRequired = configResponse.data.email_verification_required;

            await api.post('/auth/register', {
                email: formData.email,
                username: formData.username,
                full_name: formData.full_name || undefined,
                password: formData.password,
                confirm_password: formData.confirm_password,
            });

            if (emailVerificationRequired) {
                await requestOTP(formData.email, 'verification');
                toast.success('Account created! Please verify your email.');
                router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&purpose=verification`);
            } else {
                toast.success('Account created successfully! Please log in.');
                router.push('/login');
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
            setIsLoading(false);
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
                            Start your document
                            <span className="block mt-2 bg-gradient-to-r from-primary-400 via-accent to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                                Intelligence Journey
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-dark-400 text-lg mb-10 leading-relaxed"
                        >
                            Create your account and transform how you interact with your documents using AI.
                        </motion.p>

                        {/* Feature highlights with hover */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Zap, title: 'Instant Answers', desc: 'AI-powered responses in seconds', color: 'text-yellow-400' },
                                { icon: Shield, title: 'Secure Storage', desc: 'Your docs, encrypted & private', color: 'text-green-400' },
                                { icon: Sparkles, title: 'Smart Search', desc: 'Semantic document search', color: 'text-purple-400' },
                                { icon: File, title: 'Multi-Format', desc: 'PDF, DOCX, TXT & more', color: 'text-blue-400' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    whileHover={{ scale: 1.03, y: -3 }}
                                    className="p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 backdrop-blur-sm hover:border-primary-500/30 hover:bg-dark-800/80 transition-all cursor-default group"
                                >
                                    <feature.icon className={`w-6 h-6 ${feature.color} mb-2 group-hover:scale-110 transition-transform`} />
                                    <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                                    <p className="text-dark-400 text-xs">{feature.desc}</p>
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
                        <TiltCard tiltAmount={6} className="w-full">
                            <div className="relative">
                                {/* Animated border glow */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500 via-accent to-pink-500 rounded-2xl opacity-30 blur-sm animate-gradient-x bg-[length:200%_auto]" />

                                <div className="relative bg-dark-900/95 backdrop-blur-xl rounded-2xl p-8 border border-dark-700/50 shadow-2xl">
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.3 }}
                                            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg shadow-primary-500/30"
                                        >
                                            <Rocket className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Create Account
                                        </h2>
                                        <p className="text-dark-400">
                                            Get started with your free account
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Email */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                                                Email Address <span className="text-primary-400">*</span>
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
                                                    className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-dark-800 transition-all"
                                                    disabled={isLoading}
                                                    required
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Username & Full Name */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="grid grid-cols-2 gap-4"
                                        >
                                            <div>
                                                <label htmlFor="username" className="block text-sm font-medium text-dark-300 mb-2">
                                                    Username <span className="text-primary-400">*</span>
                                                </label>
                                                <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'transform scale-[1.02]' : ''}`}>
                                                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'username' ? 'text-primary-400' : 'text-dark-500'}`} />
                                                    <input
                                                        id="username"
                                                        type="text"
                                                        value={formData.username}
                                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                        onFocus={() => setFocusedField('username')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="johndoe"
                                                        className="w-full pl-10 pr-3 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-dark-800 transition-all text-sm"
                                                        disabled={isLoading}
                                                        required
                                                        autoComplete="username"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="full_name" className="block text-sm font-medium text-dark-300 mb-2">
                                                    Full Name
                                                </label>
                                                <div className={`relative transition-all duration-300 ${focusedField === 'full_name' ? 'transform scale-[1.02]' : ''}`}>
                                                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'full_name' ? 'text-primary-400' : 'text-dark-500'}`} />
                                                    <input
                                                        id="full_name"
                                                        type="text"
                                                        value={formData.full_name}
                                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                        onFocus={() => setFocusedField('full_name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="John Doe"
                                                        className="w-full pl-10 pr-3 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-dark-800 transition-all text-sm"
                                                        disabled={isLoading}
                                                        autoComplete="name"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Password */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                                                Password <span className="text-primary-400">*</span>
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
                                                    className="w-full pl-12 pr-12 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-dark-800 transition-all"
                                                    disabled={isLoading}
                                                    required
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {/* Password Requirements */}
                                            {formData.password && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-3 p-3 rounded-lg bg-dark-800/50 border border-dark-700/50 space-y-1.5"
                                                >
                                                    {[
                                                        { check: passwordChecks.length, text: 'At least 8 characters' },
                                                        { check: passwordChecks.hasLetter, text: 'Contains a letter' },
                                                        { check: passwordChecks.hasNumber, text: 'Contains a number' },
                                                    ].map((item, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className={`flex items-center gap-2 text-sm ${item.check ? 'text-green-400' : 'text-dark-500'}`}
                                                        >
                                                            <CheckCircle className={`w-4 h-4 ${item.check ? 'fill-green-400 text-dark-900' : ''}`} />
                                                            {item.text}
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {/* Confirm Password */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <label htmlFor="confirm_password" className="block text-sm font-medium text-dark-300 mb-2">
                                                Confirm Password <span className="text-primary-400">*</span>
                                            </label>
                                            <div className={`relative transition-all duration-300 ${focusedField === 'confirm' ? 'transform scale-[1.02]' : ''}`}>
                                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'confirm' ? 'text-primary-400' : 'text-dark-500'}`} />
                                                <input
                                                    id="confirm_password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.confirm_password}
                                                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                                    onFocus={() => setFocusedField('confirm')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="••••••••"
                                                    className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-dark-800 transition-all"
                                                    disabled={isLoading}
                                                    required
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                            {formData.confirm_password && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="mt-2"
                                                >
                                                    <div className={`flex items-center gap-2 text-sm ${passwordChecks.matches ? 'text-green-400' : 'text-red-400'}`}>
                                                        <CheckCircle className={`w-4 h-4 ${passwordChecks.matches ? 'fill-green-400 text-dark-900' : ''}`} />
                                                        {passwordChecks.matches ? 'Passwords match' : 'Passwords do not match'}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {/* Submit Button */}
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 overflow-hidden relative group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                                    <span className="relative z-10">Creating Account...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Create Account</span>
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

                                    {/* Google Sign-Up Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={handleGoogleSignUp}
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
                                        {isGoogleLoading ? 'Creating account...' : 'Continue with Google'}
                                    </motion.button>

                                    {/* Login Link */}
                                    <p className="text-center text-dark-400 mt-6">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                            Sign in
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
