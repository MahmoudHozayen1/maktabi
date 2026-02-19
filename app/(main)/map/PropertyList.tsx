'use client';

import Link from 'next/link';
import { Building2, Users, MapPin } from 'lucide-react';

interface Property {
    id: string;
    title: string;
    type: 'office' | 'coworking';
    price: number;
    district: string;
    city: string;
    lat: number;
    lng: number;
    size?: number;
}

interface PropertyListProps {
    properties: Property[];
    selectedType: 'all' | 'office' | 'coworking';
    selectedCity: string;
}

export default function PropertyList({ properties, selectedType, selectedCity }: PropertyListProps) {
    const filteredProperties = properties.filter((p) => {
        if (selectedType !== 'all' && p.type !== selectedType) return false;
        if (selectedCity && p.city !== selectedCity) return false;
        return true;
    });

    return (
        <div className="h-[600px] overflow-y-auto rounded-xl border border-gray-200 bg-white">
            <div className="sticky top-0 border-b border-gray-100 bg-white p-4">
                <h3 className="font-bold text-gray-900">Properties</h3>
                <p className="text-sm text-gray-500">{filteredProperties.length} results</p>
            </div>

            <div className="divide-y divide-gray-100">
                {filteredProperties.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No properties found
                    </div>
                ) : (
                    filteredProperties.map((property) => (
                        <Link
                            key={property.id}
                            href={`/${property.type === 'office' ? 'offices' : 'coworking'}/${property.id}`}
                            className="block p-4 transition-colors hover:bg-gray-50"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                {property.type === 'office' ? (
                                    <Building2 className="h-4 w-4 text-blue-600" />
                                ) : (
                                    <Users className="h-4 w-4 text-emerald-600" />
                                )}
                                <span className="text-xs font-medium uppercase text-gray-400">
                                    {property.type}
                                </span>
                            </div>
                            <h4 className="mb-1 font-semibold text-gray-900">{property.title}</h4>
                            <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-3 w-3" />
                                {property.district}, {property.city}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-emerald-600">
                                    {property.price.toLocaleString()} EGP
                                    <span className="text-xs font-normal text-gray-400">/mo</span>
                                </span>
                                {property.size && (
                                    <span className="text-sm text-gray-400">{property.size} sqm</span>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}