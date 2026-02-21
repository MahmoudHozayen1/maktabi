'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            'w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 pr-12 text-white placeholder-gray-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500',
                            icon && 'pl-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                            className
                        )}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;