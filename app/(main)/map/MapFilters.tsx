'use client';

import { Building2, Users, MapPin } from 'lucide-react';
import { CITIES } from '@/lib/constants';

interface MapFiltersProps {
    selectedType: 'all' | 'office' | 'coworking';
    setSelectedType: (type: 'all' | 'office' | 'coworking') => void;
    selectedCity: string;
    setSelectedCity: (city: string) => void;
    propertyCount: number;
}

export default function MapFilters({
    selectedType,
    setSelectedType,
    selectedCity,
    setSelectedCity,
    propertyCount,
}: MapFiltersProps) {
    const typeFilters = [
        { value: 'all', label: 'All', icon: MapPin },
        { value: 'office', label: 'Offices', icon: Building2 },
        { value: 'coworking', label: 'Coworking', icon: Users },
    ] as const;

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Type Filters */}
            <div className="flex gap-2">
                {typeFilters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setSelectedType(filter.value)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedType === filter.value
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <filter.icon className="h-4 w-4" />
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-4">
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none"
                >
                    <option value="">All Cities</option>
                    {CITIES.map((city) => (
                        <option key={city.value} value={city.label}>
                            {city.label}
                        </option>
                    ))}
                </select>

                <span className="text-sm text-gray-500">
                    {propertyCount} properties found
                </span>
            </div>
        </div>
    );
}