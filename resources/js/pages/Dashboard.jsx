import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import BentoCard from '@/components/BentoCard';
import {
    BookOpen,
    Layers,
    ArrowLeftRight,
    Users,
    Clock,
    PlusCircle,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    BookMarked,
    Sparkles,
} from 'lucide-react';

export default function Dashboard({
    stats = {
        total_buku: 0,
        total_stok: 0,
        peminjaman_aktif: 0,
        total_anggota: 0,
        total_petugas: 0,
    },
    transaksi_terbaru = [],
    buku_stok_menipis = [],
    user_stats = null,
}) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const role = user.role || 'anggota';

    const statusBadge = (status) => {
        const badges = {
            dipinjam: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-400',
            dikembalikan: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400',
            terlambat: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-400',
            hilang: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
        };

        const labels = {
            dipinjam: 'Dipinjam',
            dikembalikan: 'Dikembalikan',
            terlambat: 'Terlambat',
            hilang: 'Hilang',
        };

        return (
            <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Dashboard Perpustakaan
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Selamat datang kembali, {user.name}! Pantau aktivitas sirkulasi dan koleksi buku.
                    </p>
                </div>
            }
        >
            <Head title="Dashboard - SiPustaka" />

            <div className="space-y-6">
                {/* Bento Banner Welcome */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-blue-700 to-sky-600 p-8 text-white shadow-lg shadow-blue-500/10">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5" />
                            SiPustaka Smart Library System
                        </span>
                        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                            Halo, {user.name} ({role}) 👋
                        </h1>
                        <p className="mt-2 text-sm text-blue-100">
                            {role === 'anggota'
                                ? 'Temukan koleksi buku menarik dan pantau status peminjaman buku Anda secara real-time.'
                                : 'Kelola katalog buku, sirkulasi peminjaman, dan anggota perpustakaan dengan cepat dan efisien.'}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <Link
                                href="/bukus"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition-transform duration-200 hover:scale-102 hover:bg-blue-50"
                            >
                                <BookOpen className="h-4 w-4" />
                                Jelajahi Buku
                            </Link>
                            {role !== 'anggota' ? (
                                <Link
                                    href="/bukus/create"
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-800/80 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-900"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Tambah Buku Baru
                                </Link>
                            ) : (
                                <Link
                                    href="/peminjamen"
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-800/80 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-900"
                                >
                                    <BookMarked className="h-4 w-4" />
                                    Buku Saya
                                </Link>
                            )}
                        </div>
                    </div>
                    {/* Decorative Background Blob */}
                    <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                </div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <BentoCard
                        title="Total Judul Buku"
                        value={stats.total_buku}
                        subtitle="Koleksi judul terdaftar"
                        icon={BookOpen}
                        badgeColor="blue"
                    />
                    <BentoCard
                        title="Total Stok Koleksi"
                        value={stats.total_stok}
                        subtitle="Eksemplar fisik tersedia"
                        icon={Layers}
                        badgeColor="slate"
                    />
                    <BentoCard
                        title="Peminjaman Aktif"
                        value={stats.peminjaman_aktif}
                        subtitle="Buku sedang dipinjam"
                        icon={ArrowLeftRight}
                        badgeColor="rose"
                    />
                    <BentoCard
                        title="Total Anggota"
                        value={stats.total_anggota}
                        subtitle="Member aktif terdaftar"
                        icon={Users}
                        badgeColor="emerald"
                    />
                </div>

                {/* Anggota Specific Stats (If Member) */}
                {role === 'anggota' && user_stats && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <BentoCard
                            title="Sedang Anda Pinjam"
                            value={user_stats.aktif}
                            subtitle="Harap dikembalikan tepat waktu"
                            icon={BookMarked}
                            badgeColor="blue"
                        />
                        <BentoCard
                            title="Telah Dikembalikan"
                            value={user_stats.dikembalikan}
                            subtitle="Total buku yang telah Anda baca"
                            icon={CheckCircle2}
                            badgeColor="emerald"
                        />
                        <BentoCard
                            title="Keterlambatan"
                            value={user_stats.terlambat}
                            subtitle="Catatan keterlambatan pengembalian"
                            icon={AlertCircle}
                            badgeColor="rose"
                        />
                    </div>
                )}

                {/* Bento Content Grid: 2 Columns */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column (2 Cols): Transaksi Terbaru */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Transaksi Sirkulasi Terbaru
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Aktivitas peminjaman dan pengembalian mutakhir
                                    </p>
                                </div>
                                <Link
                                    href="/peminjamen"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
                                >
                                    Lihat Semua
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {transaksi_terbaru.length > 0 ? (
                                    transaksi_terbaru.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {item.buku?.judul || 'Buku'}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Peminjam:{' '}
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {item.user?.name || '-'}
                                                        </span>{' '}
                                                        &bull; Pinjam: {item.tanggal_pinjam}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {statusBadge(item.status)}
                                                <Link
                                                    href={`/peminjamen/${item.id}`}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                                    title="Lihat Detail"
                                                >
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-8 text-center text-xs text-slate-400">
                                        Belum ada riwayat transaksi sirkulasi.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1 Col): Peringatan Stok Menipis & Quick Actions */}
                    <div className="space-y-6">
                        {/* Peringatan Stok Menipis */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Stok Buku Menipis
                                </h3>
                                <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                    Perlu Restok
                                </span>
                            </div>

                            <div className="space-y-3">
                                {buku_stok_menipis.length > 0 ? (
                                    buku_stok_menipis.map((buku) => (
                                        <div
                                            key={buku.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                                        >
                                            <div className="min-w-0 pr-3">
                                                <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                    {buku.judul}
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    {buku.kategori}
                                                </p>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                                                    buku.stok === 0
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                                                }`}
                                            >
                                                Sisa: {buku.stok}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-xs text-slate-400">
                                        Semua stok buku aman.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Bento Quick Shortcuts */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
                                Aksi Cepat
                            </h3>
                            <div className="space-y-2.5">
                                <Link
                                    href="/peminjamen/create"
                                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <PlusCircle className="h-4 w-4 text-blue-600" />
                                        Pinjam / Transaksi Baru
                                    </span>
                                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                </Link>

                                {role !== 'anggota' && (
                                    <Link
                                        href="/bukus/create"
                                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <BookOpen className="h-4 w-4 text-blue-600" />
                                            Input Data Buku Baru
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                    </Link>
                                )}

                                {role === 'admin' && (
                                    <Link
                                        href="/usermanagements"
                                        className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Users className="h-4 w-4 text-rose-500" />
                                            Kelola Akun Anggota & Petugas
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
