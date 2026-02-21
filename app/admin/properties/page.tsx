'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, Check, X, Eye, Trash2, Pencil } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface Property {
    id: string;
    serialNumber: number;
    title: string;
    type: 'OFFICE' | 'COWORKING';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    price: number;
    city: string;
    district: string;
    lat: number | null;
    lng: number | null;
    createdAt: string;
    owner: {
        name: string;
        email: string;
    };
}

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        fetchProperties();
    }, [statusFilter, typeFilter]);

    const fetchProperties = async (searchTerm?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);
            if (typeFilter) params.set('type', typeFilter);
            if (searchTerm || search) params.set('search', searchTerm || search);

            const res = await fetch(`/api/admin/properties?${params.toString()}`);
            const data = await res.json();
            setProperties(data.properties || []);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProperties(search);
    };

    const clearSearch = () => {
        setSearch('');
        fetchProperties('');
    };

    const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            const res = await fetch(`/api/admin/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchProperties();
            } else {
                alert('Failed to update property');
            }
        } catch (error) {
            console.error('Failed to update property:', error);
        }
    };

    const deleteProperty = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            const res = await fetch(`/api/admin/properties/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchProperties();
            } else {
                alert('Failed to delete property');
            }
        } catch (error) {
            console.error('Failed to delete property:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'PENDING':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'REJECTED':
                return 'bg-red-500/10 text-red-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Properties</h1>
                    <p className="mt-1 text-gray-400">Manage all property listings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by # or title..."
                            className="w-64 rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" variant="secondary">Search</Button>
                </form>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>

                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                    <option value="">All Types</option>
                    <option value="OFFICE">Office</option>
                    <option value="COWORKING">Coworking</option>
                </select>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-5">
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold">{properties.length}</div>
                    <div className="text-sm text-gray-400">Total</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-yellow-500">
                        {properties.filter((p) => p.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-gray-400">Pending</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-emerald-500">
                        {properties.filter((p) => p.status === 'APPROVED').length}
                    </div>
                    <div className="text-sm text-gray-400">Approved</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-red-500">
                        {properties.filter((p) => p.status === 'REJECTED').length}
                    </div>
                    <div className="text-sm text-gray-400">Rejected</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-blue-500">
                        {properties.filter((p) => p.lat && p.lng).length}
                    </div>
                    <div className="text-sm text-gray-400">With Map</div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Property</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Map</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : properties.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <Building2 className="mx-auto mb-2 h-8 w-8" />
                                        No properties found
                                    </td>
                                </tr>
                            ) : (
                                properties.map((property) => (
                                    <tr key={property.id} className="border-b border-gray-800">
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-sm font-bold text-emerald-500">
                                                #{property.serialNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium">{property.title}</div>
                                                <div className="text-sm text-gray-400">
                                                    {property.district}, {property.city}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{property.type}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {property.price.toLocaleString()} EGP
                                        </td>
                                        <td className="px-6 py-4">
                                            {property.lat && property.lng ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-500">
                                                    <Check className="h-4 w-4" />
                                                    <span className="text-xs">Set</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-yellow-500">
                                                    <X className="h-4 w-4" />
                                                    <span className="text-xs">Missing</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(property.status)}`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/${property.type === 'OFFICE' ? 'offices' : 'coworking'}/${property.id}`}
                                                    target="_blank"
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/properties/${property.id}`}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-500"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                {property.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(property.id, 'APPROVED')}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-500"
                                                            title="Approve"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(property.id, 'REJECTED')}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500"
                                                            title="Reject"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteProperty(property.id)}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}