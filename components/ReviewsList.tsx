'use client';

import { Star, User } from 'lucide-react';

interface Review {
    id: string;
    stars: number;
    comment: string | null;
    createdAt: Date | string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ReviewsListProps {
    reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
    if (reviews.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                <p>No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                <User className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {review.user.name || 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(review.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= review.stars
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-200 text-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    {review.comment && (
                        <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                </div>
            ))}
        </div>
    );
}