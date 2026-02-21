import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all startups
export async function GET() {
    try {
        const startups = await prisma.startup.findMany({
            where: { status: 'APPROVED' },
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
        return NextResponse.json({ startups: [] });
    }
}

// POST create new startup
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'You must be logged in to submit a startup' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, sector, stage, fundingGoal, website } = body;

        // Validation
        if (!name || !description || !sector || !stage) {
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

        // Create startup
        const startup = await prisma.startup.create({
            data: {
                name,
                description,
                sector,
                stage,
                fundingNeeded: fundingGoal || null,
                pitchDeckUrl: website || null,
                status: 'PENDING',
                founderId: session.user.id,
            },
        });

        return NextResponse.json(
            { message: 'Startup submitted successfully', startup },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating startup:', error);
        return NextResponse.json(
            { error: 'Failed to submit startup' },
            { status: 500 }
        );
    }
}