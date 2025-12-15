'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api, { getErrorMessage } from '@/lib/api';
import {
    User as UserIcon, Mail, Lock, Loader2, Save, Shield,
    X, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, refreshUser } = useAuth();

    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [profileData, setProfileData] = useState({
        full_name: '',
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

    useEffect(() => {
        if (user) {
            setProfileData({ full_name: user.full_name || '' });
        }
    }, [user]);

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
                await api.post('/otp/request', { email: user.email, purpose: '2fa' });
                toast.success('Verification code sent to your email');
                setShow2FAModal(true);
            } else {
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-dark-700">
                    <h2 className="text-xl font-semibold text-white">Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex border-b border-dark-700">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'profile'
                                ? 'text-primary-400 border-b-2 border-primary-400'
                                : 'text-dark-400 hover:text-white'
                        }`}
                    >
                        <UserIcon className="w-4 h-4 inline-block mr-2" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'security'
                                ? 'text-primary-400 border-b-2 border-primary-400'
                                : 'text-dark-400 hover:text-white'
                        }`}
                    >
                        <Shield className="w-4 h-4 inline-block mr-2" />
                        Security
                    </button>
                </div>

                <div className="p-5 overflow-y-auto max-h-[60vh]">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="label">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="input pl-12 bg-dark-800/50 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-dark-500 text-xs mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="label">Username</label>
                                    <input
                                        type="text"
                                        value={user?.username || ''}
                                        disabled
                                        className="input bg-dark-800/50 cursor-not-allowed"
                                    />
                                </div>

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
                                    className="btn-primary w-full flex items-center justify-center gap-2"
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

                            <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                                <h3 className="text-sm font-medium text-white mb-3">Account Details</h3>
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
                                        <span className="text-dark-400">Member Since</span>
                                        <span className="text-white">
                                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Two-Factor Authentication</p>
                                        <p className="text-dark-400 text-sm">
                                            Add an extra layer of security
                                        </p>
                                    </div>
                                    <button
                                        onClick={handle2FAToggle}
                                        disabled={is2FALoading}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            user?.totp_enabled
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
                                <div className="flex items-center gap-2 mt-3 text-sm">
                                    <span className="text-dark-400">Status:</span>
                                    <span className={user?.totp_enabled ? 'text-green-400' : 'text-dark-500'}>
                                        {user?.totp_enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary-400" />
                                    Change Password
                                </h3>

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
                                    className="btn-primary w-full flex items-center justify-center gap-2"
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
                    )}
                </div>
            </div>

            {show2FAModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => { setShow2FAModal(false); setOtpCode(''); }} />
                    <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-sm w-full mx-4">
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
