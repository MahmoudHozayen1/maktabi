import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Building2, Users, Rocket, MessageSquare, Settings, Users2 } from 'lucide-react';
import { authOptions } from '@/lib/auth';

const ADMIN_ROLES = ['ADMIN', 'OWNER'];

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/properties', label: 'Properties', icon: Building2 },
    { href: '/admin/coworking-applications', label: 'Coworking Apps', icon: Users2 },
    { href: '/admin/startups', label: 'Startups', icon: Rocket },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || !ADMIN_ROLES.includes(session.user?.role || '')) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-gray-900">
                    <div className="flex h-full flex-col">
                        <div className="flex h-16 items-center border-b border-gray-800 px-6">
                            <Link href="/admin" className="text-xl font-bold">
                                <span className="text-emerald-500">MAKTABI</span> Admin
                            </Link>
                        </div>

                        <nav className="flex-1 space-y-1 px-3 py-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="border-t border-gray-800 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                                    <span className="text-sm font-bold text-emerald-500">
                                        {session.user?.name?.[0]?.toUpperCase() || 'A'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{session.user?.name}</p>
                                    <p className="text-xs text-gray-500">{session.user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-64 flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}