interface PageHeaderProps {
    title: string;
    subtitle?: string;
    tag?: string;
    actions?: React.ReactNode;
}

interface PageLayoutProps extends PageHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, subtitle, tag, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
                {tag && <p className="text-[11px] uppercase tracking-[0.28em] text-blue-100/80">{tag}</p>}
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                        {title.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-white leading-tight">{title}</h1>
                        {subtitle && <p className="text-slate-200/85 text-sm mt-1">{subtitle}</p>}
                    </div>
                </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}

export function PageLayout({ title, subtitle, tag, actions, children, className = "" }: PageLayoutProps) {
    return (
        <section className={`space-y-6 ${className}`}>
            <PageHeader title={title} subtitle={subtitle} tag={tag} actions={actions} />
            {children}
        </section>
    );
}
