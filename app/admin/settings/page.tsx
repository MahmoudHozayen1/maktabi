'use client';

import { useState, useEffect } from 'react';
import { Save, Phone, Globe, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Settings {
    whatsappNumber: string;
    supportEmail: string;
    websiteUrl: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        whatsappNumber: '+201554515541',
        supportEmail: 'support@maktabi.app',
        websiteUrl: 'https://maktabi.app',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Load settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.settings) {
                        setSettings({
                            whatsappNumber: data.settings.whatsappNumber || '+201554515541',
                            supportEmail: data.settings.supportEmail || 'support@maktabi.app',
                            websiteUrl: data.settings.websiteUrl || 'https://maktabi.app',
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setSaved(false);
        setError('');

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save settings');
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
            setError('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading settings...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="mt-1 text-gray-400">Configure platform settings</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Contact Settings */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-6 text-xl font-bold">Contact Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Phone className="h-4 w-4" />
                                WhatsApp Number
                            </label>
                            <input
                                type="text"
                                value={settings.whatsappNumber}
                                onChange={(e) =>
                                    setSettings({ ...settings, whatsappNumber: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Mail className="h-4 w-4" />
                                Support Email
                            </label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) =>
                                    setSettings({ ...settings, supportEmail: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Globe className="h-4 w-4" />
                                Website URL
                            </label>
                            <input
                                type="url"
                                value={settings.websiteUrl}
                                onChange={(e) =>
                                    setSettings({ ...settings, websiteUrl: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} isLoading={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                    </Button>
                    {saved && (
                        <span className="text-sm text-emerald-500">Settings saved successfully!</span>
                    )}
                    {error && (
                        <span className="text-sm text-red-500">{error}</span>
                    )}
                </div>
            </div>
        </div>
    );
}