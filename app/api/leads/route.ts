import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch leads
    return NextResponse.json({ leads: [] });
}

export async function POST() {
    // TODO: Create lead
    return NextResponse.json({ message: 'Created' }, { status: 201 });
}