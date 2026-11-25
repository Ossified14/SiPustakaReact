import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ArrowLeft, Upload, Loader2, BookOpen } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: new Date().getFullYear(),
        kategori: '',
        stok: 1,
        cover: null,
        deskripsi: '',
    });

    const [coverPreview, setCoverPreview] = useState(null);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cover', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/bukus', {
            forceFormData: true,
        });
    };

    const categoriesList = [
        'Teknologi & Komputer',
        'Sains & Matematika',
        'Sastra & Fiksi',
        'Sejarah & Budaya',
        'Bisnis & Ekonomi',
        'Filsafat & Agama',
        'Seni & Desain',
        'Pengembangan Diri',
    ];

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
                            Tambah Buku Baru
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Masukkan data katalog buku dan unggah cover buku
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Buku Baru - SiPustaka" />

            <div className="max-w-4xl">
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Left Column: Cover Upload & Preview */}
                        <div className="md:col-span-1 space-y-4">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Cover Buku
                            </label>

                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/40">
                                {coverPreview ? (
                                    <div className="relative mb-3 h-56 w-36 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                                        <img
                                            src={coverPreview}
                                            alt="Cover Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-44 w-32 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                        <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                    </div>
                                )}

                                <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950/80 dark:text-blue-300">
                                    <Upload className="h-3.5 w-3.5" />
                                    Pilih Gambar
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="mt-2 text-[10px] text-slate-400">
                                    PNG, JPG, atau WEBP hingga 2MB
                                </p>
                            </div>
                            {errors.cover && (
                                <p className="text-xs text-rose-500">{errors.cover}</p>
                            )}
                        </div>

                        {/* Right Column: Book Details */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Judul Buku <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    placeholder="Contoh: Pemrograman Modern dengan React & Laravel"
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                    required
                                />
                                {errors.judul && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.judul}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Penulis <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.penulis}
                                        onChange={(e) => setData('penulis', e.target.value)}
                                        placeholder="Nama penulis"
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                        required
                                    />
                                    {errors.penulis && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.penulis}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Penerbit <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.penerbit}
                                        onChange={(e) => setData('penerbit', e.target.value)}
                                        placeholder="Nama penerbit"
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                        required
                                    />
                                    {errors.penerbit && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.penerbit}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Tahun Terbit <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={data.tahun_terbit}
                                        onChange={(e) => setData('tahun_terbit', parseInt(e.target.value) || '')}
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                        required
                                    />
                                    {errors.tahun_terbit && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.tahun_terbit}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Kategori <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        list="category-suggestions"
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        placeholder="Pilih / ketik kategori"
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                        required
                                    />
                                    <datalist id="category-suggestions">
                                        {categoriesList.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                    {errors.kategori && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.kategori}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Jumlah Stok Fisik <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.stok}
                                        onChange={(e) => setData('stok', parseInt(e.target.value) || 0)}
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                        required
                                    />
                                    {errors.stok && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.stok}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Deskripsi & Sinopsis
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Tulis ringkasan singkat atau sinopsis buku..."
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.deskripsi && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.deskripsi}</p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Link
                                    href="/bukus"
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
                                    Simpan Buku Baru
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
