import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch from database
    return NextResponse.json({ coworking: [] });
}

export async function POST() {
    // TODO: Create coworking space
    return NextResponse.json({ message: 'Created' }, { status: 201 });
}