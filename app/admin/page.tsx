'use client';

import { useState, useEffect } from 'react';
import { Rocket, Search, Check, X, Eye, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface Startup {
    id: string;
    serialNumber: number;
    name: string;
    sector: string;
    stage: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    fundingNeeded: number | null;
    createdAt: string;
    founder: {
        name: string;
        email: string;
    };
}

export default function AdminStartupsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchStartups();
    }, [statusFilter]);

    const fetchStartups = async (searchTerm?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);
            if (searchTerm || search) params.set('search', searchTerm || search);

            const res = await fetch(`/api/admin/startups?${params.toString()}`);
            const data = await res.json();
            setStartups(data.startups || []);
        } catch (error) {
            console.error('Failed to fetch startups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStartups(search);
    };

    const clearSearch = () => {
        setSearch('');
        fetchStartups('');
    };

    const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            const res = await fetch(`/api/admin/startups/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchStartups();
            } else {
                alert('Failed to update startup');
            }
        } catch (error) {
            console.error('Failed to update startup:', error);
        }
    };

    const deleteStartup = async (id: string) => {
        if (!confirm('Are you sure you want to delete this startup?')) return;

        try {
            const res = await fetch(`/api/admin/startups/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchStartups();
            } else {
                alert('Failed to delete startup');
            }
        } catch (error) {
            console.error('Failed to delete startup:', error);
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Startups</h1>
                <p className="mt-1 text-gray-400">Manage startup submissions</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by # or name..."
                            className="w-64 rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
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
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-white">{startups.length}</div>
                    <div className="text-sm text-gray-400">Total</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-yellow-500">
                        {startups.filter((s) => s.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-gray-400">Pending</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-emerald-500">
                        {startups.filter((s) => s.status === 'APPROVED').length}
                    </div>
                    <div className="text-sm text-gray-400">Approved</div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-red-500">
                        {startups.filter((s) => s.status === 'REJECTED').length}
                    </div>
                    <div className="text-sm text-gray-400">Rejected</div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Startup</th>
                                <th className="px-6 py-4">Sector</th>
                                <th className="px-6 py-4">Stage</th>
                                <th className="px-6 py-4">Funding Goal</th>
                                <th className="px-6 py-4">Founder</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : startups.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        <Rocket className="mx-auto mb-2 h-8 w-8" />
                                        No startups found
                                    </td>
                                </tr>
                            ) : (
                                startups.map((startup) => (
                                    <tr key={startup.id} className="border-b border-gray-800">
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-purple-500/10 px-2 py-1 text-sm font-bold text-purple-500">
                                                #{startup.serialNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{startup.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-emerald-500">
                                            {startup.sector}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{startup.stage}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {startup.fundingNeeded
                                                ? `${startup.fundingNeeded.toLocaleString()} EGP`
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div>{startup.founder?.name || 'N/A'}</div>
                                                <div className="text-gray-400">{startup.founder?.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(startup.status)}`}>
                                                {startup.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/startup-tank/${startup.id}`}
                                                    target="_blank"
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                {startup.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(startup.id, 'APPROVED')}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-500"
                                                            title="Approve"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(startup.id, 'REJECTED')}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500"
                                                            title="Reject"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteStartup(startup.id)}
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