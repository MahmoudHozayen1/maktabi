import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const property = await prisma.property.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ property });
    } catch (error) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.property.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Property deleted' });
    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}