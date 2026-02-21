'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Building2, Users, Phone, Globe, Calendar, Search, X } from 'lucide-react';

interface Lead {
    id: string;
    source: string;
    message: string | null;
    ipAddress: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    } | null;
    property: {
        id: string;
        serialNumber: number;
        title: string;
        type: string;
        city: string;
        district: string;
    };
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');

    useEffect(() => {
        fetchLeads();
    }, [sourceFilter]);

    const fetchLeads = async (searchTerm?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm || search) params.set('search', searchTerm || search);
            if (sourceFilter) params.set('source', sourceFilter);

            const res = await fetch(`/api/leads?${params.toString()}`);
            const data = await res.json();
            setLeads(data.leads || []);
        } catch (err) {
            console.error('Failed to fetch leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLeads(search);
    };

    const clearSearch = () => {
        setSearch('');
        fetchLeads('');
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'whatsapp':
                return <Phone className="h-4 w-4 text-green-500" />;
            case 'website':
                return <Globe className="h-4 w-4 text-blue-500" />;
            default:
                return <MessageSquare className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Leads</h1>
                <p className="mt-1 text-gray-400">
                    Track all property inquiries and contact requests
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by property # or title..."
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
                    <button
                        type="submit"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                        Search
                    </button>
                </form>

                <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                    <option value="">All Sources</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="website">Website</option>
                </select>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold">{leads.length}</div>
                    <div className="text-sm text-gray-400">Total Leads</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-green-500">
                        {leads.filter((l) => l.source === 'whatsapp').length}
                    </div>
                    <div className="text-sm text-gray-400">WhatsApp</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-blue-500">
                        {leads.filter((l) => l.source === 'website').length}
                    </div>
                    <div className="text-sm text-gray-400">Website Form</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-purple-500">
                        {leads.filter((l) => l.user).length}
                    </div>
                    <div className="text-sm text-gray-400">Logged In Users</div>
                </div>
            </div>

            {/* Leads Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                                <th className="px-6 py-4">Property #</th>
                                <th className="px-6 py-4">Property</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                                        <p>No leads found</p>
                                        {search && (
                                            <p className="mt-1 text-sm">
                                                Try a different search term
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-gray-800">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-500">
                                                #{lead.property.serialNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <div className="font-medium">{lead.property.title}</div>
                                                    <div className="text-sm text-gray-400">
                                                        {lead.property.district}, {lead.property.city}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.user ? (
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <div className="font-medium">{lead.user.name || 'No name'}</div>
                                                        <div className="text-sm text-gray-400">{lead.user.email}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">Guest</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getSourceIcon(lead.source)}
                                                <span className="capitalize">{lead.source}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs truncate text-sm text-gray-400">
                                                {lead.message || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(lead.createdAt).toLocaleDateString()}
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