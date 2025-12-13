'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { FileText, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '@/lib/api';
import { requestOTP } from '@/lib/otp-api';

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        full_name: '',
        password: '',
        confirm_password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    if (!authLoading && isAuthenticated) {
        router.push('/dashboard');
        return null;
    }

    // Password strength checks
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
            // Register the user (without auto-login)
            await api.post('/auth/register', {
                email: formData.email,
                username: formData.username,
                full_name: formData.full_name || undefined,
                password: formData.password,
                confirm_password: formData.confirm_password,
            });

            // Request OTP for email verification
            await requestOTP(formData.email, 'verification');

            toast.success('Account created! Please verify your email.');
            router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&purpose=verification`);
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
                            Start your document
                            <span className="block bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
                                Intelligence Journey
                            </span>
                        </h1>

                        <p className="text-dark-400 text-lg mb-8">
                            Create your account and transform how you interact with your documents using AI.
                        </p>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Zap, title: 'Instant Answers', desc: 'AI-powered responses in seconds' },
                                { icon: Shield, title: 'Secure Storage', desc: 'Your docs, encrypted & private' },
                                { icon: Sparkles, title: 'Smart Search', desc: 'Semantic document search' },
                                { icon: FileText, title: 'Multi-Format', desc: 'PDF, DOCX, TXT & more' },
                            ].map((feature) => (
                                <div
                                    key={feature.title}
                                    className="p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 backdrop-blur-sm"
                                >
                                    <feature.icon className="w-6 h-6 text-primary-400 mb-2" />
                                    <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                                    <p className="text-dark-400 text-xs">{feature.desc}</p>
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
                                    Create Account
                                </h2>
                                <p className="text-dark-400 text-center mb-6">
                                    Get started with your free account
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                                            Email Address <span className="text-primary-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="you@example.com"
                                                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                disabled={isLoading}
                                                required
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>

                                    {/* Username & Full Name */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-dark-300 mb-2">
                                                Username <span className="text-primary-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                                <input
                                                    id="username"
                                                    type="text"
                                                    value={formData.username}
                                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                    placeholder="johndoe"
                                                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                                <input
                                                    id="full_name"
                                                    type="text"
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                    disabled={isLoading}
                                                    autoComplete="name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                                            Password <span className="text-primary-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                disabled={isLoading}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {/* Password Requirements */}
                                        {formData.password && (
                                            <div className="mt-3 p-3 rounded-lg bg-dark-800/50 border border-dark-700/50 space-y-1.5">
                                                <div className={`flex items-center gap-2 text-sm ${passwordChecks.length ? 'text-green-400' : 'text-dark-500'}`}>
                                                    <CheckCircle className={`w-4 h-4 ${passwordChecks.length ? 'fill-green-400 text-dark-900' : ''}`} />
                                                    At least 8 characters
                                                </div>
                                                <div className={`flex items-center gap-2 text-sm ${passwordChecks.hasLetter ? 'text-green-400' : 'text-dark-500'}`}>
                                                    <CheckCircle className={`w-4 h-4 ${passwordChecks.hasLetter ? 'fill-green-400 text-dark-900' : ''}`} />
                                                    Contains a letter
                                                </div>
                                                <div className={`flex items-center gap-2 text-sm ${passwordChecks.hasNumber ? 'text-green-400' : 'text-dark-500'}`}>
                                                    <CheckCircle className={`w-4 h-4 ${passwordChecks.hasNumber ? 'fill-green-400 text-dark-900' : ''}`} />
                                                    Contains a number
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirm_password" className="block text-sm font-medium text-dark-300 mb-2">
                                            Confirm Password <span className="text-primary-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                            <input
                                                id="confirm_password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirm_password}
                                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                disabled={isLoading}
                                                required
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        {formData.confirm_password && (
                                            <div className="mt-2">
                                                <div className={`flex items-center gap-2 text-sm ${passwordChecks.matches ? 'text-green-400' : 'text-red-400'}`}>
                                                    <CheckCircle className={`w-4 h-4 ${passwordChecks.matches ? 'fill-green-400 text-dark-900' : ''}`} />
                                                    {passwordChecks.matches ? 'Passwords match' : 'Passwords do not match'}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-primary-500 hover:to-primary-400 hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Login Link */}
                                <p className="text-center text-dark-400 mt-6">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                        Sign in
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
