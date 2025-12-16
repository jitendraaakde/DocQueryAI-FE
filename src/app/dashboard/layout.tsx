'use client';

import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileModal } from '@/components/ProfileModal';
import {
    FileText, MessageSquare, FolderOpen, Settings, LogOut,
    Menu, X, ChevronRight, Home, Loader2, BarChart3, Folders,
    ChevronDown, Moon, Sun, Bell, History, User
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
    { name: 'Collections', href: '/dashboard/collections', icon: Folders },
    { name: 'Ask AI', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Chat History', href: '/dashboard/chat-history', icon: History },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const NavItem = memo(function NavItem({
    item,
    isActive,
    onClose,
}: {
    item: typeof navigation[0];
    isActive: boolean;
    onClose: () => void;
}) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClose}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/50'}
            `}
        >
            <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary-400' : 'text-dark-500 group-hover:text-white'}`} />
            <span className="flex-1">{item.name}</span>
            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
        </Link>
    );
});

NavItem.displayName = "NavItem";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    const openSidebar = useCallback(() => setSidebarOpen(true), []);
    const toggleProfile = useCallback(() => setProfileOpen(prev => !prev), []);
    const closeProfile = useCallback(() => setProfileOpen(false), []);
    const closeLogoutConfirm = useCallback(() => setShowLogoutConfirm(false), []);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const newValue = !prev;
            document.documentElement.classList.toggle('dark', newValue);
            document.documentElement.classList.toggle('light', !newValue);
            return newValue;
        });
    }, []);

    const handleLogout = useCallback(() => {
        setShowLogoutConfirm(false);
        logout();
        router.push('/');
    }, [logout, router]);

    const confirmLogout = useCallback(() => {
        setShowLogoutConfirm(true);
        setProfileOpen(false);
    }, []);

    const openProfileModal = useCallback(() => {
        setShowProfileModal(true);
        setProfileOpen(false);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const userInitials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.username?.slice(0, 2).toUpperCase() || 'U';

    return (
        <div className="h-screen bg-dark-950 flex overflow-hidden">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 
                transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                h-screen
            `}>
                <div className="flex flex-col h-full max-h-screen">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-5 border-b border-dark-800">
                        <Link href="/dashboard" className="flex items-center">
                            <div className="h-11">
                                <Image
                                    src="/DocQueryAI_logo.png"
                                    alt="DocQuery AI"
                                    width={180}
                                    height={44}
                                    className="h-full w-auto object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden text-dark-400 hover:text-white p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                        {navigation.map((item) => {
                            // Special handling for routes that could conflict
                            // Chat History (/dashboard/chat-history) should not activate when on Ask AI (/dashboard/chat)
                            // Ask AI (/dashboard/chat) should not activate when on Chat History
                            let isActive = false;

                            if (item.href === '/dashboard') {
                                // Dashboard only active on exact match
                                isActive = pathname === '/dashboard';
                            } else if (item.href === '/dashboard/chat') {
                                // Ask AI active only on exact /dashboard/chat or /dashboard/chat?session=xxx
                                isActive = pathname === '/dashboard/chat';
                            } else if (item.href === '/dashboard/chat-history') {
                                // Chat History active only on exact match
                                isActive = pathname === '/dashboard/chat-history';
                            } else {
                                // Other routes use startsWith
                                isActive = pathname.startsWith(item.href);
                            }

                            return (
                                <NavItem
                                    key={item.name}
                                    item={item}
                                    isActive={isActive}
                                    onClose={closeSidebar}
                                />
                            );
                        })}
                    </nav>

                    {/* Bottom User Section - Simplified */}
                    <div className="p-3 border-t border-dark-800">
                        <button
                            onClick={confirmLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                text-dark-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                        >
                            <LogOut className="w-[18px] h-[18px]" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
                {/* Top Bar with Profile */}
                <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800">
                    <div className="flex items-center justify-between px-4 lg:px-6 h-14">
                        {/* Left: Mobile menu + Page title */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={openSidebar}
                                className="lg:hidden text-dark-400 hover:text-white p-1.5 rounded-lg hover:bg-dark-800"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Right: Actions + Profile */}
                        <div className="flex items-center gap-2">

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={toggleProfile}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-dark-800 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white text-sm font-semibold">
                                        {user?.avatar_url ? (
                                            <Image
                                                src={user.avatar_url}
                                                alt={user.full_name || user.username}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            userInitials
                                        )}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-white max-w-[100px] truncate">
                                        {user?.full_name || user?.username}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-xl py-2 z-50">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-dark-700">
                                            <p className="text-sm font-medium text-white truncate">{user?.full_name || user?.username}</p>
                                            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                                        </div>

                                        {/* Links */}
                                        <div className="py-1">
                                            <button
                                                onClick={openProfileModal}
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700/50"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </button>
                                        </div>

                                        {/* Logout */}
                                        <div className="pt-1 border-t border-dark-700">
                                            <button
                                                onClick={confirmLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-400/10"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-y-auto relative">
                    {children}
                </main>
            </div>
            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeLogoutConfirm}
                    />
                    {/* Modal */}
                    <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-7 h-7 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Sign Out?</h3>
                            <p className="text-dark-400 text-sm mb-6">
                                Are you sure you want to sign out of your account?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={closeLogoutConfirm}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 text-dark-300 hover:text-white hover:bg-dark-600 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </div>
    );
}