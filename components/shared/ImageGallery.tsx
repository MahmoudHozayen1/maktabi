'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (images.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
                No images available
            </div>
        );
    }

    return (
        <>
            {/* Main Gallery */}
            <div className="space-y-4">
                {/* Main Image */}
                <div
                    className="relative h-[400px] cursor-pointer overflow-hidden rounded-2xl bg-gray-800"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-md hover:bg-black/70"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-md hover:bg-black/70"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-md">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg',
                                    index === currentIndex && 'ring-2 ring-emerald-500'
                                )}
                            >
                                <Image
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <div className="relative h-[80vh] w-[90vw]">
                        <Image
                            src={images[currentIndex]}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-2 text-white backdrop-blur-md">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    );
}