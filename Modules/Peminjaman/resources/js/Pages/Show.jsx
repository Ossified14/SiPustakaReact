import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    BookOpen,
    User,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    RotateCcw,
    Edit,
    CheckCircle2,
} from 'lucide-react';

export default function Show({ peminjaman }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const canManage = user.role === 'admin' || user.role === 'petugas';
    const [isReturning, setIsReturning] = useState(false);

    const handleKembalikan = () => {
        setIsReturning(true);
        router.post(
            `/peminjamen/${peminjaman.id}/kembalikan`,
            {},
            {
                onFinish: () => setIsReturning(false),
            }
        );
    };

    const statusBadge = (status) => {
        const badges = {
            dipinjam: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-400',
            dikembalikan: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400',
            terlambat: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-400',
            hilang: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
        };

        const labels = {
            dipinjam: 'Sedang Dipinjam',
            dikembalikan: 'Sudah Dikembalikan',
            terlambat: 'Terlambat Dikembalikan',
            hilang: 'Buku Dinyatakan Hilang',
        };

        return (
            <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    badges[status] || badges.dipinjam
                }`}
            >
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href="/peminjamen"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Detail Transaksi Peminjaman #{peminjaman.id}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Informasi bukti transaksi sirkulasi buku
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Peminjaman #${peminjaman.id} - SiPustaka`} />

            <div className="max-w-4xl space-y-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    {/* Header Status */}
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Nomor Transaksi
                            </span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                TRX-PMJ-{peminjaman.id.toString().padStart(5, '0')}
                            </h3>
                        </div>
                        <div className="flex items-center gap-3">
                            {statusBadge(peminjaman.status)}
                        </div>
                    </div>

                    {/* Book & User Summary Bento */}
                    <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
                        {/* Book Bento */}
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-800/40">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                                Informasi Buku
                            </div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                {peminjaman.buku?.judul}
                            </h4>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Penulis: <span className="font-semibold text-slate-700 dark:text-slate-200">{peminjaman.buku?.penulis}</span>
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Penerbit: {peminjaman.buku?.penerbit} &bull; Kategori: {peminjaman.buku?.kategori}
                            </p>
                            <div className="mt-3">
                                <Link
                                    href={`/bukus/${peminjaman.buku?.id}`}
                                    className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Lihat Katalog Buku &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* User Bento */}
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-800/40">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                <User className="h-4 w-4 text-blue-600" />
                                Informasi Anggota
                            </div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                {peminjaman.user?.name}
                            </h4>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Email: <span className="font-semibold text-slate-700 dark:text-slate-200">{peminjaman.user?.email}</span>
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Role: <span className="capitalize font-semibold text-slate-700 dark:text-slate-200">{peminjaman.user?.role}</span>
                            </p>
                        </div>
                    </div>

                    {/* Timeline & Dates */}
                    <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3 dark:border-slate-800 text-xs">
                        <div>
                            <span className="block text-slate-400">Tanggal Peminjaman</span>
                            <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">
                                {peminjaman.tanggal_pinjam}
                            </span>
                        </div>
                        <div>
                            <span className="block text-slate-400">Batas Tanggal Kembali</span>
                            <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">
                                {peminjaman.tanggal_kembali}
                            </span>
                        </div>
                        <div>
                            <span className="block text-slate-400">Tanggal Dikembalikan</span>
                            <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">
                                {peminjaman.tanggal_pengembalian || '- (Belum dikembalikan)'}
                            </span>
                        </div>
                    </div>

                    {/* Denda & Catatan */}
                    <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/30 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                Total Denda / Denda Keterlambatan:
                            </span>
                            <span className={`text-sm font-black ${peminjaman.denda > 0 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
                                Rp {Number(peminjaman.denda || 0).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">Catatan:</span>
                            <p className="mt-1 text-slate-600 dark:text-slate-400">
                                {peminjaman.catatan || 'Tidak ada catatan.'}
                            </p>
                        </div>
                    </div>

                    {/* Bukti Attachment Preview */}
                    {peminjaman.bukti_url && (
                        <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Lampiran Bukti Transaksi
                            </h4>
                            <div className="flex items-center gap-4">
                                <a
                                    href={peminjaman.bukti_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/80 dark:text-blue-300"
                                >
                                    <FileText className="h-4 w-4" />
                                    Buka / Unduh Berkas Lampiran
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                        {canManage && peminjaman.status === 'dipinjam' && (
                            <button
                                type="button"
                                onClick={handleKembalikan}
                                disabled={isReturning}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
                            >
                                <RotateCcw className={`h-4 w-4 ${isReturning ? 'animate-spin' : ''}`} />
                                Kembalikan Buku Sekarang
                            </button>
                        )}

                        {canManage && (
                            <Link
                                href={`/peminjamen/${peminjaman.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Edit className="h-4 w-4 text-slate-400" />
                                Edit Data / Status
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
