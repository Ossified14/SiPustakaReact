import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ArrowLeft, User, Mail, ShieldCheck, BookOpen, Clock, Calendar, Edit } from 'lucide-react';

export default function Show({ user }) {
    const roleBadge = (role) => {
        const badges = {
            admin: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-400',
            petugas: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-400',
            anggota: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400',
        };

        return (
            <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    badges[role] || 'bg-slate-100 text-slate-700'
                }`}
            >
                {role}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href="/usermanagements"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Profil Pengguna
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Informasi akun pengguna dan riwayat transaksi peminjaman
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Pengguna - ${user.name}`} />

            <div className="max-w-4xl space-y-6">
                {/* User Capsule Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-md">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                        {user.name}
                                    </h3>
                                    {roleBadge(user.role)}
                                </div>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {user.email} &bull; Terdaftar sejak {new Date(user.created_at).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={`/usermanagements/${user.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <Edit className="h-4 w-4 text-slate-400" />
                            Edit Pengguna
                        </Link>
                    </div>
                </div>

                {/* User's Loans History */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                        Riwayat Peminjaman Buku ({user.peminjamans?.length || 0})
                    </h3>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {user.peminjamans && user.peminjamans.length > 0 ? (
                            user.peminjamans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between text-xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {loan.buku?.judul || 'Buku'}
                                            </span>
                                            <p className="text-[11px] text-slate-400">
                                                Pinjam: {loan.tanggal_pinjam} &bull; Batas: {loan.tanggal_kembali}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                loan.status === 'dikembalikan'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : loan.status === 'dipinjam'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-rose-50 text-rose-700'
                                            }`}
                                        >
                                            {loan.status}
                                        </span>
                                        <Link
                                            href={`/peminjamen/${loan.id}`}
                                            className="text-xs font-bold text-blue-600 hover:underline"
                                        >
                                            Detail &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-center text-xs text-slate-400">
                                Pengguna ini belum memiliki riwayat peminjaman buku.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
