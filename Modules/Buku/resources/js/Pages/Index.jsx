import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import DataTable from '@/components/DataTable';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import {
    BookOpen,
    Plus,
    Eye,
    Edit,
    Trash2,
    Filter,
    Layers,
    Image as ImageIcon,
} from 'lucide-react';

export default function Index({ bukus, filters, categories = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const canManage = user.role === 'admin' || user.role === 'petugas';

    const [selectedKategori, setSelectedKategori] = useState(filters?.kategori || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [bukuToDelete, setBukuToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleKategoriChange = (cat) => {
        setSelectedKategori(cat);
        router.get(
            '/bukus',
            {
                search: filters?.search || '',
                kategori: cat,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (term) => {
        router.get(
            '/bukus',
            {
                search: term,
                kategori: selectedKategori,
            },
            { preserveState: true, replace: true }
        );
    };

    const confirmDelete = (buku) => {
        setBukuToDelete(buku);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!bukuToDelete) return;
        setIsDeleting(true);
        router.delete(`/bukus/${bukuToDelete.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setBukuToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const columns = [
        {
            key: 'cover',
            label: 'Cover',
            className: 'w-16',
            render: (row) => (
                <div className="flex h-14 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs dark:border-slate-800 dark:bg-slate-800">
                    {row.cover_url ? (
                        <img
                            src={row.cover_url}
                            alt={row.judul}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                    )}
                </div>
            ),
        },
        {
            key: 'judul',
            label: 'Judul & Penulis',
            render: (row) => (
                <div>
                    <Link
                        href={`/bukus/${row.id}`}
                        className="font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                    >
                        {row.judul}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {row.penulis} &bull; {row.penerbit} ({row.tahun_terbit})
                    </p>
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (row) => (
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/70 dark:text-blue-400">
                    {row.kategori}
                </span>
            ),
        },
        {
            key: 'stok',
            label: 'Stok',
            className: 'text-center w-24',
            render: (row) => (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        row.stok > 3
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : row.stok > 0
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                >
                    {row.stok > 0 ? `${row.stok} eks` : 'Habis'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            className: 'text-right w-36',
            render: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Link
                        href={`/bukus/${row.id}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                        title="Lihat Detail"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    {canManage && (
                        <>
                            <Link
                                href={`/bukus/${row.id}/edit`}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800 dark:hover:text-amber-400"
                                title="Edit Buku"
                            >
                                <Edit className="h-4 w-4" />
                            </Link>
                            <button
                                type="button"
                                onClick={() => confirmDelete(row)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                title="Hapus Buku"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Katalog Buku
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kelola dan jelajahi seluruh koleksi buku perpustakaan
                    </p>
                </div>
            }
        >
            <Head title="Katalog Buku - SiPustaka" />

            <div className="space-y-6">
                <DataTable
                    columns={columns}
                    data={bukus}
                    searchPlaceholder="Cari judul, penulis, penerbit..."
                    searchValue={filters?.search || ''}
                    onSearch={handleSearch}
                    filters={
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedKategori}
                                onChange={(e) => handleKategoriChange(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-700 shadow-2xs transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                    actions={
                        canManage ? (
                            <Link
                                href="/bukus/create"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Buku
                            </Link>
                        ) : null
                    }
                    emptyMessage="Tidak ada data buku yang sesuai dengan pencarian."
                />
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Hapus Data Buku"
                message={`Apakah Anda yakin ingin menghapus buku "${bukuToDelete?.judul}"? Seluruh data yang berkaitan akan terhapus.`}
            />
        </AuthenticatedLayout>
    );
}
