import prisma from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';
import { Building2 } from 'lucide-react';

export default async function OfficesPage() {
    const properties = await prisma.property.findMany({
        where: {
            type: 'OFFICE',
            status: 'APPROVED',
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Premium Offices <span className="text-emerald-500">for Rent</span>
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Find the perfect workspace for your team in Egypt&apos;s top business districts.
                    </p>
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
                        <Building2 className="mb-4 h-16 w-16 text-gray-300" />
                        <h2 className="mb-2 text-xl font-bold text-gray-700">No offices available</h2>
                        <p className="text-gray-500">Check back later for new listings.</p>
                    </div>
                )}
            </div>
        </main>
    );
}