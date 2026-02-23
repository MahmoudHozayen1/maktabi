'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Trash2, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AccountPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Form states
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        if (session?.user) {
            setProfileData({
                name: session.user.name || '',
                email: session.user.email || '',
                phone: session.user.phone || '',
            });
        }
    }, [session]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        router.push('/login');
        return null;
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/account', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateProfile',
                    name: profileData.name,
                    email: profileData.email,
                    phone: profileData.phone,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to update profile');
                return;
            }

            setSuccess('Profile updated successfully!');
            // Update session
            await update();
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/account', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updatePassword',
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to update password');
                return;
            }

            setSuccess('Password updated successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/account', {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to delete account');
                return;
            }

            // Sign out and redirect
            await signOut({ callbackUrl: '/' });
        } catch (err) {
            setError('Something went wrong');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="mx-auto max-w-2xl px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account information and security</p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-600">
                        {success}
                    </div>
                )}

                {/* Profile Information */}
                <form onSubmit={handleProfileUpdate} className="mb-8">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <User className="h-5 w-5 text-emerald-600" />
                            <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    <Mail className="mr-1 inline h-4 w-4" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    <Phone className="mr-1 inline h-4 w-4" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    placeholder="+20 10 1234 5678"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button type="submit" isLoading={isLoading}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Change Password */}
                <form onSubmit={handlePasswordUpdate} className="mb-8">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <Lock className="h-5 w-5 text-emerald-600" />
                            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button type="submit" isLoading={isLoading}>
                                Update Password
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Delete Account */}
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        <h2 className="text-lg font-bold text-red-900">Delete Account</h2>
                    </div>

                    <p className="mb-4 text-sm text-red-700">
                        Once you delete your account, there is no going back. All your data, listings, and favorites will be permanently removed.
                    </p>

                    {!showDeleteConfirm ? (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="border-red-300 bg-white text-red-600 hover:bg-red-100"
                        >
                            Delete My Account
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-white border border-red-300 p-4">
                                <div className="mb-3 flex items-center gap-2 text-red-700">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-medium">This action cannot be undone!</span>
                                </div>
                                <p className="mb-3 text-sm text-gray-600">
                                    Type <strong>DELETE</strong> to confirm:
                                </p>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Type DELETE"
                                    className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    isLoading={isLoading}
                                    disabled={deleteConfirmText !== 'DELETE'}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Permanently Delete Account
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}