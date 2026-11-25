import { Link } from '@inertiajs/react';
import { Library } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50/70 p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                    <div className="flex flex-col items-center text-center gap-2">
                        <Link
                            href={home()}
                            className="flex items-center gap-3 font-bold group mb-2"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                                <Library className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <span className="block text-xl font-black tracking-tight text-slate-900 leading-none">
                                    SiPustaka
                                </span>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mt-1">
                                    Smart Library System
                                </span>
                            </div>
                        </Link>

                        <div className="space-y-1 mt-1">
                            <h1 className="text-xl font-black tracking-tight text-slate-900">{title}</h1>
                            {description && (
                                <p className="text-xs text-slate-500">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} SiPustaka. All rights reserved.
                </p>
            </div>
        </div>
    );
}
