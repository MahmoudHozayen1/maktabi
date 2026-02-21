'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Building2, Camera, Key, Headphones } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const managedSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email required'),
    phone: z.string().min(10, 'Valid phone number required'),
    propertyAddress: z.string().min(10, 'Full address required'),
    propertySize: z.number().min(10, 'Minimum size is 10 sqm'),
    message: z.string().optional(),
});

type ManagedInput = z.infer<typeof managedSchema>;

const benefits = [
    { icon: Camera, title: 'Professional Photography', description: 'High-quality photos and virtual tours' },
    { icon: Key, title: 'Tenant Management', description: 'We handle screening and contracts' },
    { icon: Headphones, title: '24/7 Support', description: 'Dedicated support for you and tenants' },
    { icon: Building2, title: 'Property Maintenance', description: 'Regular upkeep and repairs' },
];

export default function SubmitManagedPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ManagedInput>({
        resolver: zodResolver(managedSchema),
    });

    const onSubmit = async (data: ManagedInput) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/managed-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || 'Failed to submit request');
            }

            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="mx-auto max-w-2xl px-6 py-24 text-center">
                <CheckCircle className="mx-auto mb-6 h-16 w-16 text-emerald-500" />
                <h1 className="mb-4 text-3xl font-bold text-gray-900">Request Submitted!</h1>
                <p className="mb-8 text-gray-600">
                    Our team will contact you within 24 hours to discuss your property management needs.
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                    Full Property <span className="text-emerald-500">Management</span>
                </h1>
                <p className="mt-4 text-gray-600">
                    Let us handle everything — from listing to tenant management
                </p>
            </div>

            {/* Benefits */}
            <div className="mb-12 grid gap-6 md:grid-cols-4">
                {benefits.map((benefit) => (
                    <div
                        key={benefit.title}
                        className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
                    >
                        <benefit.icon className="mx-auto mb-4 h-10 w-10 text-emerald-500" />
                        <h3 className="mb-2 font-bold text-gray-900">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="mx-auto max-w-2xl">
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-xl font-bold text-gray-900">Request a Consultation</h2>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                error={errors.name?.message}
                                {...register('name')}
                            />

                            <Input
                                label="Email"
                                type="email"
                                placeholder="john@example.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                        </div>

                        <Input
                            label="Phone Number"
                            placeholder="+20 10 1234 5678"
                            error={errors.phone?.message}
                            {...register('phone')}
                        />

                        <Input
                            label="Property Address"
                            placeholder="Full address of your property"
                            error={errors.propertyAddress?.message}
                            {...register('propertyAddress')}
                        />

                        <Input
                            label="Property Size (sqm)"
                            type="number"
                            placeholder="200"
                            error={errors.propertySize?.message}
                            {...register('propertySize', { valueAsNumber: true })}
                        />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Additional Message (Optional)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Tell us more about your property..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                                {...register('message')}
                            />
                        </div>

                        <Button type="submit" isLoading={isLoading} className="w-full">
                            Submit Request
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}