import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
            <div className="mb-8 text-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    MAKTABI<span className="text-emerald-500">.</span>
                </Link>
                <h1 className="mt-4 text-xl font-bold text-white">Create Account</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Join MAKTABI to find your perfect workspace
                </p>
            </div>

            <RegisterForm />

            <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-500 hover:text-emerald-400">
                    Sign in
                </Link>
            </p>
        </div>
    );
}