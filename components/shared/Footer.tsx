import Link from 'next/link';
import Image from 'next/image';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export default function Footer() {
    return (
        <footer className="bg-premium-black px-6 py-16 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 md:grid-cols-4">
                    <div>
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.jpeg"
                                alt="MAKTABI"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold">
                                MAKTABI<span className="text-emerald-500">.</span>
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-gray-400">
                            Egypt&apos;s leading real estate and startup investment platform.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/offices" className="hover:text-emerald-400 transition-colors">Offices</Link></li>
                            <li><Link href="/coworking" className="hover:text-emerald-400 transition-colors">Coworking</Link></li>
                            <li><Link href="/startup-tank" className="hover:text-emerald-400 transition-colors">Startup Tank</Link></li>
                            <li><Link href="/map" className="hover:text-emerald-400 transition-colors">Map</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-white">For Landlords</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/list-property" className="hover:text-emerald-400 transition-colors">List Property</Link></li>
                            <li><Link href="/submit-managed" className="hover:text-emerald-400 transition-colors">Full Management</Link></li>
                            <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-white">Contact Us</h4>
                        <p className="text-sm text-gray-400">📱 {WHATSAPP_NUMBER}</p>
                        <p className="mt-2 text-sm text-gray-400">WhatsApp for all inquiries</p>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-sm text-gray-500 md:flex-row">
                    <p>© {new Date().getFullYear()} MAKTABI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}