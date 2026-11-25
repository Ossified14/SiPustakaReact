import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Library,
    BookOpen,
    ArrowRight,
    Users,
    Layers,
    ShieldCheck,
    Search,
    Sparkles,
    CheckCircle2,
    Clock,
    FileText,
    ArrowLeftRight,
    Building2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    BookmarkCheck,
    Laptop,
    HelpCircle,
} from 'lucide-react';

interface BookItem {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    kategori: string;
    stok: number;
    cover_url?: string | null;
}

interface WelcomeProps {
    featured_books?: BookItem[];
    stats?: {
        total_buku: number;
        total_stok: number;
        total_anggota: number;
    };
}

export default function Welcome({
    featured_books = [],
    stats = { total_buku: 0, total_stok: 0, total_anggota: 0 },
}: WelcomeProps) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [searchTerm, setSearchTerm] = useState('');

    const services = [
        {
            icon: BookOpen,
            title: 'Katalog Koleksi Lengkap',
            desc: 'Akses penelusuran ribuan buku fisik, literatur ilmiah, buku teks, dan karya sastra terkurasi.',
        },
        {
            icon: ArrowLeftRight,
            title: 'Sirkulasi Mandiri Terpadu',
            desc: 'Peminjaman dan pengembalian buku dengan pelacakan status dan konfirmasi otomatis tanpa antrean panjang.',
        },
        {
            icon: Laptop,
            title: 'Portal Digital 24 Jam',
            desc: 'Cek ketersediaan buku di rak dan riwayat peminjaman kapan saja melalui perangkat ponsel atau komputer.',
        },
        {
            icon: ShieldCheck,
            title: 'Keanggotaan Terintegrasi',
            desc: 'Satu akun anggota untuk mengakses seluruh fasilitas ruang baca, reservasi buku, dan layanan referensi.',
        },
    ];

    const operatingHours = [
        { day: 'Senin - Kamis', hours: '08:00 - 16:30 WIB' },
        { day: 'Jumat', hours: '08:00 - 16:00 WIB (Istirahat 11:30 - 13:00)' },
        { day: 'Sabtu', hours: '08:30 - 13:00 WIB' },
        { day: 'Minggu & Hari Libur Nasional', hours: 'Tutup (Layanan Digital Tetap Buka)' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
            <Head title="Portal Resmi Perpustakaan SiPustaka" />

            {/* Top Bar Informasi */}
            <div className="border-b border-slate-200/60 bg-white/60 px-4 py-2 text-xs text-slate-500 hidden sm:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                            Jam Layanan: Senin - Jumat (08:00 - 16:30 WIB)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-blue-600" />
                            Gedung Perpustakaan Pusat Lt. 1-3
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            (021) 555-0192
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            layanan@sipustaka.id
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Header / Navbar */}
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-8">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3.5 group">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                            <Library className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-slate-900">
                                SiPustaka
                            </span>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                Perpustakaan Terpadu
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-8 md:flex text-xs font-bold text-slate-600">
                        <a href="#koleksi" className="transition-colors hover:text-blue-600">
                            Koleksi Buku
                        </a>
                        <a href="#layanan" className="transition-colors hover:text-blue-600">
                            Layanan
                        </a>
                        <a href="#jadwal" className="transition-colors hover:text-blue-600">
                            Jam Layanan
                        </a>
                        <a href="#kontak" className="transition-colors hover:text-blue-600">
                            Pusat Bantuan
                        </a>
                    </nav>

                    {/* Auth CTA */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-transform duration-200 hover:scale-102 hover:bg-blue-700"
                            >
                                Dashboard Layanan
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                                >
                                    Masuk Anggota
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition-transform duration-200 hover:scale-102 hover:bg-blue-700"
                                >
                                    Daftar Anggota
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 sm:py-24">
                <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl" />
                <div className="pointer-events-none absolute top-48 right-10 -z-10 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            Portal Resmi Layanan Perpustakaan Digital
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl sm:leading-tight">
                            Pusat Akses Literatur, Pengetahuan &{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600">
                                Riset Ilmiah Terpadu
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            SiPustaka memfasilitasi pencarian katalog buku, manajemen sirkulasi peminjaman mandiri, dan reservasi koleksi secara cepat, nyaman, dan transparan bagi seluruh anggota.
                        </p>

                        {/* Search Simulation Bar */}
                        <div className="mx-auto max-w-xl pt-2">
                            <div className="relative flex items-center rounded-2xl border border-slate-200/90 bg-white p-2 shadow-lg shadow-slate-200/40">
                                <Search className="ml-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari judul buku, nama pengarang, atau disiplin ilmu..."
                                    className="w-full border-0 bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                                <Link
                                    href={user ? `/bukus?search=${encodeURIComponent(searchTerm)}` : `/login`}
                                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                                >
                                    Cari Koleksi
                                </Link>
                            </div>
                        </div>

                        {/* Quick Stats Banner */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/60 max-w-lg mx-auto text-center">
                            <div>
                                <span className="block text-2xl font-black text-slate-900">
                                    {stats.total_buku || '2,400+'}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                    Judul Buku Terdaftar
                                </span>
                            </div>
                            <div>
                                <span className="block text-2xl font-black text-slate-900">
                                    {stats.total_stok || '10,000+'}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                    Eksemplar Fisik
                                </span>
                            </div>
                            <div>
                                <span className="block text-2xl font-black text-slate-900">
                                    {stats.total_anggota || '1,850+'}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                    Anggota Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Showcase */}
            <section id="koleksi" className="py-14 bg-white/70 border-y border-slate-200/70">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Katalog Terpilih
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                Koleksi Unggulan Perpustakaan
                            </h2>
                        </div>
                        <Link
                            href={user ? '/bukus' : '/login'}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Lihat Seluruh Katalog
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* Books Bento Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {featured_books.slice(0, 6).map((book) => (
                            <div
                                key={book.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="flex gap-4">
                                    <div className="flex h-24 w-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 border border-slate-200 shadow-2xs">
                                        <BookOpen className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                            {book.kategori}
                                        </span>
                                        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {book.judul}
                                        </h3>
                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {book.penulis}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                                    <span className="text-[11px] text-slate-500">
                                        Penerbit: <span className="font-semibold text-slate-700">{book.penerbit}</span>
                                    </span>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                            book.stok > 0
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-rose-50 text-rose-700'
                                        }`}
                                    >
                                        {book.stok > 0 ? `Tersedia (${book.stok})` : 'Habis'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="layanan" className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Fasilitas Perpustakaan
                        </span>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Layanan Sirkulasi & Literasi
                        </h2>
                        <p className="text-xs text-slate-500">
                            Kemudahan fasilitas fisik dan digital yang dirancang untuk mendukung riset dan pembelajaran Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-slate-500">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Operating Hours & Rules Section */}
            <section id="jadwal" className="py-14 bg-white/70 border-y border-slate-200/70">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Jam Operasional
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl mt-1 mb-4">
                                Waktu Kunjungan & Layanan Fisik
                            </h2>
                            <p className="text-xs leading-relaxed text-slate-600 mb-6">
                                Perpustakaan melayani peminjaman langsung, pengembalian buku, dan ruang baca mandiri sesuai jadwal resmi berikut. Layanan pencarian katalog daring dapat diakses sepanjang waktu (24/7).
                            </p>

                            <div className="space-y-3">
                                {operatingHours.map((schedule, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 px-4 shadow-2xs text-xs"
                                    >
                                        <span className="font-bold text-slate-800">{schedule.day}</span>
                                        <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                                            {schedule.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rules / Guidance Bento */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-5">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <BookmarkCheck className="h-5 w-5 text-blue-600" />
                                Ketentuan Peminjaman Anggota
                            </h3>
                            <ul className="space-y-3 text-xs text-slate-600">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Setiap anggota aktif berhak meminjam hingga <strong>3 (tiga) judul buku</strong> secara bersamaan.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Masa peminjaman standar adalah <strong>7 (tujuh) hari kalender</strong> dan dapat diperpanjang bila tidak ada antrean reservasi.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Pengembalian melewati tenggat waktu dikenakan denda administrasi pemeliharaan buku sebesar <strong>Rp 1.000 / hari</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Harap menjaga keutuhan fisik buku dan membawa kartu anggota saat mengambil buku di loket sirkulasi.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help / Contact Section */}
            <section id="kontak" className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-blue-700 to-sky-600 p-8 text-white shadow-xl shadow-blue-500/15 sm:p-12">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                    <HelpCircle className="h-3.5 w-3.5" />
                                    Pusat Informasi & Bantuan
                                </span>
                                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                                    Butuh Bantuan atau Informasi Koleksi?
                                </h2>
                                <p className="text-xs text-blue-100 sm:text-sm leading-relaxed">
                                    Pustakawan kami siap membantu Anda dalam penelusuran referensi, pembaruan data keanggotaan, atau pertanyaan seputar fasilitas perpustakaan.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto text-center rounded-2xl bg-white px-7 py-3.5 text-xs font-bold text-blue-700 shadow-sm transition-transform duration-200 hover:scale-102 hover:bg-blue-50"
                                >
                                    Masuk ke Portal Anggota
                                </Link>
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto text-center rounded-2xl bg-blue-900/80 px-7 py-3.5 text-xs font-bold text-white transition-colors hover:bg-blue-950"
                                >
                                    Pendaftaran Anggota
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 bg-white py-10 text-xs text-slate-500">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 font-bold text-slate-900">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <Library className="h-4 w-4" />
                            </div>
                            <span className="text-base font-black">SiPustaka</span>
                            <span className="text-slate-400 font-normal">| Perpustakaan Digital Terpadu</span>
                        </div>

                        <div className="flex items-center gap-6 text-slate-600">
                            <a href="#koleksi" className="hover:text-blue-600">Koleksi</a>
                            <a href="#layanan" className="hover:text-blue-600">Layanan</a>
                            <a href="#jadwal" className="hover:text-blue-600">Jam Operasional</a>
                            <Link href="/login" className="hover:text-blue-600">Portal Anggota</Link>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
                        <p>&copy; {new Date().getFullYear()} SiPustaka. Seluruh hak cipta dilindungi.</p>
                        <p>Sistem Layanan Perpustakaan Publik & Akademik Terakreditasi.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
