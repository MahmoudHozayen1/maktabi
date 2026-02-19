import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch single startup
    return NextResponse.json({ startup: null });
}

export async function PUT() {
    // TODO: Update startup
    return NextResponse.json({ message: 'Updated' });
}

export async function DELETE() {
    // TODO: Delete startup
    return NextResponse.json({ message: 'Deleted' });
}