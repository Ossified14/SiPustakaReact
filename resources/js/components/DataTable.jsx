import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

/**
 * DataTable: Reusable table component with search, custom filters, pagination, and empty state.
 *
 * @param {Object} props
 * @param {Array<{ key: string, label: string, className?: string, render?: (row: any) => React.ReactNode }>} props.columns
 * @param {Object} props.data - Laravel Paginated object (data, links, from, to, total)
 * @param {string} [props.searchPlaceholder]
 * @param {string} [props.searchValue]
 * @param {(term: string) => void} [props.onSearch]
 * @param {React.ReactNode} [props.filters] - Filter dropdowns / slots
 * @param {React.ReactNode} [props.actions] - Action buttons (e.g., 'Tambah Data')
 * @param {string} [props.emptyMessage]
 */
export default function DataTable({
    columns = [],
    data = { data: [], links: [] },
    searchPlaceholder = 'Cari data...',
    searchValue = '',
    onSearch,
    filters,
    actions,
    emptyMessage = 'Belum ada data yang tersedia.',
    className = '',
}) {
    const [search, setSearch] = useState(searchValue);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(search);
        } else {
            router.get(
                window.location.pathname,
                { search },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e);
        }
    };

    const rows = data?.data || [];
    const links = data?.links || [];

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Table Controls (Search, Filters, Actions) */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={searchPlaceholder}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-950"
                        />
                    </form>

                    {/* Custom Filters Slot */}
                    {filters}
                </div>

                {/* Right side actions (e.g. Add Button) */}
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-3.5 ${col.className || ''}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {rows.length > 0 ? (
                                rows.map((row, rowIdx) => (
                                    <tr
                                        key={row.id || rowIdx}
                                        className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <td
                                                key={colIdx}
                                                className={`px-6 py-4 align-middle ${col.className || ''}`}
                                            >
                                                {col.render
                                                    ? col.render(row)
                                                    : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-12 text-center text-slate-400 dark:text-slate-500"
                                    >
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Inbox className="h-10 w-10 stroke-[1.5] text-slate-300 dark:text-slate-600" />
                                            <p className="font-medium text-slate-500 dark:text-slate-400">
                                                {emptyMessage}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 px-6 py-3.5 sm:flex-row dark:border-slate-800 dark:bg-slate-800/20">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {data.from || 0}
                            </span>{' '}
                            sampai{' '}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {data.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {data.total || 0}
                            </span>{' '}
                            entri
                        </div>

                        <div className="flex items-center gap-1">
                            {links.map((link, idx) => {
                                const isPrev = link.label.includes('&laquo;') || link.label.includes('Previous');
                                const isNext = link.label.includes('&raquo;') || link.label.includes('Next');

                                let content = link.label;
                                if (isPrev) content = <ChevronLeft className="h-4 w-4" />;
                                if (isNext) content = <ChevronRight className="h-4 w-4" />;

                                if (!link.url) {
                                    return (
                                        <span
                                            key={idx}
                                            className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs text-slate-300 dark:text-slate-600"
                                            dangerouslySetInnerHTML={
                                                typeof content === 'string'
                                                    ? { __html: content }
                                                    : undefined
                                            }
                                        >
                                            {typeof content !== 'string' ? content : null}
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                                : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {typeof content === 'string' ? (
                                            <span dangerouslySetInnerHTML={{ __html: content }} />
                                        ) : (
                                            content
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
