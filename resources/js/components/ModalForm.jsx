import React from 'react';
import { X, Loader2 } from 'lucide-react';

/**
 * ModalForm: Dialog modal for interactive form interactions.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {(e: React.FormEvent) => void} [props.onSubmit]
 * @param {string} [props.submitText]
 * @param {boolean} [props.processing]
 * @param {string} [props.maxWidth] - 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * @param {React.ReactNode} props.children
 */
export default function ModalForm({
    isOpen,
    onClose,
    title,
    subtitle,
    onSubmit,
    submitText = 'Simpan',
    processing = false,
    maxWidth = 'lg',
    children,
}) {
    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Dialog Box */}
            <div
                className={`relative w-full ${
                    maxWidthClasses[maxWidth] || maxWidthClasses.lg
                } overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form or Body */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (onSubmit) onSubmit(e);
                    }}
                >
                    <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-4">
                        {children}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
