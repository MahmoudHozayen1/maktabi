import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <Loader2 className={cn('animate-spin text-emerald-500', sizes[size], className)} />
    );
}

export function PageSpinner() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <Spinner size="lg" />
        </div>
    );
}