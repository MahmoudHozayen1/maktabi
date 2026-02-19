import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-gray-800 bg-gray-900',
                hover && 'transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20',
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('border-b border-gray-800 p-6', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('border-t border-gray-800 p-6', className)}>{children}</div>;
}