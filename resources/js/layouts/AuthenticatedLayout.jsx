import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    BookOpen,
    ArrowLeftRight,
    Users,
    LogOut,
    Menu,
    X,
    User,
    Library,
    ChevronDown,
    ShieldCheck,
    Bookmark,
} from 'lucide-react';
import ToastNotification from '@/components/ToastNotification';

export default function AuthenticatedLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const role = user.role || 'anggota';

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            current: pathname.endsWith('/dashboard') || pathname === '/dashboard',
            roles: ['admin', 'petugas', 'anggota'],
        },
        {
            name: 'Katalog Buku',
            href: '/bukus',
            icon: BookOpen,
            current: pathname.includes('/bukus') || pathname.includes('/buku'),
            roles: ['admin', 'petugas', 'anggota'],
        },
        {
            name: 'Peminjaman',
            href: '/peminjamen',
            icon: ArrowLeftRight,
            current: pathname.includes('/peminjamen') || pathname.includes('/peminjaman'),
            roles: ['admin', 'petugas', 'anggota'],
        },
        {
            name: 'Kelola Pengguna',
            href: '/usermanagements',
            icon: Users,
            current: pathname.includes('/usermanagements') || pathname.includes('/user-management'),
            roles: ['admin'],
        },
    ];

    const filteredNavigation = navigation.filter((item) =>
        item.roles.includes(role)
    );

    const roleLabel = {
        admin: 'Administrator',
        petugas: 'Petugas Perpustakaan',
        anggota: 'Anggota Perpustakaan',
    }[role] || 'Anggota';

    const roleBadgeColor = {
        admin: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800',
        petugas: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800',
        anggota: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800',
    }[role] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100">
            <ToastNotification />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white shadow-xs transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand / Logo */}
                <div className="flex h-18 items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                            <Library className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                SiPustaka
                            </span>
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                Smart Library
                            </span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* User Info Capsule */}
                <div className="p-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/40">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/70 dark:text-blue-300">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                {user.name}
                            </p>
                            <span
                                className={`mt-0.5 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleBadgeColor}`}
                            >
                                {role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Menu Utama
                    </p>
                    {filteredNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                                    item.current
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                                }`}
                            >
                                <Icon
                                    className={`h-4.5 w-4.5 transition-colors ${
                                        item.current
                                            ? 'text-white'
                                            : 'text-slate-400 group-hover:text-blue-600 dark:text-slate-400'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer / Logout */}
                <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                        <LogOut className="h-4.5 w-4.5" />
                        Keluar dari Akun
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="lg:pl-72 flex min-h-screen flex-col">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-300"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        {header && <div>{header}</div>}
                    </div>

                    {/* Right User Controls */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-xs">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="hidden text-left sm:block">
                                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                                    {user.name}
                                </span>
                                <span className="block text-[10px] text-slate-400">
                                    {roleLabel}
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {userDropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                onClick={() => setUserDropdownOpen(false)}
                            >
                                <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-[11px] text-slate-400">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="pt-1 space-y-0.5">
                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <User className="h-4 w-4 text-slate-400" />
                                        Profil Pengguna
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                    >
                                        <LogOut className="h-4 w-4 text-rose-500" />
                                        Keluar
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
