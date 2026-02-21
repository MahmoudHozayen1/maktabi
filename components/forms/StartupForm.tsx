'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const startupSchema = z.object({
    name: z.string().min(2, 'Startup name is required'),
    sector: z.string().min(1, 'Please select a sector'),
    stage: z.string().min(1, 'Please select a stage'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    fundingGoal: z.number().min(1000, 'Minimum funding goal is 1,000 EGP'),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type StartupInput = z.infer<typeof startupSchema>;

export default function StartupForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<StartupInput>({
        resolver: zodResolver(startupSchema),
    });

    const onSubmit = async (data: StartupInput) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/startups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to submit startup');
                return;
            }

            setSuccess(true);
            reset();

            // Redirect after success
            setTimeout(() => {
                router.push('/startup-tank');
            }, 2000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="rounded-xl bg-emerald-500/10 p-8 text-center">
                <div className="mb-4 text-4xl">🎉</div>
                <h3 className="mb-2 text-xl font-bold text-emerald-500">
                    Startup Submitted!
                </h3>
                <p className="text-gray-400">
                    Your startup has been submitted for review. Redirecting...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
                    {error}
                </div>
            )}

            <Input
                label="Startup Name"
                placeholder="Your startup name"
                error={errors.name?.message}
                {...register('name')}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Sector
                    </label>
                    <select
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                        {...register('sector')}
                    >
                        <option value="">Select sector</option>
                        <option value="fintech">FinTech</option>
                        <option value="healthtech">HealthTech</option>
                        <option value="edtech">EdTech</option>
                        <option value="ecommerce">E-Commerce</option>
                        <option value="logistics">Logistics</option>
                        <option value="proptech">PropTech</option>
                        <option value="saas">SaaS</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.sector && (
                        <p className="mt-1 text-sm text-red-500">{errors.sector.message}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Stage
                    </label>
                    <select
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                        {...register('stage')}
                    >
                        <option value="">Select stage</option>
                        <option value="idea">Idea Stage</option>
                        <option value="mvp">MVP</option>
                        <option value="early">Early Traction</option>
                        <option value="growth">Growth</option>
                        <option value="scale">Scale</option>
                    </select>
                    {errors.stage && (
                        <p className="mt-1 text-sm text-red-500">{errors.stage.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                    Description
                </label>
                <textarea
                    rows={4}
                    placeholder="Describe your startup (at least 50 characters)..."
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                    {...register('description')}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            <Input
                label="Funding Goal (EGP)"
                type="number"
                placeholder="100000"
                error={errors.fundingGoal?.message}
                {...register('fundingGoal', { valueAsNumber: true })}
            />

            <Input
                label="Website (optional)"
                type="url"
                placeholder="https://yourstartup.com"
                error={errors.website?.message}
                {...register('website')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
                Submit Startup
            </Button>
        </form>
    );
}