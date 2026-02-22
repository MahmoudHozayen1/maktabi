import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { MapPin, Users, Clock, Wifi, Coffee, Monitor } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import TrackLeadButton from '@/components/TrackLeadButton';
import PropertyMap from '@/components/PropertyMap';
import FavoriteButton from '@/components/FavoriteButton';
import StarRating from '@/components/StarRating';
import RatingInput from '@/components/RatingInput';
import ReviewsList from '@/components/ReviewsList';
import ImageGallery from '@/components/ImageGallery';

export const revalidate = 60;

export default async function CoworkingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    name: true,
                    phone: true,
                },
            },
            ratings: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
            favorites: session?.user?.id ? {
                where: { userId: session.user.id },
            } : false,
        },
    });

    if (!property || property.type !== 'COWORKING') {
        notFound();
    }

    const avgRating = property.ratings.length > 0
        ? property.ratings.reduce((acc, r) => acc + r.stars, 0) / property.ratings.length
        : 0;

    const userRating = session?.user?.id
        ? property.ratings.find((r) => r.userId === session.user.id)
        : null;

    const isFavorited = Array.isArray(property.favorites) && property.favorites.length > 0;

    const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
        wifi: { icon: Wifi, label: 'High-Speed WiFi' },
        coffee: { icon: Coffee, label: 'Free Coffee & Tea' },
        'meeting-room': { icon: Users, label: 'Meeting Rooms' },
        printer: { icon: Monitor, label: 'Printer & Scanner' },
        locker: { icon: Monitor, label: 'Personal Lockers' },
        kitchen: { icon: Coffee, label: 'Kitchen Access' },
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-8">
                <Link
                    href="/coworking"
                    className="text-sm text-gray-500 hover:text-emerald-600"
                >
                    ← Back to Coworking Spaces
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="mb-8">
                        {property.images && property.images.length > 0 ? (
                            <ImageGallery images={property.images} title={property.title} />
                        ) : (
                            <div className="flex aspect-video items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                                <Users className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Serial & Rating Badge */}
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                            Property #{property.serialNumber}
                        </span>
                        <StarRating rating={avgRating} totalReviews={property.ratings.length} />
                    </div>

                    <h1 className="mb-4 text-3xl font-bold text-gray-900">{property.title}</h1>
                    <div className="mb-6 flex items-center gap-2 text-gray-500">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        <span>{property.address}</span>
                    </div>

                    <div className="mb-8 grid grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
                        <div className="text-center">
                            <Users className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                            <div className="font-bold text-gray-900">{property.size}</div>
                            <div className="text-sm text-gray-500">Capacity</div>
                        </div>
                        <div className="text-center">
                            <Clock className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                            <div className="font-bold text-gray-900 text-sm">24/7</div>
                            <div className="text-sm text-gray-500">Access</div>
                        </div>
                        <div className="text-center">
                            <MapPin className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                            <div className="font-bold text-gray-900">{property.district}</div>
                            <div className="text-sm text-gray-500">{property.city}</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">About This Space</h2>
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
                                            <div
                                                key={amenity}
                                                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
                                            >
                                                <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <item.icon className="h-5 w-5 text-emerald-600" />
                                            <span className="text-sm text-gray-700">{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {property.lat && property.lng && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">Location</h2>
                            <PropertyMap
                                lat={property.lat}
                                lng={property.lng}
                                title={property.title}
                            />
                        </div>
                    )}

                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">
                            Reviews ({property.ratings.length})
                        </h2>
                        <div className="grid gap-6 lg:grid-cols-2">
                            <RatingInput
                                propertyId={property.id}
                                existingRating={userRating ? {
                                    stars: userRating.stars,
                                    comment: userRating.comment,
                                } : null}
                            />
                            <ReviewsList reviews={property.ratings} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 text-center">
                                <p className="text-sm text-gray-500">Starting from</p>
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
                                <FavoriteButton
                                    propertyId={property.id}
                                    initialFavorited={isFavorited}
                                />
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <p className="text-sm text-gray-500">Listed by</p>
                                <p className="font-medium text-gray-900">{property.owner?.name || 'MAKTABI'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}