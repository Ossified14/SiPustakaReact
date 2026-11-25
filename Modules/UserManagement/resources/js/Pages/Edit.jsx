import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { ArrowLeft, Loader2, ShieldCheck, User } from 'lucide-react';

export default function Edit({ user, roles = ['admin', 'petugas', 'anggota'] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'anggota',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/usermanagements/${user.id}`);
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
                            Edit Pengguna: {user.name}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Perbarui data profil pengguna atau ubah peran hak akses
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Pengguna - ${user.name}`} />

            <div className="max-w-2xl">
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 space-y-5"
                >
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            required
                        />
                        {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Alamat Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            required
                        />
                        {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Peran Hak Akses (Role) <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            required
                        >
                            <option value="anggota">Anggota (Hanya melihat buku & peminjaman sendiri)</option>
                            <option value="petugas">Petugas (Mengelola katalog buku & sirkulasi)</option>
                            <option value="admin">Administrator (Hak akses penuh & kelola user)</option>
                        </select>
                        {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Kata Sandi Baru (Opsional)
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Biarkan kosong jika tidak ingin mengubah kata sandi"
                            className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href="/usermanagements"
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
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
