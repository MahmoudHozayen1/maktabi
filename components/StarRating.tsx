'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    totalReviews?: number;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
}

export default function StarRating({
    rating,
    totalReviews = 0,
    size = 'md',
    showCount = true
}: StarRatingProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const starSize = sizes[size];

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${starSize} ${star <= Math.round(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                    />
                ))}
            </div>
            {showCount && (
                <span className="text-sm text-gray-500">
                    {rating > 0 ? rating.toFixed(1) : 'No ratings'}
                    {totalReviews > 0 && ` (${totalReviews} review${totalReviews !== 1 ? 's' : ''})`}
                </span>
            )}
        </div>
    );
}