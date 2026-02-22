'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Users } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CoworkingApplyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        spaceName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        capacity: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation
        if (!formData.spaceName || !formData.contactName || !formData.email || !formData.phone || !formData.address || !formData.city) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/coworking-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || 'Failed to submit application');
                return;
            }

            setIsSubmitted(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 py-24">
                <div className="mx-auto max-w-lg px-6 text-center">
                    <CheckCircle className="mx-auto mb-6 h-16 w-16 text-emerald-500" />
                    <h1 className="mb-4 text-3xl font-bold text-gray-900">Application Submitted!</h1>
                    <p className="mb-8 text-gray-600">
                        Thank you for your interest in listing your coworking space on MAKTABI.
                        Our team will review your application and contact you within 2-3 business days.
                    </p>
                    <Button onClick={() => router.push('/coworking')}>
                        Back to Coworking Spaces
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="mx-auto max-w-2xl px-6">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100">
                        <Users className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        List Your <span className="text-emerald-600">Coworking Space</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Apply to have your coworking space featured on MAKTABI
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Space Information */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-gray-900">Space Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Coworking Space Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.spaceName}
                                    onChange={(e) => setFormData({ ...formData, spaceName: e.target.value })}
                                    placeholder="e.g., The Hub Cairo"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Website (optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://www.yourspace.com"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        City *
                                    </label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        required
                                    >
                                        <option value="">Select city</option>
                                        <option value="Cairo">Cairo</option>
                                        <option value="Giza">Giza</option>
                                        <option value="New Cairo">New Cairo</option>
                                        <option value="6th October">6th October</option>
                                        <option value="Alexandria">Alexandria</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Capacity (seats)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        placeholder="e.g., 50"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Address *
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="123 Street Name, District, City"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell us about your coworking space, amenities, pricing plans..."
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-gray-900">Contact Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Contact Person Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    placeholder="Your full name"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="contact@yourspace.com"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+20 10 1234 5678"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                        <strong>What happens next?</strong>
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>Our team will review your application</li>
                            <li>We&apos;ll contact you within 2-3 business days</li>
                            <li>If approved, we&apos;ll schedule a visit or video call</li>
                            <li>Your space will be listed after final verification</li>
                        </ul>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full">
                        Submit Application
                    </Button>
                </form>
            </div>
        </div>
    );
}