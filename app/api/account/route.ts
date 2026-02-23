import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PUT - Update account (profile or password)
export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'updateProfile') {
            const { name, email, phone } = body;

            // Validate email
            if (!email || !email.includes('@')) {
                return NextResponse.json(
                    { error: 'Valid email is required' },
                    { status: 400 }
                );
            }

            // Check if email is already taken by another user
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: { id: session.user.id },
                },
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Email is already in use' },
                    { status: 400 }
                );
            }

            // Update user
            const user = await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    name,
                    email,
                    phone: phone || null,
                },
            });

            return NextResponse.json({
                message: 'Profile updated successfully',
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
            });
        }

        if (action === 'updatePassword') {
            const { currentPassword, newPassword } = body;

            if (!currentPassword || !newPassword) {
                return NextResponse.json(
                    { error: 'Current password and new password are required' },
                    { status: 400 }
                );
            }

            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: 'Password must be at least 6 characters' },
                    { status: 400 }
                );
            }

            // Get current user with password
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
            });

            if (!user?.password) {
                return NextResponse.json(
                    { error: 'Cannot change password for OAuth accounts' },
                    { status: 400 }
                );
            }

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                );
            }

            // Hash and update new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await prisma.user.update({
                where: { id: session.user.id },
                data: { password: hashedPassword },
            });

            return NextResponse.json({ message: 'Password updated successfully' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error updating account:', error);
        return NextResponse.json(
            { error: 'Failed to update account' },
            { status: 500 }
        );
    }
}

// DELETE - Delete account
export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check if user is OWNER - cannot delete owner account
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (user?.role === 'OWNER') {
            return NextResponse.json(
                { error: 'Cannot delete the Owner account' },
                { status: 403 }
            );
        }

        // Delete user's related data first (to avoid foreign key issues)
        await prisma.rating.deleteMany({ where: { userId: session.user.id } });
        await prisma.favorite.deleteMany({ where: { userId: session.user.id } });
        await prisma.lead.deleteMany({ where: { userId: session.user.id } });

        // Delete user's properties (optional - you might want to keep them)
        // await prisma.property.deleteMany({ where: { ownerId: session.user.id } });

        // Delete user
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}