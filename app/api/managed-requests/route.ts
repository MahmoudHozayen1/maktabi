import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const { name, email, phone, propertyAddress, propertySize, message } = body;

        // Validation
        if (!name || !email || !phone || !propertyAddress || !propertySize) {
            return NextResponse.json(
                { error: 'All required fields must be filled' },
                { status: 400 }
            );
        }

        // Save as a setting/lead for now (you could create a ManagedRequest model later)
        await prisma.setting.create({
            data: {
                key: `managed_request_${Date.now()}`,
                value: JSON.stringify({
                    name,
                    email,
                    phone,
                    propertyAddress,
                    propertySize,
                    message,
                    userId: session?.user?.id || null,
                    createdAt: new Date().toISOString(),
                }),
            },
        });

        return NextResponse.json({ message: 'Request submitted successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error submitting managed request:', error);
        return NextResponse.json(
            { error: 'Failed to submit request' },
            { status: 500 }
        );
    }
}