'use client';

import { use, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import Link from 'next/link';
import { Building2, Users, MapPin } from 'lucide-react';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Property type
interface Property {
    id: string;
    title: string;
    type: 'office' | 'coworking';
    price: number;
    district: string;
    city: string;
    lat: number;
    lng: number;
    size?: number;
    rooms?: number;
}

// Custom marker icon
const createIcon = (type: 'office' | 'coworking') => {
    return new Icon({
        iconUrl: type === 'office'
            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
            : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
};

// Component to fit bounds
function FitBounds({ properties }: { properties: Property[] }) {
    const map = useMap();

    useMemo(() => {
        if (properties.length > 0) {
            const bounds = new LatLngBounds(
                properties.map((p) => [p.lat, p.lng])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, properties]);

    return null;
}

interface MapViewProps {
    properties: Property[];
    selectedType: 'all' | 'office' | 'coworking';
    selectedCity: string;
}

export default function MapView({ properties, selectedType, selectedCity }: MapViewProps) {
    // Filter properties
    const filteredProperties = properties.filter((p) => {
        if (selectedType !== 'all' && p.type !== selectedType) return false;
        if (selectedCity && p.city !== selectedCity) return false;
        return true;
    });

    // Check if we're on the client - use typeof window check during render
    const isClient = typeof window !== 'undefined';

    if (!isClient) {
        return (
            <div className="flex h-[600px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500">Loading map...</p>
                </div>
            </div>
        );
    }

    // Egypt center coordinates
    const egyptCenter: [number, number] = [30.0444, 31.2357];

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-soft">
            <MapContainer
                center={egyptCenter}
                zoom={11}
                style={{ height: '600px', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredProperties.length > 0 && <FitBounds properties={filteredProperties} />}

                {filteredProperties.map((property) => (
                    <Marker
                        key={property.id}
                        position={[property.lat, property.lng]}
                        icon={createIcon(property.type)}
                    >
                        <Popup>
                            <div className="min-w-[200px] p-1">
                                <div className="mb-2 flex items-center gap-2">
                                    {property.type === 'office' ? (
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <Users className="h-4 w-4 text-emerald-600" />
                                    )}
                                    <span className="text-xs font-medium uppercase text-gray-500">
                                        {property.type}
                                    </span>
                                </div>
                                <h3 className="mb-1 font-bold text-gray-900">{property.title}</h3>
                                <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="h-3 w-3" />
                                    {property.district}, {property.city}
                                </div>
                                <div className="mb-3 text-lg font-bold text-emerald-600">
                                    {property.price.toLocaleString()} EGP
                                    <span className="text-xs font-normal text-gray-400">/mo</span>
                                </div>
                                <Link
                                    href={`/${property.type === 'office' ? 'offices' : 'coworking'}/${property.id}`}
                                    className="block w-full rounded-lg bg-gray-900 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}