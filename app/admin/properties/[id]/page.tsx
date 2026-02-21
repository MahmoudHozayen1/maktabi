'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface Property {
    id: string;
    serialNumber: number;
    title: string;
    description: string;
    price: number;
    size: number;
    rooms: number | null;
    type: 'OFFICE' | 'COWORKING';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    address: string;
    city: string;
    district: string;
    lat: number | null;
    lng: number | null;
    amenities: string[];
    featured: boolean;
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        size: 0,
        rooms: 0,
        address: '',
        city: '',
        district: '',
        lat: '',
        lng: '',
        status: 'PENDING',
        featured: false,
    });

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            const res = await fetch(`/api/admin/properties/${id}`);
            const data = await res.json();

            if (data.property) {
                setProperty(data.property);
                setFormData({
                    title: data.property.title,
                    description: data.property.description,
                    price: data.property.price,
                    size: data.property.size,
                    rooms: data.property.rooms || 0,
                    address: data.property.address,
                    city: data.property.city,
                    district: data.property.district,
                    lat: data.property.lat?.toString() || '',
                    lng: data.property.lng?.toString() || '',
                    status: data.property.status,
                    featured: data.property.featured,
                });
            }
        } catch (err) {
            setError('Failed to load property');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`/api/admin/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price.toString()),
                    size: parseFloat(formData.size.toString()),
                    rooms: formData.rooms ? parseInt(formData.rooms.toString()) : null,
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    lat: formData.lat ? parseFloat(formData.lat) : null,
                    lng: formData.lng ? parseFloat(formData.lng) : null,
                    status: formData.status,
                    featured: formData.featured,
                }),
            });

            if (res.ok) {
                setSuccess('Property updated successfully!');
                setTimeout(() => {
                    router.push('/admin/properties');
                }, 1500);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update property');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-400">Loading property...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="text-center py-24">
                <p className="text-gray-400">Property not found</p>
                <Link href="/admin/properties" className="text-emerald-500 hover:underline mt-4 inline-block">
                    ← Back to Properties
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/properties"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Properties
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Edit Property</h1>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-500">
                        #{property.serialNumber}
                    </span>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-500">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">Price (EGP/month)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">Size (sqm)</label>
                                <input
                                    type="number"
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">Rooms</label>
                                <input
                                    type="number"
                                    value={formData.rooms}
                                    onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Location</h2>

                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">District</label>
                                <input
                                    type="text"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
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
                            />
                        </div>
                    </div>
                </div>

                {/* Map Coordinates */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-bold">Map Coordinates</h2>
                    </div>

                    <p className="mb-4 text-sm text-gray-400">
                        Set the exact location for this property on the map. You can find coordinates using Google Maps (right-click on location and select &quot;What&apos;s here?&quot;).
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Latitude
                            </label>
                            <input
                                type="text"
                                value={formData.lat}
                                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                placeholder="e.g., 30.0444"
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">Range: -90 to 90</p>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Longitude
                            </label>
                            <input
                                type="text"
                                value={formData.lng}
                                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                placeholder="e.g., 31.2357"
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">Range: -180 to 180</p>
                        </div>
                    </div>

                    {formData.lat && formData.lng && (
                        <div className="mt-4">
                            <a
                                href={`https://www.google.com/maps?q=${formData.lat},${formData.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:underline"
                            >
                                <MapPin className="h-4 w-4" />
                                Preview on Google Maps
                            </a>
                        </div>
                    )}
                </div>

                {/* Status & Featured */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-lg font-bold">Status &amp; Visibility</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-gray-300">Featured Property</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" isLoading={saving} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
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