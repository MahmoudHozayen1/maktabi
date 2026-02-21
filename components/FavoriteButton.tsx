'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
    propertyId: string;
    initialFavorited?: boolean;
}

export default function FavoriteButton({ propertyId, initialFavorited = false }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleFavorite = async () => {
        if (!session) {
            router.push('/login');
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorited) {
                // Remove from favorites
                const res = await fetch('/api/favorites', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyId }),
                });

                if (res.ok) {
                    setIsFavorited(false);
                }
            } else {
                // Add to favorites
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyId }),
                });

                if (res.ok) {
                    setIsFavorited(true);
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-all ${isFavorited
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? 'Saved' : 'Save'}
        </button>
    );
}