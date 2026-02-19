'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { CITIES } from '@/lib/constants';

interface SearchBarProps {
    showFilters?: boolean;
    onFilterClick?: () => void;
}

export default function SearchBar({ showFilters = false, onFilterClick }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (city) params.set('city', city);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/80 p-4 backdrop-blur-md sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-800 px-4 py-3">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search offices..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-800 px-4 py-3 sm:max-w-[200px]">
                <MapPin className="h-5 w-5 text-emerald-500" />
                <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                >
                    <option value="">All Cities</option>
                    {CITIES.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>
            <Button onClick={handleSearch}>Search</Button>
            {showFilters && (
                <Button variant="secondary" onClick={onFilterClick}>
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}