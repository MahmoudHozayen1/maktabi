import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET user's favorites
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                property: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ favorites: [] });
    }
}

// POST add to favorites
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { propertyId } = await request.json();

        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
        }

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_propertyId: {
                    userId: session.user.id,
                    propertyId,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                propertyId,
            },
        });

        return NextResponse.json({ favorite }, { status: 201 });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }
}

// DELETE remove from favorites
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { propertyId } = await request.json();

        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
        }

        await prisma.favorite.delete({
            where: {
                userId_propertyId: {
                    userId: session.user.id,
                    propertyId,
                },
            },
        });

        return NextResponse.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }
}