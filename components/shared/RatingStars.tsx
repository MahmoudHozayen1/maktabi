'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
}

export default function RatingStars({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onChange,
}: RatingStarsProps) {
    const sizes = {
        sm: 'h-3 w-3',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }, (_, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= rating;

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onChange?.(starValue)}
                        className={cn(
                            'transition-colors',
                            interactive && 'cursor-pointer hover:scale-110',
                            !interactive && 'cursor-default'
                        )}
                    >
                        <Star
                            className={cn(
                                sizes[size],
                                isFilled ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}