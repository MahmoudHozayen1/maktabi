import PropertyCard from "@/components/PropertyCard";

export default function CoworkingPage() {
    const spaces = [1, 2, 3, 4, 5, 6];

    return (
        <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-12">
                <h1 className="text-4xl font-bold">
                    Coworking <span className="text-emerald-500">Spaces</span>
                </h1>
                <p className="mt-4 text-gray-400">
                    Flexible workspaces for freelancers, startups, and remote teams.
                </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {spaces.map((item) => (
                    <PropertyCard key={item} />
                ))}
            </div>
        </div>
    );
}