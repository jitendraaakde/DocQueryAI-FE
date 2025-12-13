'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { FileText, Mail, Loader2, ArrowRight, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '@/lib/otp-api';
import { getErrorMessage } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await requestPasswordReset(email);

            if (response.success) {
                setSent(true);
                toast.success('Reset code sent to your email!');
                // Redirect to reset password page with email
                setTimeout(() => {
                    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
                }, 1500);
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
                                Forgot Password?
                            </h2>
                            <p className="text-dark-400 text-center mb-8">
                                Enter your email and we&apos;ll send you a code to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            disabled={isLoading || sent}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || sent}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-primary-500 hover:to-primary-400 hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : sent ? (
                                        <>
                                            Code Sent!
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Code
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Back to Login */}
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
