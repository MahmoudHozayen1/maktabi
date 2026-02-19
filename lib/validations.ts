import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const propertySchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    titleAr: z.string().optional(),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    descriptionAr: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    size: z.number().positive('Size must be positive'),
    rooms: z.number().int().positive().optional(),
    type: z.enum(['OFFICE', 'COWORKING']),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    district: z.string().min(1, 'District is required'),
    lat: z.number().optional(),
    lng: z.number().optional(),
    amenities: z.array(z.string()),
    images: z.array(z.string()).min(1, 'At least one image is required'),
});

export const managedPropertySchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Valid phone number is required'),
    propertyType: z.enum(['OFFICE', 'COWORKING']),
    location: z.string().min(5, 'Location is required'),
    comments: z.string().optional(),
});

export const startupSchema = z.object({
    name: z.string().min(2, 'Startup name is required'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    pitchDeckUrl: z.string().url().optional().or(z.literal('')),
    fundingNeeded: z.number().positive().optional(),
    stage: z.string().min(1, 'Stage is required'),
    sector: z.string().min(1, 'Sector is required'),
});

export const ratingSchema = z.object({
    stars: z.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
    propertyId: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ManagedPropertyInput = z.infer<typeof managedPropertySchema>;
export type StartupInput = z.infer<typeof startupSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;