import Link from 'next/link';
import { Building2, Plus, Eye, MessageSquare, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    // Placeholder stats - will be replaced with real data
    const stats = [
        { label: 'Active Listings', value: '3', icon: Building2, color: 'text-emerald-500' },
        { label: 'Total Views', value: '1,247', icon: Eye, color: 'text-blue-500' },
        { label: 'Inquiries', value: '18', icon: MessageSquare, color: 'text-purple-500' },
        { label: 'This Month', value: '+12%', icon: TrendingUp, color: 'text-green-500' },
    ];

    return (
        <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="mt-2 text-gray-400">Manage your property listings</p>
                </div>
                <Link
                    href="/list-property"
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
                >
                    <Plus className="h-5 w-5" />
                    Add Property
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            <span className="text-2xl font-bold">{stat.value}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Listings Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900">
                <div className="border-b border-gray-800 p-6">
                    <h2 className="text-xl font-bold">Your Listings</h2>
                </div>
                <div className="p-6">
                    {/* Empty state */}
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Building2 className="mb-4 h-12 w-12 text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-300">No listings yet</h3>
                        <p className="mb-6 text-sm text-gray-500">
                            Start by adding your first property
                        </p>
                        <Link
                            href="/list-property"
                            className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"
                        >
                            Add Your First Property
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}