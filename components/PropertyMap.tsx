'use client';

import { useSyncExternalStore } from 'react';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
    lat: number;
    lng: number;
    title: string;
    propertyId: string;
    showExact: boolean; // true for admins, owner/uploader
    radiusMeters?: number; // approximate radius to show when obfuscating
}

const emptySubscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
    return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

// deterministic pseudo-random generator (mulberry32)
function seededRandom(seed: number) {
    return function () {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashStringToInt(s: string) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0;
}

function offsetLatLng(lat: number, lng: number, distanceMeters: number, angleRad: number) {
    // approximate conversions
    const earthRadius = 6378137; // meters
    const dy = distanceMeters * Math.cos(angleRad);
    const dx = distanceMeters * Math.sin(angleRad);
    const dLat = (dy / earthRadius) * (180 / Math.PI);
    const dLng = (dx / (earthRadius * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
    return { lat: lat + dLat, lng: lng + dLng };
}

export default function PropertyMap({
    lat,
    lng,
    title,
    propertyId,
    showExact,
    radiusMeters = 300,
}: PropertyMapProps) {
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

    if (typeof lat !== 'number' || typeof lng !== 'number') {
        return (
            <div className="flex h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                <div className="text-center text-gray-500">
                    <MapPin className="mx-auto mb-2 h-8 w-8" />
                    <p>No location provided</p>
                </div>
            </div>
        );
    }

    // Determine display coordinates.
    // If showExact === true => show exact lat/lng.
    // Otherwise compute a deterministic random offset within radiusMeters.
    let displayLat = lat;
    let displayLng = lng;
    let approximateRadius = 0;

    if (!showExact) {
        const seed = hashStringToInt(propertyId);
        const rnd = seededRandom(seed);
        // distance between 0.4*radius and radius (so not zero)
        const min = Math.max(50, Math.floor(radiusMeters * 0.4));
        const max = Math.max(min + 1, Math.floor(radiusMeters));
        const distance = Math.floor(min + rnd() * (max - min + 1));
        const angle = rnd() * Math.PI * 2;
        const p = offsetLatLng(lat, lng, distance, angle);
        displayLat = p.lat;
        displayLng = p.lng;
        approximateRadius = distance;
    }

    // bbox padding ~ 0.01 deg ~ covers small area; compute bbox around display point
    const latPad = 0.01;
    const lngPad = 0.01;
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${displayLng - lngPad},${displayLat - latPad},${displayLng + lngPad},${displayLat + latPad}&layer=mapnik&marker=${displayLat},${displayLng}`;

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
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    {showExact ? (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                            <span>{lat.toFixed(6)}, {lng.toFixed(6)}</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-yellow-600" />
                                <span>Approximate location</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Shown within ~{approximateRadius} m of actual location
                            </div>
                        </>
                    )}
                </div>

                <a
                    href={`https://www.google.com/maps?q=${displayLat},${displayLng}`}
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