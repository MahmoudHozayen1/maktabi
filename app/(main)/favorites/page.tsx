import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import PropertyCard from '@/components/PropertyCard';

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    // TODO: Fetch user's favorites from database
    const favorites: number[] = []; // Empty for now

    return (
        <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-12">
                <h1 className="text-4xl font-bold">
                    Your <span className="text-emerald-500">Favorites</span>
                </h1>
                <p className="mt-4 text-gray-400">
                    Properties you&apos;ve saved for later
                </p>
            </div>

            {favorites.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((item) => (
                        <PropertyCard key={item} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Heart className="mb-6 h-16 w-16 text-gray-600" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-300">No favorites yet</h2>
                    <p className="mb-8 text-gray-500">
                        Start exploring and save properties you like
                    </p>
                    <Link
                        href="/offices"
                        className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
                    >
                        Browse Offices
                    </Link>
                </div>
            )}
        </div>
    );
}