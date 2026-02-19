import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Get user favorites
    return NextResponse.json({ favorites: [] });
}

export async function POST() {
    // TODO: Add to favorites
    return NextResponse.json({ message: 'Added' }, { status: 201 });
}

export async function DELETE() {
    // TODO: Remove from favorites
    return NextResponse.json({ message: 'Removed' });
}