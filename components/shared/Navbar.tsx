'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, LogOut, Heart, LayoutDashboard, ChevronDown, Shield, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session, status } = useSession();

    // Check if user is admin or owner
    const userRole = session?.user?.role;
    const isAdmin = userRole === 'ADMIN' || userRole === 'OWNER';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/offices', label: 'Offices' },
        { href: '/coworking', label: 'Coworking' },
        { href: '/startup-tank', label: 'Startup Tank' },
        { href: '/map', label: 'Map' },
    ];

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'border-b border-gray-200 bg-white/95 backdrop-blur-xl shadow-sm'
                : 'bg-white'
                }`}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* Logo only: removed redundant text and adjusted size */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.jpeg"
                        alt="MAKTABI"
                        width={81}
                        height={64}
                        className="rounded-xl object-contain"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden items-center gap-3 md:flex">
                    {session ? (
                        <div className="flex items-center gap-3">
                            {/* Admin Dashboard Button - Only shows for Admin/Owner */}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800"
                                >
                                    <Shield className="h-4 w-4" />
                                    Admin
                                </Link>
                            )}

                            <Link
                                href="/favorites"
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100 hover:text-emerald-600"
                            >
                                <Heart className="h-5 w-5" />
                            </Link>
                            <div className="relative group">
                                <button
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                        <User className="h-3.5 w-3.5" />
                                    </div>
                                    {session.user?.name?.split(' ')[0] || 'Account'}
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </button>
                                <div className="absolute right-0 top-full mt-2 hidden w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg group-hover:block">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Account Settings
                                    </Link>
                                    <Link
                                        href="/list-property"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <span className="text-lg">+</span>
                                        List Property
                                    </Link>
                                    {/* Admin link in dropdown too */}
                                    {isAdmin && (
                                        <>
                                            <hr className="my-2 border-gray-200" />
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                            >
                                                <Shield className="h-4 w-4" />
                                                Admin Panel
                                            </Link>
                                        </>
                                    )}
                                    <hr className="my-2 border-gray-200" />
                                    <button
                                        onClick={() => signOut()}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-20 border-b border-gray-200 bg-white px-6 py-6 shadow-lg md:hidden">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-3 border-gray-200" />
                        {session ? (
                            <>
                                {/* Admin link in mobile menu */}
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Shield className="h-4 w-4" />
                                        Admin Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/favorites"
                                    className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Favorites
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/account"
                                    className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Account Settings
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="rounded-lg px-4 py-3 text-left text-red-500 hover:bg-red-50"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 pt-2">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}