import Link from 'next/link';
import { MapPin, Users, Clock, Wifi, Coffee, Monitor, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';

export default async function CoworkingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // TODO: Fetch coworking space data from database using id
    const space = {
        id: id,
        title: 'Creative Hub Coworking',
        description: 'A vibrant coworking space designed for freelancers, startups, and remote workers. Enjoy a creative atmosphere with all the amenities you need to be productive. Flexible plans available for individuals and teams.',
        city: 'Cairo',
        district: 'Zamalek',
        address: '25 July 26th Street, Zamalek, Cairo',
        amenities: ['wifi', 'coffee', 'meeting-room', 'printer', 'locker', 'kitchen'],
        images: [],
        plans: [
            { name: 'Hot Desk', price: 3000, period: 'month', description: 'Any available desk' },
            { name: 'Dedicated Desk', price: 5000, period: 'month', description: 'Your own fixed desk' },
            { name: 'Private Office', price: 15000, period: 'month', description: 'For teams of 4-6' },
            { name: 'Day Pass', price: 200, period: 'day', description: 'Single day access' },
        ],
        hours: '8:00 AM - 10:00 PM',
        capacity: 50,
        contact: {
            phone: '+201554515541',
        },
    };

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
                    className="text-sm text-gray-400 hover:text-emerald-400"
                >
                    ← Back to Coworking Spaces
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="mb-8 aspect-video overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                        <div className="flex h-full items-center justify-center text-gray-500">
                            <div className="text-center">
                                <Users className="mx-auto mb-2 h-12 w-12" />
                                <p>Coworking Space Images</p>
                            </div>
                        </div>
                    </div>

                    <h1 className="mb-4 text-3xl font-bold">{space.title}</h1>
                    <div className="mb-6 flex items-center gap-2 text-gray-400">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                        <span>{space.address}</span>
                    </div>

                    <div className="mb-8 grid grid-cols-3 gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
                        <div className="text-center">
                            <Users className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                            <div className="font-bold">{space.capacity}</div>
                            <div className="text-sm text-gray-400">Capacity</div>
                        </div>
                        <div className="text-center">
                            <Clock className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                            <div className="font-bold text-sm">{space.hours}</div>
                            <div className="text-sm text-gray-400">Hours</div>
                        </div>
                        <div className="text-center">
                            <MapPin className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                            <div className="font-bold">{space.district}</div>
                            <div className="text-sm text-gray-400">{space.city}</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-bold">About This Space</h2>
                        <p className="leading-relaxed text-gray-300">{space.description}</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-bold">Amenities</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {space.amenities.map((amenity) => {
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

                    <div>
                        <h2 className="mb-4 text-xl font-bold">Membership Plans</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {space.plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                                >
                                    <h3 className="mb-2 text-lg font-bold">{plan.name}</h3>
                                    <p className="mb-4 text-sm text-gray-400">{plan.description}</p>
                                    <div className="text-2xl font-bold text-emerald-500">
                                        {plan.price.toLocaleString()} EGP
                                        <span className="text-sm font-normal text-gray-400">
                                            /{plan.period}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-xl border border-gray-800 bg-gray-900 p-6">
                        <div className="mb-6 text-center">
                            <p className="text-sm text-gray-400">Starting from</p>
                            <div className="text-3xl font-bold text-emerald-500">
                                {space.plans[0].price.toLocaleString()} EGP
                            </div>
                            <div className="text-gray-400">per month</div>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={`https://wa.me/${space.contact.phone.replace('+', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700"
                            >
                                <Phone className="h-5 w-5" />
                                WhatsApp
                            </a>
                            <Button variant="secondary" className="w-full">
                                Book a Tour
                            </Button>
                        </div>

                        <div className="mt-6 border-t border-gray-800 pt-6">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-emerald-500" />
                                <span className="text-gray-400">Open:</span>
                                <span>{space.hours}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}