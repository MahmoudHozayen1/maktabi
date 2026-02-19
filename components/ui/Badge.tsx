import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        default: 'bg-gray-700 text-gray-300',
        success: 'bg-emerald-500/20 text-emerald-400',
        warning: 'bg-yellow-500/20 text-yellow-400',
        danger: 'bg-red-500/20 text-red-400',
        info: 'bg-blue-500/20 text-blue-400',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}