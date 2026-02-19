import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch from database
    return NextResponse.json({ properties: [] });
}

export async function POST() {
    // TODO: Create property
    return NextResponse.json({ message: 'Created' }, { status: 201 });
}