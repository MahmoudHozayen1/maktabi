'use client';

import { Phone } from 'lucide-react';

interface TrackLeadButtonProps {
    propertyId: string;
    phoneNumber: string;
}

export default function TrackLeadButton({ propertyId, phoneNumber }: TrackLeadButtonProps) {
    const handleClick = async () => {
        // Track the lead in background
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId,
                    source: 'whatsapp',
                }),
            });
        } catch (error) {
            console.error('Failed to track lead:', error);
        }

        // Open WhatsApp
        window.open(`https://wa.me/${phoneNumber.replace('+', '')}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700"
        >
            <Phone className="h-5 w-5" />
            WhatsApp
        </button>
    );
}