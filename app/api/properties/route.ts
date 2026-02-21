import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all approved properties
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const city = searchParams.get('city');
        const district = searchParams.get('district');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const featured = searchParams.get('featured');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {
            status: 'APPROVED',
        };

        if (type) where.type = type;
        if (city) where.city = city;
        if (district) where.district = district;

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (featured === 'true') {
            where.featured = true;
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ properties });
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ properties: [] });
    }
}

// POST create new property
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'You must be logged in to create a property' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            price,
            size,
            rooms,
            type,
            address,
            city,
            district,
            lat,
            lng,
            amenities,
            images,
        } = body;

        // Validation
        if (!title || !description || !price || !size || !type || !address || !city || !district) {
            return NextResponse.json(
                { error: 'Please fill in all required fields' },
                { status: 400 }
            );
        }

        if (description.length < 50) {
            return NextResponse.json(
                { error: 'Description must be at least 50 characters' },
                { status: 400 }
            );
        }

        const property = await prisma.property.create({
            data: {
                title,
                description,
                price: parseFloat(price.toString()),
                size: parseFloat(size.toString()),
                rooms: rooms ? parseInt(rooms.toString()) : null,
                type: type, // 'OFFICE' or 'COWORKING'
                status: 'PENDING',
                address,
                city,
                district,
                lat: lat ? parseFloat(lat.toString()) : null,
                lng: lng ? parseFloat(lng.toString()) : null,
                amenities: amenities || [],
                images: images || [],
                ownerId: session.user.id,
            },
        });

        // Revalidate pages
        revalidatePath('/offices');
        revalidatePath('/coworking');
        revalidatePath('/admin/properties');

        return NextResponse.json(
            { message: 'Property submitted successfully! It will be reviewed shortly.', property },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json(
            { error: 'Failed to create property' },
            { status: 500 }
        );
    }
}