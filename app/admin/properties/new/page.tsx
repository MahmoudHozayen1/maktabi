'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ImageUpload';

export default function NewPropertyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultType = searchParams.get('type') || 'OFFICE';

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        priceDaily: '',
        priceHourly: '',
        pricingType: 'MONTHLY',
        size: '',
        rooms: '',
        type: defaultType,
        address: '',
        city: '',
        district: '',
        lat: '',
        lng: '',
        status: 'APPROVED',
        featured: false,
        amenities: [] as string[],
    });

    const AMENITIES = [
        { value: 'wifi', label: 'Wi-Fi' },
        { value: 'parking', label: 'Parking' },
        { value: 'ac', label: 'Air Conditioning' },
        { value: 'security', label: '24/7 Security' },
        { value: 'elevator', label: 'Elevator' },
        { value: 'reception', label: 'Reception' },
        { value: 'meeting-room', label: 'Meeting Room' },
        { value: 'kitchen', label: 'Kitchen' },
        { value: 'coffee', label: 'Free Coffee' },
        { value: 'furnished', label: 'Furnished' },
    ];

    const toggleAmenity = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/admin/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    priceDaily: formData.priceDaily ? parseFloat(formData.priceDaily) : null,
                    priceHourly: formData.priceHourly ? parseFloat(formData.priceHourly) : null,
                    pricingType: formData.type === 'COWORKING' ? formData.pricingType : 'MONTHLY',
                    size: parseFloat(formData.size),
                    rooms: formData.rooms ? parseInt(formData.rooms) : null,
                    type: formData.type,
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    lat: formData.lat ? parseFloat(formData.lat) : null,
                    lng: formData.lng ? parseFloat(formData.lng) : null,
                    status: formData.status,
                    featured: formData.featured,
                    amenities: formData.amenities,
                    images: images,
                }),
            });

            if (res.ok) {
                router.push('/admin/properties');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create property');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const isCoworking = formData.type === 'COWORKING';

    return (
        <div>
            <div className="mb-8">
                <Link
                    href="/admin/properties"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Properties
                </Link>
                <h1 className="text-3xl font-bold">
                    Add New {isCoworking ? 'Coworking Space' : 'Office'}
                </h1>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Property Type</h2>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={formData.type === 'OFFICE'}
                                onChange={() => setFormData({ ...formData, type: 'OFFICE', pricingType: 'MONTHLY' })}
                                className="h-4 w-4 text-emerald-500"
                            />
                            <span>Office</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={formData.type === 'COWORKING'}
                                onChange={() => setFormData({ ...formData, type: 'COWORKING' })}
                                className="h-4 w-4 text-emerald-500"
                            />
                            <span>Coworking Space</span>
                        </label>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={isCoworking ? 'e.g., The Hub Coworking - Zamalek' : 'e.g., Modern Office in Maadi'}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the property..."
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Pricing</h2>

                    {isCoworking && (
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-300">Pricing Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.pricingType === 'HOURLY'}
                                        onChange={() => setFormData({ ...formData, pricingType: 'HOURLY' })}
                                        className="h-4 w-4 text-emerald-500"
                                    />
                                    <span>Per Hour</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.pricingType === 'DAILY'}
                                        onChange={() => setFormData({ ...formData, pricingType: 'DAILY' })}
                                        className="h-4 w-4 text-emerald-500"
                                    />
                                    <span>Per Day</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.pricingType === 'MONTHLY'}
                                        onChange={() => setFormData({ ...formData, pricingType: 'MONTHLY' })}
                                        className="h-4 w-4 text-emerald-500"
                                    />
                                    <span>Per Month</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-3">
                        {isCoworking ? (
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">
                                        Price per Hour (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.priceHourly}
                                        onChange={(e) => setFormData({ ...formData, priceHourly: e.target.value })}
                                        placeholder="e.g., 50"
                                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">
                                        Price per Day (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.priceDaily}
                                        onChange={(e) => setFormData({ ...formData, priceDaily: e.target.value })}
                                        placeholder="e.g., 300"
                                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">
                                        Price per Month (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="e.g., 5000"
                                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Price (EGP/month)
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Details</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                {isCoworking ? 'Capacity (seats)' : 'Size (sqm)'}
                            </label>
                            <input
                                type="number"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                {isCoworking ? 'Private Rooms' : 'Rooms'}
                            </label>
                            <input
                                type="number"
                                value={formData.rooms}
                                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Images</h2>
                    <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
                </div>

                {/* Amenities */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Amenities</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {AMENITIES.map((amenity) => (
                            <label
                                key={amenity.value}
                                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${formData.amenities.includes(amenity.value)
                                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                        : 'border-gray-700 text-gray-300 hover:border-gray-600'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.amenities.includes(amenity.value)}
                                    onChange={() => toggleAmenity(amenity.value)}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-emerald-500"
                                />
                                <span className="text-sm">{amenity.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Location</h2>
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">City</label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Select city</option>
                                    <option value="Cairo">Cairo</option>
                                    <option value="Giza">Giza</option>
                                    <option value="New Cairo">New Cairo</option>
                                    <option value="6th October">6th October</option>
                                    <option value="Alexandria">Alexandria</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">District</label>
                                <input
                                    type="text"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Full Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">Latitude</label>
                                <input
                                    type="text"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                    placeholder="e.g., 30.0444"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">Longitude</label>
                                <input
                                    type="text"
                                    value={formData.lng}
                                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                    placeholder="e.g., 31.2357"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Status</h2>
                    <div className="flex items-center gap-6">
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                        >
                            <option value="APPROVED">Approved (Live)</option>
                            <option value="PENDING">Pending</option>
                        </select>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-emerald-500"
                            />
                            <span>Featured Property</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" isLoading={saving} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        Create Property
                    </Button>
                    <Link
                        href="/admin/properties"
                        className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 text-gray-300 hover:bg-gray-700"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}