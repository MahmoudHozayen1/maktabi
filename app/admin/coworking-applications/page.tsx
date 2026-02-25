'use client';

import { useState, useEffect } from 'react';
import { Users, Phone, Mail, MapPin, Globe, Check, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Application {
    id: string;
    key: string;
    spaceName: string;
    contactName: string;
    email: string;
    phone: string;
    website?: string;
    address: string;
    city: string;
    capacity?: string;
    description?: string;
    status: string;
    createdAt: string;
}

export default function CoworkingApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/coworking-applications');
            const data = await res.json();
            setApplications(data.applications || []);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm('Delete this application?')) return;

        try {
            await fetch(`/api/admin/settings/${id}`, {
                method: 'DELETE',
            });
            fetchApplications();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'REJECTED':
                return 'bg-red-500/10 text-red-500';
            default:
                return 'bg-yellow-500/10 text-yellow-500';
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Coworking Applications</h1>
                    <p className="mt-1 text-gray-400">
                        Review coworking space listing requests
                    </p>
                </div>
                <Link
                    href="/admin/properties/new?type=COWORKING"
                    className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
                >
                    + Add Coworking Space
                </Link>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-white">{applications.length}</div>
                    <div className="text-sm text-gray-400">Total Applications</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-yellow-500">
                        {applications.filter((a) => a.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-gray-400">Pending Review</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-emerald-500">
                        {applications.filter((a) => a.status === 'APPROVED').length}
                    </div>
                    <div className="text-sm text-gray-400">Approved</div>
                </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                        <p className="text-gray-500">No applications yet</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div
                            key={app.id}
                            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-3">
                                        <h3 className="text-xl font-bold">{app.spaceName}</h3>
                                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="mb-4 grid gap-2 text-sm text-gray-400 sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {app.address}, {app.city}
                                        </div>
                                        {app.capacity && (
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                {app.capacity} seats
                                            </div>
                                        )}
                                    </div>

                                    {app.description && (
                                        <p className="mb-4 text-sm text-gray-400">{app.description}</p>
                                    )}

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Contact:</span>
                                            <span>{app.contactName}</span>
                                        </div>
                                        <a
                                            href={`mailto:${app.email}`}
                                            className="flex items-center gap-1 text-emerald-500 hover:underline"
                                        >
                                            <Mail className="h-4 w-4" />
                                            {app.email}
                                        </a>
                                        <a
                                            href={`tel:${app.phone}`}
                                            className="flex items-center gap-1 text-emerald-500 hover:underline"
                                        >
                                            <Phone className="h-4 w-4" />
                                            {app.phone}
                                        </a>
                                        {app.website && (
                                            <a
                                                href={app.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-emerald-500 hover:underline"
                                            >
                                                <Globe className="h-4 w-4" />
                                                Website
                                            </a>
                                        )}
                                    </div>

                                    <p className="mt-4 text-xs text-gray-500">
                                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => deleteApplication(app.id)}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}