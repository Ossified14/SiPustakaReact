import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import DataTable from '@/components/DataTable';
import ModalForm from '@/components/ModalForm';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import {
    ArrowLeftRight,
    Plus,
    Eye,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    FileText,
    AlertCircle,
    RotateCcw,
    Upload,
} from 'lucide-react';

export default function Index({
    peminjamans,
    availableBooks = [],
    users = [],
    filters = {},
}) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const canManage = user.role === 'admin' || user.role === 'petugas';

    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [quickLoanOpen, setQuickLoanOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReturning, setIsReturning] = useState(null);

    // Quick Loan Form
    const { data, setData, post, processing, reset, errors } = useForm({
        user_id: user.role === 'anggota' ? user.id : (users[0]?.id || ''),
        buku_id: availableBooks[0]?.id || '',
        tanggal_pinjam: new Date().toISOString().split('T')[0],
        tanggal_kembali: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        catatan: '',
        bukti: null,
    });

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        router.get(
            '/peminjamen',
            {
                search: filters?.search || '',
                status: status,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (term) => {
        router.get(
            '/peminjamen',
            {
                search: term,
                status: selectedStatus,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleQuickLoanSubmit = () => {
        post('/peminjamen', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setQuickLoanOpen(false);
                reset();
            },
        });
    };

    // Quick interactive return without reload
    const handleKembalikan = (id) => {
        setIsReturning(id);
        router.post(
            `/peminjamen/${id}/kembalikan`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsReturning(null),
            }
        );
    };

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        router.delete(`/peminjamen/${itemToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
        });
    };

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

    const columns = [
        {
            key: 'buku',
            label: 'Buku',
            render: (row) => (
                <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                        {row.buku?.judul || 'Buku tidak ditemukan'}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Penulis: {row.buku?.penulis || '-'} &bull; Kategori: {row.buku?.kategori || '-'}
                    </p>
                </div>
            ),
        },
        {
            key: 'user',
            label: 'Peminjam',
            render: (row) => (
                <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {row.user?.name || '-'}
                    </span>
                    <p className="text-[11px] text-slate-400">{row.user?.email || '-'}</p>
                </div>
            ),
        },
        {
            key: 'tanggal',
            label: 'Jadwal Pinjam',
            render: (row) => (
                <div className="text-xs">
                    <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-medium text-slate-400">Pinjam:</span> {row.tanggal_pinjam}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-medium text-slate-400">Batas:</span> {row.tanggal_kembali}
                    </p>
                    {row.tanggal_pengembalian && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Kembali: {row.tanggal_pengembalian}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status & Denda',
            className: 'text-center',
            render: (row) => (
                <div className="flex flex-col items-center gap-1">
                    {statusBadge(row.status)}
                    {row.denda > 0 && (
                        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            Denda: Rp {row.denda.toLocaleString('id-ID')}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'bukti',
            label: 'Bukti',
            className: 'text-center w-20',
            render: (row) =>
                row.bukti_url ? (
                    <a
                        href={row.bukti_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/70 dark:text-blue-300"
                        title="Lihat Bukti"
                    >
                        <FileText className="h-3.5 w-3.5" />
                        Bukti
                    </a>
                ) : (
                    <span className="text-[11px] text-slate-400">-</span>
                ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            className: 'text-right w-44',
            render: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    {/* Quick Return button if status is dipinjam and canManage */}
                    {canManage && row.status === 'dipinjam' && (
                        <button
                            type="button"
                            onClick={() => handleKembalikan(row.id)}
                            disabled={isReturning === row.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 disabled:opacity-50"
                            title="Konfirmasi Pengembalian Cepat"
                        >
                            <RotateCcw className={`h-3.5 w-3.5 ${isReturning === row.id ? 'animate-spin' : ''}`} />
                            Kembalikan
                        </button>
                    )}

                    <Link
                        href={`/peminjamen/${row.id}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                        title="Detail Peminjaman"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>

                    {canManage && (
                        <>
                            <Link
                                href={`/peminjamen/${row.id}/edit`}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800 dark:hover:text-amber-400"
                                title="Edit Status"
                            >
                                <Edit className="h-4 w-4" />
                            </Link>
                            <button
                                type="button"
                                onClick={() => confirmDelete(row)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                title="Hapus Data"
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
                        Sirkulasi Peminjaman
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.role === 'anggota'
                            ? 'Daftar riwayat dan status peminjaman buku Anda'
                            : 'Kelola transaksi peminjaman, pengembalian, dan denda buku'}
                    </p>
                </div>
            }
        >
            <Head title="Sirkulasi Peminjaman - SiPustaka" />

            <div className="space-y-6">
                <DataTable
                    columns={columns}
                    data={peminjamans}
                    searchPlaceholder="Cari judul buku atau peminjam..."
                    searchValue={filters?.search || ''}
                    onSearch={handleSearch}
                    filters={
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-700 shadow-2xs transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua Status</option>
                                <option value="dipinjam">Sedang Dipinjam</option>
                                <option value="dikembalikan">Dikembalikan</option>
                                <option value="terlambat">Terlambat</option>
                                <option value="hilang">Hilang</option>
                            </select>
                        </div>
                    }
                    actions={
                        <button
                            type="button"
                            onClick={() => setQuickLoanOpen(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            {user.role === 'anggota' ? 'Ajukan Pinjam Buku' : 'Catat Peminjaman'}
                        </button>
                    }
                    emptyMessage="Tidak ada data transaksi peminjaman yang ditemukan."
                />
            </div>

            {/* Quick Loan Modal */}
            <ModalForm
                isOpen={quickLoanOpen}
                onClose={() => setQuickLoanOpen(false)}
                title={user.role === 'anggota' ? 'Ajukan Peminjaman Buku' : 'Transaksi Peminjaman Baru'}
                subtitle="Pilih buku yang tersedia dan tentukan tanggal kembali"
                onSubmit={handleQuickLoanSubmit}
                submitText="Konfirmasi Pinjam"
                processing={processing}
                maxWidth="lg"
            >
                <div className="space-y-4 text-xs">
                    {/* User Selection if Admin/Petugas */}
                    {canManage && (
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300">
                                Anggota Peminjam <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                required
                            >
                                <option value="">-- Pilih Anggota --</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email}) - Role: {u.role}
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <p className="mt-1 text-rose-500">{errors.user_id}</p>}
                        </div>
                    )}

                    {/* Book Selection */}
                    <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300">
                            Buku yang Dipinjam <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.buku_id}
                            onChange={(e) => setData('buku_id', e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            required
                        >
                            <option value="">-- Pilih Buku Tersedia --</option>
                            {availableBooks.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.judul} (Stok: {b.stok}) - {b.penulis}
                                </option>
                            ))}
                        </select>
                        {errors.buku_id && <p className="mt-1 text-rose-500">{errors.buku_id}</p>}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300">
                                Tanggal Pinjam <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_pinjam}
                                onChange={(e) => setData('tanggal_pinjam', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                required
                            />
                            {errors.tanggal_pinjam && (
                                <p className="mt-1 text-rose-500">{errors.tanggal_pinjam}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300">
                                Batas Tanggal Kembali <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_kembali}
                                onChange={(e) => setData('tanggal_kembali', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                required
                            />
                            {errors.tanggal_kembali && (
                                <p className="mt-1 text-rose-500">{errors.tanggal_kembali}</p>
                            )}
                        </div>
                    </div>

                    {/* Bukti Upload */}
                    <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300">
                            Lampiran Bukti / Kartu / Identitas (Opsional)
                        </label>
                        <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => setData('bukti', e.target.files[0])}
                            className="mt-1 w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.bukti && <p className="mt-1 text-rose-500">{errors.bukti}</p>}
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300">
                            Catatan Peminjaman
                        </label>
                        <textarea
                            rows="2"
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            placeholder="Catatan kondisi fisik buku saat dipinjam..."
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        />
                    </div>
                </div>
            </ModalForm>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Hapus Data Peminjaman"
                message={`Apakah Anda yakin ingin menghapus data transaksi ini? Jika buku masih dipinjam, stok buku akan dikembalikan.`}
            />
        </AuthenticatedLayout>
    );
}
