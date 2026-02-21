
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { registerSchema, RegisterInput } from '@/lib/validations';

interface ApiError {
    message: string;
}

export default function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData: ApiError = await res.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            // Auto sign in after registration
            await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            router.push('/');
            router.refresh();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                    {error}
                </div>
            )}

            <Input
                label="Full Name"
                placeholder="John Doe"
                icon={<User className="h-5 w-5" />}
                error={errors.name?.message}
                {...register('name')}
            />

            <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                icon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label="Phone (optional)"
                type="tel"
                placeholder="+20 1XX XXX XXXX"
                icon={<Phone className="h-5 w-5" />}
                error={errors.phone?.message}
                {...register('phone')}
            />

            <PasswordInput
                label="Password"
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
            />

            <PasswordInput
                label="Confirm Password"
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
                Create Account
            </Button>
        </form>
    );
}