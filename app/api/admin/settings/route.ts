import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const settings = await prisma.setting.findMany();
        const settingsMap: Record<string, string> = {};
        settings.forEach((s) => {
            settingsMap[s.key] = s.value;
        });

        return NextResponse.json({ settings: settingsMap });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Upsert each setting
        for (const [key, value] of Object.entries(body)) {
            await prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
        }

        return NextResponse.json({ message: 'Settings saved' });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}