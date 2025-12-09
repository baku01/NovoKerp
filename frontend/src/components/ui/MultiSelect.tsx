import { useState, useRef, useEffect } from 'react';
import type { FieldError } from 'react-hook-form';

interface Option {
    value: string | number;
    label: string;
}

interface MultiSelectProps {
    label?: string;
    error?: FieldError;
    helperText?: string;
    options: Option[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const MultiSelect = ({
    label,
    error,
    helperText,
    options,
    value,
    onChange,
    placeholder = 'Select options...',
    disabled = false,
    className = '',
}: MultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOption = (optionValue: string | number) => {
        if (disabled) return;
        
        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const handleSelectAll = () => {
        if (disabled) return;
        if (value.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map(o => o.value));
        }
    };

    return (
        <div className="w-full relative" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full px-3.5 py-3 text-left border rounded-xl bg-white/90 shadow-inner shadow-slate-200/40
                    focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/80
                    disabled:bg-slate-100 disabled:cursor-not-allowed
                    flex justify-between items-center transition-all
                    ${error ? 'border-rose-400 focus:ring-rose-400/60' : 'border-slate-200'}
                    ${className}
                `}
            >
                <span className="block truncate">
                    {value.length === 0
                        ? <span className="text-slate-400">{placeholder}</span>
                        : `${value.length} selected`
                    }
                </span>
                <span
                    className={`ml-2 text-slate-400 transition-transform duration-150 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white/95 border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-auto backdrop-blur">
                    {options.length > 0 && (
                        <div
                            className="px-4 py-2 cursor-pointer hover:bg-slate-50 border-b border-slate-100 font-semibold text-sm text-blue-600"
                            onClick={handleSelectAll}
                        >
                            {value.length === options.length ? 'Deselect All' : 'Select All'}
                        </div>
                    )}
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center px-4 py-2 cursor-pointer hover:bg-blue-50/70 transition-colors"
                            onClick={() => handleToggleOption(option.value)}
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(option.value)}
                                onChange={() => {}}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 block truncate text-sm text-slate-700">
                                {option.label}
                            </span>
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div className="px-4 py-2 text-sm text-slate-500">No options available</div>
                    )}
                </div>
            )}
            
            {error && (
                <p className="mt-1 text-sm text-rose-600">{error.message}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-slate-500">{helperText}</p>
            )}
        </div>
    );
};
