import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const district = searchParams.get('district');

        const where: Record<string, unknown> = {
            type: 'COWORKING',
            status: 'APPROVED',
        };

        if (city) where.city = city;
        if (district) where.district = district;

        const coworking = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ coworking });
    } catch (error) {
        console.error('Error fetching coworking:', error);
        return NextResponse.json({ coworking: [] });
    }
}