import { MapPin, Building2, Ruler, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Property {
    id: string;
    serialNumber: number;
    title: string;
    price: number;
    size: number;
    rooms: number | null;
    type: 'OFFICE' | 'COWORKING';
    city: string;
    district: string;
    images: string[];
}

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const href = property.type === 'OFFICE'
        ? `/offices/${property.id}`
        : `/coworking/${property.id}`;

    return (
        <div className="card-hover group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
            {/* Image */}
            <div className="relative h-48 w-full bg-gray-100">
                {property.images && property.images.length > 0 ? (
                    <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {property.type === 'OFFICE' ? (
                            <Building2 className="h-12 w-12" />
                        ) : (
                            <Users className="h-12 w-12" />
                        )}
                    </div>
                )}

                {/* Serial Number Badge */}
                <div className="absolute top-4 left-4 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
                    #{property.serialNumber}
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 rounded-lg bg-gray-900 px-3 py-1 text-sm font-bold text-white">
                    {property.price.toLocaleString()} EGP
                    <span className="text-xs font-normal text-gray-400">/mo</span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 right-4 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-700">
                    {property.type === 'OFFICE' ? 'Office' : 'Coworking'}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-emerald-600 line-clamp-1">
                    {property.title}
                </h3>

                {/* Location */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>{property.district}, {property.city}</span>
                </div>

                {/* Features */}
                <div className="mb-6 flex items-center justify-between border-y border-gray-100 py-3 text-sm text-gray-600">
                    {property.rooms && (
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>{property.rooms} Rooms</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-400" />
                        <span>{property.size} sqm</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={href}
                    className="flex w-full items-center justify-center rounded-lg bg-gray-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}