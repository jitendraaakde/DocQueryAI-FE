'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/theme-context';
import api, { getErrorMessage } from '@/lib/api';
import {
    User as UserIcon, Mail, Lock, Loader2, Save, Shield,
    Moon, Sun, Palette, Bell, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { user, refreshUser } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [is2FALoading, setIs2FALoading] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);

        try {
            await api.put('/users/me', profileData);
            await refreshUser();
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        setIsUpdatingPassword(true);

        try {
            await api.put('/users/me/password', passwordData);
            toast.success('Password updated successfully');
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handle2FAToggle = async () => {
        setIs2FALoading(true);
        try {
            if (user?.totp_enabled) {
                // Request OTP to disable
                await api.post('/otp/request', { email: user.email, purpose: '2fa' });
                toast.success('Verification code sent to your email');
                setShow2FAModal(true);
            } else {
                // Request OTP to enable
                await api.post('/otp/2fa/enable');
                toast.success('Verification code sent to your email');
                setShow2FAModal(true);
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIs2FALoading(false);
        }
    };

    const confirm2FA = async () => {
        if (!otpCode.trim()) return;

        setIs2FALoading(true);
        try {
            const endpoint = user?.totp_enabled ? '/otp/2fa/disable' : '/otp/2fa/confirm';
            await api.post(endpoint, { email: user?.email, otp: otpCode });
            await refreshUser();
            toast.success(user?.totp_enabled ? '2FA disabled' : '2FA enabled successfully!');
            setShow2FAModal(false);
            setOtpCode('');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIs2FALoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-dark-400">Manage your account settings and preferences.</p>
            </div>

            {/* Appearance Section */}
            <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary-400" />
                    Appearance
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? (
                                <Moon className="w-5 h-5 text-primary-400" />
                            ) : (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            )}
                            <div>
                                <p className="text-white font-medium">Theme</p>
                                <p className="text-dark-400 text-sm">
                                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-14 h-8 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-dark-600'
                                }`}
                        >
                            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${theme === 'dark' ? 'left-7' : 'left-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-400" />
                    Security
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50">
                        <div>
                            <p className="text-white font-medium">Two-Factor Authentication</p>
                            <p className="text-dark-400 text-sm">
                                Add an extra layer of security with email verification
                            </p>
                        </div>
                        <button
                            onClick={handle2FAToggle}
                            disabled={is2FALoading}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${user?.totp_enabled
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                }`}
                        >
                            {is2FALoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : user?.totp_enabled ? (
                                'Disable'
                            ) : (
                                'Enable'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary-400" />
                    Profile Information
                </h2>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    {/* Email (read-only) */}
                    <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input pl-12 bg-dark-900/50 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-dark-500 text-xs mt-1">Email cannot be changed</p>
                    </div>

                    {/* Username (read-only) */}
                    <div>
                        <label className="label">Username</label>
                        <input
                            type="text"
                            value={user?.username || ''}
                            disabled
                            className="input bg-dark-900/50 cursor-not-allowed"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="full_name" className="label">Full Name</label>
                        <input
                            id="full_name"
                            type="text"
                            value={profileData.full_name}
                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                            placeholder="Your full name"
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isUpdatingProfile ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Password Section */}
            <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary-400" />
                    Change Password
                </h2>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="current_password" className="label">Current Password</label>
                        <input
                            id="current_password"
                            type="password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                            placeholder="••••••••"
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="new_password" className="label">New Password</label>
                        <input
                            id="new_password"
                            type="password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            placeholder="••••••••"
                            className="input"
                            required
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm_password" className="label">Confirm New Password</label>
                        <input
                            id="confirm_password"
                            type="password"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                            placeholder="••••••••"
                            className="input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isUpdatingPassword ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Update Password
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Account Info */}
            <div className="card bg-dark-800/50">
                <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-dark-400">Account Status</span>
                        <span className={user?.is_active ? 'text-green-400' : 'text-red-400'}>
                            {user?.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-dark-400">Email Verified</span>
                        <span className={user?.is_verified ? 'text-green-400' : 'text-yellow-400'}>
                            {user?.is_verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-dark-400">2FA Status</span>
                        <span className={user?.totp_enabled ? 'text-green-400' : 'text-dark-500'}>
                            {user?.totp_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-dark-400">Member Since</span>
                        <span className="text-white">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2FA Modal */}
            {show2FAModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {user?.totp_enabled ? 'Disable' : 'Enable'} 2FA
                        </h3>
                        <p className="text-dark-400 text-sm mb-4">
                            Enter the verification code sent to your email
                        </p>

                        <input
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            placeholder="000000"
                            maxLength={6}
                            className="input text-center text-2xl tracking-widest mb-4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShow2FAModal(false); setOtpCode(''); }}
                                className="flex-1 py-2.5 rounded-xl border border-dark-600 text-dark-300 hover:bg-dark-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirm2FA}
                                disabled={otpCode.length !== 6 || is2FALoading}
                                className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {is2FALoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
