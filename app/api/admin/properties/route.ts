import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

// GET all properties (admin)
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const search = searchParams.get('search');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (status) where.status = status;
        if (type) where.type = type;

        if (search) {
            const serialNumber = parseInt(search);
            if (!isNaN(serialNumber)) {
                where.serialNumber = serialNumber;
            } else {
                where.title = {
                    contains: search,
                    mode: 'insensitive',
                };
            }
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                owner: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ properties });
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ properties: [], error: 'Failed to fetch properties' }, { status: 500 });
    }
}

// POST create new property (admin only - for coworking spaces)
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const property = await prisma.property.create({
            data: {
                title: body.title,
                description: body.description,
                price: body.price,
                size: body.size,
                rooms: body.rooms || null,
                type: body.type,
                status: body.status || 'APPROVED',
                address: body.address,
                city: body.city,
                district: body.district,
                lat: body.lat || null,
                lng: body.lng || null,
                amenities: body.amenities || [],
                images: body.images || [],
                featured: body.featured || false,
                ownerId: session.user.id, // Admin is the owner
            },
        });

        revalidatePath('/offices');
        revalidatePath('/coworking');
        revalidatePath('/');

        return NextResponse.json({ property }, { status: 201 });
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}