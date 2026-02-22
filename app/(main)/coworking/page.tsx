import Link from 'next/link';
import prisma from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';
import { Users, Plus } from 'lucide-react';

export const revalidate = 60;

export default async function CoworkingPage() {
    const properties = await prisma.property.findMany({
        where: {
            type: 'COWORKING',
            status: 'APPROVED',
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Coworking <span className="text-emerald-500">Spaces</span>
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Flexible workspaces for freelancers, startups, and remote teams.
                        </p>
                    </div>
                    <Link
                        href="/coworking/apply"
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                        <Plus className="h-5 w-5" />
                        List Your Space
                    </Link>
                </div>

                {/* Grid of Listings */}
                {properties.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Users className="mb-4 h-16 w-16 text-gray-300" />
                        <h2 className="mb-2 text-xl font-bold text-gray-700">No coworking spaces available</h2>
                        <p className="mb-6 text-gray-500">Check back later for new listings.</p>
                        <Link
                            href="/coworking/apply"
                            className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
                        >
                            Apply to List Your Space
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}