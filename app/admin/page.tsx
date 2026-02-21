'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Users, Rocket, MessageSquare, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalProperties: number;
    pendingProperties: number;
    approvedProperties: number;
    totalStartups: number;
    pendingStartups: number;
    totalLeads: number;
    recentLeads: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalProperties: 0,
        pendingProperties: 0,
        approvedProperties: 0,
        totalStartups: 0,
        pendingStartups: 0,
        totalLeads: 0,
        recentLeads: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            if (data.stats) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            href: '/admin/users',
        },
        {
            title: 'Properties',
            value: stats.totalProperties,
            icon: Building2,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            href: '/admin/properties',
            subtext: `${stats.pendingProperties} pending`,
        },
        {
            title: 'Startups',
            value: stats.totalStartups,
            icon: Rocket,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            href: '/admin/startups',
            subtext: `${stats.pendingStartups} pending`,
        },
        {
            title: 'Total Leads',
            value: stats.totalLeads,
            icon: MessageSquare,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            href: '/admin/leads',
            subtext: `${stats.recentLeads} this week`,
        },
    ];

    const quickActions = [
        { label: 'Review Pending Properties', href: '/admin/properties?status=PENDING', icon: Clock },
        { label: 'Review Pending Startups', href: '/admin/startups?status=PENDING', icon: Rocket },
        { label: 'View Recent Leads', href: '/admin/leads', icon: MessageSquare },
        { label: 'Manage Users', href: '/admin/users', icon: Users },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-1 text-gray-400">Welcome to the admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">{card.title}</p>
                                <p className="mt-1 text-3xl font-bold">
                                    {loading ? '-' : card.value}
                                </p>
                                {card.subtext && (
                                    <p className="mt-1 text-xs text-gray-500">{card.subtext}</p>
                                )}
                            </div>
                            <div className={`rounded-lg p-3 ${card.bgColor}`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4 transition-all hover:border-emerald-500/50 hover:bg-gray-800"
                        >
                            <action.icon className="h-5 w-5 text-emerald-500" />
                            <span className="text-sm font-medium">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Pending Reviews */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold">Pending Properties</h3>
                        <Link href="/admin/properties?status=PENDING" className="text-sm text-emerald-500 hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="flex items-center justify-center py-8 text-gray-500">
                        {stats.pendingProperties > 0 ? (
                            <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-500">{stats.pendingProperties}</div>
                                <p className="mt-2">properties awaiting review</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                <span>All caught up!</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold">Pending Startups</h3>
                        <Link href="/admin/startups?status=PENDING" className="text-sm text-emerald-500 hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="flex items-center justify-center py-8 text-gray-500">
                        {stats.pendingStartups > 0 ? (
                            <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-500">{stats.pendingStartups}</div>
                                <p className="mt-2">startups awaiting review</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                <span>All caught up!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}