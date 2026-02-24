import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error('Invalid email or password');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    phone: user.phone,
                };
            },
        }),
    ],
    callbacks: {
        // Auto-link OAuth provider accounts to an existing user with the same email.
        // This prevents the OAuthAccountNotLinked error when the user already exists (e.g. created via credentials).
        async signIn({ user, account }) {
            try {
                // Only handle OAuth providers (skip credentials)
                if (!account || account.provider === 'credentials') return true;

                // If user doesn't have an email, can't link
                if (!user?.email) return true;

                // Find existing user by email
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (existingUser) {
                    // Check if the provider account already exists
                    const existingAccount = await prisma.account.findFirst({
                        where: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    });

                    if (!existingAccount) {
                        // Create/link the provider account to the existing user
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                type: account.type ?? 'oauth',
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: (account.refresh_token as string) ?? null,
                                access_token: (account.access_token as string) ?? null,
                                expires_at: (account.expires_at as number) ?? null,
                                token_type: (account.token_type as string) ?? null,
                                scope: (account.scope as string) ?? null,
                                id_token: (account.id_token as string) ?? null,
                                session_state: (account.session_state as string) ?? null,
                            },
                        });
                    }
                }

                return true;
            } catch (err) {
                console.error('Error in signIn callback while linking account:', err);
                // Return false to block signin on unexpected errors
                return false;
            }
        },

        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;
                token.role = user.role ?? 'RENTER';
                token.phone = user.phone ?? null;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id ?? '';
                session.user.role = token.role ?? 'RENTER';
                session.user.phone = token.phone ?? null;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;