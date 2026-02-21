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

        const startup = await prisma.startup.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ startup });
    } catch (error) {
        console.error('Error updating startup:', error);
        return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 });
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
        await prisma.startup.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Startup deleted' });
    } catch (error) {
        console.error('Error deleting startup:', error);
        return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 });
    }
}