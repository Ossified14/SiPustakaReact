import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ArrowLeft, Loader2, ArrowLeftRight, Upload, BookOpen } from 'lucide-react';

export default function Create({ availableBooks = [], users = [] }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || {};
    const canManage = currentUser.role === 'admin' || currentUser.role === 'petugas';

    const urlParams = new URLSearchParams(window.location.search);
    const initialBukuId = urlParams.get('buku_id') || availableBooks[0]?.id || '';

    const { data, setData, post, processing, errors } = useForm({
        user_id: canManage ? (users[0]?.id || '') : currentUser.id,
        buku_id: initialBukuId,
        tanggal_pinjam: new Date().toISOString().split('T')[0],
        tanggal_kembali: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        catatan: '',
        bukti: null,
    });

    const [buktiPreview, setBuktiPreview] = useState(null);

    const handleBuktiChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('bukti', file);
            if (file.type.startsWith('image/')) {
                setBuktiPreview(URL.createObjectURL(file));
            } else {
                setBuktiPreview(null);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/peminjamen', {
            forceFormData: true,
        });
    };

    const selectedBook = availableBooks.find((b) => String(b.id) === String(data.buku_id));

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
                            Formulir Peminjaman Buku
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pilih buku dan atur masa tenggat peminjaman
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Formulir Peminjaman - SiPustaka" />

            <div className="max-w-3xl">
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 space-y-6"
                >
                    {/* User Selection if Admin/Petugas */}
                    {canManage && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Anggota Peminjam <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                required
                            >
                                <option value="">-- Pilih Anggota Peminjam --</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email}) - Role: {u.role}
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <p className="mt-1 text-xs text-rose-500">{errors.user_id}</p>}
                        </div>
                    )}

                    {/* Book Selection with Live preview */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Pilih Buku yang Ingin Dipinjam <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.buku_id}
                            onChange={(e) => setData('buku_id', e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            required
                        >
                            <option value="">-- Pilih Buku yang Tersedia --</option>
                            {availableBooks.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.judul} (Tersedia: {b.stok} eks) - Penulis: {b.penulis}
                                </option>
                            ))}
                        </select>
                        {errors.buku_id && <p className="mt-1 text-xs text-rose-500">{errors.buku_id}</p>}

                        {selectedBook && (
                            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900/60 dark:bg-blue-950/40">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <div className="text-xs">
                                    <span className="font-bold text-blue-900 dark:text-blue-200">
                                        {selectedBook.judul}
                                    </span>
                                    <p className="text-blue-700/80 dark:text-blue-300">
                                        Stok saat ini: {selectedBook.stok} eksemplar &bull; Stok akan berkurang 1 otomatis setelah transaksi dicatat.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Tanggal Mulai Pinjam <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_pinjam}
                                onChange={(e) => setData('tanggal_pinjam', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                required
                            />
                            {errors.tanggal_pinjam && (
                                <p className="mt-1 text-xs text-rose-500">{errors.tanggal_pinjam}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Batas Akhir Pengembalian <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_kembali}
                                onChange={(e) => setData('tanggal_kembali', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                required
                            />
                            {errors.tanggal_kembali && (
                                <p className="mt-1 text-xs text-rose-500">{errors.tanggal_kembali}</p>
                            )}
                        </div>
                    </div>

                    {/* Bukti Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Lampiran Bukti Peminjaman / Kartu Identitas (Opsional)
                        </label>
                        <div className="mt-1.5 flex items-center gap-4">
                            <input
                                type="file"
                                accept="application/pdf,image/jpeg,image/png"
                                onChange={handleBuktiChange}
                                className="w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {buktiPreview && (
                                <img
                                    src={buktiPreview}
                                    alt="Preview"
                                    className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                                />
                            )}
                        </div>
                        {errors.bukti && <p className="mt-1 text-xs text-rose-500">{errors.bukti}</p>}
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Catatan Peminjaman
                        </label>
                        <textarea
                            rows="3"
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            placeholder="Catatan kondisi buku saat dipinjam atau tujuan peminjaman..."
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href="/peminjamen"
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            Simpan Transaksi Peminjaman
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
