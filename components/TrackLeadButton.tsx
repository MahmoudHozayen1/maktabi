'use client';

import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';

interface TrackLeadButtonProps {
    propertyId: string;
    propertySerial: number;
    propertyTitle: string;
    phoneNumber: string;
}

export default function TrackLeadButton({
    propertyId,
    propertySerial,
    propertyTitle,
    phoneNumber
}: TrackLeadButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        // Create the WhatsApp message
        const message = `Hello, I am interested in property #${propertySerial} - ${propertyTitle}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;

        // Track the lead in background
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId,
                    source: 'whatsapp',
                    message: message,
                }),
            });
        } catch (error) {
            console.error('Failed to track lead:', error);
        }

        setIsLoading(false);

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Phone className="h-5 w-5" />
            )}
            WhatsApp
        </button>
    );
}