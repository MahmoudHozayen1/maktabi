'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setError('');
        setIsUploading(true);

        try {
            const newImages: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    setError('Please upload only image files');
                    continue;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setError('Each image must be less than 5MB');
                    continue;
                }

                // Check max images limit
                if (images.length + newImages.length >= maxImages) {
                    setError(`Maximum ${maxImages} images allowed`);
                    break;
                }

                // Convert to base64
                const base64 = await fileToBase64(file);
                newImages.push(base64);
            }

            if (newImages.length > 0) {
                onImagesChange([...images, ...newImages]);
            }
        } catch (err) {
            setError('Failed to upload images');
            console.error(err);
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <div>
            {/* Upload Area */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all ${isUploading
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-gray-300 hover:border-emerald-500 hover:bg-gray-50'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                        <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="mb-2 h-10 w-10 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700">
                            Click to upload images
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG up to 5MB each (max {maxImages} images)
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                        >
                            <Image
                                src={image}
                                alt={`Property image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                                <span className="absolute bottom-1 left-1 rounded bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">
                                    Cover
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {images.length === 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <ImageIcon className="h-4 w-4" />
                    <span>No images uploaded yet</span>
                </div>
            )}
        </div>
    );
}