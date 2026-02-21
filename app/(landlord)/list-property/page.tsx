
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const propertySchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    price: z.number().min(1000, 'Minimum price is 1,000 EGP'),
    size: z.number().min(10, 'Minimum size is 10 sqm'),
    rooms: z.number().min(1, 'At least 1 room required').optional(),
    city: z.string().min(1, 'Please select a city'),
    district: z.string().min(1, 'Please enter a district'),
    address: z.string().min(10, 'Please enter full address'),
    propertyType: z.enum(['OFFICE', 'COWORKING']),
    amenities: z.array(z.string()).optional(),
});

type PropertyInput = z.infer<typeof propertySchema>;

const AMENITIES = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'parking', label: 'Parking' },
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'security', label: '24/7 Security' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'reception', label: 'Reception' },
    { value: 'meeting-room', label: 'Meeting Room' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'furnished', label: 'Furnished' },
];

// Default coordinates for cities (center of each city)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'Cairo': { lat: 30.0444, lng: 31.2357 },
    'Giza': { lat: 30.0131, lng: 31.2089 },
    'New Cairo': { lat: 30.0074, lng: 31.4913 },
    '6th October': { lat: 29.9285, lng: 30.9188 },
    'Alexandria': { lat: 31.2001, lng: 29.9187 },
};

// District-specific coordinates for more accuracy
const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'maadi': { lat: 29.9602, lng: 31.2569 },
    'zamalek': { lat: 30.0609, lng: 31.2193 },
    'downtown': { lat: 30.0444, lng: 31.2357 },
    'heliopolis': { lat: 30.0911, lng: 31.3225 },
    'nasr city': { lat: 30.0511, lng: 31.3656 },
    'dokki': { lat: 30.0385, lng: 31.2012 },
    'mohandessin': { lat: 30.0561, lng: 31.2001 },
    'fifth settlement': { lat: 30.0074, lng: 31.4913 },
    'new cairo': { lat: 30.0074, lng: 31.4913 },
    'sheikh zayed': { lat: 30.0394, lng: 30.9806 },
    'tagamoa': { lat: 30.0074, lng: 31.4913 },
    'rehab': { lat: 30.0580, lng: 31.4900 },
};

export default function ListPropertyPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PropertyInput>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            propertyType: 'OFFICE',
        },
    });

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        router.push('/login');
        return null;
    }

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((a) => a !== amenity)
                : [...prev, amenity]
        );
    };

    const getCoordinates = (city: string, district: string) => {
        // Try to get district-specific coordinates first
        const districtLower = district.toLowerCase().trim();
        if (DISTRICT_COORDINATES[districtLower]) {
            // Add small random offset to avoid stacking markers
            const offset = () => (Math.random() - 0.5) * 0.01;
            return {
                lat: DISTRICT_COORDINATES[districtLower].lat + offset(),
                lng: DISTRICT_COORDINATES[districtLower].lng + offset(),
            };
        }

        // Fall back to city coordinates
        if (CITY_COORDINATES[city]) {
            const offset = () => (Math.random() - 0.5) * 0.02;
            return {
                lat: CITY_COORDINATES[city].lat + offset(),
                lng: CITY_COORDINATES[city].lng + offset(),
            };
        }

        // Default to Cairo center
        return { lat: 30.0444, lng: 31.2357 };
    };

    const onSubmit = async (data: PropertyInput) => {
        setIsLoading(true);
        setError('');

        // Get coordinates based on city and district
        const coordinates = getCoordinates(data.city, data.district);

        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    size: data.size,
                    rooms: data.rooms || null,
                    type: data.propertyType,
                    city: data.city,
                    district: data.district,
                    address: data.address,
                    amenities: selectedAmenities,
                    images: [],
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || 'Failed to submit property');
                return;
            }

            router.push('/dashboard');
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="mx-auto max-w-3xl px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        List Your <span className="text-emerald-600">Property</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Fill in the details below to list your office or coworking space
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-gray-900">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Property Type
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="OFFICE"
                                            {...register('propertyType')}
                                            className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                        />
                                        <span className="text-gray-700">Office</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="COWORKING"
                                            {...register('propertyType')}
                                            className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                        />
                                        <span className="text-gray-700">Coworking Space</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Property Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Modern Office in Maadi"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    {...register('title')}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description <span className="text-gray-400">(min 50 characters)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your property in detail..."
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    {...register('description')}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-gray-900">Details</h2>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Price (EGP/month)
                                </label>
                                <input
                                    type="number"
                                    placeholder="50000"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    {...register('price', { valueAsNumber: true })}
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Size (sqm)
                                </label>
                                <input
                                    type="number"
                                    placeholder="120"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    {...register('size', { valueAsNumber: true })}
                                />
                                {errors.size && (
                                    <p className="mt-1 text-sm text-red-500">{errors.size.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Rooms <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="3"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    {...register('rooms', { valueAsNumber: true })}
                                />
                                {errors.rooms && (
                                    <p className="mt-1 text-sm text-red-500">{errors.rooms.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-gray-900">Amenities</h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {AMENITIES.map((amenity) => (
                                <label
                                    key={amenity.value}
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${selectedAmenities.includes(amenity.value)
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(amenity.value)}
                                        onChange={() => toggleAmenity(amenity.value)}
                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm">{amenity.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-gray-900">Location</h2>

                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <select
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        {...register('city')}
                                    >
                                        <option value="">Select city</option>
                                        <option value="Cairo">Cairo</option>
                                        <option value="Giza">Giza</option>
                                        <option value="New Cairo">New Cairo</option>
                                        <option value="6th October">6th October</option>
                                        <option value="Alexandria">Alexandria</option>
                                    </select>
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Maadi, Zamalek, Dokki..."
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        {...register('district')}
                                    />
                                    {errors.district && (
                                        <p className="mt-1 text-sm text-red-500">{errors.district.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="123 Street Name, Building Name"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    {...register('address')}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                        <strong>Note:</strong> Your property will be reviewed by our team before it appears on the site.
                        This usually takes 24-48 hours.
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" isLoading={isLoading} className="w-full">
                        Submit Listing
                    </Button>
                </form>
            </div>
        </div>
    );
}