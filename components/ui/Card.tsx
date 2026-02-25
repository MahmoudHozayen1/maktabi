import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    variant?: 'light' | 'dark';
}

export default function Card({ children, className, hover = false, variant = 'light' }: CardProps) {
    const base =
        variant === 'dark'
            ? 'rounded-xl border border-gray-800 bg-gray-900 text-white'
            : 'rounded-xl border border-gray-200 bg-white text-gray-900';

    const hoverClasses = variant === 'dark'
        ? 'transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20'
        : 'transition-all hover:border-emerald-500/50 hover:shadow-lg';

    return (
        <div
            className={cn(
                base,
                hover ? hoverClasses : '',
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('border-b border-gray-200 p-6', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('border-t border-gray-200 p-6', className)}>{children}</div>;
}