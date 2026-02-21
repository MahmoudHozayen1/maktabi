import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const coworking = await prisma.property.findUnique({
            where: { id, type: 'COWORKING' },
            include: {
                owner: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
            },
        });

        if (!coworking) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ coworking });
    } catch (error) {
        console.error('Error fetching coworking:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}