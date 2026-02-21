'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface RatingInputProps {
    propertyId: string;
    existingRating?: {
        stars: number;
        comment: string | null;
    } | null;
    onRatingSubmit?: () => void;
}

export default function RatingInput({ propertyId, existingRating, onRatingSubmit }: RatingInputProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedStars, setSelectedStars] = useState(existingRating?.stars || 0);
    const [comment, setComment] = useState(existingRating?.comment || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (!session) {
            router.push('/login');
            return;
        }

        if (selectedStars === 0) {
            setError('Please select a rating');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId,
                    stars: selectedStars,
                    comment: comment || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.updated ? 'Rating updated!' : 'Rating submitted!');
                onRatingSubmit?.();
            } else {
                setError(data.error || 'Failed to submit rating');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
                {existingRating ? 'Update Your Rating' : 'Rate This Property'}
            </h3>

            {/* Star Selection */}
            <div className="mb-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setSelectedStars(star)}
                            className="p-1 transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-8 w-8 ${star <= (hoveredStar || selectedStars)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    {selectedStars === 0 && 'Click to rate'}
                    {selectedStars === 1 && 'Poor'}
                    {selectedStars === 2 && 'Fair'}
                    {selectedStars === 3 && 'Good'}
                    {selectedStars === 4 && 'Very Good'}
                    {selectedStars === 5 && 'Excellent'}
                </p>
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Comment (optional)
                </label>
                <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                />
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">
                    {success}
                </div>
            )}

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={selectedStars === 0}
                className="w-full"
            >
                {existingRating ? 'Update Rating' : 'Submit Rating'}
            </Button>

            {!session && (
                <p className="mt-3 text-center text-sm text-gray-500">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-emerald-600 hover:underline"
                    >
                        Log in
                    </button>
                    {' '}to submit a rating
                </p>
            )}
        </div>
    );
}