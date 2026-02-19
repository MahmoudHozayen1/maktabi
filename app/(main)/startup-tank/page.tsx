import Link from 'next/link';
import { Rocket, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function StartupTankPage() {
    // Placeholder startups - will be replaced with real data
    const startups = [
        {
            id: 1,
            name: 'PayFlow',
            sector: 'FinTech',
            stage: 'Seed',
            description: 'Digital payment solutions for Egyptian businesses',
            fundingGoal: 500000,
            raised: 125000,
        },
        {
            id: 2,
            name: 'MedConnect',
            sector: 'HealthTech',
            stage: 'MVP',
            description: 'Telemedicine platform connecting patients with doctors',
            fundingGoal: 750000,
            raised: 300000,
        },
        {
            id: 3,
            name: 'EduSpark',
            sector: 'EdTech',
            stage: 'Early Traction',
            description: 'AI-powered tutoring for K-12 students',
            fundingGoal: 1000000,
            raised: 450000,
        },
    ];

    const stats = [
        { icon: Rocket, label: 'Startups Listed', value: '50+' },
        { icon: DollarSign, label: 'Total Raised', value: '25M EGP' },
        { icon: Users, label: 'Active Investors', value: '200+' },
        { icon: TrendingUp, label: 'Success Rate', value: '78%' },
    ];

    return (
        <div className="mx-auto max-w-7xl px-6 py-16">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold">
                    Startup <span className="text-emerald-500">Tank</span>
                </h1>
                <p className="mt-4 text-gray-400">
                    Invest in Egypt&apos;s most promising startups
                </p>
                <Link
                    href="/startup-tank/submit"
                    className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
                >
                    Submit Your Startup
                </Link>
            </div>

            {/* Stats */}
            <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center"
                    >
                        <stat.icon className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Startups Grid */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Featured Startups</h2>
                <select className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white">
                    <option>All Sectors</option>
                    <option>FinTech</option>
                    <option>HealthTech</option>
                    <option>EdTech</option>
                    <option>E-Commerce</option>
                    <option>SaaS</option>
                </select>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {startups.map((startup) => (
                    <Link
                        key={startup.id}
                        href={`/startup-tank/${startup.id}`}
                        className="group rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-emerald-500/50"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                                <Rocket className="h-6 w-6 text-emerald-500" />
                            </div>
                            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
                                {startup.stage}
                            </span>
                        </div>

                        <h3 className="mb-2 text-xl font-bold group-hover:text-emerald-400">
                            {startup.name}
                        </h3>
                        <p className="mb-4 text-sm text-gray-400">{startup.description}</p>

                        <div className="mb-3 flex items-center justify-between text-sm">
                            <span className="text-emerald-400">{startup.sector}</span>
                            <span className="text-gray-500">
                                {Math.round((startup.raised / startup.fundingGoal) * 100)}% funded
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                            <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${(startup.raised / startup.fundingGoal) * 100}%` }}
                            />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                                {startup.raised.toLocaleString()} EGP raised
                            </span>
                            <span className="text-gray-500">
                                Goal: {startup.fundingGoal.toLocaleString()} EGP
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}