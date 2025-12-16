'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api, { getErrorMessage } from '@/lib/api';
import {
    User as UserIcon, Mail, Lock, Loader2, Save,
    X, Camera, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Google icon SVG component
const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
);

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, refreshUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 5MB.');
            return;
        }

        setIsUploadingAvatar(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            await api.post('/users/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            await refreshUser();
            toast.success('Avatar updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsUploadingAvatar(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!isOpen) return null;

    const isGoogleUser = user?.auth_provider === 'google';

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
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'profile'
                            ? 'text-primary-400 border-b-2 border-primary-400'
                            : 'text-dark-400 hover:text-white'
                            }`}
                    >
                        <UserIcon className="w-4 h-4 inline-block mr-2" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'security'
                            ? 'text-primary-400 border-b-2 border-primary-400'
                            : 'text-dark-400 hover:text-white'
                            }`}
                    >
                        <Lock className="w-4 h-4 inline-block mr-2" />
                        Security
                    </button>
                </div>

                <div className="p-5 overflow-y-auto max-h-[60vh]">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-800 border-2 border-dark-600">
                                        {user?.avatar_url ? (
                                            <Image
                                                src={user.avatar_url}
                                                alt={user.full_name || user.username}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent">
                                                <span className="text-3xl font-bold text-white">
                                                    {(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Google badge if signed in with Google */}
                                    {isGoogleUser && (
                                        <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg border border-gray-200" title="Signed in with Google">
                                            <GoogleIcon />
                                        </div>
                                    )}

                                    {/* Upload button for non-Google users or to change avatar */}
                                    {!isGoogleUser && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploadingAvatar}
                                            className="absolute -bottom-1 -right-1 p-2 bg-primary-500 rounded-full shadow-lg hover:bg-primary-400 transition-colors disabled:opacity-50"
                                            title="Upload photo"
                                        >
                                            {isUploadingAvatar ? (
                                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                                            ) : (
                                                <Camera className="w-4 h-4 text-white" />
                                            )}
                                        </button>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </div>

                                <p className="mt-3 text-lg font-medium text-white">{user?.full_name || user?.username}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm text-dark-400">{user?.email}</p>
                                    {isGoogleUser && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-dark-800 rounded-full text-xs text-dark-300">
                                            <GoogleIcon />
                                            Google
                                        </span>
                                    )}
                                </div>

                                {!isGoogleUser && !user?.avatar_url && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploadingAvatar}
                                        className="mt-3 px-4 py-2 text-sm text-primary-400 hover:text-primary-300 flex items-center gap-2 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload profile photo
                                    </button>
                                )}
                            </div>

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
                                        <span className="text-dark-400">Sign-in Method</span>
                                        <span className="text-white flex items-center gap-1">
                                            {isGoogleUser ? (
                                                <>
                                                    <GoogleIcon />
                                                    Google
                                                </>
                                            ) : (
                                                'Email & Password'
                                            )}
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
                            {isGoogleUser ? (
                                <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-white rounded-lg">
                                            <GoogleIcon />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-white">Google Account</h3>
                                            <p className="text-xs text-dark-400">Your account is secured by Google</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-dark-400">
                                        You signed in with Google. To change your password or security settings,
                                        please visit your <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Google Account settings</a>.
                                    </p>
                                </div>
                            ) : (
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
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

