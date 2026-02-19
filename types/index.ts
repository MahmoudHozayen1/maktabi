export type UserRole =
    | 'VISITOR'
    | 'RENTER'
    | 'INVESTOR'
    | 'LANDLORD_MARKETING'
    | 'LANDLORD_MANAGED'
    | 'ADMIN';

export type PropertyType = 'OFFICE' | 'COWORKING';

export type PropertyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role: UserRole;
    image?: string;
    createdAt: Date;
}

export interface Property {
    id: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    price: number;
    size: number;
    rooms?: number;
    type: PropertyType;
    status: PropertyStatus;
    address: string;
    city: string;
    district: string;
    lat?: number;
    lng?: number;
    amenities: string[];
    images: string[];
    featured: boolean;
    averageRating?: number;
    totalRatings?: number;
    owner: User;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Rating {
    id: string;
    stars: number;
    comment?: string;
    user: User;
    userId: string;
    propertyId: string;
    createdAt: Date;
}

export interface Startup {
    id: string;
    name: string;
    description: string;
    pitchDeckUrl?: string;
    fundingNeeded?: number;
    stage: string;
    sector: string;
    status: PropertyStatus;
    founder: User;
    founderId: string;
    createdAt: Date;
}

export interface Lead {
    id: string;
    source: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
    propertyId: string;
    createdAt: Date;
}

export interface FilterParams {
    search?: string;
    city?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    rooms?: number;
    amenities?: string[];
    rating?: number;
    page?: number;
    limit?: number;
    sort?: string;
}