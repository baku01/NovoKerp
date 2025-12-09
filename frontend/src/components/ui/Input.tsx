import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, leftIcon, rightIcon, fullWidth = true, ...props }, ref) => {
        return (
            <div className={`${fullWidth ? "w-full" : ""} space-y-1.5`}>
                {label && (
                    <label className="block text-sm font-medium text-slate-300 ml-1">
                        {label}
                        {props.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                )}
                
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                            {leftIcon}
                        </div>
                    )}
                    
                    <input
                        ref={ref}
                        className={`
                            block w-full rounded-lg border bg-slate-900/50 
                            ${error 
                                ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20" 
                                : "border-slate-700/50 hover:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                            }
                            ${leftIcon ? "pl-10" : "pl-3"}
                            ${rightIcon ? "pr-10" : "pr-3"}
                            py-2.5 text-sm text-slate-100 placeholder-slate-500
                            focus:outline-none focus:ring-4 transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${className}
                        `}
                        {...props}
                    />
                    
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                            {rightIcon}
                        </div>
                    )}
                </div>
                
                {error && (
                    <p className="text-xs text-rose-400 mt-1 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
