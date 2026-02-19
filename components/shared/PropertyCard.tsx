import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, Ruler, Star } from 'lucide-react';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import FavoriteButton from './FavoriteButton';
import Badge from '@/components/ui/Badge';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const detailUrl = property.type === 'OFFICE'
        ? `/offices/${property.id}`
        : `/coworking/${property.id}`;

    return (
        <div className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20">
            {/* Image */}
            <div className="relative h-48 w-full bg-gray-800">
                {property.images[0] ? (
                    <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-600">
                        <Building2 className="h-12 w-12" />
                    </div>
                )}

                {/* Favorite Button */}
                <div className="absolute right-3 top-3">
                    <FavoriteButton propertyId={property.id} />
                </div>

                {/* Featured Badge */}
                {property.featured && (
                    <div className="absolute left-3 top-3">
                        <Badge variant="success">Featured</Badge>
                    </div>
                )}

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 rounded-lg bg-black/80 px-3 py-1 text-sm font-bold text-white backdrop-blur-md border border-gray-700">
                    {formatPrice(property.price)}
                    <span className="text-xs font-normal text-gray-400">/mo</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-emerald-400 line-clamp-1">
                    {property.title}
                </h3>

                {/* Location */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>{property.district}, {property.city}</span>
                </div>

                {/* Features */}
                <div className="mb-4 flex items-center justify-between border-y border-gray-800 py-3 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>{property.rooms || '-'} Rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <span>{property.size}m²</span>
                    </div>
                    {property.averageRating && (
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span>{property.averageRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={detailUrl}
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-95"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}