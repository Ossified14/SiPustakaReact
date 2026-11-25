import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    BookOpen,
    Edit,
    Calendar,
    Building2,
    User,
    Tag,
    Layers,
    Clock,
    PlusCircle,
} from 'lucide-react';

export default function Show({ buku }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const canManage = user.role === 'admin' || user.role === 'petugas';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href="/bukus"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Detail Buku
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Informasi lengkap buku & riwayat sirkulasi
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`${buku.judul} - SiPustaka`} />

            <div className="space-y-6 max-w-5xl">
                {/* Book Header Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start">
                        {/* Book Cover */}
                        <div className="flex shrink-0 justify-center">
                            <div className="h-64 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-800">
                                {buku.cover_url ? (
                                    <img
                                        src={buku.cover_url}
                                        alt={buku.judul}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Book Metadata */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                                    <Tag className="h-3.5 w-3.5" />
                                    {buku.kategori}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${
                                        buku.stok > 0
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                                    }`}
                                >
                                    {buku.stok > 0 ? `Tersedia ${buku.stok} Eksemplar` : 'Stok Habis'}
                                </span>
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                                {buku.judul}
                            </h1>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-1 gap-3 border-y border-slate-100 py-4 sm:grid-cols-3 dark:border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <div>
                                        <span className="block text-[10px] text-slate-400">Penulis</span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {buku.penulis}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <div>
                                        <span className="block text-[10px] text-slate-400">Penerbit</span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {buku.penerbit}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <div>
                                        <span className="block text-[10px] text-slate-400">Tahun Terbit</span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {buku.tahun_terbit}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Synopsis / Description */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Deskripsi & Sinopsis
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                    {buku.deskripsi || 'Tidak ada deskripsi tambahan untuk buku ini.'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-4">
                                {buku.stok > 0 && (
                                    <Link
                                        href={`/peminjamen/create?buku_id=${buku.id}`}
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-transform duration-200 hover:scale-102 hover:bg-blue-700"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Pinjam Buku Ini
                                    </Link>
                                )}

                                {canManage && (
                                    <Link
                                        href={`/bukus/${buku.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <Edit className="h-4 w-4 text-slate-400" />
                                        Edit Data Buku
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Loans for this Book */}
                {buku.peminjamans && buku.peminjamans.length > 0 && (
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                        <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                            Riwayat Sirkulasi Buku Ini
                        </h3>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {buku.peminjamans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex items-center justify-between py-3 text-xs"
                                >
                                    <div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {loan.user?.name || 'Anggota'}
                                        </span>
                                        <p className="text-[11px] text-slate-400">
                                            Pinjam: {loan.tanggal_pinjam} &bull; Batas: {loan.tanggal_kembali}
                                        </p>
                                    </div>
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
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
