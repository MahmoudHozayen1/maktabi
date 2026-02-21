import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET single property
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
                ratings: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({ property });
    } catch (error) {
        console.error('Error fetching property:', error);
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
    }
}

// PUT update property
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Check ownership or admin
        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER';
        if (property.ownerId !== session.user.id && !isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const body = await request.json();
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ property: updatedProperty });
    } catch (error) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

// DELETE property
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Check ownership or admin
        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER';
        if (property.ownerId !== session.user.id && !isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        await prisma.property.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Property deleted' });
    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}