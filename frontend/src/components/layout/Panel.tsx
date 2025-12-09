interface PanelProps {
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    padding?: "sm" | "md" | "lg";
}

const paddingMap: Record<NonNullable<PanelProps["padding"]>, string> = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
};

export function Panel({ title, subtitle, actions, children, className = "", padding = "md" }: PanelProps) {
    const paddingClass = paddingMap[padding] || paddingMap.md;

    return (
        <div className={`panel ${paddingClass} ${className}`}>
            {(title || subtitle || actions) && (
                <div className="panel-header">
                    <div>
                        {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
                        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            )}
            <div className={`${title || subtitle ? "pt-3" : ""}`}>{children}</div>
        </div>
    );
}
