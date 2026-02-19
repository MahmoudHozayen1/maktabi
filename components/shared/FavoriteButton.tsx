'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
    propertyId: string;
    isFavorited?: boolean;
}

export default function FavoriteButton({ propertyId, isFavorited = false }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [favorited, setFavorited] = useState(isFavorited);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            router.push('/login');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/favorites', {
                method: favorited ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId }),
            });

            if (res.ok) {
                setFavorited(!favorited);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                'rounded-full bg-black/50 p-2 backdrop-blur-md transition-all hover:bg-black/70',
                isLoading && 'opacity-50'
            )}
        >
            <Heart
                className={cn(
                    'h-5 w-5 transition-colors',
                    favorited ? 'fill-red-500 text-red-500' : 'text-white'
                )}
            />
        </button>
    );
}