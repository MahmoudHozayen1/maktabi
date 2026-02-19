import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 12);

        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                password: hashedPassword,
                role: 'RENTER',
            },
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: error.errors[0]?.message || 'Validation failed' },
                { status: 400 }
            );
        }

        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Registration failed' },
            { status: 500 }
        );
    }
}