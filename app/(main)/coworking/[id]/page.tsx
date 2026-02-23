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
import type { Property as PropertyModel, Rating as RatingModel, Favorite as FavoriteModel, User as UserModel } from '@prisma/client';

export const revalidate = 60;

// Property with relations types
type RatingWithUser = RatingModel & { user: { name: string | null; image: string | null } };
type FavoriteMaybe = FavoriteModel;
type OwnerMinimal = { name: string | null; phone?: string | null } | null;

type PropertyWithRelations = PropertyModel & {
    owner: OwnerMinimal;
    ratings: RatingWithUser[];
    favorites?: FavoriteMaybe[] | null;
};

export default async function CoworkingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const property = (await prisma.property.findUnique({
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
    })) as PropertyWithRelations | null;

    if (!property || property.type !== 'COWORKING') {
        notFound();
    }

    const avgRating =
        property.ratings.length > 0
            ? property.ratings.reduce((acc, r) => acc + r.stars, 0) / property.ratings.length
            : 0;

    const userRating = session?.user?.id
        ? property.ratings.find((r) => r.userId === session.user.id) || null
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

    // Helper to format price based on pricing type (these fields come from Prisma schema)
    const pricingType = property.pricingType ?? 'MONTHLY';
    const priceHourly = property.priceHourly ?? null;
    const priceDaily = property.priceDaily ?? null;
    const priceMonthly = property.price;

    const formatMainPrice = () => {
        switch (pricingType) {
            case 'HOURLY':
                return { amount: priceHourly ?? priceMonthly, label: 'per hour' };
            case 'DAILY':
                return { amount: priceDaily ?? priceMonthly, label: 'per day' };
            default:
                return { amount: priceMonthly, label: 'per month' };
        }
    };

    const mainPrice = formatMainPrice();

    return (
        <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-8">
                <Link href="/coworking" className="text-sm text-gray-500 hover:text-emerald-600">← Back to Coworking Spaces</Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        {property.images && property.images.length > 0 ? (
                            <ImageGallery images={property.images} title={property.title} />
                        ) : (
                            <div className="flex aspect-video items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                                <Users className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-4">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">Property #{property.serialNumber}</span>
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

                    {property.lat && property.lng && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">Location</h2>
                            <PropertyMap lat={property.lat} lng={property.lng} title={property.title} />
                        </div>
                    )}

                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Reviews ({property.ratings.length})</h2>
                        <div className="grid gap-6 lg:grid-cols-2">
                            <RatingInput
                                propertyId={property.id}
                                existingRating={userRating ? { stars: userRating.stars, comment: userRating.comment } : null}
                            />
                            <ReviewsList reviews={property.ratings} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 text-center">
                                <p className="text-sm text-gray-500">Starting from</p>
                                <div className="text-3xl font-bold text-emerald-600">{(mainPrice.amount ?? 0).toLocaleString()} EGP</div>
                                <div className="text-gray-500">{mainPrice.label}</div>
                            </div>

                            {(priceHourly || priceDaily || priceMonthly) && (
                                <div className="mb-6 space-y-2 border-t border-gray-100 pt-4">
                                    <p className="text-xs font-medium text-gray-500 uppercase">All Pricing Options</p>
                                    {priceHourly && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Hourly</span>
                                            <span className="font-semibold text-gray-900">{priceHourly.toLocaleString()} EGP/hr</span>
                                        </div>
                                    )}
                                    {priceDaily && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Daily</span>
                                            <span className="font-semibold text-gray-900">{priceDaily.toLocaleString()} EGP/day</span>
                                        </div>
                                    )}
                                    {priceMonthly && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Monthly</span>
                                            <span className="font-semibold text-gray-900">{priceMonthly.toLocaleString()} EGP/mo</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <TrackLeadButton
                                    propertyId={property.id}
                                    propertySerial={property.serialNumber}
                                    propertyTitle={property.title}
                                    phoneNumber={property.owner?.phone || '+201554515541'}
                                />
                                <FavoriteButton propertyId={property.id} initialFavorited={isFavorited} />
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