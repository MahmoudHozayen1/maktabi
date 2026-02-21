import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

function isAdmin(role: string | undefined): boolean {
    return role ? ADMIN_ROLES.includes(role) : false;
}

// GET all leads (admin only)
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user?.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get search params
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const source = searchParams.get('source') || '';

        // Build where clause
        const where: Record<string, unknown> = {};

        if (source) {
            where.source = source;
        }

        // Search by property serial number or title
        if (search) {
            const serialNumber = parseInt(search);
            if (!isNaN(serialNumber)) {
                where.property = {
                    serialNumber: serialNumber,
                };
            } else {
                where.property = {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                };
            }
        }

        const leads = await prisma.lead.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                property: {
                    select: {
                        id: true,
                        serialNumber: true,
                        title: true,
                        type: true,
                        city: true,
                        district: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

// POST create new lead (when user contacts about a property)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const { propertyId, source = 'whatsapp', message } = body;

        if (!propertyId) {
            return NextResponse.json(
                { error: 'Property ID is required' },
                { status: 400 }
            );
        }

        // Get IP and user agent from headers
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        const lead = await prisma.lead.create({
            data: {
                propertyId,
                userId: session?.user?.id || null,
                source,
                message: message || null,
                ipAddress,
                userAgent,
            },
        });

        return NextResponse.json({ lead }, { status: 201 });
    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        );
    }
}