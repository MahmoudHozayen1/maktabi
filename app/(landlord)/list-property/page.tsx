'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    rooms: z.number().min(1, 'At least 1 room required'),
    city: z.string().min(1, 'Please select a city'),
    district: z.string().min(1, 'Please enter a district'),
    address: z.string().min(10, 'Please enter full address'),
    propertyType: z.enum(['office', 'coworking']),
});

type PropertyInput = z.infer<typeof propertySchema>;

export default function ListPropertyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PropertyInput>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            propertyType: 'office',
        },
    });

    const onSubmit = async (data: PropertyInput) => {
        setIsLoading(true);
        try {
            // TODO: Submit to API
            console.log(data);
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    List Your <span className="text-emerald-500">Property</span>
                </h1>
                <p className="mt-2 text-gray-400">
                    Fill in the details below to list your office or coworking space
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Property Type
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="office"
                                        {...register('propertyType')}
                                        className="text-emerald-500"
                                    />
                                    <span>Office</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="coworking"
                                        {...register('propertyType')}
                                        className="text-emerald-500"
                                    />
                                    <span>Coworking Space</span>
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
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Describe your property..."
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Details</h2>

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
                            label="Rooms"
                            type="number"
                            placeholder="3"
                            error={errors.rooms?.message}
                            {...register('rooms', { valueAsNumber: true })}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Location</h2>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    City
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                    {...register('city')}
                                >
                                    <option value="">Select city</option>
                                    <option value="cairo">Cairo</option>
                                    <option value="giza">Giza</option>
                                    <option value="new-cairo">New Cairo</option>
                                    <option value="6th-october">6th October</option>
                                    <option value="alexandria">Alexandria</option>
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

                <Button type="submit" isLoading={isLoading} className="w-full">
                    Submit Listing
                </Button>
            </form>
        </div>
    );
}