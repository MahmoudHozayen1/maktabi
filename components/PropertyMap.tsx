'use client';

import { MapPin } from 'lucide-react';
import { useSyncExternalStore } from 'react';

interface PropertyMapProps {
    lat: number;
    lng: number;
    title: string;
}

// Helper to detect client-side rendering without useEffect
const emptySubscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
    return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

export default function PropertyMap({ lat, lng, title }: PropertyMapProps) {
    const isClient = useIsClient();

    if (!isClient) {
        return (
            <div className="flex h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                <div className="text-center text-gray-500">
                    <MapPin className="mx-auto mb-2 h-8 w-8" />
                    <p>Loading map...</p>
                </div>
            </div>
        );
    }

    // Using OpenStreetMap embed (no API key required)
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
            <iframe
                src={osmUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map showing location of ${title}`}
            />
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>{lat.toFixed(6)}, {lng.toFixed(6)}</span>
                </div>
                <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Open in Google Maps →
                </a>
            </div>
        </div>
    );
}