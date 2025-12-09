import React from "react";

interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
}

export function Card({ title, subtitle, children, className = "", actions }: CardProps) {
    return (
        <div className={`bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-lg shadow-black/20 ${className}`}>
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-white/5 flex items-start justify-between gap-4">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
                        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

// Simple stats card variant
export function StatCard({ label, value, trend, icon, trendUp }: { label: string; value: string | number; trend?: string; icon?: React.ReactNode; trendUp?: boolean }) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-sm hover:border-white/10 hover:bg-slate-800/50 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
                {icon && <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">{icon}</div>}
            </div>
            {trend && (
                <div className={`mt-3 flex items-center text-xs font-medium ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>
                    <span>{trend}</span>
                    <span className="ml-1 opacity-70">mês passado</span>
                </div>
            )}
        </div>
    );
}
