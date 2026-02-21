import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Users, TrendingUp, Globe, Mail, Phone } from 'lucide-react';
import prisma from '@/lib/prisma';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function StartupDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const startup = await prisma.startup.findUnique({
        where: { id },
        include: {
            founder: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
    });

    if (!startup) {
        notFound();
    }

    // WhatsApp message for investment inquiry
    const whatsappMessage = encodeURIComponent(
        `Hello, I am interested in investing in ${startup.name}. I would like to learn more about this opportunity.`
    );
    const whatsappNumber = startup.founder.phone?.replace('+', '') || '201554515541';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="mb-8">
                <Link
                    href="/startup-tank"
                    className="text-sm text-gray-500 hover:text-emerald-600"
                >
                    ← Back to Startup Tank
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100">
                        <Rocket className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{startup.name}</h1>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                            <span className="text-emerald-600">{startup.sector}</span>
                            <span>•</span>
                            <span>{startup.stage}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Funding Info */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {startup.fundingNeeded && (
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                            {startup.fundingNeeded.toLocaleString()} EGP
                        </span>
                        <span className="text-gray-500">Funding Goal</span>
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700"
                    >
                        <Phone className="h-5 w-5" />
                        Contact via WhatsApp
                    </a>
                    <a
                        href={`mailto:${startup.founder.email}?subject=Investment Inquiry: ${startup.name}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Mail className="h-5 w-5" />
                        Send Email
                    </a>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                    <Users className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                    <div className="font-bold text-gray-900">-</div>
                    <div className="text-sm text-gray-500">Team Members</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                    <TrendingUp className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                    <div className="font-bold text-gray-900">{startup.stage}</div>
                    <div className="text-sm text-gray-500">Stage</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                    <Globe className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                    <div className="font-bold text-gray-900">Egypt</div>
                    <div className="text-sm text-gray-500">Location</div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">About</h2>
                <p className="text-gray-600 leading-relaxed">{startup.description}</p>
            </div>

            {/* Contact */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Contact</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Founded by</p>
                        <p className="font-medium text-gray-900">{startup.founder.name}</p>
                    </div>
                    {startup.pitchDeckUrl && (
                        <a
                            href={startup.pitchDeckUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-emerald-500 hover:text-emerald-600"
                        >
                            <Globe className="h-4 w-4" />
                            Website
                        </a>
                    )}
                    <a
                        href={`mailto:${startup.founder.email}`}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-emerald-500 hover:text-emerald-600"
                    >
                        <Mail className="h-4 w-4" />
                        Email
                    </a>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-emerald-500 hover:text-emerald-600"
                    >
                        <Phone className="h-4 w-4" />
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}