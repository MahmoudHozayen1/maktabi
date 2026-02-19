import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="border-b border-gray-800 bg-black text-white">
            <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">

                {/* LOGO */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-xl font-bold tracking-wider">
                        MAKTABI<span className="text-emerald-500">.</span>
                    </Link>
                </div>

                {/* MENU LINKS */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="/offices" className="hover:text-emerald-400 transition-colors">
                        Offices
                    </Link>
                    <Link href="/coworking" className="hover:text-emerald-400 transition-colors">
                        Coworking
                    </Link>
                    <Link href="/startup-tank" className="hover:text-emerald-400 transition-colors">
                        Startup Tank
                    </Link>
                </div>

                {/* LOGIN BUTTON */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="rounded bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                    >
                        Login
                    </Link>
                </div>

            </div>
        </nav>
    );
}