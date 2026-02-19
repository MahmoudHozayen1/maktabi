import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Fetch single coworking space
    return NextResponse.json({ coworking: null });
}

export async function PUT() {
    // TODO: Update coworking space
    return NextResponse.json({ message: 'Updated' });
}

export async function DELETE() {
    // TODO: Delete coworking space
    return NextResponse.json({ message: 'Deleted' });
}