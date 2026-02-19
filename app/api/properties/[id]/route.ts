import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch single property
    return NextResponse.json({ property: null });
}

export async function PUT() {
    // TODO: Update property
    return NextResponse.json({ message: 'Updated' });
}

export async function DELETE() {
    // TODO: Delete property
    return NextResponse.json({ message: 'Deleted' });
}