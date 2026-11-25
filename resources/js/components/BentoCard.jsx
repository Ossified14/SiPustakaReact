import React from 'react';

/**
 * BentoCard: A versatile Bento-grid container component.
 *
 * @param {Object} props
 * @param {string} [props.title] - Card title
 * @param {string} [props.subtitle] - Optional subtitle/description
 * @param {React.ReactNode} [props.icon] - Icon component
 * @param {string} [props.badge] - Status/stat badge text
 * @param {string} [props.badgeColor] - Color variant for badge ('blue', 'rose', 'slate', 'emerald', 'amber')
 * @param {string} [props.value] - Large stat display value
 * @param {string} [props.trend] - Trend or secondary info text
 * @param {React.ReactNode} [props.action] - Header action button/element
 * @param {string} [props.className] - Additional classes
 * @param {string} [props.colSpan] - Bento grid column span (e.g. 'col-span-1', 'col-span-2', 'md:col-span-2')
 * @param {React.ReactNode} props.children - Card body content
 */
export default function BentoCard({
    title,
    subtitle,
    icon: Icon,
    badge,
    badgeColor = 'blue',
    value,
    trend,
    action,
    className = '',
    colSpan = '',
    children,
    ...props
}) {
    const badgeColors = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-800',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-100 dark:border-rose-800',
        slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800',
        amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-100 dark:border-amber-800',
    };

    const iconBgColors = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400',
        slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
    };

    return (
        <div
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${colSpan} ${className}`}
            {...props}
        >
            {/* Header section if title, icon, or value is present */}
            {(title || Icon || action || value) && (
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        {title && (
                            <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                {title}
                            </h3>
                        )}
                        {value && (
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {value}
                                </span>
                                {trend && (
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {trend}
                                    </span>
                                )}
                            </div>
                        )}
                        {subtitle && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {badge && (
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    badgeColors[badgeColor] || badgeColors.blue
                                }`}
                            >
                                {badge}
                            </span>
                        )}
                        {Icon && (
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                                    iconBgColors[badgeColor] || iconBgColors.blue
                                }`}
                            >
                                {React.isValidElement(Icon)
                                    ? Icon
                                    : React.createElement(Icon, { className: 'h-5 w-5' })}
                            </div>
                        )}
                        {action}
                    </div>
                </div>
            )}

            {/* Content Body */}
            {children && <div className="flex-1">{children}</div>}
        </div>
    );
}
