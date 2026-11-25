import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'SiPustaka';

const pageGlobs = {
    ...import.meta.glob('./pages/**/*.{jsx,tsx}'),
    ...import.meta.glob('../../Modules/*/resources/js/Pages/**/*.{jsx,tsx}'),
};

function getPageCandidates(name: string): string[] {
    const candidates: string[] = [];

    // Format 1: Module namespace format like 'buku::Index' or 'Buku::Index'
    if (name.includes('::')) {
        const [mod, component] = name.split('::');
        const moduleName = mod.charAt(0).toUpperCase() + mod.slice(1);
        candidates.push(
            `../../Modules/${moduleName}/resources/js/Pages/${component}.tsx`,
            `../../Modules/${moduleName}/resources/js/Pages/${component}.jsx`,
        );
    }

    // Format 2: Module/Component format like 'Buku/Index'
    const parts = name.split('/');
    if (parts.length >= 2) {
        const moduleName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const subPath = parts.slice(1).join('/');
        candidates.push(
            `../../Modules/${moduleName}/resources/js/Pages/${subPath}.tsx`,
            `../../Modules/${moduleName}/resources/js/Pages/${subPath}.jsx`,
        );
    }

    // Format 3: Direct or nested path under resources/js/pages
    candidates.push(
        `./pages/${name}.tsx`,
        `./pages/${name}.jsx`,
        `./pages/${name.toLowerCase()}.tsx`,
        `./pages/${name.toLowerCase()}.jsx`,
    );

    return candidates;
}

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(getPageCandidates(name), pageGlobs),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#2563eb',
    },
});

// This will set light / dark mode on load...
initializeTheme();
