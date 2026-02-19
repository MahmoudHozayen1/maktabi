'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Building2,
    MessageSquare,
    Rocket,
    Settings,
    LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/properties', label: 'Properties', icon: Building2 },
    { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
    { href: '/admin/startups', label: 'Startups', icon: Rocket },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex w-64 flex-col border-r border-gray-800 bg-gray-900">
            <div className="p-6">
                <Link href="/" className="text-xl font-bold">
                    MAKTABI<span className="text-emerald-500">.</span>
                </Link>
                <p className="mt-1 text-xs text-gray-500">Admin Panel</p>
            </div>

            <nav className="flex-1 space-y-1 px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-800 p-3">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}