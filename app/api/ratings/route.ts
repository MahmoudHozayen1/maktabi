import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET ratings for a property
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
        }

        const ratings = await prisma.rating.findMany({
            where: { propertyId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate average
        const average = ratings.length > 0
            ? ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length
            : 0;

        return NextResponse.json({ ratings, average, count: ratings.length });
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return NextResponse.json({ ratings: [], average: 0, count: 0 });
    }
}

// POST create rating
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { propertyId, stars, comment } = await request.json();

        if (!propertyId || !stars) {
            return NextResponse.json({ error: 'Property ID and stars required' }, { status: 400 });
        }

        if (stars < 1 || stars > 5) {
            return NextResponse.json({ error: 'Stars must be between 1 and 5' }, { status: 400 });
        }

        // Check if user already rated this property
        const existing = await prisma.rating.findUnique({
            where: {
                userId_propertyId: {
                    userId: session.user.id,
                    propertyId,
                },
            },
        });

        if (existing) {
            // Update existing rating
            const rating = await prisma.rating.update({
                where: { id: existing.id },
                data: { stars, comment },
            });
            return NextResponse.json({ rating, updated: true });
        }

        // Create new rating
        const rating = await prisma.rating.create({
            data: {
                userId: session.user.id,
                propertyId,
                stars,
                comment,
            },
        });

        return NextResponse.json({ rating }, { status: 201 });
    } catch (error) {
        console.error('Error creating rating:', error);
        return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 });
    }
}