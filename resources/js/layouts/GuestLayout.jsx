import React from 'react';
import { Link } from '@inertiajs/react';
import { Library } from 'lucide-react';
import ToastNotification from '@/components/ToastNotification';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/70 p-4 antialiased dark:bg-slate-950">
            <ToastNotification />

            <div className="w-full max-w-md">
                {/* Brand Header */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 hover:scale-105"
                    >
                        <Library className="h-7 w-7" />
                    </Link>
                    <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        SiPustaka
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Sistem Manajemen Perpustakaan Modern & Terintegrasi
                    </p>
                </div>

                {/* Card Container */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {(title || subtitle) && (
                        <div className="mb-6">
                            {title && (
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} SiPustaka. All rights reserved.
                </p>
            </div>
        </div>
    );
}
