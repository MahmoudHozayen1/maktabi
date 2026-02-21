'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapFilters from './MapFilters';
import PropertyList from './PropertyList';

// Dynamic import for Leaflet (no SSR)
const MapView = dynamic(() => import('./MapView'), {
    ssr: false,
    loading: () => (
        <div className="flex h-[600px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
            <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                <p className="text-gray-500">Loading map...</p>
            </div>
        </div>
    ),
});

interface ApiProperty {
    id: string;
    serialNumber: number;
    title: string;
    type: 'OFFICE' | 'COWORKING';
    price: number;
    district: string;
    city: string;
    lat: number | null;
    lng: number | null;
    size: number;
    rooms: number | null;
}

interface MapProperty {
    id: string;
    title: string;
    type: 'office' | 'coworking';
    price: number;
    district: string;
    city: string;
    lat: number;
    lng: number;
    size: number;
    rooms?: number;
}

export default function MapPage() {
    const [properties, setProperties] = useState<ApiProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<'all' | 'office' | 'coworking'>('all');
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await fetch('/api/properties');
            const data = await res.json();
            setProperties(data.properties || []);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    };

    // Transform properties for map display (filter those with lat/lng and convert types)
    const mapProperties: MapProperty[] = properties
        .filter((p): p is ApiProperty & { lat: number; lng: number } =>
            p.lat !== null && p.lng !== null
        )
        .map((p) => ({
            id: p.id,
            title: p.title,
            type: p.type.toLowerCase() as 'office' | 'coworking',
            price: p.price,
            district: p.district,
            city: p.city,
            lat: p.lat,
            lng: p.lng,
            size: p.size,
            rooms: p.rooms ?? undefined, // Convert null to undefined
        }));

    const filteredCount = mapProperties.filter((p) => {
        if (selectedType !== 'all' && p.type !== selectedType) return false;
        if (selectedCity && p.city !== selectedCity) return false;
        return true;
    }).length;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500">Loading properties...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Explore <span className="text-emerald-600">Map</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Find offices and coworking spaces near you
                    </p>
                </div>

                {/* Filters */}
                <MapFilters
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    propertyCount={filteredCount}
                />

                {/* Map + List Layout */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Map */}
                    <div className="lg:col-span-2">
                        <MapView
                            properties={mapProperties}
                            selectedType={selectedType}
                            selectedCity={selectedCity}
                        />
                    </div>

                    {/* Property List */}
                    <div className="lg:col-span-1">
                        <PropertyList
                            properties={mapProperties}
                            selectedType={selectedType}
                            selectedCity={selectedCity}
                        />
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                        <span>Offices</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                        <span>Coworking Spaces</span>
                    </div>
                </div>
            </div>
        </div>
    );
}