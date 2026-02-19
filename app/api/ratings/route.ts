import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch ratings
    return NextResponse.json({ ratings: [] });
}

export async function POST() {
    // TODO: Create rating
    return NextResponse.json({ message: 'Created' }, { status: 201 });
}