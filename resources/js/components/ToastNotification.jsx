import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

/**
 * ToastNotification component that monitors Inertia flash messages
 * and triggers toast notifications.
 */
export default function ToastNotification() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
                className: 'border border-blue-200 bg-white text-slate-800 shadow-lg',
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 5000,
                className: 'border border-rose-200 bg-white text-rose-900 shadow-lg',
            });
        }
    }, [flash]);

    return null;
}
