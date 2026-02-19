'use client';

import { useState } from 'react';
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

// Sample properties data - replace with real data from API
const sampleProperties = [
    {
        id: '1',
        title: 'Modern Office in Maadi',
        type: 'office' as const,
        price: 50000,
        district: 'Maadi',
        city: 'Cairo',
        lat: 29.9602,
        lng: 31.2569,
        size: 120,
        rooms: 3,
    },
    {
        id: '2',
        title: 'Creative Hub Zamalek',
        type: 'coworking' as const,
        price: 3000,
        district: 'Zamalek',
        city: 'Cairo',
        lat: 30.0609,
        lng: 31.2193,
        size: 500,
    },
    {
        id: '3',
        title: 'Premium Office Downtown',
        type: 'office' as const,
        price: 75000,
        district: 'Downtown',
        city: 'Cairo',
        lat: 30.0444,
        lng: 31.2357,
        size: 200,
        rooms: 5,
    },
    {
        id: '4',
        title: 'Tech Coworking Space',
        type: 'coworking' as const,
        price: 4500,
        district: 'Fifth Settlement',
        city: 'New Cairo',
        lat: 30.0074,
        lng: 31.4913,
        size: 800,
    },
    {
        id: '5',
        title: 'Executive Office Heliopolis',
        type: 'office' as const,
        price: 60000,
        district: 'Heliopolis',
        city: 'Cairo',
        lat: 30.0911,
        lng: 31.3225,
        size: 150,
        rooms: 4,
    },
    {
        id: '6',
        title: 'Startup Hub Dokki',
        type: 'coworking' as const,
        price: 2500,
        district: 'Dokki',
        city: 'Giza',
        lat: 30.0385,
        lng: 31.2012,
        size: 400,
    },
    {
        id: '7',
        title: 'Business Center Mohandessin',
        type: 'office' as const,
        price: 45000,
        district: 'Mohandessin',
        city: 'Giza',
        lat: 30.0561,
        lng: 31.2001,
        size: 100,
        rooms: 2,
    },
    {
        id: '8',
        title: 'Flexible Workspace Nasr City',
        type: 'coworking' as const,
        price: 2000,
        district: 'Nasr City',
        city: 'Cairo',
        lat: 30.0511,
        lng: 31.3656,
        size: 350,
    },
];

export default function MapPage() {
    const [selectedType, setSelectedType] = useState<'all' | 'office' | 'coworking'>('all');
    const [selectedCity, setSelectedCity] = useState('');

    const filteredCount = sampleProperties.filter((p) => {
        if (selectedType !== 'all' && p.type !== selectedType) return false;
        if (selectedCity && p.city !== selectedCity) return false;
        return true;
    }).length;

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
                            properties={sampleProperties}
                            selectedType={selectedType}
                            selectedCity={selectedCity}
                        />
                    </div>

                    {/* Property List */}
                    <div className="lg:col-span-1">
                        <PropertyList
                            properties={sampleProperties}
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