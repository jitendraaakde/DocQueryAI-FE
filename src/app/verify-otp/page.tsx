'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { FileText, Mail, Loader2, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifyOTP, requestOTP } from '@/lib/otp-api';
import { getErrorMessage } from '@/lib/api';

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const purpose = searchParams.get('purpose') || 'verification';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            router.push('/register');
        }
    }, [email, router]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((digit, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = digit;
                }
            });
            setOtp(newOtp);
            // Focus last filled or next empty
            const focusIndex = Math.min(index + digits.length, 5);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);

        try {
            const response = await verifyOTP(email, otpCode);

            if (response.success) {
                toast.success('Email verified successfully!');
                if (purpose === 'password_reset') {
                    router.push(`/reset-password?email=${encodeURIComponent(email)}&verified=true`);
                } else {
                    router.push('/login?verified=true');
                }
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setIsResending(true);

        try {
            const otpPurpose = purpose === 'password_reset' ? 'password_reset' : 'verification';
            const response = await requestOTP(email, otpPurpose as 'verification' | 'password_reset' | '2fa');

            if (response.success) {
                toast.success('New verification code sent!');
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
                                <Mail className="w-8 h-8 text-primary-400" />
                            </div>

                            <h2 className="text-2xl font-bold text-white text-center mb-2">
                                Verify Your Email
                            </h2>
                            <p className="text-dark-400 text-center mb-8">
                                We&apos;ve sent a 6-digit code to<br />
                                <span className="text-primary-400 font-medium">{email}</span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* OTP Input */}
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || otp.join('').length !== 6}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-primary-500 hover:to-primary-400 hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Verify Email
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Resend */}
                            <div className="text-center mt-6">
                                <p className="text-dark-400 text-sm mb-2">
                                    Didn&apos;t receive the code?
                                </p>
                                <button
                                    onClick={handleResend}
                                    disabled={isResending || countdown > 0}
                                    className="text-primary-400 hover:text-primary-300 font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : countdown > 0 ? (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Resend in {countdown}s
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Resend Code
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Back Link */}
                            <p className="text-center text-dark-500 mt-6">
                                <Link href="/register" className="hover:text-dark-300 flex items-center justify-center gap-2 transition-colors">
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Back to Register
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
