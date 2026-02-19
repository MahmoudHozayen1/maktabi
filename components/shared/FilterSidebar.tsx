'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { CITIES, DISTRICTS, AMENITIES } from '@/lib/constants';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    type?: 'OFFICE' | 'COWORKING';
}

export default function FilterSidebar({ isOpen, onClose, type }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '',
        district: searchParams.get('district') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        minSize: searchParams.get('minSize') || '',
        maxSize: searchParams.get('maxSize') || '',
        rooms: searchParams.get('rooms') || '',
        amenities: searchParams.getAll('amenities') || [],
    });

    const handleApply = () => {
        const params = new URLSearchParams(searchParams);

        Object.entries(filters).forEach(([key, value]) => {
            params.delete(key);
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else if (value) {
                params.set(key, value);
            }
        });

        router.push(`?${params.toString()}`);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            city: '',
            district: '',
            minPrice: '',
            maxPrice: '',
            minSize: '',
            maxSize: '',
            rooms: '',
            amenities: [],
        });
        router.push('?');
        onClose();
    };

    const districts = filters.city ? DISTRICTS[filters.city as keyof typeof DISTRICTS] || [] : [];

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto border-l border-gray-800 bg-gray-900 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Filters</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Location */}
                    <div>
                        <h3 className="mb-3 font-medium text-white">Location</h3>
                        <div className="space-y-3">
                            <Select
                                options={CITIES}
                                placeholder="Select City"
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value, district: '' })}
                            />
                            {districts.length > 0 && (
                                <Select
                                    options={districts}
                                    placeholder="Select District"
                                    value={filters.district}
                                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                                />
                            )}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="mb-3 font-medium text-white">Price (EGP/month)</h3>
                        <div className="flex gap-3">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Size Range */}
                    <div>
                        <h3 className="mb-3 font-medium text-white">Size (m²)</h3>
                        <div className="flex gap-3">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minSize}
                                onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxSize}
                                onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Rooms (only for offices) */}
                    {type === 'OFFICE' && (
                        <div>
                            <h3 className="mb-3 font-medium text-white">Rooms</h3>
                            <Select
                                options={[
                                    { value: '1', label: '1 Room' },
                                    { value: '2', label: '2 Rooms' },
                                    { value: '3', label: '3 Rooms' },
                                    { value: '4', label: '4 Rooms' },
                                    { value: '5', label: '5+ Rooms' },
                                ]}
                                placeholder="Any"
                                value={filters.rooms}
                                onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Amenities */}
                    <div>
                        <h3 className="mb-3 font-medium text-white">Amenities</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {AMENITIES.map((amenity) => (
                                <label
                                    key={amenity.value}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 p-2 text-sm text-gray-300 hover:border-emerald-500"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.amenities.includes(amenity.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFilters({ ...filters, amenities: [...filters.amenities, amenity.value] });
                                            } else {
                                                setFilters({ ...filters, amenities: filters.amenities.filter((a) => a !== amenity.value) });
                                            }
                                        }}
                                        className="rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    {amenity.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-3">
                    <Button variant="secondary" onClick={handleReset} className="flex-1">
                        Reset
                    </Button>
                    <Button onClick={handleApply} className="flex-1">
                        Apply Filters
                    </Button>
                </div>
            </div>
        </>
    );
}