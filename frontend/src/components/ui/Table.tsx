import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export function Table({ children, className = "", ...props }: TableProps) {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-slate-200/50 shadow-sm">
            <div className="overflow-x-auto">
                <table className={`w-full text-left text-sm ${className}`} {...props}>
                    {children}
                </table>
            </div>
        </div>
    );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
    return <thead className="bg-slate-50 text-slate-500 uppercase">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
    return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr className={`hover:bg-slate-50/50 transition-colors ${className}`} {...props}>
            {children}
        </tr>
    );
}

export function TableHead({ children, className = "", ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th className={`px-4 py-3 font-semibold tracking-wider ${className}`} {...props}>
            {children}
        </th>
    );
}

export function TableCell({ children, className = "", ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={`px-4 py-3 text-slate-700 ${className}`} {...props}>
            {children}
        </td>
    );
}
