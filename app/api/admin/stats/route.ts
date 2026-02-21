import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get counts
        const [
            totalUsers,
            totalProperties,
            pendingProperties,
            approvedProperties,
            totalStartups,
            pendingStartups,
            totalLeads,
            recentLeads,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.property.count(),
            prisma.property.count({ where: { status: 'PENDING' } }),
            prisma.property.count({ where: { status: 'APPROVED' } }),
            prisma.startup.count(),
            prisma.startup.count({ where: { status: 'PENDING' } }),
            prisma.lead.count(),
            prisma.lead.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                    },
                },
            }),
        ]);

        return NextResponse.json({
            stats: {
                totalUsers,
                totalProperties,
                pendingProperties,
                approvedProperties,
                totalStartups,
                pendingStartups,
                totalLeads,
                recentLeads,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}