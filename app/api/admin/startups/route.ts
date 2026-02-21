import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const where: Record<string, unknown> = {};
        if (status) where.status = status;

        const startups = await prisma.startup.findMany({
            where,
            include: {
                founder: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ startups });
    } catch (error) {
        console.error('Error fetching startups:', error);
        return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
    }
}