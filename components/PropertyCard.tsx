import { MapPin, Building2, Ruler } from 'lucide-react';
import Link from 'next/link';

export default function PropertyCard() {
    return (
        <div className="card-hover group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
            {/* Image Placeholder */}
            <div className="relative h-48 w-full bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-sm">Office Image</span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 rounded-lg bg-gray-900 px-3 py-1 text-sm font-bold text-white">
                    50,000 EGP<span className="text-xs font-normal text-gray-400">/mo</span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-emerald-600">
                    Modern Office Space
                </h3>

                {/* Location */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>Maadi, Cairo</span>
                </div>

                {/* Features */}
                <div className="mb-6 flex items-center justify-between border-y border-gray-100 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>3 Rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-400" />
                        <span>120 sqm</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href="/offices/1"
                    className="flex w-full items-center justify-center rounded-lg bg-gray-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}