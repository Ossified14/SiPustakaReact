import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ArrowLeft, Loader2, FileText, Upload } from 'lucide-react';

export default function Edit({ peminjaman }) {
    const { data, setData, processing, errors } = useForm({
        status: peminjaman.status || 'dipinjam',
        tanggal_kembali: peminjaman.tanggal_kembali || '',
        tanggal_pengembalian:
            peminjaman.tanggal_pengembalian ||
            new Date().toISOString().split('T')[0],
        denda: peminjaman.denda ?? 0,
        catatan: peminjaman.catatan || '',
        bukti: null,
        _method: 'PUT',
    });

    const [buktiPreview, setBuktiPreview] = useState(peminjaman.bukti_url || null);

    const handleBuktiChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('bukti', file);
            if (file.type.startsWith('image/')) {
                setBuktiPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/peminjamen/${peminjaman.id}`, data, {
            forceFormData: true,
        });
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
                            Edit Status Peminjaman #{peminjaman.id}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Buku: {peminjaman.buku?.judul} &bull; Peminjam: {peminjaman.user?.name}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Peminjaman #${peminjaman.id} - SiPustaka`} />

            <div className="max-w-3xl">
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 space-y-6"
                >
                    {/* Status Peminjaman */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Status Sirkulasi <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            required
                        >
                            <option value="dipinjam">Dipinjam (Aktif)</option>
                            <option value="dikembalikan">Dikembalikan (Selesai & Tambah Stok)</option>
                            <option value="terlambat">Terlambat</option>
                            <option value="hilang">Buku Hilang</option>
                        </select>
                        {errors.status && <p className="mt-1 text-xs text-rose-500">{errors.status}</p>}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Batas Tanggal Kembali
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_kembali}
                                onChange={(e) => setData('tanggal_kembali', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            />
                            {errors.tanggal_kembali && (
                                <p className="mt-1 text-xs text-rose-500">{errors.tanggal_kembali}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Tanggal Pengembalian Aktual
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_pengembalian}
                                onChange={(e) => setData('tanggal_pengembalian', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            />
                            {errors.tanggal_pengembalian && (
                                <p className="mt-1 text-xs text-rose-500">{errors.tanggal_pengembalian}</p>
                            )}
                        </div>
                    </div>

                    {/* Denda */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Denda Keterlambatan / Kerusakan (Rupiah)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="500"
                            value={data.denda}
                            onChange={(e) => setData('denda', parseInt(e.target.value) || 0)}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        />
                        {errors.denda && <p className="mt-1 text-xs text-rose-500">{errors.denda}</p>}
                    </div>

                    {/* Bukti Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Ganti Lampiran Bukti File (Opsional)
                        </label>
                        <div className="mt-1.5 flex items-center gap-4">
                            <input
                                type="file"
                                accept="application/pdf,image/jpeg,image/png"
                                onChange={handleBuktiChange}
                                className="w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {buktiPreview && (
                                <a
                                    href={buktiPreview}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                >
                                    <FileText className="h-4 w-4" />
                                    Lihat Lampiran
                                </a>
                            )}
                        </div>
                        {errors.bukti && <p className="mt-1 text-xs text-rose-500">{errors.bukti}</p>}
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Catatan Petugas
                        </label>
                        <textarea
                            rows="3"
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            placeholder="Catatan kondisi buku saat dikembalikan atau detail denda..."
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
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
                            Simpan Perubahan Status
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
