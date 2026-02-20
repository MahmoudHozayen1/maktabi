import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

// Helper to check if user is admin
function isAdmin(role: string | undefined): boolean {
    return role ? ADMIN_ROLES.includes(role) : false;
}

// GET single user
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !isAdmin(session.user?.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            createdAt: true,
            image: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
}

// PUT update user
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !isAdmin(session.user?.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the target user
    const targetUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // PROTECTION: Cannot modify an OWNER unless you are that OWNER
    if (targetUser.role === 'OWNER' && session.user.id !== id) {
        return NextResponse.json(
            { error: 'Cannot modify the Owner account' },
            { status: 403 }
        );
    }

    const { name, email, password, role, phone } = await request.json();

    // PROTECTION: Only OWNER can promote to OWNER
    if (role === 'OWNER' && session.user?.role !== 'OWNER') {
        return NextResponse.json(
            { error: 'Only the Owner can promote to Owner' },
            { status: 403 }
        );
    }

    // PROTECTION: OWNER cannot demote themselves
    if (targetUser.role === 'OWNER' && role !== 'OWNER' && session.user.id === id) {
        return NextResponse.json(
            { error: 'Owner cannot demote themselves' },
            { status: 403 }
        );
    }

    try {
        const updateData: Record<string, unknown> = {
            name,
            email,
            role,
            phone,
        };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// DELETE user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !isAdmin(session.user?.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the target user
    const targetUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // PROTECTION: Cannot delete an OWNER
    if (targetUser.role === 'OWNER') {
        return NextResponse.json(
            { error: 'Cannot delete the Owner account' },
            { status: 403 }
        );
    }

    // Prevent deleting yourself
    if (session.user.id === id) {
        return NextResponse.json(
            { error: 'Cannot delete your own account' },
            { status: 400 }
        );
    }

    try {
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}