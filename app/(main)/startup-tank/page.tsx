import Link from 'next/link';
import { Rocket, TrendingUp, Users, DollarSign } from 'lucide-react';
import prisma from '@/lib/prisma';

// Revalidate this page every 60 seconds, or on-demand
export const revalidate = 60;

export default async function StartupTankPage() {
    const startups = await prisma.startup.findMany({
        where: { status: 'APPROVED' },
        include: {
            founder: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    const stats = [
        { icon: Rocket, label: 'Startups Listed', value: `${startups.length}+` },
        { icon: DollarSign, label: 'Total Raised', value: '25M EGP' },
        { icon: Users, label: 'Active Investors', value: '200+' },
        { icon: TrendingUp, label: 'Success Rate', value: '78%' },
    ];

    return (
        <div className="mx-auto max-w-7xl px-6 py-16">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                    Startup <span className="text-emerald-600">Tank</span>
                </h1>
                <p className="mt-4 text-gray-600">
                    Invest in Egypt&apos;s most promising startups
                </p>
                <Link
                    href="/startup-tank/submit"
                    className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
                >
                    Submit Your Startup
                </Link>
            </div>

            {/* Stats */}
            <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
                    >
                        <stat.icon className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Startups Grid */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Featured Startups</h2>
            </div>

            {startups.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {startups.map((startup) => (
                        <Link
                            key={startup.id}
                            href={`/startup-tank/${startup.id}`}
                            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500/50 hover:shadow-md"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                                    <Rocket className="h-6 w-6 text-emerald-600" />
                                </div>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                    {startup.stage}
                                </span>
                            </div>

                            <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-emerald-600">
                                {startup.name}
                            </h3>
                            <p className="mb-4 text-sm text-gray-600 line-clamp-2">{startup.description}</p>

                            <div className="mb-3 flex items-center justify-between text-sm">
                                <span className="text-emerald-600">{startup.sector}</span>
                                {startup.fundingNeeded && (
                                    <span className="text-gray-500">
                                        Goal: {startup.fundingNeeded.toLocaleString()} EGP
                                    </span>
                                )}
                            </div>

                            <div className="text-xs text-gray-400">
                                Founded by {startup.founder.name}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Rocket className="mb-4 h-16 w-16 text-gray-300" />
                    <h2 className="mb-2 text-xl font-bold text-gray-700">No startups yet</h2>
                    <p className="mb-6 text-gray-500">Be the first to submit your startup!</p>
                    <Link
                        href="/startup-tank/submit"
                        className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
                    >
                        Submit Your Startup
                    </Link>
                </div>
            )}
        </div>
    );
}