'use client';

import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/constants';
import Button from '@/components/ui/Button';

interface WhatsAppButtonProps {
    propertyId: string;
    propertyTitle: string;
    className?: string;
}

export default function WhatsAppButton({ propertyId, propertyTitle, className }: WhatsAppButtonProps) {
    const handleClick = async () => {
        // Log the lead
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId, source: 'whatsapp' }),
            });
        } catch (error) {
            console.error('Failed to log lead:', error);
        }

        // Open WhatsApp
        const message = encodeURIComponent(
            `Hi MAKTABI! I'm interested in: ${propertyTitle}\n\nProperty ID: ${propertyId}`
        );
        window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');
    };

    return (
        <Button onClick={handleClick} className={className} size="lg">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact via WhatsApp
        </Button>
    );
}