import Link from 'next/link';
import { Building2, Users, Rocket, MapPin, ArrowRight, Star, Shield, Clock } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

export default function HomePage() {
    const features = [
        {
            icon: Building2,
            title: 'Premium Offices',
            description: 'Find fully-equipped office spaces in prime locations across Egypt.',
        },
        {
            icon: Users,
            title: 'Coworking Spaces',
            description: 'Flexible workspaces for freelancers, startups, and remote teams.',
        },
        {
            icon: Rocket,
            title: 'Startup Tank',
            description: 'Connect with investors and grow your startup with our platform.',
        },
    ];

    const stats = [
        { value: '500+', label: 'Properties Listed' },
        { value: '10K+', label: 'Happy Clients' },
        { value: '50+', label: 'Cities Covered' },
        { value: '98%', label: 'Satisfaction Rate' },
    ];

    const benefits = [
        { icon: Shield, title: 'Verified Listings', description: 'All properties are verified by our team' },
        { icon: Clock, title: 'Quick Response', description: 'Get responses within 24 hours' },
        { icon: Star, title: 'Best Prices', description: 'Competitive rates with no hidden fees' },
    ];

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 pb-20 pt-16">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white" />

                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Badge */}
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            Egypt&apos;s #1 Commercial Real Estate Platform
                        </div>

                        {/* Headline */}
                        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
                            Find Your Perfect
                            <span className="gradient-text"> Workspace</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
                            Discover premium offices, coworking spaces, and investment opportunities
                            in Egypt&apos;s top business districts.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/offices"
                                className="group flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
                            >
                                Browse Offices
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/list-property"
                                className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all hover:border-gray-300 hover:bg-gray-50"
                            >
                                List Your Property
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-bold text-gray-900 md:text-4xl">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-y border-gray-100 bg-gray-50 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            Everything You Need
                        </h2>
                        <p className="mx-auto max-w-2xl text-gray-600">
                            From finding the perfect office to investing in promising startups,
                            MAKTABI has you covered.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="card-hover rounded-2xl border border-gray-200 bg-white p-8 shadow-soft"
                            >
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                                    <feature.icon className="h-7 w-7 text-emerald-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Listings */}
            <section className="px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                Featured <span className="text-emerald-600">Offices</span>
                            </h2>
                            <p className="text-gray-600">
                                Hand-picked properties in prime locations
                            </p>
                        </div>
                        <Link
                            href="/offices"
                            className="hidden items-center gap-2 font-medium text-emerald-600 transition-colors hover:text-emerald-700 md:flex"
                        >
                            View All
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <PropertyCard key={i} />
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link
                            href="/offices"
                            className="inline-flex items-center gap-2 font-medium text-emerald-600"
                        >
                            View All Offices
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="border-t border-gray-100 bg-gray-50 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                                Why Choose <span className="text-emerald-600">MAKTABI</span>?
                            </h2>
                            <p className="mb-8 text-lg text-gray-600">
                                We make finding your perfect workspace simple, fast, and reliable.
                            </p>

                            <div className="space-y-6">
                                {benefits.map((benefit) => (
                                    <div key={benefit.title} className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                                            <benefit.icon className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-bold text-gray-900">{benefit.title}</h3>
                                            <p className="text-sm text-gray-600">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-3xl border border-gray-200 bg-white p-8 shadow-soft">
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100">
                                        <MapPin className="h-10 w-10 text-emerald-600" />
                                    </div>
                                    <h3 className="mb-2 text-2xl font-bold text-gray-900">Ready to Start?</h3>
                                    <p className="mb-6 text-gray-600">
                                        Join thousands of businesses who found their perfect space
                                    </p>
                                    <Link
                                        href="/offices"
                                        className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800"
                                    >
                                        Explore Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Premium Black */}
            <section className="bg-premium-black px-6 py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                        Have a Property to List?
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-gray-400">
                        Join our platform and reach thousands of potential tenants.
                        List your office or coworking space today.
                    </p>
                    <Link
                        href="/list-property"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-gray-100"
                    >
                        List Your Property
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}