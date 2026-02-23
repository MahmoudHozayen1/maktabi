import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, Ruler, Car, Wifi, Shield } from 'lucide-react';
import prisma from '@/lib/prisma';
import Button from '@/components/ui/Button';
import TrackLeadButton from '@/components/TrackLeadButton';
import PropertyMap from '@/components/PropertyMap';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const revalidate = 60;

export default async function OfficeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                },
            },
        },
    });

    if (!property || property.type !== 'OFFICE') {
        notFound();
    }

    // Determine if viewer can see exact details
    const viewerRole = session?.user?.role;
    const viewerId = session?.user?.id;
    const isAdminOrOwner = viewerRole === 'ADMIN' || viewerRole === 'OWNER';
    const isUploader = !!(viewerId && property.ownerId === viewerId);
    const showExact = isAdminOrOwner || isUploader;

    const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
        wifi: { icon: Wifi, label: 'High-Speed WiFi' },
        parking: { icon: Car, label: 'Parking Available' },
        security: { icon: Shield, label: '24/7 Security' },
        ac: { icon: Building2, label: 'Air Conditioning' },
        elevator: { icon: Building2, label: 'Elevator' },
        reception: { icon: Building2, label: 'Reception' },
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-8">
                <Link href="/offices" className="text-sm text-gray-500 hover:text-emerald-600">← Back to Offices</Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {/* Image Gallery / Placeholder */}
                    <div className="mb-8 aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                        {property.images && property.images.length > 0 ? (
                            <Image src={property.images[0]} alt={property.title} width={800} height={450} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                <Building2 className="h-16 w-16" />
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                            Property #{property.serialNumber}
                        </span>
                    </div>

                    <h1 className="mb-4 text-3xl font-bold text-gray-900">{property.title}</h1>
                    <div className="mb-6 flex items-center gap-2 text-gray-500">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        <span>{property.address}</span>
                    </div>

                    <div className="mb-8 grid grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
                        <div className="text-center">
                            <Ruler className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                            <div className="font-bold text-gray-900">{property.size} sqm</div>
                            <div className="text-sm text-gray-500">Size</div>
                        </div>
                        <div className="text-center">
                            <Building2 className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                            <div className="font-bold text-gray-900">{property.rooms || '-'}</div>
                            <div className="text-sm text-gray-500">Rooms</div>
                        </div>
                        <div className="text-center">
                            <MapPin className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                            <div className="font-bold text-gray-900">{property.district}</div>
                            <div className="text-sm text-gray-500">{property.city}</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Description</h2>
                        <p className="leading-relaxed text-gray-600">{property.description}</p>
                    </div>

                    {property.amenities && property.amenities.length > 0 && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">Amenities</h2>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {property.amenities.map((amenity) => {
                                    const item = amenityIcons[amenity];
                                    if (!item) {
                                        return (
                                            <div key={amenity} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={amenity} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <item.icon className="h-5 w-5 text-emerald-600" />
                                            <span className="text-sm text-gray-700">{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Map Section */}
                    {property.lat && property.lng && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">Location</h2>
                            <PropertyMap
                                lat={property.lat}
                                lng={property.lng}
                                title={property.title}
                                propertyId={property.id}
                                showExact={showExact}
                            />
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 text-center">
                            <div className="text-3xl font-bold text-emerald-600">
                                {property.price.toLocaleString()} EGP
                            </div>
                            <div className="text-gray-500">per month</div>
                        </div>

                        <div className="space-y-3">
                            <TrackLeadButton
                                propertyId={property.id}
                                propertySerial={property.serialNumber}
                                propertyTitle={property.title}
                                phoneNumber={property.owner?.phone || '+201554515541'}
                            />
                            <Button variant="secondary" className="w-full">
                                Schedule Visit
                            </Button>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <p className="text-sm text-gray-500">Listed by</p>
                            <p className="font-medium text-gray-900">{property.owner?.name || 'MAKTABI'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}