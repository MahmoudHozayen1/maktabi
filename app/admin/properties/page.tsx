'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, Check, X, Eye, Trash2, Pencil, Phone, Calendar, Filter } from 'lucide-react';
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
    updatedAt: string;
    owner: {
        name: string;
        email: string;
        phone: string | null;
    };
}

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, [statusFilter, typeFilter, dateFrom, dateTo]);

    const fetchProperties = async (searchTerm?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);
            if (typeFilter) params.set('type', typeFilter);
            if (searchTerm || search) params.set('search', searchTerm || search);
            if (dateFrom) params.set('dateFrom', dateFrom);
            if (dateTo) params.set('dateTo', dateTo);

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

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setTypeFilter('');
        setDateFrom('');
        setDateTo('');
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPhone = (phone: string | null) => {
        if (!phone) return '-';
        return phone;
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Properties</h1>
                    <p className="mt-1 text-gray-400">Manage all property listings</p>
                </div>
                <Link
                    href="/admin/properties/new"
                    className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
                >
                    + Add Property
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex flex-wrap gap-4">
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
                    </div>
                    <Button type="submit" variant="secondary">Search</Button>
                </form>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${showFilters ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                >
                    <Filter className="h-4 w-4" />
                    Filters
                    {(statusFilter || typeFilter || dateFrom || dateTo) && (
                        <span className="ml-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                            {[statusFilter, typeFilter, dateFrom, dateTo].filter(Boolean).length}
                        </span>
                    )}
                </button>

                {(statusFilter || typeFilter || dateFrom || dateTo || search) && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="mb-2 block text-sm text-gray-400">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-400">Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            >
                                <option value="">All Types</option>
                                <option value="OFFICE">Office</option>
                                <option value="COWORKING">Coworking</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-400">Date From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-400">Date To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-5">
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-white">{properties.length}</div>
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
                    <div className="text-2xl font-bold text-blue-500">
                        {properties.filter((p) => p.type === 'OFFICE').length}
                    </div>
                    <div className="text-sm text-gray-400">Offices</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-purple-500">
                        {properties.filter((p) => p.type === 'COWORKING').length}
                    </div>
                    <div className="text-sm text-gray-400">Coworking</div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                                <th className="px-4 py-4">#</th>
                                <th className="px-4 py-4">Property</th>
                                <th className="px-4 py-4">Owner / Phone</th>
                                <th className="px-4 py-4">Type</th>
                                <th className="px-4 py-4">Price</th>
                                <th className="px-4 py-4">Submitted</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : properties.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        <Building2 className="mx-auto mb-2 h-8 w-8" />
                                        No properties found
                                    </td>
                                </tr>
                            ) : (
                                properties.map((property) => (
                                    <tr key={property.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-sm font-bold text-emerald-500">
                                                #{property.serialNumber}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <div className="font-medium">{property.title}</div>
                                                <div className="text-sm text-gray-400">
                                                    {property.district}, {property.city}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <div className="text-sm">{property.owner?.name || 'N/A'}</div>
                                                <div className="flex items-center gap-1 text-sm text-gray-400">
                                                    <Phone className="h-3 w-3" />
                                                    {property.owner?.phone ? (
                                                        <a
                                                            href={`tel:${property.owner.phone}`}
                                                            className="text-emerald-500 hover:underline"
                                                        >
                                                            {property.owner.phone}
                                                        </a>
                                                    ) : (
                                                        <span>No phone</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${property.type === 'OFFICE'
                                                ? 'bg-blue-500/10 text-blue-500'
                                                : 'bg-purple-500/10 text-purple-500'
                                                }`}>
                                                {property.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            {property.price.toLocaleString()} EGP
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(property.createdAt)}
                                            </div>
                                            {property.status === 'APPROVED' && property.updatedAt !== property.createdAt && (
                                                <div className="text-xs text-emerald-500">
                                                    Posted: {formatDate(property.updatedAt)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(property.status)}`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1">
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