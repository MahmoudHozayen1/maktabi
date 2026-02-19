import { NextResponse } from 'next/server';

export async function POST() {
    // TODO: Handle file upload
    return NextResponse.json({ message: 'Uploaded' }, { status: 201 });
}