'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PropertyMapProps {
    lat: number;
    lng: number;
    title: string;
    propertyId: string;
    showExact: boolean; // true for admins, owner/uploader
    radiusMeters?: number; // obfuscation radius max
}

function seededRandom(seed: number) {
    return function () {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashStringToInt(s: string) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h + 2654435761, 1) >>> 0;
    }
    return h >>> 0;
}

function offsetLatLng(lat: number, lng: number, distanceMeters: number, angleRad: number) {
    const earthRadius = 6378137; // meters
    const dy = distanceMeters * Math.cos(angleRad);
    const dx = distanceMeters * Math.sin(angleRad);
    const dLat = (dy / earthRadius) * (180 / Math.PI);
    const dLng = (dx / (earthRadius * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
    return { lat: lat + dLat, lng: lng + dLng };
}

// simple div icon so Marker shows without asset imports
const makeDivIcon = (color = '#10B981') =>
    L.divIcon({
        className: 'custom-marker',
        html: `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${color};box-shadow:0 0 0 4px rgba(0,0,0,0.06)"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    });

export default function PropertyMap({
    lat,
    lng,
    title,
    propertyId,
    showExact,
    radiusMeters = 300,
}: PropertyMapProps) {
    // compute display coordinates deterministically
    const { displayLat, displayLng, usedRadius } = useMemo(() => {
        if (showExact) return { displayLat: lat, displayLng: lng, usedRadius: 0 };

        const seed = hashStringToInt(propertyId);
        const rnd = seededRandom(seed);

        const min = Math.max(50, Math.floor(radiusMeters * 0.4));
        const max = Math.max(min + 1, Math.floor(radiusMeters));
        const distance = Math.floor(min + rnd() * (max - min + 1));
        const angle = rnd() * Math.PI * 2;
        const p = offsetLatLng(lat, lng, distance, angle);
        return { displayLat: p.lat, displayLng: p.lng, usedRadius: distance };
    }, [lat, lng, propertyId, showExact, radiusMeters]);

    const mapCenter = [displayLat, displayLng] as [number, number];
    const zoom = showExact ? 15 : 13;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
            <MapContainer center={mapCenter} zoom={zoom} style={{ height: 300, width: '100%' }} scrollWheelZoom={false} attributionControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {showExact ? (
                    <Marker position={[lat, lng]} icon={makeDivIcon()}>
                        <Tooltip>{title}</Tooltip>
                    </Marker>
                ) : (
                    <>
                        {/* Circle showing obfuscated area (centered at the obfuscated point) */}
                        <Circle center={mapCenter} radius={usedRadius} pathOptions={{ color: '#F59E0B', fillColor: '#FDE68A', fillOpacity: 0.25 }} />
                        {/* small marker at the approximate point for context */}
                        <Marker position={mapCenter} icon={makeDivIcon('#F59E0B')}>
                            <Tooltip>Approximate area (not exact)</Tooltip>
                        </Marker>
                    </>
                )}
            </MapContainer>

            <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
                {showExact ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Exact coordinates</span>
                        <span>{lat.toFixed(6)}, {lng.toFixed(6)}</span>
                    </div>
                ) : (
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Approximate location</span>
                        </div>
                        <div className="text-xs text-gray-500">Shown within ~{usedRadius} m of actual location</div>
                    </div>
                )}

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