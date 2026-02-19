import PropertyCard from "@/components/PropertyCard";

export default function OfficesPage() {
    // Temporary dummy data to see how it looks
    const listings = [1, 2, 3, 4, 5, 6];

    return (
        <main className="min-h-screen bg-black px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold">
                        Premium Offices <span className="text-emerald-500">for Rent</span>
                    </h1>
                    <p className="mt-4 text-gray-400">
                        Find the perfect workspace for your team in Egypts top business districts.
                    </p>
                </div>

                {/* Grid of Listings */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {listings.map((item) => (
                        <PropertyCard key={item} />
                    ))}
                </div>

            </div>
        </main>
    );
}