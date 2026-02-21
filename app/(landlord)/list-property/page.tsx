'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

    // Redirect if not logged in
    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center">
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

    const onSubmit = async (data: PropertyInput) => {
        setIsLoading(true);
        setError('');

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
        <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    List Your <span className="text-emerald-500">Property</span>
                </h1>
                <p className="mt-2 text-gray-600">
                    Fill in the details below to list your office or coworking space
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Property Type
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="OFFICE"
                                        {...register('propertyType')}
                                        className="h-4 w-4 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <span className="text-gray-700">Office</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="COWORKING"
                                        {...register('propertyType')}
                                        className="h-4 w-4 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <span className="text-gray-700">Coworking Space</span>
                                </label>
                            </div>
                        </div>

                        <Input
                            label="Property Title"
                            placeholder="Modern Office in Maadi"
                            error={errors.title?.message}
                            {...register('title')}
                        />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description (min 50 characters)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Describe your property in detail..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">Details</h2>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Input
                            label="Price (EGP/month)"
                            type="number"
                            placeholder="50000"
                            error={errors.price?.message}
                            {...register('price', { valueAsNumber: true })}
                        />

                        <Input
                            label="Size (sqm)"
                            type="number"
                            placeholder="120"
                            error={errors.size?.message}
                            {...register('size', { valueAsNumber: true })}
                        />

                        <Input
                            label="Rooms (optional)"
                            type="number"
                            placeholder="3"
                            error={errors.rooms?.message}
                            {...register('rooms', { valueAsNumber: true })}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">Amenities</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {AMENITIES.map((amenity) => (
                            <label
                                key={amenity.value}
                                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${selectedAmenities.includes(amenity.value)
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedAmenities.includes(amenity.value)}
                                    onChange={() => toggleAmenity(amenity.value)}
                                    className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm">{amenity.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">Location</h2>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none"
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

                            <Input
                                label="District"
                                placeholder="Maadi"
                                error={errors.district?.message}
                                {...register('district')}
                            />
                        </div>

                        <Input
                            label="Full Address"
                            placeholder="123 Street Name, Building Name"
                            error={errors.address?.message}
                            {...register('address')}
                        />
                    </div>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
                    <strong>Note:</strong> Your property will be reviewed by our team before it appears on the site.
                    This usually takes 24-48 hours.
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full">
                    Submit Listing
                </Button>
            </form>
        </div>
    );
}