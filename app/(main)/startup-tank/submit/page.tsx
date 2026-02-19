import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import StartupForm from '@/components/forms/StartupForm';

export default async function SubmitStartupPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="mb-8">
                <Link
                    href="/startup-tank"
                    className="text-sm text-gray-400 hover:text-emerald-400"
                >
                    ← Back to Startup Tank
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Submit Your <span className="text-emerald-500">Startup</span>
                </h1>
                <p className="mt-4 text-gray-400">
                    Looking for investment? Submit your startup to connect with investors.
                </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
                <StartupForm />
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
                By submitting, you agree to our{' '}
                <Link href="/terms" className="text-emerald-500 hover:underline">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-emerald-500 hover:underline">
                    Privacy Policy
                </Link>
            </p>
        </div>
    );
}