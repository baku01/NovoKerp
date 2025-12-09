import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "neutral" | "outline";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
    const variants = {
        default: "bg-blue-100 text-blue-700 border-blue-200",
        success: "bg-emerald-100 text-emerald-700 border-emerald-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        error: "bg-rose-100 text-rose-700 border-rose-200",
        info: "bg-sky-100 text-sky-700 border-sky-200",
        neutral: "bg-slate-100 text-slate-600 border-slate-200",
        outline: "bg-transparent border-slate-300 text-slate-600",
    };

    return (
        <span
            className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </span>
    );
}
