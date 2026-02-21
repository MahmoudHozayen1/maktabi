import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Building2, Plus, Eye, MessageSquare, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    // Fetch user's properties
    const properties = await prisma.property.findMany({
        where: { ownerId: session.user.id },
        include: {
            leads: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const totalLeads = properties.reduce((acc, p) => acc + p.leads.length, 0);
    const approvedCount = properties.filter((p) => p.status === 'APPROVED').length;
    const pendingCount = properties.filter((p) => p.status === 'PENDING').length;

    const stats = [
        { label: 'Total Listings', value: properties.length.toString(), icon: Building2, color: 'text-emerald-500' },
        { label: 'Approved', value: approvedCount.toString(), icon: Eye, color: 'text-blue-500' },
        { label: 'Pending', value: pendingCount.toString(), icon: TrendingUp, color: 'text-yellow-500' },
        { label: 'Total Inquiries', value: totalLeads.toString(), icon: MessageSquare, color: 'text-purple-500' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-emerald-100 text-emerald-700';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'REJECTED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage your property listings</p>
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
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Listings Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900">Your Listings</h2>
                </div>

                {properties.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Property</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Inquiries</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((property) => (
                                    <tr key={property.id} className="border-b border-gray-100">
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                                                #{property.serialNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{property.title}</div>
                                                <div className="text-sm text-gray-500">
                                                    {property.district}, {property.city}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{property.type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {property.price.toLocaleString()} EGP
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(property.status)}`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {property.leads.length}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/${property.type === 'OFFICE' ? 'offices' : 'coworking'}/${property.id}`}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Building2 className="mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-700">No listings yet</h3>
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
                )}
            </div>
        </div>
    );
}