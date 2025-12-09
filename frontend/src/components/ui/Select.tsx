import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: FieldError;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, options, placeholder, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
                        w-full px-3.5 py-3 rounded-xl border bg-white/90 shadow-inner shadow-slate-200/40
                        focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/80
                        transition-all duration-150 placeholder:text-slate-400
                        disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
                        ${error ? "border-rose-400 focus:ring-rose-400/60" : "border-slate-200"}
                        ${className}
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-rose-600">{error.message}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-slate-500">{helperText}</p>
                )}
            </div>
        );
    },
);

Select.displayName = "Select";
