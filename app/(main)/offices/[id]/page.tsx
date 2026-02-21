import Link from 'next/link';
import { MapPin, Building2, Ruler, Car, Wifi, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import TrackLeadButton from '@/components/TrackLeadButton';

export default async function OfficeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // TODO: Fetch office data from database using id
    const office = {
        id: id,
        title: 'Modern Office Space in Maadi',
        description: 'A beautifully designed modern office space perfect for teams of 5-15 people. Located in the heart of Maadi with easy access to public transportation and amenities. The space features high ceilings, natural lighting, and a professional atmosphere.',
        price: 50000,
        size: 120,
        rooms: 3,
        city: 'Cairo',
        district: 'Maadi',
        address: '15 Road 9, Maadi, Cairo',
        amenities: ['wifi', 'parking', 'security', 'ac', 'elevator', 'reception'],
        images: [],
        landlord: {
            name: 'Ahmed Hassan',
            phone: '+201554515541',
        },
    };

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
                <Link
                    href="/offices"
                    className="text-sm text-gray-400 hover:text-emerald-400"
                >
                    ← Back to Offices
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="mb-8 aspect-video overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                        <div className="flex h-full items-center justify-center text-gray-500">
                            <div className="text-center">
                                <Building2 className="mx-auto mb-2 h-12 w-12" />
                                <p>Office Images</p>
                            </div>
                        </div>
                    </div>

                    <h1 className="mb-4 text-3xl font-bold">{office.title}</h1>
                    <div className="mb-6 flex items-center gap-2 text-gray-400">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                        <span>{office.address}</span>
                    </div>

                    <div className="mb-8 grid grid-cols-3 gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
                        <div className="text-center">
                            <Ruler className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                            <div className="font-bold">{office.size} sqm</div>
                            <div className="text-sm text-gray-400">Size</div>
                        </div>
                        <div className="text-center">
                            <Building2 className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                            <div className="font-bold">{office.rooms}</div>
                            <div className="text-sm text-gray-400">Rooms</div>
                        </div>
                        <div className="text-center">
                            <MapPin className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                            <div className="font-bold">{office.district}</div>
                            <div className="text-sm text-gray-400">{office.city}</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-bold">Description</h2>
                        <p className="leading-relaxed text-gray-300">{office.description}</p>
                    </div>

                    <div>
                        <h2 className="mb-4 text-xl font-bold">Amenities</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {office.amenities.map((amenity) => {
                                const item = amenityIcons[amenity];
                                if (!item) return null;
                                return (
                                    <div
                                        key={amenity}
                                        className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4"
                                    >
                                        <item.icon className="h-5 w-5 text-emerald-500" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-xl border border-gray-800 bg-gray-900 p-6">
                        <div className="mb-6 text-center">
                            <div className="text-3xl font-bold text-emerald-500">
                                {office.price.toLocaleString()} EGP
                            </div>
                            <div className="text-gray-400">per month</div>
                        </div>

                        <div className="space-y-3">
                            {/* Track Lead Button */}
                            <TrackLeadButton
                                propertyId={office.id}
                                phoneNumber={office.landlord.phone}
                            />
                            <Button variant="secondary" className="w-full">
                                Schedule Visit
                            </Button>
                        </div>

                        <div className="mt-6 border-t border-gray-800 pt-6">
                            <p className="text-sm text-gray-400">Listed by</p>
                            <p className="font-medium">{office.landlord.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}