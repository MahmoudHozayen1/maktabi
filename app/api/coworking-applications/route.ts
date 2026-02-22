import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST - Submit coworking application
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            spaceName,
            contactName,
            email,
            phone,
            website,
            address,
            city,
            capacity,
            description,
        } = body;

        // Validation
        if (!spaceName || !contactName || !email || !phone || !address || !city) {
            return NextResponse.json(
                { error: 'Please fill in all required fields' },
                { status: 400 }
            );
        }

        // Store as a setting with a unique key (you could create a dedicated model later)
        await prisma.setting.create({
            data: {
                key: `coworking_application_${Date.now()}`,
                value: JSON.stringify({
                    spaceName,
                    contactName,
                    email,
                    phone,
                    website,
                    address,
                    city,
                    capacity,
                    description,
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                }),
            },
        });

        return NextResponse.json(
            { message: 'Application submitted successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error submitting coworking application:', error);
        return NextResponse.json(
            { error: 'Failed to submit application' },
            { status: 500 }
        );
    }
}

// GET - Fetch all coworking applications (admin only)
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'OWNER'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    startsWith: 'coworking_application_',
                },
            },
            orderBy: { id: 'desc' },
        });

        const applications = settings.map((s) => ({
            id: s.id,
            key: s.key,
            ...JSON.parse(s.value),
        }));

        return NextResponse.json({ applications });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ applications: [] });
    }
}