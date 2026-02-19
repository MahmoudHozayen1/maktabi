import Link from 'next/link';
import { Rocket, Users, TrendingUp, Globe, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

export default async function StartupDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // TODO: Fetch startup data from database using id
    const startup = {
        id: id,
        name: 'PayFlow',
        sector: 'FinTech',
        stage: 'Seed',
        description: 'Digital payment solutions for Egyptian businesses. We are building the next generation of payment infrastructure for SMEs across Egypt and the MENA region.',
        fundingGoal: 500000,
        raised: 125000,
        teamSize: 8,
        founded: '2024',
        website: 'https://payflow.eg',
        highlights: [
            '10,000+ monthly active users',
            'Processing 5M EGP monthly',
            'Partnerships with 3 major banks',
            'Featured in TechCrunch MENA',
        ],
    };

    const progressPercent = (startup.raised / startup.fundingGoal) * 100;

    return (
        <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="mb-8">
                <Link
                    href="/startup-tank"
                    className="text-sm text-gray-400 hover:text-emerald-400"
                >
                    ← Back to Startup Tank
                </Link>
            </div>

            <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-500/10">
                        <Rocket className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{startup.name}</h1>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                            <span className="text-emerald-400">{startup.sector}</span>
                            <span>•</span>
                            <span>{startup.stage}</span>
                            <span>•</span>
                            <span>Founded {startup.founded}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-bold">
                        {startup.raised.toLocaleString()} EGP
                    </span>
                    <span className="text-gray-400">
                        of {startup.fundingGoal.toLocaleString()} EGP goal
                    </span>
                </div>

                <div className="mb-4 h-3 overflow-hidden rounded-full bg-gray-800">
                    <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400">{Math.round(progressPercent)}% funded</span>
                    <span className="text-gray-500">42 investors</span>
                </div>

                <Button className="mt-6 w-full">
                    Invest Now
                </Button>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
                    <Users className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                    <div className="font-bold">{startup.teamSize}</div>
                    <div className="text-sm text-gray-400">Team Members</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
                    <TrendingUp className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                    <div className="font-bold">42</div>
                    <div className="text-sm text-gray-400">Investors</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
                    <Globe className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                    <div className="font-bold">Egypt</div>
                    <div className="text-sm text-gray-400">Location</div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold">About</h2>
                <p className="text-gray-300 leading-relaxed">{startup.description}</p>
            </div>

            <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold">Highlights</h2>
                <ul className="space-y-3">
                    {startup.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {highlight}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-4 text-xl font-bold">Contact</h2>
                <div className="flex flex-wrap gap-4">
                    <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-emerald-500 hover:text-emerald-400"
                    >
                        <Globe className="h-4 w-4" />
                        Website
                    </a>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-emerald-500 hover:text-emerald-400">
                        <Mail className="h-4 w-4" />
                        Contact Team
                    </button>
                </div>
            </div>
        </div>
    );
}