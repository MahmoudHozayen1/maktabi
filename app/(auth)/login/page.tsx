import Link from 'next/link';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
            <div className="mb-8 text-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    MAKTABI<span className="text-emerald-500">.</span>
                </Link>
                <h1 className="mt-4 text-xl font-bold text-white">Welcome Back</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Sign in to access your account
                </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-emerald-500 hover:text-emerald-400">
                    Sign up
                </Link>
            </p>
        </div>
    );
}