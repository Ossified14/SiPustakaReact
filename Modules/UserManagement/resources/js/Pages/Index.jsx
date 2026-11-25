import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import DataTable from '@/components/DataTable';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import {
    Users,
    Plus,
    Eye,
    Edit,
    Trash2,
    ShieldCheck,
    UserCheck,
    BookMarked,
} from 'lucide-react';

export default function Index({ users, filters, roles = [] }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || {};

    const [selectedRole, setSelectedRole] = useState(filters?.role || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        router.get(
            '/usermanagements',
            {
                search: filters?.search || '',
                role: role,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (term) => {
        router.get(
            '/usermanagements',
            {
                search: term,
                role: selectedRole,
            },
            { preserveState: true, replace: true }
        );
    };

    const confirmDelete = (u) => {
        setUserToDelete(u);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        router.delete(`/usermanagements/${userToDelete.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setUserToDelete(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
        });
    };

    const roleBadge = (role) => {
        const badges = {
            admin: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-400',
            petugas: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-400',
            anggota: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400',
        };

        return (
            <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    badges[role] || 'bg-slate-100 text-slate-700'
                }`}
            >
                {role}
            </span>
        );
    };

    const columns = [
        {
            key: 'name',
            label: 'Pengguna',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                        {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                                {row.name}
                            </span>
                            {row.id === currentUser.id && (
                                <span className="rounded-sm bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    Anda
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Role / Peran',
            render: (row) => roleBadge(row.role),
        },
        {
            key: 'loans',
            label: 'Peminjaman Aktif',
            className: 'text-center',
            render: (row) => (
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        row.active_loans_count > 0
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                >
                    <BookMarked className="h-3 w-3" />
                    {row.active_loans_count || 0} buku
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
                        href={`/usermanagements/${row.id}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                        title="Lihat Profil"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                        href={`/usermanagements/${row.id}/edit`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800 dark:hover:text-amber-400"
                        title="Edit Pengguna"
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                    {row.id !== currentUser.id && (
                        <button
                            type="button"
                            onClick={() => confirmDelete(row)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                            title="Hapus Pengguna"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
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
                        Manajemen Pengguna
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kelola akun pengguna, peran hak akses (RBAC), dan keanggotaan
                    </p>
                </div>
            }
        >
            <Head title="Manajemen Pengguna - SiPustaka" />

            <div className="space-y-6">
                <DataTable
                    columns={columns}
                    data={users}
                    searchPlaceholder="Cari nama atau email pengguna..."
                    searchValue={filters?.search || ''}
                    onSearch={handleSearch}
                    filters={
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedRole}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-700 shadow-2xs transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                            >
                                <option value="">Semua Peran</option>
                                <option value="admin">Administrator</option>
                                <option value="petugas">Petugas</option>
                                <option value="anggota">Anggota</option>
                            </select>
                        </div>
                    }
                    actions={
                        <Link
                            href="/usermanagements/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Pengguna
                        </Link>
                    }
                    emptyMessage="Tidak ada data pengguna yang sesuai dengan pencarian."
                />
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Hapus Akun Pengguna"
                message={`Apakah Anda yakin ingin menghapus akun "${userToDelete?.name}" (${userToDelete?.email})?`}
            />
        </AuthenticatedLayout>
    );
}
