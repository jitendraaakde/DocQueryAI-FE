'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { FileText, Lock, Loader2, ArrowRight, Eye, EyeOff, CheckCircle, KeyRound, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmPasswordReset, requestPasswordReset } from '@/lib/otp-api';
import { getErrorMessage } from '@/lib/api';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            router.push('/forgot-password');
        }
    }, [email, router]);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Password strength checks
    const passwordChecks = {
        length: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password),
        matches: password === confirmPassword && confirmPassword.length > 0,
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((digit, i) => {
                if (index + i < 6) newOtp[index + i] = digit;
            });
            setOtp(newOtp);
            const focusIndex = Math.min(index + digits.length, 5);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setIsResending(true);

        try {
            const response = await requestPasswordReset(email);
            if (response.success) {
                toast.success('New reset code sent!');
                setOtp(['', '', '', '', '', '']);
                setCountdown(60);
                inputRefs.current[0]?.focus();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter the 6-digit code');
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
            const response = await confirmPasswordReset(email, otpCode, password);

            if (response.success) {
                toast.success('Password reset successfully!');
                router.push('/login');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden pt-20 pb-12">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full filter blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full filter blur-[120px]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />
                </div>

                <div className="w-full max-w-md px-6 relative z-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center justify-center gap-3 mb-8">
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
                            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
                                <KeyRound className="w-8 h-8 text-primary-400" />
                            </div>

                            <h2 className="text-2xl font-bold text-white text-center mb-2">
                                Reset Password
                            </h2>
                            <p className="text-dark-400 text-center mb-6">
                                Enter the code sent to <span className="text-primary-400">{email}</span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* OTP Input */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">
                                        Verification Code
                                    </label>
                                    <div className="flex justify-center gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => { inputRefs.current[index] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-11 h-12 text-center text-lg font-bold bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                                disabled={isLoading}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-center mt-2">
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={isResending || countdown > 0}
                                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {isResending ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <RefreshCw className="w-3 h-3" />
                                            )}
                                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            disabled={isLoading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="mt-2 p-2 rounded-lg bg-dark-800/50 border border-dark-700/50 space-y-1">
                                            <div className={`flex items-center gap-2 text-xs ${passwordChecks.length ? 'text-green-400' : 'text-dark-500'}`}>
                                                <CheckCircle className={`w-3 h-3 ${passwordChecks.length ? 'fill-green-400 text-dark-900' : ''}`} />
                                                At least 8 characters
                                            </div>
                                            <div className={`flex items-center gap-2 text-xs ${passwordChecks.hasLetter ? 'text-green-400' : 'text-dark-500'}`}>
                                                <CheckCircle className={`w-3 h-3 ${passwordChecks.hasLetter ? 'fill-green-400 text-dark-900' : ''}`} />
                                                Contains a letter
                                            </div>
                                            <div className={`flex items-center gap-2 text-xs ${passwordChecks.hasNumber ? 'text-green-400' : 'text-dark-500'}`}>
                                                <CheckCircle className={`w-3 h-3 ${passwordChecks.hasNumber ? 'fill-green-400 text-dark-900' : ''}`} />
                                                Contains a number
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirm_password" className="block text-sm font-medium text-dark-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input
                                            id="confirm_password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    {confirmPassword && (
                                        <div className={`flex items-center gap-2 text-xs mt-2 ${passwordChecks.matches ? 'text-green-400' : 'text-red-400'}`}>
                                            <CheckCircle className={`w-3 h-3 ${passwordChecks.matches ? 'fill-green-400 text-dark-900' : ''}`} />
                                            {passwordChecks.matches ? 'Passwords match' : 'Passwords do not match'}
                                        </div>
                                    )}
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
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Back Link */}
                            <p className="text-center text-dark-500 mt-6">
                                <Link href="/login" className="hover:text-dark-300 flex items-center justify-center gap-2 transition-colors">
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
