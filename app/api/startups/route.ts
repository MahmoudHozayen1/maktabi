import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch startups
    return NextResponse.json({ startups: [] });
}

export async function POST() {
    // TODO: Create startup
    return NextResponse.json({ message: 'Created' }, { status: 201 });
}